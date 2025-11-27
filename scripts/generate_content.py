#!/usr/bin/env python3
"""
RetrofitAge.com - Akıllı İçerik Yönetim Sistemi
Günde 1 makale üretir, tekrarları önler, kategori rotasyonu yapar.

Özellikler:
- 10 API key rotation (rate limit bypass)
- Yazılan konuları takip eder (tekrar yazmaz)
- Kategori rotasyonu ile çeşitlilik
- Humanization ile insan tonu
- Otomatik git push

Usage:
    python generate_content.py              # Günlük 1 makale
    python generate_content.py --all        # Tüm bekleyenleri yaz
    python generate_content.py --new-topic  # Yeni konu öner (Gemini ile)
"""

import os
import re
import json
import time
import random
import argparse
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Optional, List

try:
    import google.generativeai as genai
except ImportError:
    print("Installing google-generativeai...")
    subprocess.run(["pip", "install", "google-generativeai"], check=True)
    import google.generativeai as genai

# ============================================
# PATHS & CONFIG
# ============================================

BASE_DIR = Path(__file__).parent.parent
CONTENT_DIR = BASE_DIR / "content" / "posts"
SCRIPTS_DIR = Path(__file__).parent

TOPICS_FILE = SCRIPTS_DIR / "topics.json"
HISTORY_FILE = SCRIPTS_DIR / "content-history.json"

# İçerik kategorileri
CONTENT_CATEGORIES = [
    "bathroom-safety",
    "smart-monitoring", 
    "finance-insurance",
    "smart-home",
    "structural-retrofit",
    "housing-options",
    "kitchen-safety",
    "electrical-lighting",
    "finance",
    "accessibility"
]

# ============================================
# API KEY MANAGER
# ============================================

class APIKeyManager:
    """10 Gemini API key rotation sistemi"""
    
    def __init__(self):
        self.keys = self._load_keys()
        self.current_index = 0
        self.exhausted_keys = set()
        
        if not self.keys:
            raise ValueError("❌ API key bulunamadı! GEMINI_API_KEY_1 ... _10 ayarla")
        
        print(f"🔑 {len(self.keys)} API key yüklendi")
    
    def _load_keys(self) -> List[str]:
        keys = []
        for i in range(1, 11):
            key = os.environ.get(f"GEMINI_API_KEY_{i}")
            if key:
                keys.append(key)
        
        # Fallback
        if not keys:
            single = os.environ.get("GEMINI_API_KEY")
            if single:
                keys.append(single)
        
        return keys
    
    def get_key(self) -> str:
        """Kullanılabilir key al"""
        if len(self.exhausted_keys) >= len(self.keys):
            print("⚠️ Tüm keyler exhausted, sıfırlanıyor...")
            self.exhausted_keys.clear()
        
        available = [k for i, k in enumerate(self.keys) if i not in self.exhausted_keys]
        if not available:
            raise Exception("❌ Kullanılabilir API key yok!")
        
        key = random.choice(available)
        return key
    
    def mark_exhausted(self, key: str):
        try:
            idx = self.keys.index(key)
            self.exhausted_keys.add(idx)
            print(f"⚠️ Key #{idx + 1} exhausted")
        except:
            pass


# ============================================
# CONTENT HISTORY MANAGER
# ============================================

def load_history() -> dict:
    """İçerik geçmişini yükle"""
    if HISTORY_FILE.exists():
        with open(HISTORY_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    # Yeni oluştur
    history = {
        "publishedSlugs": [],
        "publishedTitles": [],
        "publishedKeywords": [],
        "lastCategory": None,
        "totalPosts": 0,
        "lastPublishDate": None,
        "categoryRotation": 0
    }
    save_history(history)
    return history


def save_history(history: dict):
    """Geçmişi kaydet"""
    with open(HISTORY_FILE, 'w', encoding='utf-8') as f:
        json.dump(history, f, indent=2, ensure_ascii=False)


def already_posted_today(history: dict) -> bool:
    """Bugün zaten post atıldı mı?"""
    if not history.get("lastPublishDate"):
        return False
    
    today = datetime.now().strftime("%Y-%m-%d")
    last = history["lastPublishDate"].split("T")[0]
    
    return today == last


def get_next_category(history: dict) -> str:
    """Rotasyon ile sıradaki kategori"""
    idx = history.get("categoryRotation", 0) % len(CONTENT_CATEGORIES)
    return CONTENT_CATEGORIES[idx]


# ============================================
# TOPIC MANAGER
# ============================================

def load_topics() -> dict:
    """topics.json yükle"""
    if TOPICS_FILE.exists():
        with open(TOPICS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {"topics": [], "future_topics": []}


def save_topics(data: dict):
    """topics.json kaydet"""
    with open(TOPICS_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def get_next_topic(topics: dict, history: dict) -> Optional[dict]:
    """Yazılmamış sıradaki konuyu al"""
    published = set(history.get("publishedSlugs", []))
    
    for topic in topics.get("topics", []):
        if topic.get("slug") not in published and topic.get("status") != "published":
            return topic
    
    return None


# ============================================
# GEMINI CONTENT GENERATION
# ============================================

SYSTEM_PROMPT = """You are the Chief Engineer at RetrofitAge.com, a world-class expert in Aging-in-Place technology with 25+ years of experience helping families make homes safer for seniors.

WRITING STYLE:
- Write like a real human expert, NOT AI
- Use contractions naturally (it's, don't, we've, I've)
- Include personal observations ("In my experience...", "I've seen...")
- Vary sentence length - mix short punchy with longer explanatory
- Add subtle humor and personality where appropriate
- Use first person plural (we) when giving advice
- Include specific numbers, measurements, prices (USD)
- Reference real brands and products

NEVER USE:
- "In this article", "Welcome to", "Let's dive in"
- "Without further ado", "In conclusion", "To summarize"
- "Unleash", "Delve into", "Journey" metaphorically
- Excessive exclamation marks
- Robotic or overly formal tone"""


HUMANIZATION_PROMPT = """Rewrite this article to sound more naturally human-written:

1. Add personal touches - "I've found...", "In my experience...", "What we recommend..."
2. Vary rhythm - mix short punchy sentences with longer ones
3. Add conversational asides in parentheses where natural
4. Include specific anecdotes ("I once worked with a family...")
5. Use contractions throughout
6. Add occasional hedging ("typically", "often", "in most cases")
7. Remove any remaining AI-ish phrases

Keep ALL technical content, markdown formatting, and structure intact.
Return the full rewritten article:"""


def create_model(api_key: str):
    genai.configure(api_key=api_key)
    return genai.GenerativeModel(
        model_name="gemini-2.0-flash-exp",
        generation_config={
            "temperature": 0.8,
            "top_p": 0.95,
            "max_output_tokens": 8192,
        },
        system_instruction=SYSTEM_PROMPT
    )


def generate_article_prompt(topic: dict) -> str:
    return f"""Write a comprehensive, SEO-optimized blog post about: "{topic['title']}"

TARGET KEYWORDS: {', '.join(topic.get('keywords', []))}
CATEGORY: {topic.get('category', 'general')}

FORMAT (include frontmatter):
---
title: "{topic['title']}"
description: "[150-160 char meta description]"
date: "{datetime.now().strftime('%Y-%m-%d')}"
category: "{topic.get('category', 'general')}"
tags: {json.dumps(topic.get('keywords', [])[:5])}
author: "RetrofitAge Engineering Team"
featured: false
---

[Article in Markdown]

REQUIRED STRUCTURE:
1. **Hook paragraph** - Engaging opener, NOT generic intro
2. **Executive Summary** - 4-5 bullet points with ✓
3. **The Problem** - Why this matters for senior safety
4. **Technical Solutions** - Compare products/methods, pros & cons
5. **Cost Analysis** - USD prices, breakdown table
6. **Installation Guide** - Step-by-step OR when to hire pro
7. **FAQ Section** - 4 questions as H3 under H2 "Frequently Asked Questions"
8. **Conclusion** - Strong CTA, not generic

MUST INCLUDE:
- Comparison table (markdown)
- Safety callouts: > **Safety Note:** ...
- Internal links: [Related: Title](/category/slug)
- Word count: 1800-2200 words
- American English

Write now as a seasoned professional sharing hard-earned knowledge:"""


async def generate_with_retry(key_manager: APIKeyManager, prompt: str, max_retries: int = 3) -> str:
    """Retry ve key rotation ile Gemini çağır"""
    last_error = None
    
    for attempt in range(max_retries):
        api_key = key_manager.get_key()
        
        try:
            model = create_model(api_key)
            response = model.generate_content(prompt)
            return response.text
            
        except Exception as e:
            last_error = e
            error_msg = str(e).lower()
            
            if any(x in error_msg for x in ['429', 'quota', 'rate', 'exhausted']):
                key_manager.mark_exhausted(api_key)
                print(f"⚠️ Rate limit, key değiştiriliyor... (deneme {attempt + 1})")
                time.sleep(2)
            else:
                raise e
    
    raise last_error


def generate_article(key_manager: APIKeyManager, topic: dict) -> str:
    """Makale üret (draft + humanize)"""
    print(f"📝 Yazılıyor: {topic['title']}")
    
    # 1. Draft
    prompt = generate_article_prompt(topic)
    
    import asyncio
    draft = asyncio.get_event_loop().run_until_complete(
        generate_with_retry(key_manager, prompt)
    )
    print("✅ Taslak oluşturuldu")
    
    time.sleep(2)
    
    # 2. Humanize
    print("🔄 Humanize ediliyor...")
    humanize_prompt = f"{HUMANIZATION_PROMPT}\n\n---\n\n{draft}"
    
    humanized = asyncio.get_event_loop().run_until_complete(
        generate_with_retry(key_manager, humanize_prompt)
    )
    print("✅ Humanize tamamlandı")
    
    return humanized


# ============================================
# NEW TOPIC GENERATION (Gemini ile)
# ============================================

def generate_new_topic(key_manager: APIKeyManager, history: dict, category: str) -> dict:
    """Gemini ile yeni konu öner"""
    print(f"🧠 Yeni konu üretiliyor (Kategori: {category})...")
    
    recent_titles = "\n- ".join(history.get("publishedTitles", [])[-20:])
    recent_keywords = ", ".join(list(set(history.get("publishedKeywords", [])))[-50:])
    
    prompt = f"""You are an SEO expert for RetrofitAge.com - an aging-in-place home modification website.

Generate ONE new blog post topic for category: "{category}"

ALREADY WRITTEN (DO NOT suggest similar):
- {recent_titles if recent_titles else '(No posts yet)'}

Already used keywords (avoid): {recent_keywords if recent_keywords else '(none)'}

Requirements:
1. UNIQUE, not similar to published topics
2. High-volume SEO keywords for home safety/aging-in-place
3. Actionable, provides real value
4. Appeals to adult children of seniors OR seniors themselves

Respond in EXACT JSON (no markdown):
{{
  "title": "SEO-Optimized Title Here",
  "slug": "url-friendly-slug",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "category": "{category}",
  "outline": [
    "Section 1",
    "Section 2", 
    "Section 3",
    "Section 4",
    "Section 5"
  ]
}}"""
    
    import asyncio
    response = asyncio.get_event_loop().run_until_complete(
        generate_with_retry(key_manager, prompt)
    )
    
    # JSON parse
    json_str = response.strip()
    if json_str.startswith('```'):
        json_str = re.sub(r'```json?\n?', '', json_str).replace('```', '').strip()
    
    topic = json.loads(json_str)
    topic["status"] = "pending"
    topic["generatedAt"] = datetime.now().isoformat()
    
    return topic


# ============================================
# FILE OPERATIONS
# ============================================

def save_article(content: str, topic: dict) -> Path:
    """MDX dosyası kaydet"""
    CONTENT_DIR.mkdir(parents=True, exist_ok=True)
    
    filepath = CONTENT_DIR / f"{topic['slug']}.mdx"
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"💾 Kaydedildi: {filepath}")
    return filepath


def git_commit_push(filepath: Path, topic: dict):
    """Git commit ve push"""
    try:
        subprocess.run(["git", "add", str(filepath)], check=True, cwd=BASE_DIR)
        subprocess.run(["git", "add", str(HISTORY_FILE)], check=True, cwd=BASE_DIR)
        subprocess.run(["git", "add", str(TOPICS_FILE)], check=True, cwd=BASE_DIR)
        
        msg = f"📝 New article: {topic['title']}"
        subprocess.run(["git", "commit", "-m", msg], check=True, cwd=BASE_DIR)
        subprocess.run(["git", "push"], check=True, cwd=BASE_DIR)
        
        print("🚀 GitHub'a push edildi!")
    except subprocess.CalledProcessError as e:
        print(f"⚠️ Git hatası: {e}")


# ============================================
# MAIN
# ============================================

def main():
    parser = argparse.ArgumentParser(description="RetrofitAge İçerik Yöneticisi")
    parser.add_argument("--all", action="store_true", help="Tüm bekleyen konuları yaz")
    parser.add_argument("--new-topic", action="store_true", help="Yeni konu öner (Gemini)")
    parser.add_argument("--no-push", action="store_true", help="Git push yapma")
    parser.add_argument("--force", action="store_true", help="Günlük limiti atla")
    args = parser.parse_args()
    
    print("🏠 RetrofitAge Akıllı İçerik Yöneticisi")
    print("=" * 50)
    
    # Load
    key_manager = APIKeyManager()
    history = load_history()
    topics_data = load_topics()
    
    print(f"📊 Toplam yayınlanmış: {history.get('totalPosts', 0)} post")
    
    # Günlük kontrol
    if not args.force and not args.new_topic and already_posted_today(history):
        print("✅ Bugün zaten bir post yayınlandı. Yarın tekrar dene.")
        print("   (--force ile bu kontrolü atlayabilirsin)")
        return
    
    # Yeni konu üret
    if args.new_topic:
        category = get_next_category(history)
        new_topic = generate_new_topic(key_manager, history, category)
        
        topics_data.setdefault("topics", []).append(new_topic)
        save_topics(topics_data)
        
        print(f"\n✅ Yeni konu eklendi: {new_topic['title']}")
        print(f"📂 Kategori: {category}")
        return
    
    # Sıradaki konuyu al
    topic = get_next_topic(topics_data, history)
    
    if not topic:
        # Otomatik yeni konu üret
        print("📋 Hazır konu yok, yeni üretiliyor...")
        category = get_next_category(history)
        topic = generate_new_topic(key_manager, history, category)
        topics_data.setdefault("topics", []).append(topic)
    
    # Makale üret
    print(f"\n{'='*50}")
    print(f"📌 Konu: {topic['title']}")
    print(f"📂 Kategori: {topic.get('category', 'general')}")
    print(f"{'='*50}\n")
    
    article = generate_article(key_manager, topic)
    
    # Kaydet
    filepath = save_article(article, topic)
    
    # History güncelle
    history["publishedSlugs"].append(topic["slug"])
    history["publishedTitles"].append(topic["title"])
    history["publishedKeywords"].extend(topic.get("keywords", []))
    history["lastCategory"] = topic.get("category")
    history["totalPosts"] = history.get("totalPosts", 0) + 1
    history["lastPublishDate"] = datetime.now().isoformat()
    history["categoryRotation"] = history.get("categoryRotation", 0) + 1
    save_history(history)
    
    # Topic status güncelle
    for t in topics_data.get("topics", []):
        if t.get("slug") == topic["slug"]:
            t["status"] = "published"
            t["publishedAt"] = datetime.now().isoformat()
    save_topics(topics_data)
    
    # Git
    if not args.no_push:
        git_commit_push(filepath, topic)
    
    print(f"\n{'='*50}")
    print("🎉 Tamamlandı!")
    print(f"📄 Dosya: {filepath}")
    print(f"📊 Toplam post: {history['totalPosts']}")
    print(f"📂 Sonraki kategori: {CONTENT_CATEGORIES[history['categoryRotation'] % len(CONTENT_CATEGORIES)]}")


if __name__ == "__main__":
    main()
