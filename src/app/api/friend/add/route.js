import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

/**
 * POST /api/friend/add
 * 发送好友请求
 * Body: { to_user_id: string }
 * 需要登录
 * 管理员发送则直接通过，无需对方同意
 */
export async function POST(request) {
  try {
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
      return Response.json({ error: '请先登录' }, { status: 401 })
    }

    const { to_user_id } = await request.json()
    if (!to_user_id) {
      return Response.json({ error: '缺少目标用户ID' }, { status: 400 })
    }

    if (to_user_id === user.id) {
      return Response.json({ error: '不能添加自己为好友' }, { status: 400 })
    }

    // 检查发送者是否为管理员
    const { data: senderProfile } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', user.id)
      .single()

    const isAdmin = senderProfile?.role === 'admin'

    // 检查目标用户是否存在
    const { data: targetProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', to_user_id)
      .single()

    if (!targetProfile) {
      return Response.json({ error: '用户不存在' }, { status: 404 })
    }

    // 检查是否已经是好友（通过 friends 表）
    const { data: existingFriend } = await supabase
      .from('friends')
      .select('id, status')
      .or(`and(requester_id.eq.${user.id},addressee_id.eq.${to_user_id}),and(requester_id.eq.${to_user_id},addressee_id.eq.${user.id})`)
      .eq('status', 'accepted')
      .maybeSingle()

    if (existingFriend) {
      return Response.json({ error: '你们已经是好友了' }, { status: 409 })
    }

    // 检查是否已经是好友（通过 friendships 表）
    const uid1 = user.id < to_user_id ? user.id : to_user_id
    const uid2 = user.id < to_user_id ? to_user_id : user.id
    const { data: existingFriendship } = await supabase
      .from('friendships')
      .select('id')
      .eq('user_id_1', uid1)
      .eq('user_id_2', uid2)
      .maybeSingle()

    if (existingFriendship) {
      return Response.json({ error: '你们已经是好友了' }, { status: 409 })
    }

    // ===== 管理员直接通过 =====
    if (isAdmin) {
      // 直接添加好友（双方都通过）
      const { error: f1 } = await supabase
        .from('friends')
        .insert({
          requester_id: user.id,
          addressee_id: to_user_id,
          status: 'accepted',
        })

      const { error: f2 } = await supabase
        .from('friendships')
        .insert({
          user_id_1: uid1,
          user_id_2: uid2,
        })

      if (f1 || f2) {
        console.error('管理员加好友失败:', f1?.message, f2?.message)
        return Response.json({ error: '添加失败' }, { status: 500 })
      }

      return Response.json({ success: true, message: '✅ 管理员直接添加好友成功' })
    }

    // ===== 普通用户流程 =====

    // 检查是否已有待处理的请求（friend_requests 表）
    const { data: existingRequest } = await supabase
      .from('friend_requests')
      .select('id, status')
      .eq('from_user_id', user.id)
      .eq('to_user_id', to_user_id)
      .maybeSingle()

    if (existingRequest) {
      if (existingRequest.status === 'pending') {
        return Response.json({ error: '已发送过好友请求，请等待对方回复' }, { status: 409 })
      }
      if (existingRequest.status === 'accepted') {
        return Response.json({ error: '你们已经是好友了' }, { status: 409 })
      }
      // 如果之前被拒绝，重新发送（更新状态为pending）
      await supabase
        .from('friend_requests')
        .update({ status: 'pending', updated_at: new Date().toISOString() })
        .eq('id', existingRequest.id)
      return Response.json({ success: true, message: '好友请求已重新发送' })
    }

    // 检查对方是否已给自己发过请求
    const { data: reverseRequest } = await supabase
      .from('friend_requests')
      .select('id, status')
      .eq('from_user_id', to_user_id)
      .eq('to_user_id', user.id)
      .eq('status', 'pending')
      .maybeSingle()

    if (reverseRequest) {
      // 自动接受 - 反向请求存在则直接建立好友关系
      await supabase
        .from('friend_requests')
        .update({ status: 'accepted', updated_at: new Date().toISOString() })
        .eq('id', reverseRequest.id)

      // 写入 friends 表
      await supabase
        .from('friends')
        .insert({ requester_id: uid1, addressee_id: uid2, status: 'accepted' })

      await supabase
        .from('friendships')
        .insert({ user_id_1: uid1, user_id_2: uid2 })

      return Response.json({ success: true, message: '对方已向你发送过请求，自动建立好友关系' })
    }

    // 检查是否已有待处理的请求（friends 表 - 兼容旧数据）
    const { data: existingFriendReq } = await supabase
      .from('friends')
      .select('id, status')
      .eq('requester_id', user.id)
      .eq('addressee_id', to_user_id)
      .maybeSingle()

    if (existingFriendReq) {
      if (existingFriendReq.status === 'pending') {
        return Response.json({ error: '已发送过好友请求，请等待对方回复' }, { status: 409 })
      }
      if (existingFriendReq.status === 'accepted') {
        return Response.json({ error: '你们已经是好友了' }, { status: 409 })
      }
    }

    // 发送新请求（同时写入两个表以保持兼容）
    const { error: err1 } = await supabase
      .from('friend_requests')
      .insert({
        from_user_id: user.id,
        to_user_id,
        status: 'pending',
      })

    const { error: err2 } = await supabase
      .from('friends')
      .insert({
        requester_id: user.id,
        addressee_id: to_user_id,
        status: 'pending',
      })

    if (err1 || err2) {
      console.error('发送好友请求失败:', err1?.message, err2?.message)
      return Response.json({ error: '发送失败' }, { status: 500 })
    }

    return Response.json({ success: true, message: '好友请求已发送' })
  } catch (err) {
    console.error('好友请求接口异常:', err)
    return Response.json({ error: '服务器错误: ' + err.message }, { status: 500 })
  }
}
