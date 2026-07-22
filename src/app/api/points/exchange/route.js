import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const EXCHANGE_COSTS = {
  gold: 5000,
  diamond: 20000
}

/**
 * POST /api/points/exchange
 * 积分兑换会员等级
 * Body: { target: 'gold' | 'diamond' }
 * gold = 5000分, diamond = 20000分
 */
export async function POST(request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    const { target } = await request.json()
    if (!target || !EXCHANGE_COSTS[target]) {
      return NextResponse.json({ error: '无效的兑换目标，可选: gold, diamond' }, { status: 400 })
    }

    const cost = EXCHANGE_COSTS[target]

    // 获取用户当前积分
    const { data: profile } = await supabase
      .from('profiles')
      .select('points, membership_level')
      .eq('id', user.id)
      .single()

    const currentPoints = profile?.points || 0

    // 检查积分是否足够
    if (currentPoints < cost) {
      const shortage = cost - currentPoints
      return NextResponse.json({
        success: false,
        message: `积分不足，还差${shortage}分。联系管理员充值打赏：黄金会员9.9元，钻石会员99元`
      })
    }

    // 检查会员等级：已持有同等级或更高级别则禁止兑换
    const currentLevel = profile?.membership_level || 'regular'
    if (currentLevel === 'diamond') {
      return NextResponse.json({
        success: false,
        message: '您已经是钻石会员，无需重复兑换'
      })
    }
    if (target === 'gold' && currentLevel === 'gold') {
      return NextResponse.json({
        success: false,
        message: '您已经是黄金会员，无需重复兑换'
      })
    }

    const remainingPoints = currentPoints - cost

    // 扣分 + 升级会员 + 重置已用次数
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        points: remainingPoints,
        membership_level: target,
        tech_views_used: 0,
        music_downloads_used: 0,
        thread_pins_used: 0,
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('积分兑换更新失败:', updateError)
      return NextResponse.json({ error: '兑换失败' }, { status: 500 })
    }

    // 记录交易
    const levelName = target === 'gold' ? '黄金会员' : '钻石会员'
    await supabase
      .from('points_transactions')
      .insert({
        user_id: user.id,
        amount: -cost,
        type: 'exchange_deduct',
        description: `兑换${levelName}，扣除 ${cost} 积分`
      })

    return NextResponse.json({
      success: true,
      remaining_points: remainingPoints,
      membership_level: target
    })
  } catch (e) {
    console.error('积分兑换接口异常:', e)
    return NextResponse.json({ error: '服务器错误: ' + e.message }, { status: 500 })
  }
}
