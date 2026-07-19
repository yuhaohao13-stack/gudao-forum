import json, re

with open('src/data/parts/classics-honglou.js', 'r', encoding='utf-8') as f:
    raw = f.read()

lines = raw.split('\n')
new_lines = []

for line in lines:
    stripped = line.strip()
    if stripped.startswith("content: '"):
        # Split on the first occurrence of content: '
        idx = line.index("content: '") + len("content: '")
        before = line[:idx]
        rest = line[idx:]
        
        # Find closing '
        if rest.endswith("',"):
            content_text = rest[:-2]
            trailing = "',"
        elif rest.endswith("'"):
            content_text = rest[:-1]
            trailing = "'"
        else:
            new_lines.append(line)
            continue
        
        # Properly escape for JavaScript single-quoted string
        # Escape: backslash, single quote, newline
        escaped = content_text.replace('\\', '\\\\').replace("'", "\\'").replace('\n', '\\n')
        
        new_line = f"{before}{escaped}{trailing}"
        new_lines.append(new_line)
    else:
        new_lines.append(line)

result = '\n'.join(new_lines)
with open('src/data/parts/classics-honglou.js', 'w', encoding='utf-8') as f:
    f.write(result)
print('Fixed')
