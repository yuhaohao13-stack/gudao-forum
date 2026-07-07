'use client'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#e8e2d8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm font-semibold text-[#888]">古道论坛</p>
            <p className="text-xs text-[#bbb] mt-0.5">以文会友 · 以友辅仁</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#bbb]">
            <Link href="/" className="hover:text-[#2563eb] transition-colors">首页</Link>
            <Link href="/chat" className="hover:text-[#2563eb] transition-colors">聊天室</Link>
            <a href="https://www.crazy-repair.com" target="_blank" rel="noopener" className="hover:text-[#2563eb] transition-colors">Crazy维修</a>
          </div>
        </div>
        <p className="text-[10px] text-[#ddd] text-center mt-4">&copy; {new Date().getFullYear()} 古道论坛</p>
      </div>
    </footer>
  )
}
