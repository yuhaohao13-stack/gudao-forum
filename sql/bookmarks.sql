-- 收藏功能迁移
-- 运行：在 Supabase Dashboard → SQL Editor 执行

CREATE TABLE IF NOT EXISTS bookmarks (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  thread_id UUID NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, thread_id)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_thread ON bookmarks(thread_id);

-- 行级安全
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- 用户可以看自己的收藏
CREATE POLICY "users_select_own_bookmarks" ON bookmarks
  FOR SELECT USING (auth.uid() = user_id);

-- 用户可以添加自己的收藏
CREATE POLICY "users_insert_own_bookmarks" ON bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 用户可以删除自己的收藏
CREATE POLICY "users_delete_own_bookmarks" ON bookmarks
  FOR DELETE USING (auth.uid() = user_id);
