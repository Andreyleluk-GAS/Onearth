import urllib.request
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

urls = [
    'http://www.ues.su/UPLOAD/user/production/transformers/6-10/tmg/tmg_25-100.png',
    'http://www.ues.su/UPLOAD/user/production/transformers/6-10/tmg/tmg_160-630.png',
    'http://www.ues.su/UPLOAD/user/production/transformers/6-10/tmg/tmg_1000-2500.png',
    'http://www.ues.su/UPLOAD/user/production/transformers/6-10/tsl/tsl_250-2500.png',
    'http://www.ues.su/UPLOAD/user/production/transformers/6-10/tsl/tslz_250-2500.png',
    'http://www.ues.su/UPLOAD/2015/07/09/trans_35_teaser_300_260.jpg',
    'http://www.ues.su/UPLOAD/2014/07/10/oil-274_300_260.jpg',
    'http://www.ues.su/UPLOAD/2014/07/08/dry_6-10_300_260.jpg',
    'http://www.ues.su/UPLOAD/2014/09/02/110_208x5_300_260.jpg'
]

os.makedirs('ues_highres', exist_ok=True)

for u in urls:
    filename = os.path.join('ues_highres', os.path.basename(u))
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = resp.read()
            with open(filename, 'wb') as f:
                f.write(data)
            print(f"Downloaded {filename}: {len(data)} bytes")
    except Exception as e:
        print(f"Error {u}: {e}")
