import os
import requests
from dotenv import load_dotenv

# Načíta tajné údaje z tvojho .env súboru
load_dotenv()

DIRECTUS_URL = os.getenv("DIRECTUS_URL")
DIRECTUS_TOKEN = os.getenv("DIRECTUS_TOKEN")

print("Zobúdzam agenta a testujem spojenie...")
print(f"Cieľová databáza: {DIRECTUS_URL}")

# Pripravíme si "kľúč" pre Directus
headers = {
    "Authorization": f"Bearer {DIRECTUS_TOKEN}"
}

# Skúsime zaklopať na našu vytvorenú tabuľku 'agent_config'
try:
    response = requests.get(f"{DIRECTUS_URL}/items/agent_config", headers=headers)
    
    if response.status_code == 200:
        print("\n✅ ÚSPECH! Agent je úspešne prepojený s Directusom!")
        print("Načítané dáta z tabuľky:", response.json())
    else:
        print(f"\n❌ NIEČO JE ZLE. Kód chyby: {response.status_code}")
        print("Detail chyby:", response.text)
except Exception as e:
    print(f"\n❌ ZLYHALO PRIPOJENIE: {e}")