'use client'

import { useState, useEffect } from 'react'
import { Heart, MessageCircle, X, Phone, MessageSquare } from 'lucide-react'

// 联系信息
const WECHAT_ID = 'crazy-repair'
const PHONE_CHINA = '+8613573735550'
const PHONE_SG = '+6596146709'
const QR_URL = 'https://www.crazy-repair.com/images/wechat-qr.jpg'

export default function FloatingButtons() {
  const [showDonateTip, setShowDonateTip] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [showWechat, setShowWechat] = useState(false)
  const [copied, setCopied] = useState(false)
  const [savingQr, setSavingQr] = useState(false)
  const [qrSaved, setQrSaved] = useState(false)

  useEffect(() => {
    if (showDonateTip) {
      const timer = setTimeout(() => setShowDonateTip(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showDonateTip])

  const handleDonate = () => {
    window.dispatchEvent(new CustomEvent('open-donate'))
  }

  // 微信：复制 + 弹窗
  const handleWechat = () => {
    setShowContact(false)
    setCopied(false)
    setShowWechat(true)
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
    doCopy().then(() => setCopied(true)).catch(() => setCopied(false))
  }

  // 短信
  const handleSms = () => {
    window.location.href = `sms:${PHONE_CHINA}?body=${encodeURIComponent('你好，我在古道论坛看到Crazy维修的信息，想咨询维修事宜')}`
    setShowContact(false)
  }

  // 保存二维码
  const saveQrToAlbum = async () => {
    setSavingQr(true)
    try {
      const res = await fetch(QR_URL)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Crazy维修微信二维码.jpg'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 5000)
      setQrSaved(true)
      setTimeout(() => setQrSaved(false), 3000)
    } catch(e) {
      setQrSaved(true)
      setTimeout(() => setQrSaved(false), 3000)
    }
    setSavingQr(false)
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
        {/* 打赏 */}
        <div style={{ position: 'relative' }}>
          <button onClick={handleDonate} onMouseEnter={() => setShowDonateTip(true)}
            onMouseLeave={() => setShowDonateTip(false)}
            style={{
              width: '3.25rem', height: '3.25rem', borderRadius: '50%',
              backgroundColor: '#c23531', color: '#fff', border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', transition: 'all 0.2s ease',
            }} title="打赏支持">
            <Heart size={22} />
          </button>
          {showDonateTip && (
            <div style={{
              position: 'absolute', right: '4rem', top: '50%',
              transform: 'translateY(-50%)', backgroundColor: '#1a1a1a',
              color: '#fff', fontSize: '0.75rem', padding: '0.375rem 0.75rem',
              borderRadius: '0.5rem', whiteSpace: 'nowrap',
            }}>
              请我喝杯咖啡 ☕
              <div style={{
                position: 'absolute', right: '-0.375rem', top: '50%',
                transform: 'translateY(-50%)', width: 0, height: 0,
                borderTop: '0.375rem solid transparent',
                borderBottom: '0.375rem solid transparent',
                borderLeft: '0.375rem solid #1a1a1a',
              }} />
            </div>
          )}
        </div>

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

      {/* ===== 微信引导弹窗 ===== */}
      {showWechat && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)', padding: '1rem',
        }} onClick={() => setShowWechat(false)}>
          <div style={{
            backgroundColor: '#fff', borderRadius: '0.875rem',
            maxWidth: '20rem', width: '100%', padding: '1rem',
            animation: 'scaleIn 0.25s ease-out both',
            textAlign: 'center',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💚</div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.25rem' }}>添加微信</h3>
            <p style={{ fontSize: '0.65rem', color: '#999', marginBottom: '0.75rem' }}>
              长按二维码直接添加，或在微信搜索微信号
            </p>

            {/* 二维码 */}
            <div style={{ marginBottom: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src={QR_URL} alt="微信二维码"
                style={{ width: '8rem', height: '8rem', borderRadius: '0.65rem', border: '1px solid #eee8dc', cursor: 'pointer' }}
                onClick={saveQrToAlbum} />
              <button onClick={saveQrToAlbum}
                style={{ marginTop: '0.35rem', fontSize: '0.6rem', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}>
                {savingQr ? '保存中...' : qrSaved ? '✅ 已保存到相册' : '📥 点击保存二维码到相册'}
              </button>
            </div>

            {/* 微信号 */}
            <div style={{
              backgroundColor: '#f9f9f9', borderRadius: '0.5rem',
              padding: '0.5rem', marginBottom: '0.75rem',
            }}>
              <p style={{ fontSize: '0.55rem', color: '#999', marginBottom: '0.2rem' }}>或复制微信号搜索</p>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#07c160', letterSpacing: '0.1em', userSelect: 'all' }}>{WECHAT_ID}</p>
            </div>

            {/* 步骤 */}
            <div style={{ textAlign: 'left', fontSize: '0.6rem', color: '#666', marginBottom: '0.75rem', marginLeft: '0.75rem', lineHeight: '1.6' }}>
              <p>① 微信号已复制 ✅</p>
              <p>② 打开微信 → 添加朋友 → 粘贴搜索</p>
              <p>③ 发送「咨询维修」即可</p>
            </div>

            {/* 按钮 */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setShowWechat(false)}
                style={{
                  flex: 1, padding: '0.5rem', borderRadius: '0.65rem',
                  border: '1px solid #ddd', background: 'none',
                  fontSize: '0.75rem', color: '#666', cursor: 'pointer',
                }}>知道了</button>
              <button onClick={() => { try { window.location.href = 'weixin://' } catch(e) {} }}
                style={{
                  flex: 1, padding: '0.5rem', borderRadius: '0.65rem',
                  border: 'none', backgroundColor: '#07c160',
                  fontSize: '0.75rem', color: '#fff', cursor: 'pointer',
                }}>打开微信</button>
            </div>
          </div>
        </div>
      )}

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
              {/* 📱 短信咨询 */}
              <button onClick={handleSms} style={btnBase}>
                <div style={iconCircle('#3b82f6')}><MessageSquare size={16} color="#fff" /></div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>📱 短信咨询</div>
                  <div style={{ fontSize: '0.65rem', color: '#666' }}>一键发送短信，自动填写咨询内容</div>
                </div>
                <span style={{ color: '#3b82f6', fontSize: '0.8rem' }}>→</span>
              </button>

              {/* 💚 微信 */}
              <button onClick={handleWechat} style={btnBase}>
                <div style={iconCircle('#07c160')}><MessageCircle size={16} color="#fff" /></div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>💚 微信</div>
                  <div style={{ fontSize: '0.65rem', color: '#666' }}>复制微信号，去微信搜索添加</div>
                </div>
                <span style={{ color: '#07c160', fontSize: '0.8rem' }}>→</span>
              </button>

              {/* 📞 中国电话 */}
              <a href={`tel:${PHONE_CHINA}`} target="_blank" rel="noopener" style={btnBase}>
                <div style={iconCircle('#ea4335')}><Phone size={16} color="#fff" /></div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>📞 中国电话</div>
                  <div style={{ fontSize: '0.65rem', color: '#666' }}>+86 13573735550</div>
                </div>
                <span style={{ color: '#ea4335', fontSize: '0.8rem' }}>→</span>
              </a>

              {/* WhatsApp */}
              <a href={`https://wa.me/${PHONE_SG.replace('+', '')}?text=我想咨询维修事宜`} target="_blank" rel="noopener" style={btnBase}>
                <div style={iconCircle('#25d366')}><Phone size={16} color="#fff" /></div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>WhatsApp</div>
                  <div style={{ fontSize: '0.65rem', color: '#666' }}>+65 96146709</div>
                </div>
                <span style={{ color: '#25d366', fontSize: '0.8rem' }}>→</span>
              </a>

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
