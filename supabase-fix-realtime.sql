-- 古道论坛 — 私信未读标记修复
-- 1. 添加 UPDATE 策略（让 receiver 可以标记已读）
-- 2. 启用 UPDATE 实时广播
-- 在 Supabase SQL Editor 运行一次

-- 添加 UPDATE 策略：receiver 可更新消息（标记 read_at）
DROP POLICY IF EXISTS "用户可更新自己的私信" ON public.private_messages;
CREATE POLICY "用户可更新自己的私信" ON public.private_messages
  FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- 启用 UPDATE 实时广播（让未读计数实时更新）
ALTER PUBLICATION supabase_realtime SET TABLE public.private_messages (id, sender_id, receiver_id, read_at);
