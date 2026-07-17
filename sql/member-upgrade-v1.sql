-- ============================================
-- 古道论坛 会员权益升级 v1
-- 日期：2026-07-17
-- ============================================

-- 1. profiles 表新增会员权益字段
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gold_music_downloads INTEGER DEFAULT 10;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gold_thread_pins INTEGER DEFAULT 10;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gold_tech_views INTEGER DEFAULT 10;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tech_views_used INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS music_downloads_used INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS thread_pins_used INTEGER DEFAULT 0;

-- 2. threads 表新增置顶字段
ALTER TABLE threads ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;
ALTER TABLE threads ADD COLUMN IF NOT EXISTS pinned_by UUID REFERENCES auth.users(id);
ALTER TABLE threads ADD COLUMN IF NOT EXISTS pinned_at TIMESTAMPTZ;
