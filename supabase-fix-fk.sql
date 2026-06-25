-- 修复聊天消息与用户资料的外键关联
-- 在 Supabase SQL Editor 运行

-- 1. 确保 profiles.id 有唯一约束
ALTER TABLE public.profiles ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);

-- 2. 添加 chat_messages 到 profiles 的外键
ALTER TABLE public.chat_messages DROP CONSTRAINT IF EXISTS fk_chat_messages_profile;
ALTER TABLE public.chat_messages ADD CONSTRAINT fk_chat_messages_profile
  FOREIGN KEY (user_id) REFERENCES public.profiles(id);

-- 3. 刷新 schema 缓存（让 Supabase 识别到新关系）
SELECT pg_catalog.pg_stat_clear_snapshot();
SELECT set_config('schema.cache', 'refresh', false);
NOTIFY pgrst, 'reload schema';
