"""Oprava obrázkov v existujúcom WP článku.

Odstráni z článku staré <img> tagy (napr. náhodné picsum.photos) a nahradí
ich novými tematickými obrázkami vygenerovanými k zadanej téme — natrvalo
uloženými v Knižnici médií, rovnako ako to robí wp_writer_agent.

Použitie:
    python fix_post_images.py <ID článku> "Téma pre obrázky"

ID článku nájdete vo wp-admin v adrese pri úprave článku (…post=ID…).
"""

import re
import sys

import requests
from wp_writer_agent import (
    WP_URL,
    generate_image,
    img_tag,
    insert_inline_image,
    upload_image_to_wp,
    wp_auth_header,
)


def fix_post(post_id, topic):
    # 1. Načítanie článku (context=edit vráti surové HTML bez WP úprav)
    response = requests.get(
        f"{WP_URL}/wp-json/wp/v2/posts/{post_id}?context=edit",
        headers=wp_auth_header(),
        timeout=30,
    )
    if response.status_code != 200:
        print(f"❌ Článok {post_id} sa nepodarilo načítať: {response.status_code} {response.text[:200]}")
        return
    post = response.json()
    title = post["title"].get("raw") or post["title"].get("rendered", topic)
    content = post["content"].get("raw") or post["content"].get("rendered", "")
    print(f"📄 Článok: „{title}“ (stav: {post.get('status')})")

    # 2. Odstránenie všetkých starých <img> tagov
    content, removed = re.subn(r"<img[^>]*>", "", content)
    print(f"🧹 Odstránené staré obrázky: {removed}")

    # 3. Nové tematické obrázky — rovnaká mašinéria ako pri novom článku
    slug_base = re.sub(r"[^a-z0-9]+", "-", topic.lower()).strip("-")[:40]
    featured_media_id = None

    image, mime = generate_image(topic, "hero")
    if image:
        ext = "jpg" if "jpeg" in mime else "png"
        media_id, url = upload_image_to_wp(image, mime, f"{slug_base}-hero.{ext}", title)
        if media_id:
            featured_media_id = media_id
            content = img_tag(url, title) + "\n" + content

    image, mime = generate_image(topic, "inline")
    if image:
        ext = "jpg" if "jpeg" in mime else "png"
        media_id, url = upload_image_to_wp(
            image, mime, f"{slug_base}-detail.{ext}", f"{title} — ilustrácia postupu"
        )
        if media_id:
            content = insert_inline_image(
                content, img_tag(url, f"{title} — ilustrácia postupu")
            )

    if not featured_media_id and removed == 0:
        print("ℹ️  Nič sa nezmenilo (žiadne staré obrázky, žiadne nové) — končím.")
        return

    # 4. Uloženie späť do WordPressu (stav článku sa nemení; ak je
    #    publikovaný, úprava spustí webhook a stránka sa obnoví sama)
    payload = {"content": content}
    if featured_media_id:
        payload["featured_media"] = featured_media_id
    response = requests.post(
        f"{WP_URL}/wp-json/wp/v2/posts/{post_id}",
        headers=wp_auth_header() | {"Content-Type": "application/json"},
        json=payload,
        timeout=60,
    )
    if response.status_code == 200:
        print(f"🎉 Hotovo! Článok {post_id} má nové trvalé obrázky.")
    else:
        print(f"❌ Uloženie zlyhalo: {response.status_code} {response.text[:200]}")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print('Použitie: python fix_post_images.py <ID článku> "Téma pre obrázky"')
        sys.exit(1)
    fix_post(sys.argv[1], " ".join(sys.argv[2:]).strip())
