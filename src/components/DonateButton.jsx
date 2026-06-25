'use client'

import { useState } from 'react'

export default function DonateButton() {
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const handleAlipay = () => {
    // 支付宝深度链接 — 手机上装了支付宝会直接跳转转账页
    const alipayUrl = 'alipays://platformapi/startapp?saId=20000067&userId=13573735550'
    window.open(alipayUrl, '_blank')
    showToast('正在打开支付宝...')
  }

  const handlePayNow = () => {
    showToast('请使用 PayNow 扫描二维码支付')
    // 暂时显示二维码提示，等浩哥上传 PayNow QR 码后替换
  }

  return (
    <>
      {/* 浮动打赏按钮 */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-[#c23531] text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center text-lg"
        title="支持一下"
      >
        💖
      </button>

      {/* 遮罩层 */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          {/* 弹窗 */}
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 anim-scale"
            onClick={e => e.stopPropagation()}
          >
            {/* 标题 */}
            <div className="text-center mb-5">
              <div className="text-3xl mb-2">☕</div>
              <h3 className="text-lg font-bold font-serif text-[#1a1a1a]">请我喝杯咖啡</h3>
              <p className="text-xs text-[#999] mt-1">如果觉得论坛有用，欢迎打赏支持</p>
            </div>

            {/* 支付方式 */}
            <div className="space-y-3">
              {/* 支付宝 */}
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

              {/* PayNow */}
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

            {/* 说明 */}
            <p className="text-[10px] text-[#ccc] text-center mt-5">
              所有打赏将用于维持论坛运营 💪
            </p>

            {/* 关闭按钮 */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#f5f0e8] text-[#999] hover:text-[#c23531] hover:bg-[#c23531]/10 transition-all flex items-center justify-center text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Toast 提示 */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1a1a1a] text-white text-xs px-4 py-2 rounded-full shadow-lg anim-fade-in">
          {toast}
        </div>
      )}
    </>
  )
}
