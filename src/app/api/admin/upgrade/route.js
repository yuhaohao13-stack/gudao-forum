import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 })

    // 验证管理员身份
    const { data: admin } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (admin?.role !== 'admin') return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })

    const { user_id, level, draws } = await request.json()
    if (!user_id || !level) return NextResponse.json({ error: '缺少参数' }, { status: 400 })

    const updates = { membership_level: level }
    if (level === 'gold') updates.gold_draws_remaining = draws || 500
    if (level === 'diamond') updates.gold_draws_remaining = 99999

    // 使用 service_role key 进行更新（绕过 RLS）
    const { error } = await supabase.from('profiles').update(updates).eq('id', user_id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // 自动生成打赏记录
    if (level === 'gold' || level === 'diamond') {
      const amount = level === 'diamond' ? 99 : 9.9
      const { data: target } = await supabase.from('profiles').select('username, display_name').eq('id', user_id).single()
      await supabase.from('donations').insert({
        user_id: user_id,
        username: target?.display_name || target?.username || '未知',
        amount: amount,
        plan: level,
        status: 'completed'
      }).catch(() => {})
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
