import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

await supabase.from('threads').insert({
  title: '📱 如何将古道论坛添加到手机主屏幕？',
  content: `很多朋友问怎么把论坛添加到手机桌面，像原生App一样方便浏览。

━━━━━━━━━━━━━━━━━
   iPhone（Safari）
━━━━━━━━━━━━━━━━━

1. 打开 Safari，访问论坛网址
2. 点底部中间的「分享」按钮（方框↑图标）
3. 向下滑，点「添加到主屏幕」
4. 确认名称，点右上角「添加」
5. 桌面出现图标，打开全屏显示 ✅

━━━━━━━━━━━━━━━━━
   安卓（Chrome）
━━━━━━━━━━━━━━━━━

1. 打开 Chrome，访问论坛网址
2. 点右上角「三个点 ⋮」
3. 点「添加到主屏幕」
4. 点「添加」✅

━━━━━━━━━━━━━━━━━
   注意事项
━━━━━━━━━━━━━━━━━

• 必须用 Safari（iPhone）或 Chrome（安卓）
• 微信/QQ内置浏览器不支持
• 图标是深色底金色「古」字
• 想删除：长按图标→移除App
• 数据不会丢，重新添加即可

古道论坛管理组`,
  category_id: 'd09ded43-58e8-43e3-849b-cf22b68230db',
  author_id: '1d5b2916-b91f-4a33-87da-120d841d0bb2',
  is_pinned: true,
}).select('id').then(({ data, error }) => {
  if (error) console.error('Error:', error.message)
  else console.log('✅ 教程帖已发布, id:', data?.[0]?.id)
})
