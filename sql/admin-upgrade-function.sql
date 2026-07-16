-- ============================================================
-- 🛠️ 古道论坛 · 管理员升级会员函数
-- 在 Supabase SQL Editor 运行这个脚本
-- ============================================================

-- 1. 先加一个 RLS 策略：管理员可以更新任何用户的 profile
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
CREATE POLICY "Admins can update any profile"
  ON profiles
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- 2. 创建数据库函数（SECURITY DEFINER 绕过 RLS，作为备用方案）
CREATE OR REPLACE FUNCTION admin_upgrade_membership(
  p_target_user_id UUID,
  p_level TEXT,
  p_draws INTEGER DEFAULT 0
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles
  SET
    membership_level = p_level,
    gold_draws_remaining = CASE
      WHEN p_level = 'diamond' THEN 99999
      WHEN p_level = 'gold'   THEN p_draws
      ELSE 0
    END
  WHERE id = p_target_user_id;
END;
$$;
