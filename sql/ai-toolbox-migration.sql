-- 古道论坛 - AI工具箱 使用次数记录
-- 在 profiles 表中添加 ai_queries_used 字段

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS ai_queries_used INTEGER DEFAULT 0;

-- 黄金会员上限100次，钻石1000次
-- 权限在代码中校验（根据 membership_level 判断）
