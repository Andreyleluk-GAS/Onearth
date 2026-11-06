import urllib.request
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

url = 'http://www.ues.su/catalog/transformers/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        raw = resp.read()
except Exception as e:
    print("Fetch error:", e)
    sys.exit(1)

# Check charset
charset = 'windows-1251'
for enc in ['windows-1251', 'utf-8']:
    try:
        decoded = raw.decode(enc)
        if 'трансформатор' in decoded.lower():
            charset = enc
            break
    except:
        pass

print(f"Detected charset: {charset}")
html = raw.decode(charset, errors='replace')

# Title
title_match = re.search(r'<title>(.*?)</title>', html, re.I | re.S)
if title_match:
    print("PAGE TITLE:", title_match.group(1).strip())

# Find images and their links or alt
img_tags = re.findall(r'<img[^>]+>', html)
print(f"\nTOTAL IMAGES FOUND: {len(img_tags)}")
for tag in img_tags:
    src_match = re.search(r'src=["\']([^"\']+)["\']', tag)
    alt_match = re.search(r'alt=["\']([^"\']+)["\']', tag)
    src = src_match.group(1) if src_match else ""
    alt = alt_match.group(1) if alt_match else ""
    if any(k in src.lower() or k in alt.lower() for k in ['trans', 'catalog', 'upload', 'tm', 'ts']):
        print(f"IMG: src={src} | alt={alt}")

# Find catalog categories or structure
print("\nCATALOG SECTIONS / LINKS:")
links = re.findall(r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', html, re.S)
for href, text in links:
    clean_text = re.sub(r'<[^>]+>', '', text).strip()
    if any(k in href.lower() for k in ['catalog', 'transformers']) and clean_text:
        print(f"LINK: {href} -> {clean_text}")

# Find main content headings and blocks
print("\nHEADINGS:")
for h, text in re.findall(r'<(h[1-4])[^>]*>(.*?)</\1>', html, re.S):
    clean_text = re.sub(r'<[^>]+>', '', text).strip()
    if clean_text:
        print(f"{h.upper()}: {clean_text}")

# Look at classes and structure
classes = set(re.findall(r'class=["\']([^"\']+)["\']', html))
print(f"\nSome notable classes: {[c for c in classes if any(k in c.lower() for k in ['item', 'card', 'prod', 'cat', 'list', 'grid'])][:15]}")
