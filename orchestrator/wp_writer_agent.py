import os
import re
import sys
import base64
import random
import requests
from dotenv import load_dotenv

from directus import nacitaj_config, zapis_log

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


def generate_article(topic, model="glm-4.5-flash", system_prompt=None):
    """Vygeneruje titulok a HTML článku cez Z.ai GLM.

    model a system_prompt prichádzajú z Directus configu; ak chýbajú,
    použijú sa rozumné defaulty.
    """
    print(f"🐉 Generujem článok na tému: {topic} (model: {model})")

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

    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": prompt})

    payload = {
        "model": model,
        "messages": messages,
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


# Kandidáti na obrazový model — skúšajú sa po poradí, použije sa prvý funkčný.
# Vlastný názov sa dá vynútiť premennou ZAI_IMAGE_MODEL v .env.
IMAGE_MODEL_CANDIDATES = [
    m for m in [
        os.getenv("ZAI_IMAGE_MODEL"),
        "cogview-4-250304",
        "cogview-4",
        "cogview-3-flash",
    ] if m
]

_working_image_model = None

# Google Gemini — primárny generátor obrázkov (kľúč z https://aistudio.google.com)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# Kandidáti po poradí; vlastný model vynútite cez GEMINI_IMAGE_MODEL v .env.
GEMINI_IMAGE_CANDIDATES = [
    m for m in [
        os.getenv("GEMINI_IMAGE_MODEL"),
        "gemini-3.1-flash-image",   # Nano Banana 2 — aktuálny
        "gemini-2.5-flash-image",   # starší, stále dostupný
    ] if m
]

_working_gemini_model = None


NO_TEXT = (
    "Strictly NO text, NO letters, NO words, NO labels, NO numbers, "
    "NO typography of any kind anywhere in the image — purely visual "
    "illustration without any writing."
)


def image_subject(topic):
    """Krátky vizuálny námet z témy článku.

    Obrazové modely nevedia správne písať (najmä slovenčinu) — dlhé zadanie
    so zoznamom bodov ich zvádza kresliť infografiku s popiskami. Preto do
    obrázkového promptu ide len prvá veta témy, orezaná na ~90 znakov.
    """
    subject = re.split(r"[.:;\n]", topic)[0].strip()
    return subject[:90]


def image_prompt(topic, variant):
    subject = image_subject(topic)
    prompts = {
        "hero": (
            f"Modern minimal editorial illustration evoking: {subject}. "
            "Dark background, indigo and violet accents, glassmorphism, "
            f"abstract technology shapes, high quality. {NO_TEXT}"
        ),
        "inline": (
            f"Clean isometric illustration of abstract devices and flows evoking: {subject}. "
            f"Dark indigo-violet color palette, minimal, professional. {NO_TEXT}"
        ),
    }
    return prompts[variant]


def generate_image_gemini(topic, variant):
    """Vygeneruje obrázok cez Google Gemini. Vráti (bytes, mime) alebo (None, None)."""
    global _working_gemini_model
    headers = {"x-goog-api-key": GEMINI_API_KEY, "Content-Type": "application/json"}
    payload = {
        "contents": [{"parts": [{"text": image_prompt(topic, variant)}]}],
        "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]},
    }
    models = [_working_gemini_model] if _working_gemini_model else GEMINI_IMAGE_CANDIDATES
    for model in models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=120)
            data = response.json()
            if response.status_code == 404:  # model neexistuje → skús ďalšieho
                print(f"ℹ️  Gemini model {model} nie je dostupný, skúšam ďalší…")
                continue
            if response.status_code != 200:
                print(f"⚠️  Gemini obrázok ({variant}) zlyhal: {str(data)[:300]}")
                return None, None
            for part in data["candidates"][0]["content"]["parts"]:
                inline = part.get("inlineData") or part.get("inline_data")
                if inline:
                    _working_gemini_model = model  # zapamätaj si funkčný model
                    mime = inline.get("mimeType") or inline.get("mime_type") or "image/png"
                    return base64.b64decode(inline["data"]), mime
            print(f"⚠️  Gemini ({variant}) nevrátil obrázok v odpovedi.")
            return None, None
        except Exception as e:
            print(f"⚠️  Gemini obrázok ({variant}) zlyhal: {e}")
            return None, None
    print(f"⚠️  Žiadny Gemini model nefunguje ({', '.join(GEMINI_IMAGE_CANDIDATES)}).")
    return None, None


def generate_image_cogview(topic, variant):
    """Záloha: obrázok cez Z.ai CogView. Vráti (bytes, mime) alebo (None, None)."""
    global _working_image_model
    models = [_working_image_model] if _working_image_model else IMAGE_MODEL_CANDIDATES
    for model in models:
        payload = {
            "model": model,
            "prompt": image_prompt(topic, variant),
            "size": "1344x768",
        }
        try:
            response = requests.post(ZAI_IMAGE_URL, headers=zai_headers, json=payload, timeout=120)
            data = response.json()
            if response.status_code == 200:
                _working_image_model = model  # zapamätaj si funkčný model
                img = requests.get(data["data"][0]["url"], timeout=60)
                img.raise_for_status()
                return img.content, img.headers.get("Content-Type", "image/png")
            error_code = str(data.get("error", {}).get("code", ""))
            if error_code == "1211":  # model neexistuje → skús ďalšieho kandidáta
                print(f"ℹ️  Model {model} na tomto účte nie je, skúšam ďalší…")
                continue
            print(f"⚠️  CogView obrázok ({variant}) zlyhal: {data}")
            return None, None
        except Exception as e:
            print(f"⚠️  CogView obrázok ({variant}) zlyhal: {e}")
            return None, None
    print(f"⚠️  Žiadny CogView model nefunguje ({', '.join(IMAGE_MODEL_CANDIDATES)}).")
    return None, None


def generate_image(topic, variant, provider="gemini"):
    """Obrázok k téme. `provider` určuje primárny generátor, druhý je záloha.

    provider="gemini" (default) → Gemini, záloha CogView.
    provider="cogview"          → CogView, záloha Gemini.
    """
    if provider == "cogview":
        image, mime = generate_image_cogview(topic, variant)
        if image:
            return image, mime
        if GEMINI_API_KEY:
            print("ℹ️  Skúšam zálohu cez Google Gemini…")
            return generate_image_gemini(topic, variant)
        return None, None

    # Predvolene Gemini ako primárny, CogView ako záloha.
    if GEMINI_API_KEY:
        image, mime = generate_image_gemini(topic, variant)
        if image:
            return image, mime
        print("ℹ️  Skúšam zálohu cez Z.ai CogView…")
    return generate_image_cogview(topic, variant)


def upload_image_to_wp(image_bytes, mime, filename, alt_text):
    """Natrvalo uloží obrázok do Knižnice médií WP.

    Vráti (media_id, trvalá_url) alebo (None, None) pri zlyhaní.
    """
    try:
        headers = wp_auth_header() | {
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Type": mime,
        }
        response = requests.post(
            f"{WP_URL}/wp-json/wp/v2/media", headers=headers, data=image_bytes, timeout=60
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


def generate_and_post_article(topic=None):
    if not all([WP_URL, WP_USER, WP_APP_PASSWORD, ZAI_API_KEY]):
        print("❌ Chyba: Chýbajú údaje v .env súbore (WP_URL, WP_USER, WP_APP_PASSWORD, ZAI_API_KEY).")
        return

    # 0. Nastavenia z Directusu (ak nie sú, padáme na defaulty).
    config = nacitaj_config() or {}
    model = config.get("text_model") or "glm-4.5-flash"
    system_prompt = config.get("system_prompt") or None
    image_provider = config.get("image_provider") or "gemini"
    post_status = config.get("post_status") or "draft"

    # Téma: 1) argument z príkazu, 2) náhodná zo zoznamu topics v configu,
    # 3) predvolená téma. Náhodný výber využije cloud worker bez zásahu človeka.
    if not topic:
        topics = config.get("topics") or []
        if topics:
            topic = random.choice(topics)
            print(f"🎲 Téma vybraná zo zoznamu topics: {topic}")
        else:
            topic = DEFAULT_TOPIC
            print(f"ℹ️  Config nemá témy, použijem predvolenú: {topic}")

    # 1. Článok
    try:
        title, article_html = generate_article(topic, model=model, system_prompt=system_prompt)
    except Exception as e:
        print(f"❌ {e}")
        zapis_log("error", topic=topic, message=f"Generovanie článku zlyhalo: {e}")
        return

    # 2. Obrázky: vygenerovať k téme → natrvalo uložiť do WP médií.
    #    Pri zlyhaní článok vyjde bez obrázkov — nikdy nepoužívame náhodné
    #    externé obrázky, ktoré sa menia pri každom načítaní.
    slug_base = re.sub(r"[^a-z0-9]+", "-", topic.lower()).strip("-")[:40]
    featured_media_id = None

    image, mime = generate_image(topic, "hero", provider=image_provider)
    if image:
        ext = "jpg" if "jpeg" in mime else "png"
        media_id, permanent_url = upload_image_to_wp(
            image, mime, f"{slug_base}-hero.{ext}", title
        )
        if media_id:
            featured_media_id = media_id
            article_html = img_tag(permanent_url, title) + "\n" + article_html

    image, mime = generate_image(topic, "inline", provider=image_provider)
    if image:
        ext = "jpg" if "jpeg" in mime else "png"
        media_id, permanent_url = upload_image_to_wp(
            image, mime, f"{slug_base}-detail.{ext}", f"{title} — ilustrácia postupu"
        )
        if media_id:
            article_html = insert_inline_image(
                article_html, img_tag(permanent_url, f"{title} — ilustrácia postupu")
            )

    # 3. Odoslanie do WordPressu. Predvolene ako koncept (post_status="draft"),
    #    publikovanie sa dá zapnúť v Directus configu — poistka proti nechcenému
    #    automatickému publikovaniu ostáva na strane configu.
    print(f"🚀 Odosielam článok na {WP_URL} (status: {post_status})...")
    wp_payload = {
        "title": title,
        "content": article_html,
        "status": post_status,
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
        print(f"🎉 Hotovo! Článok s trvalými obrázkami je vo WordPresse ako {post_status} (ID: {post_id}).")
        print("   Skontrolujte ho vo wp-admin → Články a publikujte.")
        zapis_log(
            "success",
            topic=topic,
            message=f"Vytvorený {post_status}: „{title}“.",
            wp_post_id=post_id,
        )
    else:
        print(f"❌ WordPress vrátil chybu: {response.status_code}")
        print(response.text)
        zapis_log(
            "error",
            topic=topic,
            message=f"WordPress vrátil {response.status_code}: {response.text[:300]}",
        )


if __name__ == "__main__":
    # Téma sa dá zadať ako argument: python wp_writer_agent.py "Moja téma".
    # Bez argumentu si tému vyberie sám zo zoznamu topics v Directus configu.
    topic = " ".join(sys.argv[1:]).strip() or None
    generate_and_post_article(topic)
