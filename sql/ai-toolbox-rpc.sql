-- AI工具箱 - 配额增减函数
-- 在 Supabase Dashboard → SQL Editor 中运行

-- 增加已使用次数（调用前扣除）
CREATE OR REPLACE FUNCTION increment_ai_queries(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET ai_queries_used = COALESCE(ai_queries_used, 0) + 1
  WHERE id = user_id;
END;
$$;

-- 减少已使用次数（调用失败时加回）
CREATE OR REPLACE FUNCTION decrement_ai_queries(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET ai_queries_used = GREATEST(0, COALESCE(ai_queries_used, 0) - 1)
  WHERE id = user_id;
END;
$$;
