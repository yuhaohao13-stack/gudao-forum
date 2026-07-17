'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, X } from 'lucide-react'

// 联系信息
const WECHAT_ID = 'crazy-repair'
const EMAIL_QQ = '994730969@qq.com'
const EMAIL_GMAIL = 'yuhaohao13@gmail.com'

export default function FloatingButtons() {
  const [showContact, setShowContact] = useState(false)
  const [copied, setCopied] = useState('')

  // 微信：复制+显示已复制（不弹窗）
  const handleWechat = () => {
    const val = WECHAT_ID
    const doCopy = () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(val)
      }
      return new Promise((resolve, reject) => {
        try {
          const ta = document.createElement('textarea')
          ta.value = val
          ta.style.position = 'fixed'
          ta.style.opacity = '0'
          document.body.appendChild(ta)
          ta.select()
          document.execCommand('copy')
          document.body.removeChild(ta)
          resolve()
        } catch(e) { reject(e) }
      })
    }
    doCopy().then(() => {
      setCopied('wechat')
      setTimeout(() => setCopied(''), 3000)
    }).catch(() => {})
  }

  const btnBase = {
    display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem',
    borderRadius: '0.65rem', border: '1px solid #eee8dc', width: '100%',
    cursor: 'pointer', background: 'none', fontSize: '0.8rem', color: '#1a1a1a',
    textDecoration: 'none',
    transition: 'all 0.15s ease',
  }
  const iconCircle = (bg) => ({
    width: '2rem', height: '2rem', borderRadius: '50%',
    backgroundColor: bg, display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '1rem', flexShrink: 0,
  })

  return (
    <>
      {/* ===== 悬浮按钮 ===== */}
      <div style={{
        position: 'fixed', bottom: '7rem', right: '1.25rem',
        zIndex: 999, display: 'flex', flexDirection: 'column',
        gap: '0.75rem', alignItems: 'center',
      }}>
        {/* 联系我 */}
        <button onClick={() => setShowContact(true)}
          style={{
            width: '3.25rem', height: '3.25rem', borderRadius: '50%',
            backgroundColor: '#2563eb', color: '#fff', border: 'none',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', transition: 'all 0.2s ease',
          }} title="联系Crazy维修">
          <MessageCircle size={22} />
        </button>
      </div>



      {/* ===== 联系弹窗 ===== */}
      {showContact && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)', padding: '1rem',
        }} onClick={() => setShowContact(false)}>
          <div style={{
            backgroundColor: '#fff', borderRadius: '0.875rem',
            maxWidth: '20rem', width: '100%', padding: '1rem',
            animation: 'scaleIn 0.25s ease-out both',
            position: 'relative',
          }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowContact(false)} style={{
              position: 'absolute', top: '0.5rem', right: '0.5rem',
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#999', padding: '0.2rem',
            }}><X size={15} /></button>

            <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🔧</div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1a1a1a' }}>Crazy维修 — 联系我们</h3>
              <p style={{ fontSize: '0.65rem', color: '#999', marginTop: '0.2rem' }}>威海手机电脑维修 · 2007年至今</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem' }}>
              {/* 💚 微信 */}
              <button onClick={handleWechat} style={btnBase}>
                <div style={iconCircle('#07c160')}><MessageCircle size={16} color="#fff" /></div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>💚 微信 <span style={{ fontSize: '0.5rem', color: '#999', fontWeight: 400 }}>· 点击复制去添加好友</span></div>
                  <div style={{ fontSize: '0.65rem', color: '#666' }}>{copied === 'wechat' ? '✅ 已复制' : WECHAT_ID}</div>
                </div>
                <span style={{ color: '#07c160', fontSize: '0.8rem' }}>→</span>
              </button>

              {/* QQ邮箱 */}
              <button onClick={() => {
                navigator.clipboard.writeText(EMAIL_QQ).then(() => { setCopied('qq'); setTimeout(() => setCopied(''), 2500) }).catch(() => {})
              }} style={btnBase}>
                <div style={iconCircle('#ea4335')}>📧</div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>📧 QQ邮箱 <span style={{ fontSize: '0.5rem', color: '#999', fontWeight: 400 }}>· 点击复制去发邮件</span></div>
                  <div style={{ fontSize: '0.65rem', color: '#666' }}>{copied === 'qq' ? '✅ 已复制' : '994730969@qq.com'}</div>
                </div>
                <span style={{ color: '#ea4335', fontSize: '0.8rem' }}>→</span>
              </button>

              {/* 谷歌邮箱 */}
              <button onClick={() => {
                navigator.clipboard.writeText(EMAIL_GMAIL).then(() => { setCopied('gmail'); setTimeout(() => setCopied(''), 2500) }).catch(() => {})
              }} style={btnBase}>
                <div style={iconCircle('#4285F4')}>📧</div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>📧 谷歌邮箱 <span style={{ fontSize: '0.5rem', color: '#999', fontWeight: 400 }}>· 点击复制去发邮件</span></div>
                  <div style={{ fontSize: '0.65rem', color: '#666' }}>{copied === 'gmail' ? '✅ 已复制' : 'yuhaohao13@gmail.com'}</div>
                </div>
                <span style={{ color: '#4285F4', fontSize: '0.8rem' }}>→</span>
              </button>

              {/* 官方网站 */}
              <a href="https://www.crazy-repair.com" target="_blank" rel="noopener" style={btnBase}>
                <div style={iconCircle('#2563eb')}>🔧</div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>官方网站</div>
                  <div style={{ fontSize: '0.65rem', color: '#666' }}>www.crazy-repair.com</div>
                </div>
                <span style={{ color: '#2563eb', fontSize: '0.8rem' }}>→</span>
              </a>

              {/* 抖音 */}
              <a href="https://v.douyin.com/NvUr5C82ZDM/" target="_blank" rel="noopener" style={btnBase}>
                <div style={{
                  width: '2rem', height: '2rem', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00f2fe, #fe2c55)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="#fff">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.35 0 .69.06 1.01.18V8.48a6.34 6.34 0 0 0-1.01-.08C5.9 8.4 3 11.3 3 14.86c0 3.56 2.9 6.46 6.46 6.46 3.56 0 6.46-2.9 6.46-6.46V9.33a8.28 8.28 0 0 0 4.67 1.4v-3.4a4.84 4.84 0 0 1-1-.64z"/>
                  </svg>
                </div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>抖音</div>
                  <div style={{ fontSize: '0.65rem', color: '#666' }}>@Crazy维修 浩哥维修实录</div>
                </div>
                <span style={{ color: '#fe2c55', fontSize: '0.8rem' }}>→</span>
              </a>

              {/* 到店地址 */}
              <div style={btnBase}>
                <div style={iconCircle('#f59e0b')}>📍</div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>📍 到店维修</div>
                  <div style={{ fontSize: '0.65rem', color: '#666' }}>威海环翠区西门31号</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
