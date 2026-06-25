-- 古道论坛 — 好友系统 + 私信 + 聊天图片 + 48小时清理
-- 在 Supabase SQL Editor 运行

-- ============================================
-- 1. 好友系统
-- ============================================
CREATE TABLE IF NOT EXISTS public.friends (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  addressee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(requester_id, addressee_id)
);

CREATE INDEX IF NOT EXISTS idx_friends_user ON public.friends(requester_id);
CREATE INDEX IF NOT EXISTS idx_friends_status ON public.friends(status);

ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "好友关系本人可读" ON public.friends;
CREATE POLICY "好友关系本人可读" ON public.friends
  FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

DROP POLICY IF EXISTS "用户可发起好友请求" ON public.friends;
CREATE POLICY "用户可发起好友请求" ON public.friends
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

DROP POLICY IF EXISTS "用户可更新自己的好友请求" ON public.friends;
CREATE POLICY "用户可更新自己的好友请求" ON public.friends
  FOR UPDATE USING (auth.uid() = addressee_id);

-- ============================================
-- 2. 私信表
-- ============================================
CREATE TABLE IF NOT EXISTS public.private_messages (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_private_messages_users ON public.private_messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_private_messages_created ON public.private_messages(created_at);

ALTER TABLE public.private_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "私信双方可读写" ON public.private_messages;
CREATE POLICY "私信双方可读写" ON public.private_messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "登录用户可发送私信" ON public.private_messages;
CREATE POLICY "登录用户可发送私信" ON public.private_messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- 启用实时订阅
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'private_messages') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.private_messages;
  END IF;
END $$;

-- ============================================
-- 3. 聊天室消息支持图片
-- ============================================
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- ============================================
-- 4. 48小时自动清理函数
-- ============================================
CREATE OR REPLACE FUNCTION public.cleanup_old_messages()
RETURNS void AS $$
BEGIN
  DELETE FROM public.chat_messages WHERE created_at < NOW() - INTERVAL '48 hours';
  DELETE FROM public.private_messages WHERE created_at < NOW() - INTERVAL '48 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建定时任务（如果 pg_cron 可用）
-- Supabase 项目中需启用 pg_cron 扩展
-- 取消注释以下行以每小时清理一次：
-- SELECT cron.schedule('cleanup-messages', '0 * * * *', 'SELECT cleanup_old_messages()');
