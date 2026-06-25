-- 按姓名+出生日期 或 用户ID 查找邮箱
CREATE OR REPLACE FUNCTION public.reset_password_by_profile(target_name TEXT, target_dob DATE)
RETURNS TEXT AS $$
DECLARE
  v_user_id UUID;
  v_email TEXT;
BEGIN
  SELECT p.id INTO v_user_id
  FROM public.profiles p
  WHERE p.display_name = target_name AND p.date_of_birth = target_dob
  LIMIT 1;
  IF v_user_id IS NULL THEN RETURN 'NOT_FOUND'; END IF;
  SELECT au.email INTO v_email FROM auth.users au WHERE au.id = v_user_id;
  RETURN v_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 按用户ID查找邮箱（用于手机号验证后）
CREATE OR REPLACE FUNCTION public.get_email_by_user_id(target_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_email TEXT;
BEGIN
  SELECT au.email INTO v_email FROM auth.users au WHERE au.id = target_id;
  RETURN COALESCE(v_email, 'NOT_FOUND');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
