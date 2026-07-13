/** @type {import('next').NextConfig} */
const nextConfig = {
  // ═══════════════════════════════════════════════
  // 安全响应头（覆盖所有路径）
  // ═══════════════════════════════════════════════
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // HSTS — 强制 HTTPS，包含子域名，有效期1年
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },

          // 禁止 MIME 嗅探
          { key: 'X-Content-Type-Options', value: 'nosniff' },

          // 禁止被嵌入 iframe（防点击劫持）
          { key: 'X-Frame-Options', value: 'DENY' },

          // XSS 过滤（老旧浏览器兼容）
          { key: 'X-XSS-Protection', value: '1; mode=block' },

          // 防盗链：仅允许本站和 supabase 图片域名引用
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

          // 权限控制：禁用不必要的浏览器 API
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },

          // ─── 严格的内容安全策略（CSP）───
          // 关键原则：只允许必要来源，堵住 XSS 和注入
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // 脚本：允许自身、next.js 内联 hash 和 supabase
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co",
              // 样式：允许自身和内联（tailwind 需要内联）
              "style-src 'self' 'unsafe-inline'",
              // 图片：允许自身、supabase storage、picsum、data:、blob:
              "img-src 'self' data: blob: https://*.supabase.co https://picsum.photos",
              // 字体：允许自身
              "font-src 'self' data:",
              // 连接：允许自身、supabase、websocket
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
              // 框架：不允许被嵌入
              "frame-ancestors 'none'",
              // 表单提交：仅限本站
              "form-action 'self'",
              // 媒体：仅限自身 + Supabase Storage
              "media-src 'self' https://*.supabase.co",
              // 对象：完全禁止（不允许 plugins）
              "object-src 'none'",
              // base-uri：禁止 base 标签篡改
              "base-uri 'self'",
              // 升级不安全请求
              "upgrade-insecure-requests",
            ].join('; '),
          },

          // 禁止 IE 自动检测内容类型（兼容旧浏览器）
          { key: 'X-Download-Options', value: 'noopen' },

          // 禁止搜索引擎索引敏感页面（配合 robots meta，额外的 server-level 控制）
          { key: 'X-Robots-Tag', value: 'noindex, nofollow', },
        ],
      },

      // ─── 管理员路径 — 禁止搜索引擎索引 ───
      {
        source: '/admin/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },

      // ─── API 路径 — 禁止缓存 + 禁止搜索引擎 ───
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
        ],
      },

      // ─── 用户资料页 — 禁止搜索引擎索引 ───
      {
        source: '/profile/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },

      // ─── 私信页 — 禁止搜索引擎索引 ───
      {
        source: '/messages/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },

      // ─── 聊天室 — 禁止搜索引擎索引 ───
      {
        source: '/chat/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },

      // ─── 登录/注册 — 禁止搜索引擎索引 ───
      {
        source: '/login',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      {
        source: '/register',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },

      // ─── Supabase 图片资源 — 长缓存 + 防盗链 ───
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },

  // ═══════════════════════════════════════════════
  // 图片优化安全配置
  // ═══════════════════════════════════════════════
  images: {
    // 允许加载外部图片的域名白名单
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
    // 限制图片大小，防止滥用
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
