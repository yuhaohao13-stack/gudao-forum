import { updateSession } from '@/lib/supabase/middleware'

// ─── 简单的内存速率限制（Vercel Edge 上每个实例独立） ───
// 在生产环境建议配合 Vercel WAF / Supabase RLS 做更严格的限制
const rateLimitMap = new Map()

const RATE_LIMIT = {
  windowMs: 60_000,          // 1 分钟窗口
  maxRequests: {
    default: 60,             // 普通路径：每分钟最多 60 次
    api: 30,                 // API 路径：每分钟最多 30 次
    auth: 10,                // 登录/注册：每分钟最多 10 次
  },
}

function getRateLimitKey(request) {
  // 优先用 IP，其次用 x-forwarded-for
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  const path = request.nextUrl.pathname
  return `${ip}:${path}`
}

function checkRateLimit(key, limit) {
  const now = Date.now()
  const record = rateLimitMap.get(key)

  if (!record || now - record.windowStart > RATE_LIMIT.windowMs) {
    rateLimitMap.set(key, { windowStart: now, count: 1 })
    return { allowed: true, remaining: limit - 1 }
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 }
  }

  record.count++
  return { allowed: true, remaining: limit - record.count }
}

// 定期清理过期记录（防止内存泄漏）
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, record] of rateLimitMap) {
      if (now - record.windowStart > RATE_LIMIT.windowMs) {
        rateLimitMap.delete(key)
      }
    }
  }, 60_000)
}

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // ─── 速率限制 ───
  // 静态资源跳过限流
  const isStatic = /\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|json|xml|txt)$/.test(pathname)
  if (!isStatic) {
    let limit = RATE_LIMIT.maxRequests.default

    if (pathname.startsWith('/api/')) {
      limit = RATE_LIMIT.maxRequests.api
    } else if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
      limit = RATE_LIMIT.maxRequests.auth
    }

    const key = getRateLimitKey(request)
    const result = checkRateLimit(key, limit)

    if (!result.allowed) {
      return new Response('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': '60',
          'Content-Type': 'text/plain',
        },
      })
    }
  }

  // ─── Supabase 认证 session 刷新 ───
  const supabaseResponse = await updateSession(request)

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
