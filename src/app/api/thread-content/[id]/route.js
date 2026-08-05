import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

// 服务端鉴权：维修案例详情内容，仅钻石会员可读
// 访客/普通/黄金 → { locked: true, reason }；钻石 → { content }
// 读取用 service_role（SQL 已 REVOKE anon/authenticated 对 content 列的读权限）
export async function GET(request, { params }) {
  try {
    const { id } = await params
    const supabase = await createClient() // anon + cookies，用于识别当前登录用户
    const svc = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { data: thread } = await svc
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
      const { data: prof } = await svc
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
