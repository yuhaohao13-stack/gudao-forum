import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ checked_in: false, total_points: 0 })
  }

  // 获取今天的签到状态
  const today = new Date().toISOString().split('T')[0]
  const { data: checkin } = await supabase
    .from('daily_checkins')
    .select('id')
    .eq('user_id', user.id)
    .eq('checkin_date', today)
    .maybeSingle()

  // 获取总积分
  const { data: profile } = await supabase
    .from('profiles')
    .select('points, total_checkins')
    .eq('id', user.id)
    .single()

  return NextResponse.json({
    checked_in: !!checkin,
    total_points: profile?.points || 0,
    total_checkins: profile?.total_checkins || 0,
  })
}
