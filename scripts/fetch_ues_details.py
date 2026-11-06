import urllib.request
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

urls = [
    'http://www.ues.su/UPLOAD/2014/07/10/oil-274_300_260.jpg',
    'http://www.ues.su/UPLOAD/2014/07/08/dry_6-10_300_260.jpg',
    'http://www.ues.su/UPLOAD/2015/07/09/trans_35_teaser_300_260.jpg',
    'http://www.ues.su/UPLOAD/2014/09/02/110_208x5_300_260.jpg',
    'http://www.ues.su/UPLOAD/2015/02/17/220_208x5_300_260_300_260.jpg'
]

os.makedirs('ues_images', exist_ok=True)

for u in urls:
    filename = os.path.join('ues_images', os.path.basename(u))
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = resp.read()
            with open(filename, 'wb') as f:
                f.write(data)
            print(f"Downloaded {filename}: {len(data)} bytes")
    except Exception as e:
        print(f"Error {u}: {e}")

# Also inspect a product detail page on ues.su
detail_urls = [
    'http://www.ues.su/catalog/transformers/tmg_6-10-item/',
    'http://www.ues.su/catalog/transformers/tsl_6-10-item/'
]

for du in detail_urls:
    try:
        req = urllib.request.Request(du, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            raw = resp.read().decode('utf-8', errors='ignore')
            print(f"\nDetail {du} (length {len(raw)}):")
            # find images in detail
            imgs = re.findall(r'<img[^>]+src="([^"]+)"', raw)
            for im in imgs:
                if 'upload' in im.lower():
                    print("  Detail img:", im)
            # find tables
            tables = re.findall(r'<table[^>]*>.*?</table>', raw, re.S)
            print(f"  Found {len(tables)} tables")
            # headings
            h1 = re.findall(r'<h1[^>]*>(.*?)</h1>', raw)
            print("  H1:", h1)
    except Exception as e:
        print(f"Error {du}: {e}")
