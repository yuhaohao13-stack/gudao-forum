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

    // 获取在线用户
    const { data: presences } = await sbAdmin
      .from('chat_presence')
      .select('user_id, guest_label, display_name, status, last_seen')
      .eq('room_id', room.id)
      .gte('last_seen', cutoff)
      .order('last_seen', { ascending: false })

    if (!presences) {
      return Response.json({ users: [] })
    }

    // 同用户多设备去重：每个注册用户只保留最近一次心跳
    const seenUserIds = new Set()
    const deduped = []
    for (const p of presences) {
      if (p.user_id) {
        if (seenUserIds.has(p.user_id)) continue
        seenUserIds.add(p.user_id)
      }
      deduped.push(p)
    }

    // 对注册用户，获取角色信息
    const registeredUserIds = deduped
      .filter(p => p.user_id)
      .map(p => p.user_id)

    let rolesMap = {}
    if (registeredUserIds.length > 0) {
      const { data: profiles } = await sbAdmin
        .from('profiles')
        .select('id, role')
        .in('id', registeredUserIds)
      if (profiles) {
        for (const p of profiles) {
          rolesMap[p.id] = p.role
        }
      }
    }

    const users = deduped.map(p => ({
      user_id: p.user_id,
      display_name: p.display_name,
      guest_label: p.guest_label,
      is_guest: !p.user_id,
      role: p.user_id ? (rolesMap[p.user_id] || 'user') : null,
      status: p.status,
    }))

    return Response.json({ users })
  } catch (err) {
    console.error('获取在线用户失败:', err)
    return Response.json({ error: '服务器错误: ' + err.message }, { status: 500 })
  }
}
