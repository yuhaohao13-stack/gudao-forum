import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

/**
 * POST /api/chat/heartbeat
 * 客户端心跳：上报在线状态，返回访客标签
 * Body: { room_slug: string, session_id: string, user_agent?: string }
 * 无需登录，检测IP自动生成访客标签
 */
export async function POST(request) {
  try {
    const { room_slug, session_id, user_agent } = await request.json()
    if (!room_slug || !session_id) {
      return Response.json({ error: '缺少参数' }, { status: 400 })
    }

    // 设备标签解析（保留注释供后续启用）
    // 注：device_label 列尚未在数据库中创建，暂时忽略该字段避免心跳失败
    const deviceLabel = '' // 由 getDeviceLabel(user_agent) 生成

    // 1. 检测客户端 IP
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const rawIp = forwarded?.split(',')[0]?.trim() || realIp || '127.0.0.1'
    // 取最后3位非点数字
    const ipMatch = rawIp.replace(/\./g, '').match(/\d{3}$/)
    const ipLast3 = ipMatch ? ipMatch[0] : rawIp.slice(-3)

    // 2. 获取当前登录用户（如果有）
    const cookieStore = await cookies()
    const sbUser = createServerClient(
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
    const { data: { user } } = await sbUser.auth.getUser()
    const userId = user?.id || null

    // 3. 使用 service role 写入 chat_presence
    const sbAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    )

    // 获取 room_id
    const { data: room } = await sbAdmin
      .from('chat_rooms')
      .select('id')
      .eq('slug', room_slug)
      .single()

    if (!room) {
      return Response.json({ error: '聊天室不存在' }, { status: 404 })
    }

    const roomId = room.id

    if (userId) {
      // === 注册用户 ===
      // 获取 profile
      const { data: profile } = await sbAdmin
        .from('profiles')
        .select('display_name, username')
        .eq('id', userId)
        .single()

      const displayName = profile?.display_name || profile?.username || '用户'

      // Upsert
      await sbAdmin.from('chat_presence').upsert({
        user_id: userId,
        room_id: roomId,
        session_id,
        client_ip: rawIp,
        ip_last3: ipLast3,
        guest_label: null,
        display_name: displayName,
        // device_label: deviceLabel,  // 列不存在，暂时注释
        status: 'online',
        last_seen: new Date().toISOString(),
      }, {
        onConflict: 'session_id, room_id',
      })

      return Response.json({
        ok: true,
        is_guest: false,
        display_name: displayName,
        // device_label: deviceLabel,
      })
    } else {
      // === 访客 ===
      // 查看该 session_id 是否已有记录
      const { data: existing } = await sbAdmin
        .from('chat_presence')
        .select('guest_label')
        .eq('session_id', session_id)
        .eq('room_id', roomId)
        .maybeSingle()

      let guestLabel = existing?.guest_label

      if (!guestLabel) {
        // 生成新标签：同IP已有多少访客
        const { count } = await sbAdmin
          .from('chat_presence')
          .select('*', { count: 'exact', head: true })
          .eq('ip_last3', ipLast3)
          .eq('room_id', roomId)
          .is('user_id', null)
          .gte('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString())

        const sameIpCount = count || 0
        guestLabel = sameIpCount === 0 ? ipLast3 : `${ipLast3}(${sameIpCount})`
      }

      // 写入
      await sbAdmin.from('chat_presence').upsert({
        user_id: null,
        room_id: roomId,
        session_id,
        client_ip: rawIp,
        ip_last3: ipLast3,
        guest_label: guestLabel,
        display_name: `访客 ${guestLabel}`,
        // device_label: '',          // 列不存在，暂时注释
        status: 'online',
        last_seen: new Date().toISOString(),
      }, {
        onConflict: 'session_id, room_id',
      })

      // 顺便清理过期记录（防止表膨胀）
      try { await sbAdmin.rpc('cleanup_stale_presence') } catch (e) { /* 清理非关键 */ }

      return Response.json({
        ok: true,
        is_guest: true,
        guest_label: guestLabel,
        display_name: `访客 ${guestLabel}`,
      })
    }
  } catch (err) {
    console.error('心跳上报失败:', err)
    return Response.json({ error: '服务器错误: ' + err.message }, { status: 500 })
  }
}
