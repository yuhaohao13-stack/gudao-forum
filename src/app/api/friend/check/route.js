import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

/**
 * GET /api/friend/check?user_id=xxx
 * 检查当前用户与某用户的好友关系状态
 * 需要登录
 */
export async function GET(request) {
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
      return Response.json({ status: 'guest' })
    }

    const { searchParams } = new URL(request.url)
    const targetUserId = searchParams.get('user_id')

    if (!targetUserId || targetUserId === user.id) {
      return Response.json({ status: 'self' })
    }

    // 检查好友关系
    const uid1 = user.id < targetUserId ? user.id : targetUserId
    const uid2 = user.id < targetUserId ? targetUserId : user.id

    const { data: friendship } = await supabase
      .from('friendships')
      .select('id')
      .eq('user_id_1', uid1)
      .eq('user_id_2', uid2)
      .maybeSingle()

    if (friendship) {
      return Response.json({ status: 'friends' })
    }

    // 检查好友请求状态
    const { data: sentRequest } = await supabase
      .from('friend_requests')
      .select('status')
      .eq('from_user_id', user.id)
      .eq('to_user_id', targetUserId)
      .maybeSingle()

    if (sentRequest) {
      return Response.json({ status: sentRequest.status === 'pending' ? 'pending_sent' : 'rejected' })
    }

    const { data: receivedRequest } = await supabase
      .from('friend_requests')
      .select('status')
      .eq('from_user_id', targetUserId)
      .eq('to_user_id', user.id)
      .maybeSingle()

    if (receivedRequest) {
      return Response.json({ status: receivedRequest.status === 'pending' ? 'pending_received' : 'rejected' })
    }

    return Response.json({ status: 'none' })
  } catch (err) {
    console.error('检查好友关系失败:', err)
    return Response.json({ error: '服务器错误: ' + err.message }, { status: 500 })
  }
}
