import os
import requests
import base64
from dotenv import load_dotenv

# Načítanie premenných
load_dotenv()

WP_URL = os.getenv("WP_URL")
WP_USER = os.getenv("WP_USER")
WP_APP_PASSWORD = os.getenv("WP_APP_PASSWORD")
ZAI_API_KEY = os.getenv("ZAI_API_KEY")

def generate_and_post_article():
    if not all([WP_URL, WP_USER, WP_APP_PASSWORD, ZAI_API_KEY]):
        print("❌ Chyba: Chýbajú údaje v .env súbore (nezabudni pridať ZAI_API_KEY).")
        return

    print("🐉 Pripájam sa na čínsky model od Z.ai (GLM-5.2)...")
    
    # 1. ČASŤ: GENEROVANIE ČLÁNKU POMOCOU Z.AI API
    zai_url = "https://open.bigmodel.cn/api/paas/v4/chat/completions"
    zai_headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {ZAI_API_KEY}"
    }
    
    prompt = """
    Napíš profesionálny, 1000+ slovný SEO optimalizovaný článok na tému: "Ako automatizovať firemné a osobné procesy pomocou umelej inteligencie".
    Článok musí byť v slovenčine a naformátovaný v čistom HTML.
    
    Pravidlá formátovania:
    - Nepíš žiadne <html>, <head> alebo <body> tagy, iba samotný obsah.
    - Používaj <h2> a <h3> pre logické rozdelenie textu.
    - Používaj <ul>, <ol> a <li> pre zoznamy a tipy.
    - Zvýrazni dôležité kľúčové slová pomocou <strong>.
    - Vlož do textu aspoň 2 tematické (ilustračné) obrázky pomocou tohto HTML kódu: <img src="https://picsum.photos/800/400?random=1" alt="Opis obrázku pre SEO" style="width:100%; border-radius:10px; margin: 20px 0;"> (pri druhom obrázku zmeň random číslo na 2).
    - Štýl písania nech je pútavý, moderný, s presahom do roku 2026.
    
    Vygeneruj IBA HTML kód článku, nič iné.
    """
    
    zai_payload = {
        "model": "glm-4.5-flash", # Použijeme ich najnovší výkonný model
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }
    
    try:
        # Odoslanie požiadavky na Z.ai
        response = requests.post(zai_url, headers=zai_headers, json=zai_payload)
        response_data = response.json()
        
        # Ak Z.ai vráti chybu (napr. zlý kľúč)
        if response.status_code != 200:
            print(f"❌ Chyba API Z.ai: {response_data}")
            return
            
        # Očistenie výsledného HTML kódu
        article_html = response_data['choices'][0]['message']['content']
        article_html = article_html.replace('```html', '').replace('```', '').strip()
        print("✅ Článok bol úspešne vygenerovaný čínskym drakom!")
        
    except Exception as e:
        print(f"❌ Chyba pri komunikácii so Z.ai: {e}")
        return

    # 2. ČASŤ: ODOSLANIE DO WORDPRESSU
    print(f"🚀 Odosielam obrovský vygenerovaný článok na {WP_URL}...")
    api_url = f"{WP_URL}/wp-json/wp/v2/posts"
    credentials = f"{WP_USER}:{WP_APP_PASSWORD}"
    token = base64.b64encode(credentials.encode()).decode('utf-8')
    
    wp_headers = {
        'Authorization': f'Basic {token}',
        'Content-Type': 'application/json'
    }
    
    wp_payload = {
        'title': 'Ako automatizovať firemné a osobné procesy pomocou umelej inteligencie (Kompletný sprievodca)',
        'content': article_html,
        'status': 'draft' # Koncept
    }
    
    wp_response = requests.post(api_url, headers=wp_headers, json=wp_payload)
    
    if wp_response.status_code == 201:
        post_id = wp_response.json().get('id')
        print(f"🎉 BINGO! Plnohodnotný SEO článok je vo WordPresse ako koncept s ID: {post_id}")
    else:
        print(f"❌ Ups, WordPress vrátil chybu: {wp_response.status_code}")
        print(wp_response.text)

if __name__ == "__main__":
    generate_and_post_article()