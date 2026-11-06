import urllib.request
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

urls_35 = [
    'http://www.ues.su/UPLOAD/user/production/transformers/35/tmn/tmn_1000-1600.png',
    'http://www.ues.su/UPLOAD/user/production/transformers/35/tmn/tmn_2500-6300.png',
    'http://www.ues.su/UPLOAD/user/production/transformers/35/tdns/tdns-35_10000-16000_01.png',
    'http://www.ues.su/UPLOAD/user/production/transformers/35/tm/tm-35_4000-6300_01.png'
]

for u in urls_35:
    fn = os.path.join('ues_highres', os.path.basename(u))
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = resp.read()
            with open(fn, 'wb') as f:
                f.write(data)
            print(f"Downloaded {fn}: {len(data)} bytes")
    except Exception as e:
        print(f"Error {u}: {e}")
