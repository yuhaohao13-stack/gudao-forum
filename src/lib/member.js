// 会员权限通用工具函数

// 技术帖分类 slug
export const TECH_CATEGORY_SLUG = 'tech'

// 检查技术帖查看权限
export function canViewTech(user, profile) {
  if (!user) return { allowed: false, reason: 'login' }
  const level = profile?.membership_level || 'regular'
  if (level === 'diamond') return { allowed: true, unlimited: true }
  if (level === 'gold') {
    const max = profile?.gold_tech_views ?? 10
    const used = profile?.tech_views_used ?? 0
    if (used < max) return { allowed: true, remaining: max - used }
    return { allowed: false, reason: 'exhausted' }
  }
  return { allowed: false, reason: 'upgrade' }
}

// 检查音乐下载权限
export function canDownloadMusic(user, profile) {
  if (!user) return { allowed: false, reason: 'login' }
  const level = profile?.membership_level || 'regular'
  if (level === 'diamond') return { allowed: true, unlimited: true }
  if (level === 'gold') {
    const max = profile?.gold_music_downloads ?? 10
    const used = profile?.music_downloads_used ?? 0
    if (used < max) return { allowed: true, remaining: max - used }
    return { allowed: false, reason: 'exhausted' }
  }
  return { allowed: false, reason: 'upgrade' }
}

// 检查帖子置顶权限
export function canPinThread(user, profile) {
  if (!user) return { allowed: false, reason: 'login' }
  const level = profile?.membership_level || 'regular'
  if (level === 'diamond') return { allowed: true, unlimited: true }
  if (level === 'gold') {
    const max = profile?.gold_thread_pins ?? 10
    const used = profile?.thread_pins_used ?? 0
    if (used < max) return { allowed: true, remaining: max - used }
    return { allowed: false, reason: 'exhausted' }
  }
  return { allowed: false, reason: 'upgrade' }
}

// 获取升级提示文案
export function getUpgradeInfo(reason, lang = 'zh') {
  if (reason === 'login') return {
    title: '🔒 请先登录',
    desc: '登录后才能查看完整内容',
    btn: '去登录',
    link: '/login'
  }
  if (reason === 'exhausted') return {
    title: '⛔ 次数已用完',
    desc: '黄金会员次数已用完，升级钻石会员即可无限次使用',
    btn: '升级钻石会员',
    link: '/lottery/upgrade'
  }
  return {
    title: '💎 需要升级会员',
    desc: '升级黄金/钻石会员即可解锁此功能',
    btn: '了解会员权益',
    link: '/lottery/upgrade'
  }
}

// 技术帖锁定提示弹窗组件（内联样式版，给普通JSX用）
export function TechLockOverlay({ show, onClose, reason, onAction }) {
  if (!show) return null
  const info = getUpgradeInfo(reason)
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)', padding: '1rem',
    }} onClick={onClose}>
      <div style={{
        backgroundColor: '#fff', borderRadius: '1rem', maxWidth: '22rem',
        width: '100%', padding: '2rem', textAlign: 'center',
        animation: 'scaleIn 0.25s ease-out both',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🔒</div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.5rem' }}>{info.title}</h3>
        <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1.5rem', lineHeight: 1.5 }}>{info.desc}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <a href={info.link}
            style={{
              display: 'block', padding: '0.7rem', borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, #b45309, #d97706)',
              color: '#fff', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none',
            }}>{info.btn}</a>
          {reason !== 'login' && (
            <a href="/lottery/upgrade"
              style={{
                display: 'block', padding: '0.7rem', borderRadius: '0.75rem',
                border: '1px solid #eee8dc', color: '#666', fontSize: '0.8rem',
                textDecoration: 'none',
              }}>打赏升级会员 →</a>
          )}
          <button onClick={onClose}
            style={{
              background: 'none', border: 'none', fontSize: '0.75rem',
              color: '#999', cursor: 'pointer', padding: '0.5rem',
            }}>先看看</button>
        </div>
      </div>
    </div>
  )
}
