import { createClient } from '@/lib/supabase/server'
import { createRateLimiter } from '@/lib/rate-limit'

export async function POST(request) {
  try {
    // 速率限制
    const supabase = await createClient()
    const limiter = createRateLimiter(supabase)
    const ip = limiter.getClientIp(request)
    const result = await limiter.check(`broadcast:${ip}`, 5, 60000) // 每小时最多5条广播

    if (!result.allowed) {
      return Response.json(
        { success: false, error: `请求过于频繁，请 ${result.retryAfter} 秒后再试` },
        { status: 429 }
      )
    }

    const { content } = await request.json()
    if (!content?.trim()) {
      return Response.json({ success: false, error: '内容不能为空' }, { status: 400 })
    }

    // 验证管理员身份
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ success: false, error: '未登录' }, { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin' && profile?.role !== 'moderator') {
      return Response.json({ success: false, error: '无权限' }, { status: 403 })
    }

    // 发站内信给所有用户
    const { data: users } = await supabase.from('profiles').select('id')
    if (!users?.length) return Response.json({ success: true, message: '没有活跃用户' })

    const messages = users
      .filter(u => u.id !== user.id)
      .map(u => ({
        sender_id: user.id,
        receiver_id: u.id,
        content: `📢 系统公告：\n\n${content.trim()}`,
      }))

    if (messages.length > 0) {
      const { error } = await supabase.from('private_messages').insert(messages)
      if (error) throw error
    }

    return Response.json({
      success: true,
      message: `✅ 公告已发送给 ${messages.length} 位用户`,
    })
  } catch (err) {
    console.error('[broadcast] Error:', err)
    return Response.json({ success: false, error: '发送失败: ' + err.message }, { status: 500 })
  }
}
