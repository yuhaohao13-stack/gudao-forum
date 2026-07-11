-- ═══════════════════════════════════════════════
-- 分布式速率限制 — 数据库表 + RPC 函数
-- 替代中间件中不可靠的内存 Map（Vercel Edge 多实例不共享）
-- ═══════════════════════════════════════════════

-- 1. 创建速率限制表
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,           -- "ip:path" 或 "userId:action"
  count INTEGER NOT NULL DEFAULT 1,
  window_start BIGINT NOT NULL,   -- 时间窗口起始（毫秒时间戳）
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引：按窗口起始时间查询（用于清理过期记录）
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits(window_start);

-- 2. 创建原子限流检查函数
-- 返回: { allowed: boolean, remaining: number, retryAfter: number }
CREATE OR REPLACE FUNCTION rate_limit_check(
  p_key TEXT,
  p_max_attempts INTEGER DEFAULT 30,
  p_window_ms BIGINT DEFAULT 60000
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_now BIGINT;
  v_window_start BIGINT;
  v_current_count INTEGER;
  v_result JSONB;
BEGIN
  v_now := (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT;
  v_window_start := v_now - p_window_ms;

  -- 清理过期数据
  DELETE FROM rate_limits WHERE window_start < v_window_start;

  -- 尝试获取当前记录（使用 FOR UPDATE 锁行防并发）
  SELECT count INTO v_current_count
  FROM rate_limits
  WHERE key = p_key
  FOR UPDATE;

  IF NOT FOUND THEN
    -- 新窗口，插入记录
    INSERT INTO rate_limits (key, count, window_start)
    VALUES (p_key, 1, v_now);
    v_result := jsonb_build_object(
      'allowed', true,
      'remaining', p_max_attempts - 1,
      'retryAfter', 0
    );
  ELSIF v_current_count >= p_max_attempts THEN
    -- 超出限制
    v_result := jsonb_build_object(
      'allowed', false,
      'remaining', 0,
      'retryAfter', (v_window_start + p_window_ms - v_now) / 1000
    );
  ELSE
    -- 递增计数
    UPDATE rate_limits
    SET count = count + 1
    WHERE key = p_key;
    v_result := jsonb_build_object(
      'allowed', true,
      'remaining', p_max_attempts - v_current_count - 1,
      'retryAfter', 0
    );
  END IF;

  RETURN v_result;
END;
$$;

-- 3. 定时清理（PostgreSQL 自带 pg_cron 需要额外安装，这里用应用层定期清理）
-- 应用层在启动时会定期 DELETE 过期记录作为补充
