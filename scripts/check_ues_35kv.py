import urllib.request
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

urls_to_check = [
    'http://www.ues.su/catalog/transformers/tm_35-item/',
    'http://www.ues.su/catalog/transformers/tmn_35-item/',
    'http://www.ues.su/catalog/transformers/tdns_35-item/'
]

for u in urls_to_check:
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            raw = resp.read().decode('utf-8', errors='ignore')
            imgs = re.findall(r'<img[^>]+src="([^"]+)"', raw)
            print(f"\n{u}:")
            for im in imgs:
                if any(k in im.lower() for k in ['upload', 'trans', '35']):
                    print(" ", im)
    except Exception as e:
        print(f"Error {u}: {e}")
