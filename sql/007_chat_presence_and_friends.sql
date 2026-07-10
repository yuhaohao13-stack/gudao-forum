-- ============================================================
-- 007: 聊天室在线用户追踪 + 好友系统
-- ============================================================

-- 1. chat_presence — 在线用户心跳表
CREATE TABLE IF NOT EXISTS chat_presence (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,           -- 客户端生成的唯一会话ID
  client_ip TEXT NOT NULL,            -- 客户端IP（仅取后3位逻辑用）
  ip_last3 TEXT NOT NULL,             -- IP最后3位数字
  guest_label TEXT,                   -- 访客标签（如 "678"、"678(1)"），注册用户为null
  display_name TEXT,                  -- 显示名（注册用户=display_name/username，访客="访客 XXX"）
  status TEXT DEFAULT 'online',       -- online / away
  last_seen TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(session_id, room_id)         -- 同一会话在同一房间只一条
);

-- 索引：加速查询某房间在线用户
CREATE INDEX IF NOT EXISTS idx_chat_presence_room ON chat_presence(room_id, last_seen);
CREATE INDEX IF NOT EXISTS idx_chat_presence_session ON chat_presence(session_id);

-- 2. friend_requests — 好友申请表
CREATE TABLE IF NOT EXISTS friend_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(from_user_id, to_user_id)
);

CREATE INDEX IF NOT EXISTS idx_friend_requests_to ON friend_requests(to_user_id, status);
CREATE INDEX IF NOT EXISTS idx_friend_requests_from ON friend_requests(from_user_id, status);

-- 3. friendships — 好友关系表（接受后写入，双向去重）
CREATE TABLE IF NOT EXISTS friendships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id_1 UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id_2 UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id_1, user_id_2),
  CHECK (user_id_1 < user_id_2)
);

CREATE INDEX IF NOT EXISTS idx_friendships_uid1 ON friendships(user_id_1);
CREATE INDEX IF NOT EXISTS idx_friendships_uid2 ON friendships(user_id_2);

-- 4. RLS 策略
ALTER TABLE chat_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

-- chat_presence: 所有人都可以读（展示在线列表）
CREATE POLICY "chat_presence_select_all"
  ON chat_presence FOR SELECT
  USING (true);

-- chat_presence: 通过 service_role API 写入，无需 RLS 写策略（API route 用 service key）

-- friend_requests: 用户可以查看自己的记录
CREATE POLICY "friend_requests_select_own"
  ON friend_requests FOR SELECT
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- friend_requests: 用户可以发送（from_user 必须是自己）
CREATE POLICY "friend_requests_insert_own"
  ON friend_requests FOR INSERT
  WITH CHECK (auth.uid() = from_user_id);

-- friend_requests: 接收方可以更新（接受/拒绝）
CREATE POLICY "friend_requests_update_receiver"
  ON friend_requests FOR UPDATE
  USING (auth.uid() = to_user_id);

-- friendships: 用户可以查看自己的好友
CREATE POLICY "friendships_select_own"
  ON friendships FOR SELECT
  USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

-- friendships: 通过触发器或 API 写入

-- 5. 清理函数（删除 last_seen < 2分钟前的记录）
CREATE OR REPLACE FUNCTION cleanup_stale_presence()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM chat_presence
  WHERE last_seen < NOW() - INTERVAL '2 minutes';
END;
$$;

-- 定时任务：每分钟清理一次（需要 pg_cron 扩展）
-- 如果 Supabase 不支持 pg_cron，将在 API 端做清理

-- 6. 添加设备标签列（同一用户多设备区分显示）
ALTER TABLE chat_presence ADD COLUMN IF NOT EXISTS device_label TEXT DEFAULT '';
