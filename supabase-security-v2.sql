-- ============================================
-- 古道论坛 — 安全加固 v2
-- 在 Supabase SQL Editor 运行
-- ⚠️ 用 Service Role Key（非 anon key）执行
-- ============================================

-- ============================================
-- 1. 确保 storage 桶已开启 RLS
-- ============================================
-- forum-images 存储桶（图片上传）
ALTER TABLE IF EXISTS storage.objects ENABLE ROW LEVEL SECURITY;

-- 公开读取（任何人都可看图片）
DROP POLICY IF EXISTS "公开查看图片" ON storage.objects;
CREATE POLICY "公开查看图片" ON storage.objects
  FOR SELECT USING (bucket_id = 'forum-images');

-- 登录用户可上传到 forum-images 桶
DROP POLICY IF EXISTS "登录用户上传图片" ON storage.objects;
CREATE POLICY "登录用户上传图片" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'forum-images'
    AND auth.role() = 'authenticated'
  );

-- 用户只能删除自己的图片
DROP POLICY IF EXISTS "删除自己的图片" ON storage.objects;
CREATE POLICY "删除自己的图片" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'forum-images'
    AND auth.uid() = owner
  );

-- 限制上传文件类型（仅图片）
-- 注意：Supabase 存储的 RLS 暂不支持直接检查 mime_type，
-- 建议在客户端和 API 端同时做类型验证

-- ============================================
-- 2. 防止用户枚举：限制 profiles 公开信息
-- ============================================
-- 只暴露必要的字段（不暴露 email、不暴露敏感信息）
-- 已有 "公开查看资料" 策略，这里补充限制
-- 或创建视图来限制可查字段（可选方案）

-- ============================================
-- 3. 防止暴力登录
-- ============================================
-- Supabase Auth 自带一定程度的暴力破解防护。
-- 建议在 Supabase Dashboard → Authentication → Settings 中设置：
-- - 开启 CAPTCHA （推荐 hCaptcha 免费版）
-- - 设置最小密码长度 ≥ 8
-- - 开启邮箱确认
-- - 设置 Rate Limiting（默认已有，无需额外配置）

-- ============================================
-- 4. 保护聊天室：限制消息频率
-- ============================================
-- 可以在应用层做限制，这里提供数据库层级函数
-- 检查用户在最近 N 秒内是否发过消息

CREATE OR REPLACE FUNCTION public.check_message_rate_limit(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  recent_count INT;
BEGIN
  SELECT COUNT(*) INTO recent_count
  FROM public.chat_messages
  WHERE author_id = user_id
    AND created_at > NOW() - INTERVAL '5 seconds';

  RETURN recent_count < 3;  -- 5秒内最多3条
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 5. 自动清理过期/未验证用户
-- ============================================
DELETE FROM auth.users
WHERE created_at < NOW() - INTERVAL '7 days'
  AND email_confirmed_at IS NULL;

-- ============================================
-- 6. 保护私信内容：XSS 防御
-- ============================================
-- 在应用层对 content 做 HTML 转义，
-- 数据库层可添加输入长度限制（可选）
ALTER TABLE public.private_messages
  ADD CONSTRAINT IF NOT EXISTS chk_content_length
  CHECK (char_length(content) <= 5000);

ALTER TABLE public.chat_messages
  ADD CONSTRAINT IF NOT EXISTS chk_chat_content_length
  CHECK (char_length(content) <= 2000);

-- ============================================
-- 7. 确保 RLS 在所有表上都开启
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
-- 8. 阻止 SQL 注入：限制可用函数
-- ============================================
-- 确保没有公开可执行的危险函数
-- 以下查询可以检查哪些 SECURITY DEFINER 函数存在风险
-- SELECT proname, prosrc
-- FROM pg_proc
-- WHERE prolang = (SELECT oid FROM pg_language WHERE lanname = 'sql')
--   AND pronamespace = 'public'::regnamespace
--   AND prosecdef = true;

-- ============================================
-- 9. 配置行级创建时间索引，加快清理效率
-- ============================================
CREATE INDEX IF NOT EXISTS idx_chat_messages_cleanup
  ON public.chat_messages(created_at)
  WHERE created_at < NOW() - INTERVAL '48 hours';

CREATE INDEX IF NOT EXISTS idx_private_messages_cleanup
  ON public.private_messages(created_at)
  WHERE created_at < NOW() - INTERVAL '48 hours';

-- ============================================
-- 10. 论坛内容防删除保护
-- ============================================
-- 已有 "自己编辑帖子" 和 "管理员管理帖子" 策略
-- 这里补充：已删除回复保留记录（is_deleted），不硬删除
-- 已在 schema 中实现（replies.is_deleted 字段）
