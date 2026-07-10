-- ======================================================
-- 古道论坛 · 游戏高分榜数据表
-- 创建时间：2026-07-10
-- ======================================================

-- 1. 创建 game_scores 表
CREATE TABLE IF NOT EXISTS game_scores (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  game_slug TEXT NOT NULL,           -- 游戏标识：snake, tetris, breakout, game2048, whackamole
  user_id UUID NOT NULL,             -- 用户ID（关联 auth.users）
  username TEXT NOT NULL,            -- 用户名（冗余存储，方便显示）
  score INTEGER NOT NULL DEFAULT 0,  -- 分数
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- 每人每个游戏只保留一个最高分（后续用 upsert）
  UNIQUE (game_slug, user_id)
);

-- 索引：按游戏查询高分排行
CREATE INDEX IF NOT EXISTS idx_game_scores_game_slug
  ON game_scores (game_slug, score DESC);

-- 2. 打开 RLS
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;

-- 3. 任何人都可以读取高分榜
CREATE POLICY "Anyone can read game scores"
  ON game_scores FOR SELECT
  USING (true);

-- 4. 登录用户可以插入/更新自己的分数
CREATE POLICY "Users can upsert own scores"
  ON game_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scores"
  ON game_scores FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
