-- ============================================
-- 古道论坛 积分签到系统 v1
-- 日期：2026-07-22
-- ============================================

-- 1. profiles 表新增积分字段
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_checkins INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_checkin_date DATE;

-- 2. 每日签到记录表
CREATE TABLE IF NOT EXISTS daily_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  checkin_date DATE NOT NULL DEFAULT CURRENT_DATE,
  points_earned INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, checkin_date)
);

-- 3. 积分交易记录表（审计日志）
CREATE TABLE IF NOT EXISTS points_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('checkin', 'checkin_bonus', 'post', 'download', 'content_view', 'exchange_deduct', 'admin_add', 'admin_deduct')),
  description TEXT,
  reference_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RLS 安全策略
ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;

-- 签到记录：用户可查看自己的
DROP POLICY IF EXISTS "Users can view own checkins" ON daily_checkins;
CREATE POLICY "Users can view own checkins" ON daily_checkins
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own checkins" ON daily_checkins;
CREATE POLICY "Users can insert own checkins" ON daily_checkins
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 交易记录：用户可查看自己的
DROP POLICY IF EXISTS "Users can view own transactions" ON points_transactions;
CREATE POLICY "Users can view own transactions" ON points_transactions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service can insert transactions" ON points_transactions;
CREATE POLICY "Service can insert transactions" ON points_transactions
  FOR INSERT WITH CHECK (true);

-- 5. 索引
CREATE INDEX IF NOT EXISTS idx_daily_checkins_user_date ON daily_checkins(user_id, checkin_date);
CREATE INDEX IF NOT EXISTS idx_points_transactions_user ON points_transactions(user_id, created_at DESC);
