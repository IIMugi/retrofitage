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

def scan_existing_posts() -> List[str]:
    """Mevcut .mdx dosyalarının slug'larını tara"""
    existing_slugs = []
    if CONTENT_DIR.exists():
        for mdx_file in CONTENT_DIR.glob("*.mdx"):
            slug = mdx_file.stem  # Dosya adından .mdx uzantısını çıkar
            existing_slugs.append(slug)
    return existing_slugs


def load_history() -> dict:
    """İçerik geçmişini yükle"""
    if HISTORY_FILE.exists():
        with open(HISTORY_FILE, 'r', encoding='utf-8') as f:
            history = json.load(f)
            # Mevcut dosyaları da kontrol et
            existing = scan_existing_posts()
            for slug in existing:
                if slug not in history.get("publishedSlugs", []):
                    history["publishedSlugs"].append(slug)
            return history
    
    # Yeni oluştur - mevcut dosyaları tara
    existing_slugs = scan_existing_posts()
    history = {
        "publishedSlugs": existing_slugs,
        "publishedTitles": [],
        "publishedKeywords": [],
        "lastCategory": None,
        "totalPosts": len(existing_slugs),
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
        model_name="gemini-2.5-flash",  # Free tier, blog için ideal
        generation_config={
            "temperature": 0.8,
            "top_p": 0.95,
            "max_output_tokens": 8192,  # Flash yeterli output limit
        },
        system_instruction=SYSTEM_PROMPT
    )


def get_unsplash_image(keywords: List[str], category: str) -> str:
    """Unsplash'tan konuya uygun görsel URL'i oluştur"""
    # Kategori bazlı önceden seçilmiş yüksek kaliteli Unsplash fotoğrafları
    # Her kategoride 5 farklı görsel - rotasyonla kullanılacak
    category_images = {
        "bathroom-safety": [
            "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&h=630&fit=crop&q=80",  # Modern bathroom
            "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&h=630&fit=crop&q=80",  # Clean bathroom
            "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1200&h=630&fit=crop&q=80",  # Bathroom interior
            "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1200&h=630&fit=crop&q=80",  # Spa bathroom
            "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&h=630&fit=crop&q=80",  # Luxury bath
        ],
        "smart-home": [
            "https://images.unsplash.com/photo-1558002038-1055907df827?w=1200&h=630&fit=crop&q=80",  # Smart speaker
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=630&fit=crop&q=80",  # Home automation
            "https://images.unsplash.com/photo-1585503418537-88331351ad99?w=1200&h=630&fit=crop&q=80",  # Smart devices
            "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=1200&h=630&fit=crop&q=80",  # Living room tech
            "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1200&h=630&fit=crop&q=80",  # Smart home setup
        ],
        "smart-monitoring": [
            "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=630&fit=crop&q=80",  # Health tech
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop&q=80",  # Dashboard
            "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&h=630&fit=crop&q=80",  # Medical device
            "https://images.unsplash.com/photo-1576671081837-49000212a370?w=1200&h=630&fit=crop&q=80",  # Health monitor
            "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=1200&h=630&fit=crop&q=80",  # Smartwatch
        ],
        "finance-insurance": [
            "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=630&fit=crop&q=80",  # Financial planning
            "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=630&fit=crop&q=80",  # Documents
            "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=1200&h=630&fit=crop&q=80",  # Calculator
            "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=630&fit=crop&q=80",  # Insurance
            "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&h=630&fit=crop&q=80",  # Money planning
        ],
        "finance": [
            "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&h=630&fit=crop&q=80",  # Savings
            "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=630&fit=crop&q=80",  # Planning
            "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=1200&h=630&fit=crop&q=80",  # Money
            "https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?w=1200&h=630&fit=crop&q=80",  # Home investment
            "https://images.unsplash.com/photo-1560472355-536de3962603?w=1200&h=630&fit=crop&q=80",  # Budget
        ],
        "structural-retrofit": [
            "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=630&fit=crop&q=80",  # Construction
            "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=630&fit=crop&q=80",  # Renovation
            "https://images.unsplash.com/photo-1585128792020-803d29415281?w=1200&h=630&fit=crop&q=80",  # Home improvement
            "https://images.unsplash.com/photo-1523413363574-c30aa1c2a516?w=1200&h=630&fit=crop&q=80",  # Tools
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=630&fit=crop&q=80",  # Building
        ],
        "housing-options": [
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=630&fit=crop&q=80",  # Modern house
            "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&h=630&fit=crop&q=80",  # Family home
            "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1200&h=630&fit=crop&q=80",  # Cottage
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=630&fit=crop&q=80",  # Luxury home
            "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=1200&h=630&fit=crop&q=80",  # Cozy house
        ],
        "kitchen-safety": [
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=630&fit=crop&q=80",  # Modern kitchen
            "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=1200&h=630&fit=crop&q=80",  # Clean kitchen
            "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=1200&h=630&fit=crop&q=80",  # Kitchen interior
            "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1200&h=630&fit=crop&q=80",  # Cooking
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=630&fit=crop&q=80",  # Home kitchen
        ],
        "electrical-lighting": [
            "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=1200&h=630&fit=crop&q=80",  # Light bulbs
            "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=1200&h=630&fit=crop&q=80",  # Pendant lights
            "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1200&h=630&fit=crop&q=80",  # Interior lighting
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=630&fit=crop&q=80",  # Bright room
            "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&h=630&fit=crop&q=80",  # Living room
        ],
        "accessibility": [
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&h=630&fit=crop&q=80",  # Accessibility
            "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=630&fit=crop&q=80",  # Home access
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=630&fit=crop&q=80",  # Home
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=630&fit=crop&q=80",  # Interior
            "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=630&fit=crop&q=80",  # Modern space
        ],
    }
    
    # Varsayılan görseller
    default_images = [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=630&fit=crop&q=80",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=630&fit=crop&q=80",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=630&fit=crop&q=80",
    ]
    
    # Kategoriye göre görsel seç
    images = category_images.get(category, default_images)
    
    # Rastgele birini seç
    return random.choice(images)


def generate_article_prompt(topic: dict) -> str:
    # Görsel URL'i oluştur
    image_url = get_unsplash_image(topic.get('keywords', []), topic.get('category', 'general'))
    
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
image: "{image_url}"
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


async def generate_with_retry(key_manager: APIKeyManager, prompt: str, max_retries: int = 15) -> str:
    """Retry ve key rotation ile Gemini çağır - 10 key için 15 deneme
    
    Özellikler:
    - 503 UNAVAILABLE error handling
    - Exponential backoff (1s, 2s, 4s, 8s, 16s)
    - Quota/rate limit için key rotation
    """
    last_error = None
    
    for attempt in range(max_retries):
        api_key = key_manager.get_key()
        
        if not api_key:
            print("❌ Tüm API key'ler tükendi!")
            break
        
        try:
            model = create_model(api_key)
            response = model.generate_content(prompt)
            return response.text
            
        except Exception as e:
            last_error = e
            error_msg = str(e).lower()
            
            # 503 Service Unavailable - Exponential backoff
            if '503' in error_msg or 'unavailable' in error_msg or 'overloaded' in error_msg:
                wait_time = min(2 ** attempt, 16)  # 1s, 2s, 4s, 8s, 16s max
                print(f"⚠️ API geçici olarak aşırı yüklü (503), {wait_time}s bekleniyor... (deneme {attempt + 1}/{max_retries})")
                time.sleep(wait_time)
                continue
            
            # Quota/Rate limit - Key rotation
            if any(x in error_msg for x in ['429', 'quota', 'rate', 'exhausted', 'resource']):
                key_manager.mark_exhausted(api_key)
                print(f"⚠️ Rate limit, key değiştiriliyor... (deneme {attempt + 1}/{max_retries})")
                time.sleep(2)  # Kısa bekleme
                continue
            
            # Diğer hatalar - Direkt fırlat
            print(f"❌ Beklenmeyen hata: {e}")
            raise e
    
    raise last_error


def clean_gemini_preamble(text: str) -> str:
    """Gemini'nin yanıtın başına eklediği preamble metinlerini temizle"""
    lines = text.split('\n')
    
    # Başta gereksiz metinleri at
    skip_phrases = [
        'here is the rewritten',
        'here\'s the rewritten',
        'here is the article',
        'here\'s the article',
        'chief',
        'adopting the persona',
    ]
    
    start_idx = 0
    for i, line in enumerate(lines):
        lower_line = line.lower().strip()
        # Skip empty lines and preamble phrases
        if not lower_line:
            continue
        if any(phrase in lower_line for phrase in skip_phrases):
            start_idx = i + 1
            continue
        # Frontmatter başladıysa orada kes
        if lower_line == '---':
            start_idx = i
            break
        # Normal içerik başladıysa orada kes
        if lower_line and not any(phrase in lower_line for phrase in skip_phrases):
            start_idx = i
            break
    
    cleaned_lines = lines[start_idx:]
    return '\n'.join(cleaned_lines).strip()


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
    
    # 3. Clean preamble
    cleaned = clean_gemini_preamble(humanized)
    print("✅ Preamble temizlendi")
    
    return cleaned


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
    parser = argparse.ArgumentParser(description="RetrofitAge Content Manager")
    parser.add_argument("--all", action="store_true", help="Generate all pending topics")
    parser.add_argument("--new-topic", action="store_true", help="Suggest new topic (Gemini)")
    parser.add_argument("--no-push", action="store_true", help="Skip git push")
    parser.add_argument("--force", action="store_true", help="Skip daily limit check")
    args = parser.parse_args()
    
    print("RetrofitAge Smart Content Manager")
    print("=" * 50)
    
    # Load
    key_manager = APIKeyManager()
    history = load_history()
    topics_data = load_topics()
    
    print(f"Total published: {history.get('totalPosts', 0)} posts")
    
    # Daily check
    if not args.force and not args.new_topic and already_posted_today(history):
        print("Already posted today. Try again tomorrow.")
        print("(Use --force to skip this check)")
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
