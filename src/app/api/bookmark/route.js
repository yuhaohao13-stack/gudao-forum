import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: '需要登录' }, { status: 401 })

    const { thread_id } = await request.json()
    if (!thread_id) return NextResponse.json({ error: '缺少参数' }, { status: 400 })

    // 检查是否已收藏
    const { data: existing } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', user.id)
      .eq('thread_id', thread_id)
      .single()

    if (existing) {
      // 取消收藏
      await supabase.from('bookmarks').delete().eq('id', existing.id)
      return NextResponse.json({ bookmarked: false })
    } else {
      // 添加收藏
      await supabase.from('bookmarks').insert({ user_id: user.id, thread_id })
      return NextResponse.json({ bookmarked: true })
    }
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: '需要登录' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const thread_id = searchParams.get('thread_id')

    if (thread_id) {
      // 检查单个帖子是否收藏
      const { data } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('thread_id', thread_id)
        .single()
      return NextResponse.json({ bookmarked: !!data })
    }

    // 获取用户所有收藏（带帖子信息）
    const { data: bookmarks } = await supabase
      .from('bookmarks')
      .select('id, created_at, thread:thread_id(id, title, created_at)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    return NextResponse.json({ bookmarks: bookmarks || [] })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
