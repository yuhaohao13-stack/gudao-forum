import json, re

def rebuild_js_file(input_path, output_path, var_name):
    """Read a JS data file and rebuild it with proper escaping"""
    with open(input_path, 'r', encoding='utf-8') as f:
        raw = f.read()
    
    # Extract all lines and find chapter entries
    # The format from sub-agents is:
    # const VAR = [
    #   {
    #     id: N,
    #     title: '...',
    #     content: '...'
    #   },
    #   ...
    # ]
    
    lines = raw.split('\n')
    
    # Find entries by pattern matching
    entries = []
    current_id = None
    current_title = None
    current_content = None
    in_content = False
    
    for line in lines:
        s = line.strip()
        
        # Skip empty lines and brackets
        if not s or s == '[' or s == ']':
            continue
        
        # id: N
        id_m = re.match(r'id:\s*(\d+),?', s)
        if id_m:
            current_id = int(id_m.group(1))
            continue
        
        # title: '...'
        title_m = re.match(r"title:\s*'(.+?)(?:',?$|'$)", s)
        if title_m:
            current_title = title_m.group(1)
            continue
        
        # content: '...'
        if s.startswith("content: '"):
            # Extract content - handle multi-line
            c_start = s.index("'") + 1
            rest = s[c_start:]
            if rest.endswith("',"):
                current_content = rest[:-2]
            elif rest.endswith("'"):
                current_content = rest[:-1]
            else:
                current_content = rest
            continue
        
        # }, or }
        if s == '},' or s == '}':
            if current_id is not None:
                entries.append((current_id, current_title or f'第{current_id}回', current_content or ''))
            current_id = None
            current_title = None
            current_content = None
            in_content = False
    
    print(f"  Found {len(entries)} entries in {input_path}")
    
    # Write properly escaped JS file
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(f"const {var_name} = [\n")
        for eid, title, content in entries:
            # json.dumps for proper escaping, then remove surrounding quotes
            title_js = json.dumps(title, ensure_ascii=False)[1:-1]
            content_js = json.dumps(content, ensure_ascii=False)[1:-1]
            f.write(f"  {{ id: {eid}, title: '{title_js}', content: '{content_js}' }},\n")
        f.write("]\n\nexport default " + var_name + ";\n")
    
    print(f"  Written to {output_path}")

# Rebuild all four files
print("Rebuilding parts files...")
rebuild_js_file('src/data/parts/classics-shuihu.js', 'src/data/parts/classics-shuihu.js', 'SHUIHU_CHAPTERS')
rebuild_js_file('src/data/parts/classics-sanguo.js', 'src/data/parts/classics-sanguo.js', 'SANGUO_CHAPTERS')
rebuild_js_file('src/data/parts/classics-xiyouji.js', 'src/data/parts/classics-xiyouji.js', 'XIYOUJI_CHAPTERS')
rebuild_js_file('src/data/parts/classics-honglou.js', 'src/data/parts/classics-honglou.js', 'HONGLOU_CHAPTERS')

print("All done!")
