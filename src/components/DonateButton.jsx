'use client'

import { useState, useEffect, useRef } from 'react'

export default function DonateButton({ className = '' }) {
  const [showModal, setShowModal] = useState(false)
  const [showPayNowQR, setShowPayNowQR] = useState(false)
  const [toast, setToast] = useState('')
  const modalRef = useRef(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const handleAlipay = () => {
    const alipayUrl = 'alipays://platformapi/startapp?saId=20000067&userId=13573735550'
    window.open(alipayUrl, '_blank')
    showToast('正在打开支付宝...')
  }

  const handlePayNow = () => {
    setShowPayNowQR(true)
  }

  const closeAll = () => {
    setShowModal(false)
    setShowPayNowQR(false)
  }

  // 点击文档任意位置关闭弹窗
  useEffect(() => {
    if (!showModal && !showPayNowQR) return

    const handleClick = (e) => {
      // 如果点击的是弹窗内部，不关闭
      if (modalRef.current && modalRef.current.contains(e.target)) return
      closeAll()
    }

    // 延迟添加，避免点击触发按钮时立即关闭
    const timer = setTimeout(() => {
      document.addEventListener('click', handleClick, true)
    }, 100)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('click', handleClick, true)
    }
  }, [showModal, showPayNowQR])

  return (
    <>
      {/* 触发按钮 */}
      <span ref={modalRef}>
        <button
          onClick={(e) => { e.stopPropagation(); setShowModal(true) }}
          className={className || "btn-ghost flex items-center gap-1"}
        >
          💖 打赏
        </button>
      </span>

      {/* 主弹窗 */}
      {showModal && (
        <>
          {/* 遮罩 */}
          <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm" />
          {/* 弹窗 */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 anim-scale pointer-events-auto"
            >
              <div className="text-center mb-5">
                <div className="text-3xl mb-2">☕</div>
                <h3 className="text-lg font-bold font-serif text-[#1a1a1a]">请我喝杯咖啡</h3>
                <p className="text-xs text-[#999] mt-1">如果觉得论坛有用，欢迎打赏支持</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleAlipay}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-[#eee8dc] hover:border-[#1677ff]/40 hover:bg-[#1677ff]/5 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#1677ff] flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                    💳
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-semibold text-sm text-[#1a1a1a]">支付宝</div>
                    <div className="text-xs text-[#999]">点击跳转转账</div>
                  </div>
                  <span className="text-[#1677ff] text-sm">→</span>
                </button>

                <button
                  onClick={handlePayNow}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-[#eee8dc] hover:border-green-400/40 hover:bg-green-50/50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                    🇸🇬
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-semibold text-sm text-[#1a1a1a]">PayNow</div>
                    <div className="text-xs text-[#999]">扫描二维码支付</div>
                  </div>
                  <span className="text-green-600 text-sm">→</span>
                </button>
              </div>

              <p className="text-[10px] text-[#ccc] text-center mt-5">
                所有打赏将用于维持论坛运营 💪
              </p>
            </div>
          </div>
        </>
      )}

      {/* PayNow 二维码弹窗 */}
      {showPayNowQR && (
        <>
          <div className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm" />
          <div className="fixed inset-0 z-[111] flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white rounded-2xl shadow-2xl max-w-xs w-full p-6 anim-scale text-center pointer-events-auto">
              <div className="text-lg font-bold font-serif text-[#1a1a1a] mb-1">🇸🇬 PayNow</div>
              <p className="text-xs text-[#999] mb-4">打开银行 App 扫描二维码支付</p>
              <img
                src="/images/paynow-qr.jpg"
                alt="PayNow QR Code"
                className="w-full max-w-[240px] mx-auto rounded-xl border border-[#eee8dc] shadow-sm"
              />
              <p className="text-[10px] text-[#ccc] mt-4">截图保存到相册，在银行 App 中扫码</p>
            </div>
          </div>
        </>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[120] bg-[#1a1a1a] text-white text-xs px-4 py-2 rounded-full shadow-lg anim-fade-in pointer-events-none">
          {toast}
        </div>
      )}
    </>
  )
}
