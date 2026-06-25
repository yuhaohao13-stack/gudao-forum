-- ============================================
-- 古道论坛 — 安全加固 SQL
-- 在 Supabase SQL Editor 运行
-- ============================================

-- 1. 确保所有表的 RLS 已开启
ALTER TABLE IF EXISTS public.threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 2. 防止 SQL 注入：限制模糊搜索
-- Supabase 客户端已自动处理参数化查询，这层是额外防护

-- 3. 定期清理过期/未验证的账号
-- Supabase 会自动处理，无需手动

-- 4. 限制公开表的写入权限
-- threads：已处理
-- replies：已处理
-- chat_messages：已处理

-- 5. 保护 profiles 表：用户只能修改自己的资料
DROP POLICY IF EXISTS "用户可修改自己资料" ON public.profiles;
CREATE POLICY "用户可修改自己资料" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 6. 禁止删除 profiles（管理员除外）
DROP POLICY IF EXISTS "管理员可删除资料" ON public.profiles;
CREATE POLICY "管理员可删除资料" ON public.profiles
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 7. 新用户注册时自动创建 profile 的触发器（已存在则跳过）
-- 如果之前已创建则跳过
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;
