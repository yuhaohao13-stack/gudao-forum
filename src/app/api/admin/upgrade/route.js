import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

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

    function buildUpdates(level, draws) {
      const updates = { membership_level: level }
      if (level === 'gold') updates.gold_draws_remaining = draws || 500
      if (level === 'diamond') updates.gold_draws_remaining = 99999
      return updates
    }

    let updateSuccess = false

    // 方案A：使用 service_role key（需在 Vercel 环境变量中设置 SUPABASE_SERVICE_ROLE_KEY）
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const adminSupabase = createAdminClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY,
          { auth: { autoRefreshToken: false, persistSession: false } }
        )
        const { error } = await adminSupabase
          .from('profiles')
          .update(buildUpdates(level, draws))
          .eq('id', user_id)
        if (!error) updateSuccess = true
      } catch (_) { /* 方案A失败，走方案B */ }
    }

    // 方案B：通过数据库函数（要求先运行 admin-upgrade-function.sql）
    if (!updateSuccess) {
      try {
        const { error } = await supabase.rpc('admin_upgrade_membership', {
          p_target_user_id: user_id,
          p_level: level,
          p_draws: draws || 500
        })
        if (!error) updateSuccess = true
      } catch (_) { /* 方案B失败，走方案C */ }
    }

    // 方案C：通过 RLS 策略（admin 可更新任何 profile，要求先运行 admin-upgrade-function.sql 中的 policy）
    if (!updateSuccess) {
      const { error } = await supabase
        .from('profiles')
        .update(buildUpdates(level, draws))
        .eq('id', user_id)
      if (!error) updateSuccess = true
    }

    if (!updateSuccess) {
      return NextResponse.json({
        error: '升级失败。请确认：1）在 Vercel 环境变量中设置 SUPABASE_SERVICE_ROLE_KEY；2）或在 Supabase SQL Editor 运行 sql/admin-upgrade-function.sql'
      }, { status: 500 })
    }

    // 自动生成打赏记录
    if (level !== 'regular') {
      try {
        const amount = level === 'diamond' ? 99 : 9.9
        // 用 service_role key 插入打赏记录，降级到 server client
        const donor = process.env.SUPABASE_SERVICE_ROLE_KEY
          ? createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } })
          : supabase
        const { data: target } = await donor.from('profiles').select('username, display_name').eq('id', user_id).single()
        await donor.from('donations').insert({
          user_id,
          username: target?.display_name || target?.username || '未知',
          amount,
          plan: level,
          status: 'completed'
        }).catch(() => {})
      } catch (_) { /* 打赏记录非关键，忽略 */ }
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
