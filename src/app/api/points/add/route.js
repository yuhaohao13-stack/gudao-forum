import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const POINTS_RULES = {
  post: 50,
  download: -500,
  content_view: -500,
}

export async function POST(request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ success: false, message: '请先登录' }, { status: 401 })
  }

  const { type, reference_id } = await request.json()

  if (!type || !POINTS_RULES[type]) {
    return NextResponse.json({ success: false, message: '无效的操作类型' }, { status: 400 })
  }

  const amount = POINTS_RULES[type]

  // 获取当前积分
  const { data: profile } = await supabase
    .from('profiles')
    .select('points')
    .eq('id', user.id)
    .single()

  const currentPoints = profile?.points || 0

  // 如果是扣分，检查积分够不够
  if (amount < 0 && currentPoints + amount < 0) {
    return NextResponse.json({
      success: false,
      message: `积分不足，当前 ${currentPoints} 分，需要 ${Math.abs(amount)} 分`,
      current_points: currentPoints,
      required: Math.abs(amount),
    })
  }

  const newPoints = currentPoints + amount
  const { error } = await supabase
    .from('profiles')
    .update({ points: newPoints })
    .eq('id', user.id)

  if (error) {
    return NextResponse.json({ success: false, message: '操作失败: ' + error.message }, { status: 500 })
  }

  // 记录交易
  const descriptions = {
    post: '发帖奖励 +50积分',
    download: '下载资源 -500积分',
    content_view: '查看隐藏内容 -500积分',
  }

  await supabase
    .from('points_transactions')
    .insert({
      user_id: user.id,
      amount,
      type,
      description: descriptions[type],
      reference_id: reference_id || null,
    })

  return NextResponse.json({
    success: true,
    amount,
    new_points: newPoints,
    description: descriptions[type],
  })
}
