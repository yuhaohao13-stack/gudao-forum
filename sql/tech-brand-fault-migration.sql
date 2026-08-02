-- 古道论坛：技术板块品牌×故障分类迁移
-- 给 threads 表加 brand / fault 字段，用于三级导航（品牌→故障→案例）
-- 执行方式：Supabase Dashboard → SQL Editor 运行

ALTER TABLE threads ADD COLUMN IF NOT EXISTS brand TEXT DEFAULT '';
ALTER TABLE threads ADD COLUMN IF NOT EXISTS fault TEXT DEFAULT '';

-- 索引（按品牌/故障查询加速）
CREATE INDEX IF NOT EXISTS idx_threads_brand ON threads (brand);
CREATE INDEX IF NOT EXISTS idx_threads_fault ON threads (fault);

-- ============================================
-- 更新已发布的 117 个图文案例（按标题前缀匹配）
-- ============================================

-- 苹果 Apple
UPDATE threads SET brand='苹果 Apple', fault='不开机-死机' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'Apple Won''t Turn On Repair%';
UPDATE threads SET brand='苹果 Apple', fault='屏幕-显示-触摸' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'Apple Screen Display Touch Repair%';
UPDATE threads SET brand='苹果 Apple', fault='主板-芯片' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'Apple Motherboard Chip Repair%';
UPDATE threads SET brand='苹果 Apple', fault='电池-耗电' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'Apple Battery Repair%';
UPDATE threads SET brand='苹果 Apple', fault='充电-尾插' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'Apple Charging Port Repair%';
UPDATE threads SET brand='苹果 Apple', fault='信号-无服务' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'Apple No Signal Repair%';
UPDATE threads SET brand='苹果 Apple', fault='扩容-存储' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'Apple Storage Upgrade%';
UPDATE threads SET brand='苹果 Apple', fault='摄像头' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'Apple Camera Repair%';
UPDATE threads SET brand='苹果 Apple', fault='功能故障' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'Apple Function Fault Repair%';
UPDATE threads SET brand='苹果 Apple', fault='音频' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'Apple Audio Repair%';
UPDATE threads SET brand='苹果 Apple', fault='进水' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'Apple Water Damage Repair%';
UPDATE threads SET brand='苹果 Apple', fault='解锁-激活' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'Apple Unlock Activation%';
UPDATE threads SET brand='苹果 Apple', fault='其他' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'Apple Other Repair%';

-- 三星 Samsung
UPDATE threads SET brand='三星 Samsung', fault='主板-芯片' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'Samsung Motherboard Chip Repair%';
UPDATE threads SET brand='三星 Samsung', fault='不开机-死机' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'Samsung Won''t Turn On Repair%';
UPDATE threads SET brand='三星 Samsung', fault='屏幕-显示-触摸' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'Samsung Screen Display Touch Repair%';
UPDATE threads SET brand='三星 Samsung', fault='信号-无服务' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'Samsung No Signal Repair%';
UPDATE threads SET brand='三星 Samsung', fault='摄像头' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'Samsung Camera Repair%';
UPDATE threads SET brand='三星 Samsung', fault='充电-尾插' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'Samsung Charging Port Repair%';
UPDATE threads SET brand='三星 Samsung', fault='电池-耗电' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'Samsung Battery Repair%';
UPDATE threads SET brand='三星 Samsung', fault='进水' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'Samsung Water Damage Repair%';

-- 华为 Huawei
UPDATE threads SET brand='华为 Huawei', fault='不开机-死机' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'Huawei Won''t Turn On Repair%';
UPDATE threads SET brand='华为 Huawei', fault='摄像头' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'Huawei Camera Repair%';
UPDATE threads SET brand='华为 Huawei', fault='音频' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'Huawei Audio Repair%';

-- 小米 Xiaomi
UPDATE threads SET brand='小米 Xiaomi', fault='其他' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'Xiaomi Other Repair%';
UPDATE threads SET brand='小米 Xiaomi', fault='不开机-死机' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'Xiaomi Won''t Turn On Repair%';
UPDATE threads SET brand='小米 Xiaomi', fault='主板-芯片' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'Xiaomi Motherboard Chip Repair%';
UPDATE threads SET brand='小米 Xiaomi', fault='充电-尾插' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'Xiaomi Charging Port Repair%';
UPDATE threads SET brand='小米 Xiaomi', fault='屏幕-显示-触摸' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'Xiaomi Screen Display Touch Repair%';

-- 其他安卓 Other Android
UPDATE threads SET brand='其他安卓 Other', fault='不开机-死机' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'Other Android Won''t Turn On Repair%';
UPDATE threads SET brand='其他安卓 Other', fault='主板-芯片' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'Other Android Motherboard Chip Repair%';
UPDATE threads SET brand='其他安卓 Other', fault='信号-无服务' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'Other Android No Signal Repair%';
UPDATE threads SET brand='其他安卓 Other', fault='其他' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'Other Android Other Repair%';
UPDATE threads SET brand='其他安卓 Other', fault='屏幕-显示-触摸' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'Other Android Screen Display Touch Repair%';

-- 电脑主板 PC
UPDATE threads SET brand='电脑主板 PC', fault='主板-芯片' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'PC Motherboard Chip Repair%';
UPDATE threads SET brand='电脑主板 PC', fault='不开机-死机' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'PC Won''t Turn On Repair%';
UPDATE threads SET brand='电脑主板 PC', fault='屏幕-显示-触摸' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'PC Screen Display Touch Repair%';
UPDATE threads SET brand='电脑主板 PC', fault='电池-耗电' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'PC Battery Repair%';
UPDATE threads SET brand='电脑主板 PC', fault='解锁-激活' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'PC Unlock Activation%';

-- 通用 General
UPDATE threads SET brand='通用 General', fault='其他' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'General Other Repair%';
UPDATE threads SET brand='通用 General', fault='屏幕-显示-触摸' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'General Screen Display Touch Repair%';
UPDATE threads SET brand='通用 General', fault='电池-耗电' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE 'General Battery Repair%';

-- ============================================
-- 更新已发布的旧技术帖（90 个，按标题关键词归类）
-- ============================================

-- 笔记本类 → 电脑主板 PC
UPDATE threads SET brand='电脑主板 PC', fault='其他'
WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '%笔记本%' AND brand='';

-- 手机类 → 通用 General（无品牌）
UPDATE threads SET brand='通用 General', fault='其他'
WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '%手机%' AND brand='';

-- MacBook → 苹果 Apple
UPDATE threads SET brand='苹果 Apple', fault='其他'
WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '%MacBook%' AND brand='';

-- 剩下的归通用
UPDATE threads SET brand='通用 General', fault='其他'
WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND brand='';
