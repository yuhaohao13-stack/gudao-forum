import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// 服务端鉴权：维修案例详情内容，仅钻石会员可读
// 访客/普通/黄金 → { locked: true, reason }；钻石 → { content }
export async function GET(request, { params }) {
  try {
    const id = params.id
    const supabase = await createClient()

    const { data: thread } = await supabase
      .from('threads')
      .select('id, content, categories(slug)')
      .eq('id', id)
      .maybeSingle()

    if (!thread) return NextResponse.json({ error: '帖子不存在' }, { status: 404 })

    const isTech = thread.categories?.slug === 'tech'

    // 维修案例板块：钻石会员才能看内容
    if (isTech) {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return NextResponse.json({ locked: true, reason: 'login' })
      const { data: prof } = await supabase
        .from('profiles')
        .select('membership_level')
        .eq('id', user.id)
        .maybeSingle()
      const level = prof?.membership_level || 'regular'
      if (level !== 'diamond') return NextResponse.json({ locked: true, reason: 'diamond_only' })
    }

    return NextResponse.json({ content: thread.content || '' })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
