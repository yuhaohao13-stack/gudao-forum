-- 站务管理版块仅管理员可发帖
DROP POLICY IF EXISTS "登录用户发帖" ON public.threads;

CREATE POLICY "登录用户发帖" ON public.threads
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated'
    AND (
      -- 非站务管理的版块，所有人可发
      (SELECT slug FROM public.categories WHERE id = category_id) != 'announcements'
      OR
      -- 站务管理限管理员/版主
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
    )
  );
