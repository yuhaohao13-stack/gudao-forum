#!/usr/bin/env python3
"""把PDF每页导出为WebP图片"""
import fitz
import os
from multiprocessing import Pool
from PIL import Image

PDFS = [
    ('/Users/hy/Downloads/76版 民兵训练手册.pdf', '/Users/hy/.openclaw/workspace/forum/public/pages/militia', 626),
    ('/Users/hy/Downloads/《新赤脚医生手册》 .pdf', '/Users/hy/.openclaw/workspace/forum/public/pages/doctor', 780),
]

DPI = 80
QUALITY = 65

def export_page(args):
    pdf_path, out_dir, page_idx = args
    try:
        doc = fitz.open(pdf_path)
        page = doc[page_idx]
        pix = page.get_pixmap(dpi=DPI)
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        fname = f"{page_idx+1:04d}.webp"
        img.save(os.path.join(out_dir, fname), format='WEBP', quality=QUALITY)
        doc.close()
        return fname
    except Exception as e:
        return f"ERROR page {page_idx+1}: {e}"

def main():
    for pdf_path, out_dir, total in PDFS:
        os.makedirs(out_dir, exist_ok=True)
        name = os.path.basename(pdf_path).split('.')[0][:10]
        print(f"正在导出 {name} ({total}页)...")

        tasks = [(pdf_path, out_dir, i) for i in range(total)]
        with Pool(processes=8) as pool:
            results = []
            for i, r in enumerate(pool.imap_unordered(export_page, tasks, chunksize=10)):
                if i % 50 == 0:
                    print(f"  {i}/{total} 完成", end='\r')
                results.append(r)

        print(f"\n  {name} 导出完成！")

        # 统计大小
        total_size = sum(os.path.getsize(os.path.join(out_dir, f"{i+1:04d}.webp")) for i in range(total))
        print(f"  总大小: {total_size/1024/1024:.1f}MB, 平均: {total_size/1024/total:.1f}KB/页")

if __name__ == '__main__':
    main()
