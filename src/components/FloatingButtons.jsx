'use client'

import { useState, useEffect } from 'react'
import { Heart, MessageCircle, X, Phone, MessageSquare } from 'lucide-react'

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
        bottom: '7rem',
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
              backgroundColor: '#c23531',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(194,53,49,0.35)',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(194,53,49,0.45)' }}
            onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(194,53,49,0.35)' }}
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
              backgroundColor: '#1a1a1a',
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
                borderLeft: '0.375rem solid #1a1a1a',
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
            boxShadow: '0 4px 12px rgba(37,99,235,0.35)',
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
            backgroundColor: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            padding: '1rem',
          }}
          onClick={() => setShowContact(false)}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '1rem',
              boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
              maxWidth: '22rem',
              width: '100%',
              padding: '1.5rem',
              animation: 'scaleIn 0.3s ease-out both',
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowContact(false)}
              style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#999',
                padding: '0.25rem',
              }}
            >
              <X size={18} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🙋</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, fontFamily: "'Noto Serif SC', serif", color: '#1a1a1a' }}>联系站长</h3>
              <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.25rem' }}>有问题或建议，欢迎联系浩哥</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a href="mailto:yuhaohao13@gmail.com"
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem',
                  borderRadius: '0.75rem', border: '1px solid #eee8dc', width: '100%',
                  cursor: 'pointer', background: 'none', fontSize: 'inherit',
                  textDecoration: 'none', color: 'inherit',
                }}>
                <div style={{
                  width: '2.5rem', height: '2.5rem', borderRadius: '50%',
                  backgroundColor: '#ea4335', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0,
                }}>📧</div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1a1a' }}>Email</div>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>yuhaohao13@gmail.com</div>
                </div>
                <span style={{ color: '#ea4335', fontSize: '0.875rem' }}>→</span>
              </a>

              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem',
                  borderRadius: '0.75rem', border: '1px solid #eee8dc', width: '100%',
                  cursor: 'pointer', background: 'none', fontSize: 'inherit',
                }}
                onClick={() => {
                  const text = '浩哥的联系方式:\nEmail: yuhaohao13@gmail.com\n古道论坛: https://www.gudaoforum.com\nCrazy-Repair: https://www.crazy-repair.com\n抖音: https://v.douyin.com/NvUr5C82ZDM/'
                  navigator.clipboard.writeText(text)
                }}
              >
                <div style={{
                  width: '2.5rem', height: '2.5rem', borderRadius: '50%',
                  backgroundColor: '#07c160', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0,
                }}>💬</div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1a1a' }}>联系方式</div>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>点击复制全部信息</div>
                </div>
                <span style={{ color: '#07c160', fontSize: '0.875rem' }}>📋</span>
              </div>

              <a href="https://v.douyin.com/NvUr5C82ZDM/" target="_blank" rel="noopener"
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem',
                  borderRadius: '0.75rem', border: '1px solid #eee8dc', width: '100%',
                  cursor: 'pointer', background: 'none', fontSize: 'inherit',
                  textDecoration: 'none', color: 'inherit',
                }}>
                <div style={{
                  width: '2.5rem', height: '2.5rem', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00f2fe, #fe2c55)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.25rem', flexShrink: 0,
                }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="#fff">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.35 0 .69.06 1.01.18V8.48a6.34 6.34 0 0 0-1.01-.08C5.9 8.4 3 11.3 3 14.86c0 3.56 2.9 6.46 6.46 6.46 3.56 0 6.46-2.9 6.46-6.46V9.33a8.28 8.28 0 0 0 4.67 1.4v-3.4a4.84 4.84 0 0 1-1-.64z"/>
                  </svg>
                </div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1a1a' }}>抖音</div>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>@Crazy维修 浩哥维修实录</div>
                </div>
                <span style={{ color: '#fe2c55', fontSize: '0.875rem' }}>→</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
