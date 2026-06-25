-- 古道论坛 — 更新注册触发器，支持新字段
-- 在 Supabase SQL Editor 运行

-- 先扩展现有表字段（如果还没加）
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  ADD COLUMN IF NOT EXISTS hobbies TEXT,
  ADD COLUMN IF NOT EXISTS resume TEXT;

-- 更新触发器函数，支持新字段
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, phone, gender, hobbies, bio, resume, role, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'gender', 'male'),
    NEW.raw_user_meta_data->>'hobbies',
    NEW.raw_user_meta_data->>'bio',
    NEW.raw_user_meta_data->>'resume',
    'user',
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
