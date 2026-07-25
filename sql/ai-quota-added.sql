-- 添加 AI 额外配额字段（管理员手动增加的次数，可累计）
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ai_additional_quota INTEGER DEFAULT 0;
