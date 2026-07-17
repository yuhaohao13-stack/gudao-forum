import { createClient } from '@supabase/supabase-js'

/**
 * GET /api/chat/online-users?room_slug=xxx
 * 获取某聊天室的在线用户列表（含访客）
 * 同时清理过期记录
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const room_slug = searchParams.get('room_slug')

    if (!room_slug) {
      return Response.json({ error: '缺少 room_slug 参数' }, { status: 400 })
    }

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

    // 清理过期记录（超过2分钟未更新）
    const cutoff = new Date(Date.now() - 2 * 60 * 1000).toISOString()
    await sbAdmin
      .from('chat_presence')
      .delete()
      .lt('last_seen', cutoff)

    // 获取在线用户（允许同一用户多设备，靠 display_name 中嵌入的设备标签区分）
    const { data: presences } = await sbAdmin
      .from('chat_presence')
      .select('user_id, guest_label, display_name, status, last_seen')
      .eq('room_id', room.id)
      .gte('last_seen', cutoff)
      .order('last_seen', { ascending: false })

    if (!presences) {
      return Response.json({ users: [] })
    }

    // 对注册用户，获取角色信息
    const registeredUserIds = [...new Set(
      presences.filter(p => p.user_id).map(p => p.user_id)
    )]

    let rolesMap = {}
    if (registeredUserIds.length > 0) {
      const { data: profiles } = await sbAdmin
        .from('profiles')
        .select('id, role, membership_level')
        .in('id', registeredUserIds)
      if (profiles) {
        for (const p of profiles) {
          rolesMap[p.id] = p
        }
      }
    }

    const users = presences.map(p => {
      // 从 display_name 解析设备标签（格式：display_name ∈ "浩哥 ‖ iPhone" 或 "浩哥"）
      const pipeIdx = p.display_name?.lastIndexOf(' ‖ ')
      let displayName = p.display_name || ''
      let deviceLabel = ''
      if (pipeIdx !== -1 && pipeIdx > 0) {
        displayName = p.display_name.slice(0, pipeIdx)
        deviceLabel = p.display_name.slice(pipeIdx + 3)
      }

      return {
        user_id: p.user_id,
        display_name: displayName,
        guest_label: p.guest_label,
        device_label: deviceLabel,
        is_guest: !p.user_id,
        role: p.user_id ? (rolesMap[p.user_id]?.role || 'user') : null,
        membership_level: p.user_id ? (rolesMap[p.user_id]?.membership_level || 'regular') : null,
        status: p.status,
      }
    })

    return Response.json({ users })
  } catch (err) {
    console.error('获取在线用户失败:', err)
    return Response.json({ error: '服务器错误: ' + err.message }, { status: 500 })
  }
}
