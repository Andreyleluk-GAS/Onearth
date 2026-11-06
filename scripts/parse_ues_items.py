import urllib.request
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('ues_su.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# Let's find blocks with cat2Item or similar
items = re.findall(r'<div[^>]*class=["\'][^"\']*cat2Item[^"\']*["\'][^>]*>(.*?)</div>\s*</div>', html, re.S)
if not items:
    items = re.findall(r'<div[^>]*class=["\'][^"\']*cat2Item[^"\']*["\'][^>]*>(.*?)(?=<div[^>]*class=["\'][^"\']*cat2Item|$)', html, re.S)

print(f"Found {len(items)} items:")
for i, item in enumerate(items):
    print(f"\n--- ITEM {i+1} ---")
    img = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', item)
    name = re.search(r'<div[^>]*class=["\'][^"\']*Name[^"\']*["\'][^>]*>(.*?)</div>', item, re.S)
    children = re.findall(r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', item, re.S)
    
    if img:
        print("Image:", img.group(1))
    if name:
        print("Name:", re.sub(r'<[^>]+>', '', name.group(1)).strip())
    print("Sub-items/links:")
    for href, txt in children:
        clean = re.sub(r'<[^>]+>', '', txt).strip()
        print(f"  * {clean} ({href})")
