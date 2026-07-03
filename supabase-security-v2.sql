-- ============================================
-- 古道论坛 — 安全加固 v2 (精简版)
-- 在 Supabase SQL Editor 中运行
-- SQL Editor: https://supabase.com/dashboard/project/rsndnhdimruisysacujg/sql/new
-- ⚠️ 确保右上角已选择 Service Role（非 Anon Key）
-- ============================================

-- ============================================
-- 1. 开启 storage.objects 的 RLS
-- ============================================
ALTER TABLE IF EXISTS storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. 创建存储桶策略
-- 任何人可查看公开图片
DROP POLICY IF EXISTS "公开查看图片" ON storage.objects;
CREATE POLICY "公开查看图片" ON storage.objects
  FOR SELECT USING (bucket_id = 'forum-images');

-- 登录用户可上传图片
DROP POLICY IF EXISTS "登录用户上传图片" ON storage.objects;
CREATE POLICY "登录用户上传图片" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'forum-images'
    AND auth.role() = 'authenticated'
  );

-- 用户只能删自己的图片
DROP POLICY IF EXISTS "删除自己的图片" ON storage.objects;
CREATE POLICY "删除自己的图片" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'forum-images'
    AND auth.uid() = owner
  );

-- ============================================
-- 3. 聊天防刷屏函数
-- ============================================
CREATE OR REPLACE FUNCTION public.check_message_rate_limit(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  recent_count INT;
BEGIN
  SELECT COUNT(*) INTO recent_count
  FROM public.chat_messages
  WHERE author_id = user_id
    AND created_at > NOW() - INTERVAL '5 seconds';
  RETURN recent_count < 3;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 4. 输入长度限制
-- ============================================
ALTER TABLE public.private_messages
  ADD CONSTRAINT IF NOT EXISTS chk_content_length
  CHECK (char_length(content) <= 5000);

ALTER TABLE public.chat_messages
  ADD CONSTRAINT IF NOT EXISTS chk_chat_content_length
  CHECK (char_length(content) <= 2000);

-- ============================================
-- 5. 清理索引优化
-- ============================================
CREATE INDEX IF NOT EXISTS idx_chat_messages_cleanup
  ON public.chat_messages(created_at)
  WHERE created_at < NOW() - INTERVAL '48 hours';

CREATE INDEX IF NOT EXISTS idx_private_messages_cleanup
  ON public.private_messages(created_at)
  WHERE created_at < NOW() - INTERVAL '48 hours';

-- ============================================
-- 6. 确保所有表 RLS 开启
-- ============================================
DO $$
DECLARE
  tbl RECORD;
BEGIN
  FOR tbl IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename IN ('profiles', 'threads', 'replies', 'categories',
                         'chat_rooms', 'chat_messages', 'friends',
                         'private_messages', 'thread_likes')
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl.tablename);
  END LOOP;
END $$;

-- ============================================
-- ✅ 完成！验证
-- ============================================
SELECT '✅ 安全加固v2执行完毕' AS status;
