-- 古道论坛 — 找回密码：按用户ID直接重置密码
-- 在 Supabase SQL Editor 运行（覆盖之前的函数）

CREATE OR REPLACE FUNCTION public.reset_password_by_profile(target_name TEXT, target_dob DATE)
RETURNS TEXT AS $$
DECLARE v_user_id UUID; v_email TEXT;
BEGIN
  SELECT p.id INTO v_user_id FROM public.profiles p WHERE p.display_name = target_name AND p.date_of_birth = target_dob LIMIT 1;
  IF v_user_id IS NULL THEN RETURN 'NOT_FOUND'; END IF;
  SELECT au.email INTO v_email FROM auth.users au WHERE au.id = v_user_id;
  RETURN v_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_email_by_user_id(target_id UUID)
RETURNS TEXT AS $$
DECLARE v_email TEXT;
BEGIN
  SELECT au.email INTO v_email FROM auth.users au WHERE au.id = target_id;
  RETURN COALESCE(v_email, 'NOT_FOUND');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 直接重置密码（跳过邮箱验证）
CREATE OR REPLACE FUNCTION public.reset_user_password(target_email TEXT, new_password TEXT)
RETURNS TEXT AS $$
BEGIN
  UPDATE auth.users
  SET encrypted_password = crypt(new_password, gen_salt('bf')),
      updated_at = NOW(),
      email_confirmed_at = COALESCE(email_confirmed_at, NOW())
  WHERE email = target_email;
  IF NOT FOUND THEN RETURN 'NOT_FOUND'; END IF;
  RETURN 'OK';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
