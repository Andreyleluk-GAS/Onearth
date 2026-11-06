import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('ues_su.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# Let's find everything inside cat2List or whatever container holds the transformers
m = re.search(r'<div class="cat2List">(.*?)</div>\s*</div>\s*</div>', html, re.S)
if m:
    content = m.group(1)
    print("Found cat2List, length:", len(content))
    # Find all cat2Item
    items = re.findall(r'<div class="cat2Item">(.*?)</div>\s*(?=<div class="cat2Item"|$)', content, re.S)
    print("Found items count:", len(items))
    for i, it in enumerate(items):
        print(f"\n================ ITEM {i+1} ================")
        img = re.search(r'<img[^>]+src="([^"]+)"', it)
        name = re.search(r'<div class="cat2ItemName">(.*?)</div>', it, re.S)
        if img:
            print("IMG:", img.group(1))
        if name:
            print("CATEGORY NAME:", re.sub(r'<[^>]+>', '', name.group(1)).strip())
        
        # Subgroups / children
        children = re.findall(r'<div class="cat2ItemChild">(.*?)</div>', it, re.S)
        for ch in children:
            ch_name = re.search(r'<div class="cat2ItemChildName">(.*?)</div>', ch, re.S)
            if ch_name:
                print("  SUB-CATEGORY:", re.sub(r'<[^>]+>', '', ch_name.group(1)).strip())
            links = re.findall(r'<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>', ch, re.S)
            for h, t in links:
                print(f"    - {re.sub(r'<[^>]+>', '', t).strip()} (url: {h})")
else:
    print("cat2List not found, searching for other containers...")
    for tag in re.findall(r'<div class="([^"]+)"', html):
        if 'cat' in tag or 'item' in tag or 'prod' in tag:
            print(tag)
