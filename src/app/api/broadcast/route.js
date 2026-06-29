import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

/**
 * POST /api/broadcast
 * 管理员群发站内公告
 * 使用管理员自身的 session 插入私信，RLS 策略 (auth.uid() = sender_id) 天然允许
 */
export async function POST(request) {
  try {
    // 1. 验证管理员身份
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: '未登录' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return Response.json({ error: '权限不足' }, { status: 403 })
    }

    // 2. 解析请求
    const { content } = await request.json()
    if (!content || !content.trim()) {
      return Response.json({ error: '内容不能为空' }, { status: 400 })
    }

    // 3. 获取所有用户（排除自己）
    const { data: allUsers, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .neq('id', user.id)

    if (userError) {
      return Response.json({ error: '获取用户列表失败' }, { status: 500 })
    }

    if (!allUsers || allUsers.length === 0) {
      return Response.json({ error: '没有可发送的用户' }, { status: 400 })
    }

    // 4. 使用管理员自身的 session 分批插入私信
    //    RLS 策略要求 sender_id = auth.uid()，管理员本人发送，天然满足
    const targetContent = `📢 站内公告：${content.trim()}`
    let sent = 0
    const errors = []

    // 逐条插入，便于定位失败原因
    for (const targetUser of allUsers) {
      const { error: insertError } = await supabase
        .from('private_messages')
        .insert({
          sender_id: user.id,
          receiver_id: targetUser.id,
          content: targetContent,
        })

      if (insertError) {
        errors.push({ userId: targetUser.id, error: insertError.message })
        console.error(`发送给 ${targetUser.id} 失败:`, insertError)
      } else {
        sent++
      }
    }

    const total = allUsers.length

    return Response.json({
      success: sent > 0,
      sent,
      total,
      errors: errors.length > 0 ? errors.slice(0, 5) : undefined,
      message: errors.length === 0
        ? `✅ 已向 ${sent} 位用户发送公告`
        : `✅ 已向 ${sent}/${total} 位用户发送公告（${errors.length} 条失败）`,
    })
  } catch (err) {
    console.error('广播接口异常:', err)
    return Response.json({ error: '服务器内部错误: ' + err.message }, { status: 500 })
  }
}
