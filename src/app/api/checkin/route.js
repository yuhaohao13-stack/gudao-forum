import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/checkin
 * 每日签到
 * 登录用户每日可签到一次，获得积分
 */
export async function POST(request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    // 获取今日日期（东八区）
    const now = new Date()
    const today = now.toISOString().split('T')[0] // YYYY-MM-DD

    // 检查今日是否已签到
    const { data: existingCheckin } = await supabase
      .from('daily_checkins')
      .select('id')
      .eq('user_id', user.id)
      .eq('checkin_date', today)
      .maybeSingle()

    if (existingCheckin) {
      return NextResponse.json({
        success: false,
        message: '今日已签到'
      })
    }

    // 插入签到记录
    const pointsEarned = 10
    const { error: checkinError } = await supabase
      .from('daily_checkins')
      .insert({
        user_id: user.id,
        checkin_date: today,
        points_earned: pointsEarned
      })

    if (checkinError) {
      console.error('签到记录插入失败:', checkinError)
      return NextResponse.json({ error: '签到失败' }, { status: 500 })
    }

    // 更新 profiles：积分 +10，签到次数 +1，记录最后签到日期
    const { data: profile } = await supabase
      .from('profiles')
      .select('points, total_checkins')
      .eq('id', user.id)
      .single()

    const newPoints = (profile?.points || 0) + pointsEarned
    const newTotalCheckins = (profile?.total_checkins || 0) + 1

    await supabase
      .from('profiles')
      .update({
        points: newPoints,
        total_checkins: newTotalCheckins,
        last_checkin_date: today
      })
      .eq('id', user.id)

    // 记录积分交易
    await supabase
      .from('points_transactions')
      .insert({
        user_id: user.id,
        amount: pointsEarned,
        type: 'checkin',
        description: `每日签到 +${pointsEarned}分`
      })

    // 检查月度签到奖励（本月签到天数 >= 当月天数）
    const year = now.getFullYear()
    const month = now.getMonth() + 1 // JavaScript month is 0-indexed

    const { count: monthlyCheckinCount, error: countError } = await supabase
      .from('daily_checkins')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('checkin_date', `${year}-${String(month).padStart(2, '0')}-01`)
      .lt('checkin_date', `${month === 12 ? year + 1 : year}-${String(month === 12 ? 1 : month + 1).padStart(2, '0')}-01`)

    let monthlyBonus = 0
    if (!countError) {
      const daysInMonth = new Date(year, month, 0).getDate()
      if (monthlyCheckinCount >= daysInMonth) {
        monthlyBonus = 100
      }
    }

    // 计算连续签到天数
    let streakDays = 1 // 今天已签到
    const { data: recentCheckins } = await supabase
      .from('daily_checkins')
      .select('checkin_date')
      .eq('user_id', user.id)
      .order('checkin_date', { ascending: false })
      .limit(60)

    if (recentCheckins && recentCheckins.length > 1) {
      for (let i = 1; i < recentCheckins.length; i++) {
        const prevDate = new Date(recentCheckins[i - 1].checkin_date)
        const currDate = new Date(recentCheckins[i].checkin_date)
        const diffMs = prevDate.getTime() - currDate.getTime()
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
        if (diffDays === 1) {
          streakDays++
        } else {
          break
        }
      }
    }

    // 连续签到奖励
    const STREAK_BONUS = {
      7: 20,
      15: 50,
      30: 100,
    }
    let streakBonus = 0
    if (STREAK_BONUS[streakDays]) {
      streakBonus = STREAK_BONUS[streakDays]
    }

    const totalBonus = monthlyBonus + streakBonus
    const finalPoints = newPoints + totalBonus

    if (totalBonus > 0) {
      await supabase
        .from('profiles')
        .update({ points: finalPoints })
        .eq('id', user.id)

      if (monthlyBonus > 0) {
        await supabase
          .from('points_transactions')
          .insert({
            user_id: user.id,
            amount: monthlyBonus,
            type: 'checkin_bonus',
            description: `月度签满奖励 +${monthlyBonus}分（本月已签到 ${monthlyCheckinCount}/天）`
          })
      }

      if (streakBonus > 0) {
        await supabase
          .from('points_transactions')
          .insert({
            user_id: user.id,
            amount: streakBonus,
            type: 'checkin_bonus',
            description: `连续签到${streakDays}天奖励 +${streakBonus}分 🔥`
          })
      }
    }

    return NextResponse.json({
      success: true,
      points_earned: pointsEarned,
      streak_days: streakDays,
      streak_bonus: streakBonus,
      monthly_bonus: monthlyBonus,
      total_points: finalPoints
    })
  } catch (e) {
    console.error('签到接口异常:', e)
    return NextResponse.json({ error: '服务器错误: ' + e.message }, { status: 500 })
  }
}
