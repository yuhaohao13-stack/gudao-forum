'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-auto py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="border-t border-[#e2e8f0] pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <p className="text-sm font-semibold text-[#475569]">古道论坛</p>
            <p className="text-xs text-[#94a3b8] mt-1">以文会友 · 以友辅仁</p>
          </div>
          <div className="flex items-center gap-5 text-xs text-[#94a3b8]">
            <Link href="/" className="hover:text-[#475569] transition-colors">首页</Link>
            <Link href="/chat" className="hover:text-[#475569] transition-colors">聊天室</Link>
          </div>
        </div>
        <p className="text-[10px] text-[#cbd5e1] text-center mt-6">
          &copy; {new Date().getFullYear()} 古道论坛
        </p>
      </div>
    </footer>
  )
}
