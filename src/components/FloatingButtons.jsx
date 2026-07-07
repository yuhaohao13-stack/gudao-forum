'use client'

import { useState, useEffect } from 'react'
import { Heart, MessageCircle, X } from 'lucide-react'

export default function FloatingButtons() {
  const [showDonateTip, setShowDonateTip] = useState(false)
  const [showContact, setShowContact] = useState(false)

  useEffect(() => {
    if (showDonateTip) {
      const timer = setTimeout(() => setShowDonateTip(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showDonateTip])

  const handleDonate = () => {
    window.dispatchEvent(new CustomEvent('open-donate'))
  }

  const handleContact = () => {
    setShowContact(true)
  }

  return (
    <>
      {/* 悬浮按钮组 - 右下角 */}
      <div style={{
        position: 'fixed',
        bottom: '6rem',
        right: '1.25rem',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        alignItems: 'center',
      }}>
        {/* 打赏按钮 */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={handleDonate}
            onMouseEnter={() => setShowDonateTip(true)}
            onMouseLeave={() => setShowDonateTip(false)}
            style={{
              width: '3.25rem',
              height: '3.25rem',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #b45309, #92400e)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(180, 83, 9, 0.4)',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(180, 83, 9, 0.5)' }}
            onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(180, 83, 9, 0.4)' }}
            title="打赏支持"
          >
            <Heart size={22} fill="currentColor" />
          </button>
          {showDonateTip && (
            <div style={{
              position: 'absolute',
              right: '4rem',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: '#1c1917',
              color: '#fff',
              fontSize: '0.75rem',
              padding: '0.375rem 0.75rem',
              borderRadius: '0.5rem',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}>
              请我喝杯咖啡 ☕
              <div style={{
                position: 'absolute',
                right: '-0.375rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 0,
                height: 0,
                borderTop: '0.375rem solid transparent',
                borderBottom: '0.375rem solid transparent',
                borderLeft: '0.375rem solid #1c1917',
              }} />
            </div>
          )}
        </div>

        {/* 联系我按钮 */}
        <button
          onClick={handleContact}
          style={{
            width: '3.25rem',
            height: '3.25rem',
            borderRadius: '50%',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,99,235,0.45)' }}
          onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,99,235,0.35)' }}
          title="联系站长"
        >
          <MessageCircle size={22} />
        </button>
      </div>

      {/* 联系我弹窗 */}
      {showContact && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
            padding: '1rem',
          }}
          onClick={() => setShowContact(false)}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '0.875rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
              maxWidth: '20rem',
              width: '100%',
              padding: '1rem',
              animation: 'scaleIn 0.25s ease-out both',
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowContact(false)}
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#999',
                padding: '0.2rem',
              }}
            >
              <X size={15} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🔧</div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1c1917' }}>Crazy 维修 — 联系我们</h3>
              <p style={{ fontSize: '0.65rem', color: '#999', marginTop: '0.2rem' }}>新加坡电脑/手机/平板专业维修</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem' }}>
              <div onClick={() => { navigator.clipboard.writeText('crazy-repair') }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', borderRadius: '0.65rem', border: '1px solid #e8e2d8', width: '100%', cursor: 'pointer', background: 'none' }}>
                <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: '#07c160', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>💚</div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#1c1917' }}>微信</div>
                  <div style={{ fontSize: '0.65rem', color: '#666' }}>微信号：crazy-repair（点击复制）</div>
                </div>
                <span style={{ color: '#07c160', fontSize: '0.8rem' }}>📋</span>
              </div>

              <a href="https://wa.me/6596146709?text=我想咨询手机电脑维修事宜" target="_blank" rel="noopener"
                style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', borderRadius: '0.65rem', border: '1px solid #e8e2d8', width: '100%', textDecoration: 'none', color: 'inherit' }}>
                <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>📱</div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#1c1917' }}>WhatsApp / 新加坡电话</div>
                  <div style={{ fontSize: '0.65rem', color: '#666' }}>+65 96146709</div>
                </div>
                <span style={{ color: '#25d366', fontSize: '0.8rem' }}>→</span>
              </a>

              <a href="tel:+8613573735550"
                style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', borderRadius: '0.65rem', border: '1px solid #e8e2d8', width: '100%', textDecoration: 'none', color: 'inherit' }}>
                <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: '#ea4335', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>📞</div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#1c1917' }}>中国电话</div>
                  <div style={{ fontSize: '0.65rem', color: '#666' }}>+86 13573735550</div>
                </div>
                <span style={{ color: '#ea4335', fontSize: '0.8rem' }}>→</span>
              </a>

              <a href="https://www.crazy-repair.com" target="_blank" rel="noopener"
                style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', borderRadius: '0.65rem', border: '1px solid #e8e2d8', width: '100%', textDecoration: 'none', color: 'inherit' }}>
                <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>🔧</div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#1c1917' }}>官方网站</div>
                  <div style={{ fontSize: '0.65rem', color: '#666' }}>www.crazy-repair.com</div>
                </div>
                <span style={{ color: '#2563eb', fontSize: '0.8rem' }}>→</span>
              </a>

              <a href="https://v.douyin.com/NvUr5C82ZDM/" target="_blank" rel="noopener"
                style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', borderRadius: '0.65rem', border: '1px solid #e8e2d8', width: '100%', textDecoration: 'none', color: 'inherit' }}>
                <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'linear-gradient(135deg, #00f2fe, #fe2c55)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="#fff"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.35 0 .69.06 1.01.18V8.48a6.34 6.34 0 0 0-1.01-.08C5.9 8.4 3 11.3 3 14.86c0 3.56 2.9 6.46 6.46 6.46 3.56 0 6.46-2.9 6.46-6.46V9.33a8.28 8.28 0 0 0 4.67 1.4v-3.4a4.84 4.84 0 0 1-1-.64z"/></svg>
                </div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#1c1917' }}>抖音</div>
                  <div style={{ fontSize: '0.65rem', color: '#666' }}>@Crazy维修 浩哥维修实录</div>
                </div>
                <span style={{ color: '#fe2c55', fontSize: '0.8rem' }}>→</span>
              </a>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', borderRadius: '0.65rem', border: '1px solid #e8e2d8', width: '100%' }}>
                <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>📍</div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#1c1917' }}>到店维修</div>
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
