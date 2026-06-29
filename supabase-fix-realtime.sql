-- 古道论坛 — 启用 private_messages 的 UPDATE 实时广播
-- 让未读计数在点开私信后实时更新
-- 在 Supabase SQL Editor 运行一次

-- 先移除再重新添加，包含 UPDATE
ALTER PUBLICATION supabase_realtime DROP TABLE public.private_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.private_messages;

-- 确保也启用 INSERT（默认就有）
-- 如果需要只广播特定列：
-- ALTER PUBLICATION supabase_realtime SET TABLE public.private_messages ('id', 'sender_id', 'receiver_id', 'read_at');
