import urllib.request
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

for du in [
    'http://www.ues.su/catalog/transformers/tmg_6-10-item/',
    'http://www.ues.su/catalog/transformers/tsl_6-10-item/'
]:
    req = urllib.request.Request(du, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=10) as resp:
        raw = resp.read().decode('utf-8', errors='ignore')
        print(f"\n==================== {du} ====================")
        # title, h1
        print("TITLE:", re.findall(r'<title>(.*?)</title>', raw, re.I))
        print("H1:", re.findall(r'<h1[^>]*>(.*?)</h1>', raw, re.I))
        # find all images
        imgs = re.findall(r'<img[^>]+src="([^"]+)"', raw)
        print("Images:")
        for im in imgs:
            if any(k in im.lower() for k in ['upload', 'trans', 'photo']):
                print(" ", im)
        # find table headers or structure
        th_tags = re.findall(r'<th[^>]*>(.*?)</th>', raw, re.S)
        if th_tags:
            print("Table headers:", [re.sub(r'<[^>]+>', '', t).strip() for t in th_tags[:10]])
        # find links to questionnaires / docs / drawings
        doc_links = re.findall(r'<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>', raw, re.S)
        print("Doc/questionnaire links:")
        for h, t in doc_links:
            if any(k in h.lower() or k in t.lower() for k in ['opros', 'pdf', 'doc', 'dwg', 'схема', 'чертеж', 'опрос']):
                print(f"  * {re.sub(r'<[^>]+>', '', t).strip()} -> {h}")
