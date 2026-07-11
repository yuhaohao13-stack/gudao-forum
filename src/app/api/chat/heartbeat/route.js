import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

/**
 * POST /api/chat/heartbeat
 * 客户端心跳：上报在线状态，返回访客标签
 * Body: { room_slug: string, session_id: string, user_agent?: string }
 * 无需登录，检测IP自动生成访客标签
 */

// 从 user-agent 解析设备标签
// 注意：iOS Safari UA 同时包含 'iPhone' 和 'Mac OS X'，iPhone 检查必须优先
function getDeviceLabel(ua) {
  if (!ua) return ''

  // iPhone 带具体型号（如 iPhone17,3）
  const iPhoneModelMatch = ua.match(/iPhone(\d+)[,_](\d+)/i)
  if (iPhoneModelMatch) return `iPhone${iPhoneModelMatch[1]},${iPhoneModelMatch[2]}`

  // iPhone（无具体型号，iOS Safari UA 只有 "iPhone;" 无数字）
  // 必须早于 Mac 检查，因为 iOS UA 也包含 'Mac OS X'
  if (/iPhone/i.test(ua)) return 'iPhone'

  // iPad
  if (/iPad/i.test(ua)) return 'iPad'

  // Android 带具体机型（如 Pixel 9）
  const androidMatch = ua.match(/;\s*([^;]+?)\s+Build\//i)
  if (androidMatch) return androidMatch[1].trim()

  // Android（无具体机型）
  if (/Android/i.test(ua)) return 'Android'

  // Mac（iOS 已被排除，安全检测 Mac OS X）
  if (/Macintosh|Mac OS X/i.test(ua)) {
    if (/Intel Mac/i.test(ua)) return 'Mac (Intel)'
    if (/ARM64/i.test(ua)) return 'Mac (M芯片)'
    return 'Mac'
  }

  // Windows
  if (/Windows/i.test(ua)) {
    const winMatch = ua.match(/Windows NT (\d+\.?\d*)/i)
    if (winMatch) {
      const v = parseFloat(winMatch[1])
      if (v >= 10) return 'Win 10/11'
      if (v >= 6.2) return 'Win 8/8.1'
      if (v >= 6.1) return 'Win 7'
      return `Win NT ${winMatch[1]}`
    }
    return 'Windows'
  }

  // Linux
  if (/Linux/i.test(ua)) return 'Linux'

  // 兜底
  const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(ua)
  if (isMobile) return '手机'
  return '电脑'
}

export async function POST(request) {
  try {
    const { room_slug, session_id, user_agent } = await request.json()
    if (!room_slug || !session_id) {
      return Response.json({ error: '缺少参数' }, { status: 400 })
    }

    const deviceLabel = getDeviceLabel(user_agent || '')

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

      const baseName = profile?.display_name || profile?.username || '用户'
      // 把设备标签嵌入 display_name（不依赖数据库列）
      const displayName = deviceLabel ? `${baseName} ‖ ${deviceLabel}` : baseName

      // Upsert
      await sbAdmin.from('chat_presence').upsert({
        user_id: userId,
        room_id: roomId,
        session_id,
        client_ip: rawIp,
        ip_last3: ipLast3,
        guest_label: null,
        display_name: displayName,
        status: 'online',
        last_seen: new Date().toISOString(),
      }, {
        onConflict: 'session_id, room_id',
      })

      return Response.json({
        ok: true,
        is_guest: false,
        display_name: baseName,
        device_label: deviceLabel,
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
