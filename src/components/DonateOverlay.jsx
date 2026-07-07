'use client'

import { useEffect, useState } from 'react'

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0,0,0,0.35)',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
  padding: '1rem',
}

const innerStyle = {
  backgroundColor: '#fff',
  borderRadius: '1rem',
  boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
  maxWidth: '24rem',
  width: '100%',
  padding: '1.5rem',
  animation: 'scaleIn 0.3s ease-out both',
}

export default function DonateOverlay() {
  const [showModal, setShowModal] = useState(false)
  const [showWechatQR, setShowWechatQR] = useState(false)
  const [showPayNowQR, setShowPayNowQR] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  useEffect(() => {
    const handler = () => setShowModal(true)
    window.addEventListener('open-donate', handler)
    return () => window.removeEventListener('open-donate', handler)
  }, [])

  // 微信二维码点击时自动关闭主弹窗
  const openWechat = () => {
    setShowModal(false)
    setTimeout(() => setShowWechatQR(true), 200)
  }

  const openPayNow = () => {
    setShowModal(false)
    setTimeout(() => setShowPayNowQR(true), 200)
  }

  return (
    <>
      {/* 主弹窗 */}
      {showModal && (
        <div style={overlayStyle} onClick={() => { setShowModal(false); setShowWechatQR(false); setShowPayNowQR(false) }}>
          <div style={innerStyle} onClick={e => e.stopPropagation()}>
            <div className="text-center mb-5">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>☕</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, fontFamily: "'Inter', 'Noto Sans SC', -apple-system, sans-serif", color: '#1a1a1a' }}>请我喝杯咖啡</h3>
              <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.25rem' }}>如果觉得论坛有用，欢迎打赏支持</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button onClick={openWechat}
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #eee8dc', width: '100%', cursor: 'pointer', background: 'none', fontSize: 'inherit' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: '#07c160', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>💚</div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1a1a' }}>微信</div>
                  <div style={{ fontSize: '0.75rem', color: '#999' }}>扫描二维码支付</div>
                </div>
                <span style={{ color: '#07c160', fontSize: '0.875rem' }}>→</span>
              </button>

              <button onClick={openPayNow}
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #eee8dc', width: '100%', cursor: 'pointer', background: 'none', fontSize: 'inherit' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>🇸🇬</div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1a1a' }}>PayNow</div>
                  <div style={{ fontSize: '0.75rem', color: '#999' }}>扫描二维码支付</div>
                </div>
                <span style={{ color: '#16a34a', fontSize: '0.875rem' }}>→</span>
              </button>
            </div>

            <p style={{ fontSize: '0.625rem', color: '#ccc', textAlign: 'center', marginTop: '1.25rem' }}>所有打赏将用于维持论坛运营 💪</p>
          </div>
        </div>
      )}

      {/* 微信二维码 */}
      {showWechatQR && (
        <div style={{ ...overlayStyle, zIndex: 9999 }} onClick={() => setShowWechatQR(false)}>
          <div style={{ ...innerStyle, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, fontFamily: "'Inter', 'Noto Sans SC', -apple-system, sans-serif", color: '#1a1a1a', marginBottom: '0.25rem' }}>💚 微信</div>
            <p style={{ fontSize: '0.75rem', color: '#999', marginBottom: '1rem' }}>打开微信扫描二维码支付</p>
            <img src="/images/wechat-qr.jpg" alt="WeChat Pay QR" style={{ width: '100%', maxWidth: '15rem', margin: '0 auto', borderRadius: '0.75rem', border: '1px solid #eee8dc', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} />
            <p style={{ fontSize: '0.625rem', color: '#ccc', marginTop: '1rem' }}>截图保存到相册，在微信中扫码</p>
          </div>
        </div>
      )}

      {/* PayNow 二维码 */}
      {showPayNowQR && (
        <div style={{ ...overlayStyle, zIndex: 9999 }} onClick={() => setShowPayNowQR(false)}>
          <div style={{ ...innerStyle, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, fontFamily: "'Inter', 'Noto Sans SC', -apple-system, sans-serif", color: '#1a1a1a', marginBottom: '0.25rem' }}>🇸🇬 PayNow</div>
            <p style={{ fontSize: '0.75rem', color: '#999', marginBottom: '1rem' }}>打开银行 App 扫描二维码支付</p>
            <img src="/images/paynow-qr.jpg" alt="PayNow QR" style={{ width: '100%', maxWidth: '15rem', margin: '0 auto', borderRadius: '0.75rem', border: '1px solid #eee8dc', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} />
            <p style={{ fontSize: '0.625rem', color: '#ccc', marginTop: '1rem' }}>截图保存到相册，在银行 App 中扫码</p>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '1rem', left: '50%', transform: 'translateX(-50%)',
          zIndex: 99999, backgroundColor: '#1a1a1a', color: '#fff',
          fontSize: '0.75rem', padding: '0.5rem 1rem', borderRadius: '9999px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}>
          {toast}
        </div>
      )}
    </>
  )
}
