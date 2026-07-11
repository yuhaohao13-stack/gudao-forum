/**
 * 古道论坛 — 分布式速率限制（Supabase 持久化版本）
 * 
 * 替代原本中间件中的内存 Map，解决 Vercel Edge 多实例不共享的问题。
 * 核心依赖 Supabase RPC 函数的原子操作（SELECT ... FOR UPDATE + UPSERT）。
 * 
 * 用法：
 *   import { createRateLimiter } from '@/lib/rate-limit'
 *   const limiter = createRateLimiter(supabase)
 *   const result = await limiter.check('ip:path', 30, 60000)
 */

import { createClient } from '@supabase/supabase-js'

/**
 * 创建速率限制器实例
 * @param {Object} supabase - Supabase 客户端实例
 * @returns {Object} { check, getClientIp, middleware }
 */
export function createRateLimiter(supabase) {
  /**
   * 检查是否超出速率限制
   * @param {string} key - 唯一标识（如 "ip:/api/broadcast"）
   * @param {number} maxAttempts - 窗口内最大请求数
   * @param {number} windowMs - 时间窗口（毫秒）
   * @returns {Promise<{allowed: boolean, remaining: number, retryAfter: number}>}
   */
  async function check(key, maxAttempts = 30, windowMs = 60000) {
    try {
      const { data, error } = await supabase.rpc('rate_limit_check', {
        p_key: key,
        p_max_attempts: maxAttempts,
        p_window_ms: windowMs,
      })

      if (error) {
        console.error('[rate-limit] RPC error:', error.message)
        // RPC 失败时放行（fail open），避免误杀正常用户
        return { allowed: true, remaining: maxAttempts, retryAfter: 0 }
      }

      return data
    } catch (err) {
      console.error('[rate-limit] Unexpected error:', err)
      return { allowed: true, remaining: maxAttempts, retryAfter: 0 }
    }
  }

  /**
   * 从请求中提取客户端 IP
   * @param {Request} request
   * @returns {string}
   */
  function getClientIp(request) {
    // Vercel 优先用 x-vercel-forwarded-for / x-forwarded-for
    const forwarded = request.headers.get('x-forwarded-for')
      || request.headers.get('x-real-ip')
      || 'unknown'
    return forwarded.split(',')[0].trim()
  }

  return { check, getClientIp }
}
