import json

# Read the original broken file
with open('src/data/parts/classics-honglou.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract all id, title, content triples using regex
import re

# Find all chapter entries
pattern = r"\{\s*id:\s*(\d+),\s*title:\s*'([^']*)',\s*content:\s*'([^']*)'\s*\}"
# Actually, the content may have escaped quotes now, let's find them differently

# Find with simpler approach - extract each chapter block
blocks = content.split('},\n  {')
chapters = []

# First, let's try to rebuild using JSON-like parsing
# Find all id: N, title: '...', content: '...' patterns
entries = re.findall(r"id:\s*(\d+),?\s*title:\s*'([^']*)',?\s*content:\s*'([^']*)'", content)

print(f"Found {len(entries)} entries")

# Rebuild each entry with proper escaping
new_entries = []
for eid, title, ctext in entries:
    # Escape for JS string - handle single quotes inside
    escaped_content = ctext.replace("'", "\\'")
    entry = f"    {{ id: {eid}, title: '{title}', content: '{escaped_content}' }},"
    new_entries.append(entry)

# Write the file
with open('src/data/parts/classics-honglou.js', 'w', encoding='utf-8') as f:
    f.write("const HONGLOU_CHAPTERS = [\n")
    f.write('\n'.join(new_entries))
    f.write("\n]\n\nexport default HONGLOU_CHAPTERS;\n")

print(f"Written {len(new_entries)} entries")
