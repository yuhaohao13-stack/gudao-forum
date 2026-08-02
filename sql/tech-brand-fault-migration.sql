-- 古道论坛：技术板块品牌×故障分类迁移（2026-08-03 修复版，按中文标题匹配）
-- 给 threads 表加 brand / fault 字段，用于三级导航（品牌→故障→案例）
-- 执行方式：Supabase Dashboard → SQL Editor → Run（选 service_role）

ALTER TABLE threads ADD COLUMN IF NOT EXISTS brand TEXT DEFAULT '';
ALTER TABLE threads ADD COLUMN IF NOT EXISTS fault TEXT DEFAULT '';

-- 索引（按品牌/故障查询加速）
CREATE INDEX IF NOT EXISTS idx_threads_brand ON threads (brand);
CREATE INDEX IF NOT EXISTS idx_threads_fault ON threads (fault);

-- ============================================
-- 按中文标题更新（新发布的 117 个图文案例 + 旧帖）
-- 品牌关键词 → 品牌名
-- ============================================

-- 苹果 Apple
UPDATE threads SET brand='苹果 Apple' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '苹果 %';
UPDATE threads SET fault='不开机-死机' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '苹果 不开机/死机/重启维修%';
UPDATE threads SET fault='屏幕-显示-触摸' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '苹果 屏幕/显示/触摸维修%';
UPDATE threads SET fault='主板-芯片' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '苹果 主板/芯片级维修%';
UPDATE threads SET fault='电池-耗电' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '苹果 电池/耗电维修%';
UPDATE threads SET fault='充电-尾插' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '苹果 充电/尾插维修%';
UPDATE threads SET fault='信号-无服务' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '苹果 信号/无服务维修%';
UPDATE threads SET fault='扩容-存储' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '苹果 扩容/存储维修%';
UPDATE threads SET fault='功能故障' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '苹果 功能故障维修%';
UPDATE threads SET fault='摄像头' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '苹果 摄像头维修%';
UPDATE threads SET fault='解锁-激活' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '苹果 解锁/激活维修%';
UPDATE threads SET fault='进水' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '苹果 进水维修%';
UPDATE threads SET fault='音频' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '苹果 音频维修%';
UPDATE threads SET fault='其他' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '苹果 其他维修%';

-- 三星 Samsung
UPDATE threads SET brand='三星 Samsung' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '三星 %';
UPDATE threads SET fault='不开机-死机' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '三星 不开机/死机/重启维修%';
UPDATE threads SET fault='屏幕-显示-触摸' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '三星 屏幕/显示/触摸维修%';
UPDATE threads SET fault='主板-芯片' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '三星 主板/芯片级维修%';
UPDATE threads SET fault='电池-耗电' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '三星 电池/耗电维修%';
UPDATE threads SET fault='充电-尾插' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '三星 充电/尾插维修%';
UPDATE threads SET fault='信号-无服务' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '三星 信号/无服务维修%';
UPDATE threads SET fault='摄像头' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '三星 摄像头维修%';
UPDATE threads SET fault='进水' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '三星 进水维修%';
UPDATE threads SET fault='其他' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '三星 其他维修%';

-- 华为 Huawei
UPDATE threads SET brand='华为 Huawei' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '华为 %';
UPDATE threads SET fault='不开机-死机' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '华为 不开机/死机/重启维修%';
UPDATE threads SET fault='摄像头' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '华为 摄像头维修%';
UPDATE threads SET fault='音频' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '华为 音频维修%';
UPDATE threads SET fault='其他' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '华为 其他维修%';

-- 小米 Xiaomi
UPDATE threads SET brand='小米 Xiaomi' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '小米 %';
UPDATE threads SET fault='不开机-死机' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '小米 不开机/死机/重启维修%';
UPDATE threads SET fault='屏幕-显示-触摸' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '小米 屏幕/显示/触摸维修%';
UPDATE threads SET fault='主板-芯片' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '小米 主板/芯片级维修%';
UPDATE threads SET fault='充电-尾插' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '小米 充电/尾插维修%';
UPDATE threads SET fault='其他' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '小米 其他维修%';

-- 其他安卓 Other
UPDATE threads SET brand='其他安卓 Other' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '其他安卓 %';
UPDATE threads SET fault='不开机-死机' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '其他安卓 不开机/死机/重启维修%';
UPDATE threads SET fault='屏幕-显示-触摸' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '其他安卓 屏幕/显示/触摸维修%';
UPDATE threads SET fault='主板-芯片' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '其他安卓 主板/芯片级维修%';
UPDATE threads SET fault='信号-无服务' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '其他安卓 信号/无服务维修%';
UPDATE threads SET fault='其他' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '其他安卓 其他维修%';

-- 电脑主板 PC
UPDATE threads SET brand='电脑主板 PC' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '电脑主板 %';
UPDATE threads SET fault='不开机-死机' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '电脑主板 不开机/死机/重启维修%';
UPDATE threads SET fault='屏幕-显示-触摸' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '电脑主板 屏幕/显示/触摸维修%';
UPDATE threads SET fault='主板-芯片' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '电脑主板 主板/芯片级维修%';
UPDATE threads SET fault='电池-耗电' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '电脑主板 电池/耗电维修%';
UPDATE threads SET fault='解锁-激活' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '电脑主板 解锁/激活维修%';
UPDATE threads SET fault='其他' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '电脑主板 其他维修%';

-- 通用 General
UPDATE threads SET brand='通用 General' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '通用 %';
UPDATE threads SET fault='屏幕-显示-触摸' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '通用 屏幕/显示/触摸维修%';
UPDATE threads SET fault='电池-耗电' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '通用 电池/耗电维修%';
UPDATE threads SET fault='其他' WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '通用 其他维修%';

-- ============================================
-- 旧帖（笔记本/手机/MacBook 等，无品牌前缀）按关键词归类
-- ============================================
UPDATE threads SET brand='电脑主板 PC', fault='其他'
WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '%笔记本%' AND brand='';
UPDATE threads SET brand='通用 General', fault='其他'
WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '%手机%' AND brand='';
UPDATE threads SET brand='苹果 Apple', fault='其他'
WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND title LIKE '%MacBook%' AND brand='';
UPDATE threads SET brand='通用 General', fault='其他'
WHERE category_id='23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8' AND brand='';
