import re

with open('ues_su.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# Let's find the main content block
# Look for <div class="content" or <div class="catalog" or similar
main_content = re.search(r'<div[^>]*class=["\'][^"\']*(?:content|catalog|center|main)[^"\']*["\'][^>]*>(.*?)</div>\s*<div[^>]*class=["\']footer', html, re.S | re.I)
if not main_content:
    # Look for H1
    h1_pos = html.find('<h1')
    footer_pos = html.find('footer')
    if h1_pos != -1:
        snippet = html[h1_pos:footer_pos if footer_pos != -1 else h1_pos+10000]
    else:
        snippet = html[:5000]
else:
    snippet = main_content.group(1)

print("SNIPPET LENGTH:", len(snippet))
with open('ues_section_dump.html', 'w', encoding='utf-8') as f:
    f.write(snippet)

print("Wrote ues_section_dump.html")
