-- 按姓名+出生日期查找邮箱并发送重置邮件
CREATE OR REPLACE FUNCTION public.reset_password_by_profile(target_name TEXT, target_dob DATE)
RETURNS TEXT AS $$
DECLARE
  v_user_id UUID;
  v_email TEXT;
BEGIN
  -- 查找匹配的用户
  SELECT p.id INTO v_user_id
  FROM public.profiles p
  WHERE p.display_name = target_name AND p.date_of_birth = target_dob
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RETURN 'NOT_FOUND';
  END IF;

  -- 查找对应的邮箱
  SELECT au.email INTO v_email
  FROM auth.users au
  WHERE au.id = v_user_id;

  IF v_email IS NULL THEN
    RETURN 'NO_EMAIL';
  END IF;

  RETURN v_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
