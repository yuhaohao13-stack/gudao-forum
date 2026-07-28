import { updateSession } from '@/lib/supabase/middleware'

// 轻型内存限流（第一道防线 — 捕获同一实例内的突发请求）
// 跨实例的精确限流由各 API route 内调用 Supabase RPC 完成
const rateLimitMap = new Map()

const RATE_LIMIT = {
  windowMs: 60_000,
  maxRequests: { default: 120, api: 60, auth: 20, },
}

function getRateLimitKey(request) {
  const forwarded = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  return `${forwarded.split(',')[0].trim()}:${request.nextUrl.pathname}`
}

function checkLocalRateLimit(key, limit) {
  const now = Date.now()
  const record = rateLimitMap.get(key)
  if (!record || now - record.windowStart > RATE_LIMIT.windowMs) {
    rateLimitMap.set(key, { windowStart: now, count: 1 })
    return { allowed: true, remaining: limit - 1 }
  }
  if (record.count >= limit) return { allowed: false, remaining: 0 }
  record.count++
  return { allowed: true, remaining: limit - record.count }
}

// 定期清理
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, record] of rateLimitMap) {
      if (now - record.windowStart > RATE_LIMIT.windowMs) rateLimitMap.delete(key)
    }
  }, 120_000)
}

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // 静态资源跳过
  const isStatic = /\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|json|xml|txt)$/.test(pathname)
  if (!isStatic) {
    let limit = RATE_LIMIT.maxRequests.default
    if (pathname.startsWith('/api/')) limit = RATE_LIMIT.maxRequests.api
    else if (pathname === '/login' || pathname === '/register') limit = RATE_LIMIT.maxRequests.auth

    // 内存限流（第一道防线）
    const key = getRateLimitKey(request)
    const { allowed } = checkLocalRateLimit(key, limit)

    if (!allowed) {
      return new Response('429 Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Reset': String(Math.ceil(Date.now() / 1000) + 60),
          'Cache-Control': 'no-store',
        },
      })
    }
  }

  // Supabase session 刷新
  return await updateSession(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest|sw).*)'],
}
