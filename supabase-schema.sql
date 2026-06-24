-- ============================================
-- 逼哥论坛 — Supabase 数据库结构
-- 在 Supabase SQL Editor 里运行这个
-- ============================================

-- 1. 用户资料表（extends auth.users）
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 注册时自动创建 profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. 版块（categories）
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '📋',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 帖子（threads）
CREATE TABLE public.threads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  view_count INT DEFAULT 0,
  reply_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 回复（replies）
CREATE TABLE public.replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID REFERENCES public.threads(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 点赞
CREATE TABLE public.thread_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  thread_id UUID REFERENCES public.threads(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, thread_id)
);

-- 浏览量自增函数（用于 RPC）
CREATE OR REPLACE FUNCTION public.increment_view_count(thread_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.threads SET view_count = COALESCE(view_count, 0) + 1 WHERE id = thread_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 索引
CREATE INDEX idx_threads_category ON public.threads(category_id);
CREATE INDEX idx_threads_created ON public.threads(created_at DESC);
CREATE INDEX idx_replies_thread ON public.replies(thread_id);
CREATE INDEX idx_replies_created ON public.replies(created_at);

-- 行级安全策略（RLS）
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thread_likes ENABLE ROW LEVEL SECURITY;

-- profiles: 任何人都可以看，自己可以编辑
CREATE POLICY "公开查看资料" ON public.profiles FOR SELECT USING (TRUE);
CREATE POLICY "自己编辑资料" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- categories: 公开查看
CREATE POLICY "公开查看版块" ON public.categories FOR SELECT USING (TRUE);

-- threads: 公开查看，登录用户创建，自己可编辑
CREATE POLICY "公开查看帖子" ON public.threads FOR SELECT USING (TRUE);
CREATE POLICY "登录用户发帖" ON public.threads FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "自己编辑帖子" ON public.threads FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "管理员管理帖子" ON public.threads FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);

-- replies: 公开查看，登录用户回复
CREATE POLICY "公开查看回复" ON public.replies FOR SELECT USING (TRUE);
CREATE POLICY "登录用户回复" ON public.replies FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "自己编辑回复" ON public.replies FOR UPDATE USING (auth.uid() = author_id);

-- likes: 自己管理
CREATE POLICY "公开查看点赞" ON public.thread_likes FOR SELECT USING (TRUE);
CREATE POLICY "登录用户点赞" ON public.thread_likes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "自己取消点赞" ON public.thread_likes FOR DELETE USING (auth.uid() = user_id);

-- 默认版块
INSERT INTO public.categories (name, slug, description, icon, sort_order) VALUES
('闲聊灌水', 'random', '随便聊聊，什么都行', '💬', 0),
('技术讨论', 'tech', '技术相关话题', '💻', 1),
('生活分享', 'life', '美食、旅行、日常', '🌸', 2),
('资源分享', 'resources', '好资源一起分享', '📦', 3),
('站务管理', 'announcements', '论坛公告和建议', '📢', 4);
