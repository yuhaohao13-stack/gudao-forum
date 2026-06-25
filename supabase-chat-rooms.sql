-- ============================================
-- 古道论坛 — 聊天室系统
-- ============================================

-- 1. 聊天室表
CREATE TABLE IF NOT EXISTS public.chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT DEFAULT '💬',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 插入 10 个聊天室
INSERT INTO public.chat_rooms (name, slug, description, icon, sort_order) VALUES
  ('谈古道今', 'talk', '古今中外，无所不谈', '🏛️', 1),
  ('硬核技术', 'tech', '数码、科技、硬件折腾', '💻', 2),
  ('维修互助', 'repair', '手机维修问题交流解惑', '🔧', 3),
  ('闲聊茶馆', 'chat', '轻松唠嗑，来杯茶', '🍵', 4),
  ('游戏江湖', 'gaming', '主机、手游、Steam 啥都聊', '🎮', 5),
  ('听风赏乐', 'music', '好音乐一起分享', '🎵', 6),
  ('光影之间', 'movies', '电影、剧集、动漫', '🎬', 7),
  ('书海泛舟', 'books', '读书笔记、推荐、讨论', '📚', 8),
  ('花间漫步', 'life', '生活日常、摄影、美食', '🌸', 9),
  ('江湖体育', 'sports', '足球篮球电竞运动', '🏀', 10)
ON CONFLICT (slug) DO NOTHING;

-- 2. 聊天消息表
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_room ON public.chat_messages(room_id, created_at DESC);

-- 3. 启用实时订阅
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'chat_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
  END IF;
END $$;

-- 4. RLS 行级安全策略
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "聊天室所有人可读" ON public.chat_rooms;
CREATE POLICY "聊天室所有人可读" ON public.chat_rooms
  FOR SELECT USING (true);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "聊天消息所有人可读" ON public.chat_messages;
CREATE POLICY "聊天消息所有人可读" ON public.chat_messages
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "登录用户可发消息" ON public.chat_messages;
CREATE POLICY "登录用户可发消息" ON public.chat_messages
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated'
    AND auth.uid() = user_id
  );
