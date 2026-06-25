-- 古道论坛 — 聊天室消息改用 LEFT JOIN + 自动创建用户资料
-- 在 Supabase SQL Editor 运行

-- 1. 创建自动创建用户资料的触发器
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, role, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    'user',
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 删除旧的触发器（如果存在）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 创建触发器
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 2. 给已注册但没有资料的用户补建资料
INSERT INTO public.profiles (id, username, display_name, role, created_at)
SELECT
  au.id,
  COALESCE(au.raw_user_meta_data->>'username', split_part(au.email, '@', 1)),
  COALESCE(au.raw_user_meta_data->>'display_name', split_part(au.email, '@', 1)),
  'user',
  COALESCE(au.created_at, NOW())
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;
