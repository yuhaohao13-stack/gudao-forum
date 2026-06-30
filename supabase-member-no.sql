-- 1. 给profiles表添加会员编号字段
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS member_no TEXT;

-- 2. 管理员设为 00000001，其他会员从 00000010 开始
DO $$
DECLARE
  admin_id UUID;
  idx INTEGER := 10;
  rec RECORD;
BEGIN
  -- 找到管理员
  SELECT id INTO admin_id FROM public.profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1;

  -- 管理员设为 00000001
  IF admin_id IS NOT NULL THEN
    UPDATE public.profiles SET member_no = '00000001' WHERE id = admin_id;
  END IF;

  -- 其他会员按创建时间排序，从 00000010 开始
  FOR rec IN SELECT id FROM public.profiles WHERE (member_no IS NULL OR member_no = '') AND id != COALESCE(admin_id, '00000000-0000-0000-0000-000000000000') ORDER BY created_at ASC
  LOOP
    UPDATE public.profiles SET member_no = LPAD(idx::TEXT, 8, '0') WHERE id = rec.id;
    idx := idx + 1;
  END LOOP;
END $$;

-- 3. 修改创建用户触发器，自动分配会员编号
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  next_no INTEGER;
BEGIN
  SELECT COALESCE(MAX(NULLIF(member_no, '')::INTEGER), 9) + 1 INTO next_no FROM public.profiles;
  INSERT INTO public.profiles (id, username, display_name, member_no)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username'),
    LPAD(next_no::TEXT, 8, '0')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
