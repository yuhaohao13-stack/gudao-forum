/**
 * 古道论坛 — 安全与内容审查模块
 * 包含：敏感词过滤、XSS 防护、输入校验、速率限制
 */

// ==========================================
// 1. XSS 防护 — HTML 标签转义
// ==========================================
export function escapeHtml(text) {
  if (!text) return text
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
  }
  return text.replace(/[&<>"']/g, match => map[match])
}

// ==========================================
// 2. 敏感词库
// ==========================================
const BAD_WORDS = [
  // 骂人/侮辱
  '傻逼', '草泥马', '操你妈', '日你妈', '去死', '废物', '垃圾', '狗屎',
  '脑残', '智障', '白痴', '滚蛋', '吃屎', '放屁', '他妈',
  '傻叉', '煞笔', '操你', '妈的', '特么', '尼玛', '卧槽', 'cnm', 'nmsl', 'wcnm',
  // 种族/地域歧视
  '黑鬼', '白皮猪', '黄皮狗', '支那', '台巴子', '阿三', '棒子',
  '鬼子', '蛮子', '贱种',
  // 色情/淫秽
  '色情', '淫秽', '裸聊', '约炮', '一夜情', '援交', '卖淫',
  '嫖娼', '成人片', '三级片', '色图', '裸照',
  // 暴力/威胁
  '杀人', '砍死', '弄死你', '炸了', '灭门',
  // 诈骗/广告
  '兼职日结', '加微信', '扫码', '刷单',
]

const STRICT_CHECK = [
  '傻逼', '草泥马', '操你妈', '日你妈', '去死吧', '吃屎',
  '黑鬼', '支那', '色情', '约炮', '裸聊', '卖淫', '杀人',
]

// ==========================================
// 3. 内容检查
// ==========================================
export function checkContent(text, strict = false) {
  if (!text) return { pass: true, word: null }
  const words = strict ? STRICT_CHECK : BAD_WORDS
  const lower = text.toLowerCase()
  for (const word of words) {
    if (lower.includes(word.toLowerCase())) {
      return { pass: false, word }
    }
  }
  return { pass: true, word: null }
}

export function filterContent(text) {
  if (!text) return text
  let filtered = text
  for (const word of BAD_WORDS) {
    const regex = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    filtered = filtered.replace(regex, '***')
  }
  return filtered
}

// ==========================================
// 4. 输入校验
// ==========================================
export function validateInput(text, maxLength = 10000) {
  if (!text || typeof text !== 'string') {
    return { valid: false, error: '输入内容无效' }
  }
  const trimmed = text.trim()
  if (trimmed.length === 0) {
    return { valid: false, error: '内容不能为空' }
  }
  if (trimmed.length > maxLength) {
    return { valid: false, error: `内容不能超过 ${maxLength} 个字符` }
  }
  // 防止超长无空格文本（垃圾信息特征）
  const noSpaceRun = trimmed.split(/\s+/).reduce((max, word) => Math.max(max, word.length), 0)
  if (noSpaceRun > 500) {
    return { valid: false, error: '内容包含超长无空格文本，请检查' }
  }
  return { valid: true, error: null }
}

// ==========================================
// 5. 密码强度校验
// ==========================================
export function validatePassword(password) {
  if (!password) return { valid: false, error: '密码不能为空' }
  if (password.length < 8) return { valid: false, error: '密码至少 8 位' }
  if (password.length > 128) return { valid: false, error: '密码不能超过 128 位' }
  if (!/[A-Za-z]/.test(password)) return { valid: false, error: '密码需要包含字母' }
  if (!/[0-9]/.test(password)) return { valid: false, error: '密码需要包含数字' }
  return { valid: true, error: null }
}

// ==========================================
// 6. 速率限制（内存版）
// ==========================================
const rateLimitStore = {}

export function checkRateLimit(key, maxAttempts = 5, windowMs = 60000) {
  const now = Date.now()
  const entry = rateLimitStore[key]

  if (!entry || now - entry.windowStart > windowMs) {
    rateLimitStore[key] = { count: 1, windowStart: now }
    return { allowed: true, remaining: maxAttempts - 1 }
  }

  if (entry.count >= maxAttempts) {
    const retryAfter = Math.ceil((windowMs - (now - entry.windowStart)) / 1000)
    return { allowed: false, remaining: 0, retryAfter }
  }

  entry.count++
  return { allowed: true, remaining: maxAttempts - entry.count }
}

// 定期清理过期条目（每5分钟）
setInterval(() => {
  const now = Date.now()
  for (const key in rateLimitStore) {
    if (now - rateLimitStore[key].windowStart > 300000) {
      delete rateLimitStore[key]
    }
  }
}, 300000)

// ==========================================
// 7. 图片上传限制
// ==========================================
export const IMAGE_CONFIG = {
  maxSize: 5 * 1024 * 1024,
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxCount: 3,
  bucket: 'forum-images',
}

export function validateImage(file) {
  if (!file) return { valid: false, error: '请选择图片' }
  if (file.size > IMAGE_CONFIG.maxSize) {
    return { valid: false, error: '图片不能超过 5MB' }
  }
  if (!IMAGE_CONFIG.allowedTypes.includes(file.type)) {
    return { valid: false, error: '仅支持 JPG/PNG/GIF/WebP 格式' }
  }
  return { valid: true, error: null }
}
