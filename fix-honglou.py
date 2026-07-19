import re

with open('src/data/parts/classics-honglou.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the problematic parts - content strings with embedded single quotes
# Replace content: '...' with content: `...`
# We need to handle the single-quote boundaries carefully

pattern = r"(content:\s*)'([^']*(?:\x27[^']*)*)'(\s*[,}])"

# Actually, let's just find and manually handle
lines = content.split('\n')
fixed = []
for line in lines:
    if line.strip().startswith("content: '"):
        # Check if content has internal single quotes causing issues
        # Find the content: prefix, extract string
        idx = line.index("content: '") + len("content: '")
        rest = line[idx:]
        # Find the closing single quote
        # The issue: internal ' characters break the parser
        # Use backtick template literal instead
        new_line = "      content: `" + rest
        # Replace trailing ', with `,
        if new_line.endswith("',"):
            new_line = new_line[:-2] + "`,"
        elif new_line.endswith("'"):
            new_line = new_line[:-1] + "`"
        fixed.append(new_line)
    else:
        fixed.append(line)

result = '\n'.join(fixed)

with open('src/data/parts/classics-honglou.js', 'w', encoding='utf-8') as f:
    f.write(result)

print("Fixed honglou.js")