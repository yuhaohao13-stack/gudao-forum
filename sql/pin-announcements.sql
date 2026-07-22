-- ============================================
-- 站务公告置顶顺序 (2026-07-20)
-- 在 Supabase Dashboard → SQL Editor 运行
-- ============================================

-- 1. 加 pin_order 列
ALTER TABLE threads ADD COLUMN IF NOT EXISTS pin_order INTEGER DEFAULT 0;

-- 2. 设置三个置顶帖子的顺序
--    置顶顺序：会员规则 > 添加到手机 > 浩哥的梦想
UPDATE threads SET is_pinned = true, pin_order = 1
WHERE id = '4156a55b-d4a4-4b8b-865c-7c5c545c0be9';  -- 📜 古道论坛会员规则等级介绍

UPDATE threads SET is_pinned = true, pin_order = 2
WHERE id = '1187de2c-01d3-4f1c-af91-7b985c4fbd59';  -- 📱 如何将古道论坛添加到手机主屏幕？

UPDATE threads SET is_pinned = true, pin_order = 3
WHERE id = 'ba357f91-6ca6-421a-8506-d11d55c42fb8';  -- 浩哥的梦想

-- 3. 其他帖子取消置顶，pin_order 设为 NULL（NULL < 数字，排后面）
UPDATE threads SET is_pinned = false, pin_order = NULL
WHERE category_id = (SELECT id FROM categories WHERE slug = 'announcements')
AND id NOT IN (
  '4156a55b-d4a4-4b8b-865c-7c5c545c0be9',
  '1187de2c-01d3-4f1c-af91-7b985c4fbd59',
  'ba357f91-6ca6-421a-8506-d11d55c42fb8'
);
