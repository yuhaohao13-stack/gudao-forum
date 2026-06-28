import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

/**
 * POST /api/broadcast
 * 管理员群发站内公告（服务端执行，绕过 RLS）
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

    // 3. 获取所有用户
    const { data: allUsers, error: userError } = await supabase
      .from('profiles')
      .select('id')

    if (userError) {
      return Response.json({ error: '获取用户列表失败' }, { status: 500 })
    }

    // 4. 使用 service_role 创建管理员客户端，批量插入私信
    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    )

    const messages = allUsers
      .filter(u => u.id !== user.id) // 不给自己发
      .map(u => ({
        sender_id: user.id,
        receiver_id: u.id,
        content: `📢 站内公告：${content.trim()}`,
      }))

    if (messages.length === 0) {
      return Response.json({ error: '没有可发送的用户' }, { status: 400 })
    }

    // 分批插入，每批 100 条
    let sent = 0
    for (let i = 0; i < messages.length; i += 100) {
      const batch = messages.slice(i, i + 100)
      const { error: insertError } = await serviceClient
        .from('private_messages')
        .insert(batch)

      if (insertError) {
        console.error('批量插入失败:', insertError)
        // 继续尝试下一批
      } else {
        sent += batch.length
      }
    }

    return Response.json({
      success: true,
      sent,
      total: messages.length,
      message: `✅ 已向 ${sent}/${messages.length} 位用户发送公告`,
    })
  } catch (err) {
    console.error('广播接口异常:', err)
    return Response.json({ error: '服务器内部错误: ' + err.message }, { status: 500 })
  }
}
