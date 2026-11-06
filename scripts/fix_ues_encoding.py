import urllib.request
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

req = urllib.request.Request('http://www.ues.su/catalog/transformers/', headers={'User-Agent': 'Mozilla/5.0'})
raw = urllib.request.urlopen(req, timeout=10).read()

# Let's try decoding with windows-1251
text_cp1251 = raw.decode('windows-1251', errors='replace')

with open('ues_su_cp1251.html', 'w', encoding='utf-8') as f:
    f.write(text_cp1251)

print("Saved ues_su_cp1251.html with UTF-8 encoding")
# Let's inspect headings and content
print("Title:", re.findall(r'<title>(.*?)</title>', text_cp1251))
print("H1:", re.findall(r'<h1[^>]*>(.*?)</h1>', text_cp1251))
print("H2:", re.findall(r'<h2[^>]*>(.*?)</h2>', text_cp1251))
print("H3:", re.findall(r'<h3[^>]*>(.*?)</h3>', text_cp1251))
