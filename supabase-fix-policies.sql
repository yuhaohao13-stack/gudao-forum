-- 古道论坛 — 更新：私信永久保留 / 聊天室48小时清理
-- 在 Supabase SQL Editor 运行

-- 1. 更新清理函数：只清理聊天室消息，私信永久保留
CREATE OR REPLACE FUNCTION public.cleanup_old_messages()
RETURNS void AS $$
BEGIN
  DELETE FROM public.chat_messages WHERE created_at < NOW() - INTERVAL '48 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. 允许用户删除自己的私信
DROP POLICY IF EXISTS "用户可删除自己的私信" ON public.private_messages;
CREATE POLICY "用户可删除自己的私信" ON public.private_messages
  FOR DELETE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- 3. 允许用户删除好友关系
DROP POLICY IF EXISTS "用户可删除好友" ON public.friends;
CREATE POLICY "用户可删除好友" ON public.friends
  FOR DELETE USING (auth.uid() = requester_id OR auth.uid() = addressee_id);
