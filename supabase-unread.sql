-- 添加已读标记
ALTER TABLE public.private_messages ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS idx_private_messages_unread ON public.private_messages(receiver_id, read_at);
