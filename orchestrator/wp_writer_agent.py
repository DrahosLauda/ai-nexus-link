import os
import re
import sys
import base64
import requests
from dotenv import load_dotenv

# Načítanie premenných
load_dotenv()

WP_URL = os.getenv("WP_URL")
WP_USER = os.getenv("WP_USER")
WP_APP_PASSWORD = os.getenv("WP_APP_PASSWORD")
ZAI_API_KEY = os.getenv("ZAI_API_KEY")

ZAI_CHAT_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions"
ZAI_IMAGE_URL = "https://open.bigmodel.cn/api/paas/v4/images/generations"

DEFAULT_TOPIC = "Automatické spracovanie faktúr z e-mailu pomocou AI"

zai_headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {ZAI_API_KEY}",
}


def wp_auth_header():
    credentials = f"{WP_USER}:{WP_APP_PASSWORD}"
    token = base64.b64encode(credentials.encode()).decode("utf-8")
    return {"Authorization": f"Basic {token}"}


def generate_article(topic):
    """Vygeneruje titulok a HTML článku cez Z.ai GLM."""
    print(f"🐉 Generujem článok na tému: {topic}")

    prompt = f"""
    Napíš profesionálny, 1000+ slovný SEO optimalizovaný článok na tému: "{topic}".
    Článok musí byť v slovenčine a naformátovaný v čistom HTML.

    Pravidlá formátovania:
    - Prvý riadok odpovede musí byť: TITLE: pútavý SEO titulok článku (bez HTML).
    - Od druhého riadku nasleduje IBA HTML obsah článku.
    - Nepíš žiadne <html>, <head> alebo <body> tagy, iba samotný obsah.
    - Používaj <h2> a <h3> pre logické rozdelenie textu.
    - Používaj <ul>, <ol> a <li> pre zoznamy a tipy.
    - Zvýrazni dôležité kľúčové slová pomocou <strong>.
    - NEVKLADAJ žiadne <img> tagy ani obrázky — tie doplníme my.
    - Píš konkrétne: reálne príklady zo slovenských malých firiem, čísla, kroky.
    - Štýl písania nech je pútavý, moderný, ľudský a bez žargónu.

    Vygeneruj IBA titulok a HTML kód článku, nič iné.
    """

    payload = {
        "model": "glm-4.5-flash",
        "messages": [{"role": "user", "content": prompt}],
    }
    response = requests.post(ZAI_CHAT_URL, headers=zai_headers, json=payload)
    data = response.json()
    if response.status_code != 200:
        raise RuntimeError(f"Chyba API Z.ai: {data}")

    text = data["choices"][0]["message"]["content"]
    text = text.replace("```html", "").replace("```", "").strip()

    # Oddelenie titulku (prvý riadok "TITLE: ...") od HTML obsahu
    title = topic
    match = re.match(r"\s*TITLE:\s*(.+)", text)
    if match:
        title = match.group(1).strip()
        text = text[match.end():].strip()

    print(f"✅ Článok vygenerovaný: „{title}“")
    return title, text


def generate_image(topic, variant):
    """Vygeneruje tematický obrázok cez Z.ai CogView. Vráti URL alebo None."""
    prompts = {
        "hero": (
            f"Modern minimal editorial illustration for a blog article about: {topic}. "
            "Dark background, indigo and violet accents, glassmorphism, abstract technology shapes, "
            "no text, no letters, high quality"
        ),
        "inline": (
            f"Clean isometric illustration showing the process of: {topic}. "
            "Dark indigo-violet color palette, minimal, professional, no text, no letters"
        ),
    }
    payload = {
        "model": "cogview-3-flash",
        "prompt": prompts[variant],
        "size": "1344x768",
    }
    try:
        response = requests.post(ZAI_IMAGE_URL, headers=zai_headers, json=payload, timeout=120)
        data = response.json()
        if response.status_code != 200:
            print(f"⚠️  Obrázok ({variant}) sa nepodarilo vygenerovať: {data}")
            return None
        return data["data"][0]["url"]
    except Exception as e:
        print(f"⚠️  Obrázok ({variant}) sa nepodarilo vygenerovať: {e}")
        return None


def upload_image_to_wp(image_url, filename, alt_text):
    """Stiahne vygenerovaný obrázok a natrvalo ho uloží do Knižnice médií WP.

    Vráti (media_id, trvalá_url) alebo (None, None) pri zlyhaní.
    """
    try:
        img = requests.get(image_url, timeout=60)
        img.raise_for_status()

        headers = wp_auth_header() | {
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Type": img.headers.get("Content-Type", "image/png"),
        }
        response = requests.post(
            f"{WP_URL}/wp-json/wp/v2/media", headers=headers, data=img.content, timeout=60
        )
        if response.status_code != 201:
            print(f"⚠️  Nahratie do médií zlyhalo: {response.status_code} {response.text[:200]}")
            return None, None

        media = response.json()
        # Doplnenie ALT textu (dôležité pre SEO a prístupnosť)
        requests.post(
            f"{WP_URL}/wp-json/wp/v2/media/{media['id']}",
            headers=wp_auth_header() | {"Content-Type": "application/json"},
            json={"alt_text": alt_text},
            timeout=30,
        )
        print(f"🖼️  Obrázok natrvalo uložený v médiách: {media['source_url']}")
        return media["id"], media["source_url"]
    except Exception as e:
        print(f"⚠️  Nahratie obrázka zlyhalo: {e}")
        return None, None


def img_tag(url, alt):
    return (
        f'<img src="{url}" alt="{alt}" '
        'style="width:100%; border-radius:10px; margin: 20px 0;">'
    )


def insert_inline_image(article_html, tag):
    """Vloží obrázok približne do stredu článku (za prostredný nadpis <h2>)."""
    headings = [m.end() for m in re.finditer(r"</h2>", article_html)]
    if headings:
        pos = headings[len(headings) // 2]
        return article_html[:pos] + "\n" + tag + "\n" + article_html[pos:]
    paragraphs = [m.end() for m in re.finditer(r"</p>", article_html)]
    if paragraphs:
        pos = paragraphs[len(paragraphs) // 2]
        return article_html[:pos] + "\n" + tag + "\n" + article_html[pos:]
    return article_html + "\n" + tag


def generate_and_post_article(topic):
    if not all([WP_URL, WP_USER, WP_APP_PASSWORD, ZAI_API_KEY]):
        print("❌ Chyba: Chýbajú údaje v .env súbore (WP_URL, WP_USER, WP_APP_PASSWORD, ZAI_API_KEY).")
        return

    # 1. Článok
    try:
        title, article_html = generate_article(topic)
    except Exception as e:
        print(f"❌ {e}")
        return

    # 2. Obrázky: vygenerovať k téme → natrvalo uložiť do WP médií.
    #    Pri zlyhaní článok vyjde bez obrázkov — nikdy nepoužívame náhodné
    #    externé obrázky, ktoré sa menia pri každom načítaní.
    slug_base = re.sub(r"[^a-z0-9]+", "-", topic.lower()).strip("-")[:40]
    featured_media_id = None

    hero_url = generate_image(topic, "hero")
    if hero_url:
        media_id, permanent_url = upload_image_to_wp(
            hero_url, f"{slug_base}-hero.png", title
        )
        if media_id:
            featured_media_id = media_id
            article_html = img_tag(permanent_url, title) + "\n" + article_html

    inline_url = generate_image(topic, "inline")
    if inline_url:
        media_id, permanent_url = upload_image_to_wp(
            inline_url, f"{slug_base}-detail.png", f"{title} — ilustrácia postupu"
        )
        if media_id:
            article_html = insert_inline_image(
                article_html, img_tag(permanent_url, f"{title} — ilustrácia postupu")
            )

    # 3. Odoslanie do WordPressu ako koncept
    print(f"🚀 Odosielam článok na {WP_URL}...")
    wp_payload = {
        "title": title,
        "content": article_html,
        "status": "draft",  # Koncept — publikujete po kontrole vo wp-admin
    }
    if featured_media_id:
        wp_payload["featured_media"] = featured_media_id

    response = requests.post(
        f"{WP_URL}/wp-json/wp/v2/posts",
        headers=wp_auth_header() | {"Content-Type": "application/json"},
        json=wp_payload,
        timeout=60,
    )
    if response.status_code == 201:
        post_id = response.json().get("id")
        print(f"🎉 Hotovo! Článok s trvalými obrázkami je vo WordPresse ako koncept (ID: {post_id}).")
        print("   Skontrolujte ho vo wp-admin → Články a publikujte.")
    else:
        print(f"❌ WordPress vrátil chybu: {response.status_code}")
        print(response.text)


if __name__ == "__main__":
    # Téma sa dá zadať ako argument: python wp_writer_agent.py "Moja téma"
    topic = " ".join(sys.argv[1:]).strip() or DEFAULT_TOPIC
    generate_and_post_article(topic)
