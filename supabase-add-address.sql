-- 古道论坛 — 用户资料表添加省市和详细地址
-- 在 Supabase SQL Editor 运行

-- 1. 新增字段
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS birth_place TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT;

-- 2. 更新自动创建 profile 的触发器，同步省市和地址
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, phone, gender, date_of_birth, hobbies, bio, resume, birth_place, address)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username'),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'gender',
    (NEW.raw_user_meta_data->>'date_of_birth')::DATE,
    NEW.raw_user_meta_data->>'hobbies',
    NEW.raw_user_meta_data->>'bio',
    NEW.raw_user_meta_data->>'resume',
    NEW.raw_user_meta_data->>'birth_place',
    NEW.raw_user_meta_data->>'address'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
