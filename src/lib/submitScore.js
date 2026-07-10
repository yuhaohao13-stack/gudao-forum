'use client'

import { createClient } from '@/lib/supabase/client'

/**
 * 提交游戏高分（upsert：每人每游戏只保留最高分）
 * @param {string} gameSlug - 游戏标识
 * @param {number} score - 本次得分
 * @returns {Promise<{success: boolean, isNewHigh: boolean, error?: string}>}
 */
export async function submitScore(gameSlug, score) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, isNewHigh: false, error: '未登录' }

  const username = user.user_metadata?.display_name || user.email?.split('@')[0] || '匿名'

  // 查已有分数
  const { data: existing } = await supabase
    .from('game_scores')
    .select('score')
    .eq('game_slug', gameSlug)
    .eq('user_id', user.id)
    .single()

  if (existing && score <= existing.score) {
    return { success: true, isNewHigh: false } // 不更新，没破纪录
  }

  // 插入或更新
  const { error } = await supabase
    .from('game_scores')
    .upsert({
      game_slug: gameSlug,
      user_id: user.id,
      username,
      score,
    }, { onConflict: 'game_slug, user_id' })

  if (error) return { success: false, isNewHigh: false, error: error.message }

  return { success: true, isNewHigh: !existing }
}

/**
 * 获取某个游戏的高分榜（前10）
 * @param {string} gameSlug
 * @returns {Promise<Array<{username: string, score: number}>>}
 */
export async function getLeaderboard(gameSlug) {
  const supabase = createClient()
  const { data } = await supabase
    .from('game_scores')
    .select('username, score')
    .eq('game_slug', gameSlug)
    .order('score', { ascending: false })
    .limit(10)
  return data || []
}
