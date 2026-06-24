/**
 * 内容审查 — 不良言论过滤
 */

// 敏感词库（包含骂人、歧视、色情等）
const BAD_WORDS = [
  // 骂人/侮辱
  '傻逼', '草泥马', '操你妈', '日你妈', '去死', '废物', '垃圾', '狗屎',
  '脑残', '智障', '白痴', '傻逼', '滚蛋', '吃屎', '放屁', '他妈',
  '傻叉', '煞笔', '操你', '妈的', '特么', '尼玛', '卧槽',
  // 种族/地域歧视
  '黑鬼', '白皮猪', '黄皮狗', '支那', '台巴子', '阿三', '棒子',
  '鬼子', '蛮子', '贱种',
  // 色情/淫秽
  '色情', '淫秽', '裸聊', '约炮', '一夜情', '援交', '卖淫',
  '嫖娼', '成人片', 'AV', '三级片', '色图', '裸照',
  // 暴力/威胁
  '杀人', '砍死', '弄死你', '炸了', '灭门',
  // 诈骗/广告
  '兼职日结', '加微信', '扫码', '刷单',
]

// 宽松模式 — 用于标题和内容检查
const STRICT_CHECK = [
  '傻逼', '草泥马', '操你妈', '日你妈', '去死吧', '吃屎',
  '黑鬼', '支那', '色情', '约炮', '裸聊', '卖淫', '杀人',
]

/**
 * 检查文本是否包含不良内容
 * @param {string} text - 要检查的文本
 * @param {boolean} strict - 是否严格模式
 * @returns {{ pass: boolean, word: string|null }}
 */
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

/**
 * 过滤文本中的敏感词（替换为 ***）
 */
export function filterContent(text) {
  if (!text) return text
  let filtered = text
  for (const word of BAD_WORDS) {
    const regex = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    filtered = filtered.replace(regex, '***')
  }
  return filtered
}

/**
 * 图片上传限制
 */
export const IMAGE_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxCount: 3, // 每帖最多 3 张
  bucket: 'forum-images',
}

export function validateImage(file) {
  if (file.size > IMAGE_CONFIG.maxSize) {
    return { valid: false, error: '图片不能超过 5MB' }
  }
  if (!IMAGE_CONFIG.allowedTypes.includes(file.type)) {
    return { valid: false, error: '仅支持 JPG/PNG/GIF/WebP 格式' }
  }
  return { valid: true, error: null }
}
