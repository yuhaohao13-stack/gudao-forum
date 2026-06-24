-- ============================================
-- 古道论坛 — 追加功能 SQL
-- 在 Supabase SQL Editor 里接着跑
-- ============================================

-- 0. 帖子图片列
ALTER TABLE public.threads ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- 1. 全文搜索索引
ALTER TABLE public.threads ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(content, ''))) STORED;

CREATE INDEX IF NOT EXISTS idx_threads_search ON public.threads USING GIN(search_vector);

-- 2. 热度算法函数
CREATE OR REPLACE FUNCTION public.hot_score(reply_count INT, view_count INT, like_count INT, created_at TIMESTAMPTZ)
RETURNS FLOAT AS $$
DECLARE
  hours_old FLOAT;
  score FLOAT;
BEGIN
  hours_old := EXTRACT(EPOCH FROM (NOW() - created_at)) / 3600;
  score := (COALESCE(reply_count, 0) * 5.0 + COALESCE(view_count, 0) * 1.0 + COALESCE(like_count, 0) * 3.0)
           / GREATEST(1.0, hours_old * 0.1);
  RETURN score;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 3. 帖子点赞数视图（方便查热度）
CREATE OR REPLACE VIEW public.thread_hot AS
SELECT
  t.id,
  t.title,
  t.category_id,
  t.reply_count,
  t.view_count,
  COUNT(tl.id) AS like_count,
  hot_score(t.reply_count, t.view_count, COUNT(tl.id), t.created_at) AS score
FROM public.threads t
LEFT JOIN public.thread_likes tl ON tl.thread_id = t.id
GROUP BY t.id
ORDER BY score DESC;

-- 4. 图片存储配置（在 Supabase Storage 里需要手动创建 bucket）
-- Bucket 名称: forum-images
-- Public bucket: 是
-- 文件大小限制: 5MB
-- 允许 MIME: image/*
-- RLS 策略:
--   SELECT: true (任何人都可以看)
--   INSERT: auth.role() = 'authenticated' (登录用户可以上传)
--   DELETE: owner 或 admin

-- 5. 回复点赞数（后续可加）
-- ALTER TABLE public.replies ADD COLUMN IF NOT EXISTS like_count INT DEFAULT 0;
