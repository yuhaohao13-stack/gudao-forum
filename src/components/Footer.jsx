'use client'
import Link from 'next/link'
import { Landmark, Heart } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="mt-auto border-t border-[#e8e2d8] bg-[#fafaf9]">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-12">
        <div className="grid sm:grid-cols-3 gap-8 sm:gap-10">
          {/* 左：品牌 */}
          <div className="sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#b45309] to-[#92400e] flex items-center justify-center">
                <Landmark size={16} className="text-white" />
              </div>
              <span className="font-bold text-[#1c1917]">古道论坛</span>
            </div>
            <p className="text-xs text-[#999] leading-relaxed">以文会友 · 以友辅仁<br />面向全球华人的国际中文社区</p>
          </div>

          {/* 中：导航 */}
          <div>
            <h4 className="text-xs font-semibold text-[#999] uppercase tracking-wider mb-3">导航</h4>
            <div className="space-y-2">
              <Link href="/" className="block text-sm text-[#666] hover:text-[#b45309] transition-colors">首页</Link>
              <Link href="/chat" className="block text-sm text-[#666] hover:text-[#b45309] transition-colors">聊天室</Link>
              <Link href="/search" className="block text-sm text-[#666] hover:text-[#b45309] transition-colors">搜索</Link>
              <Link href="/new-thread" className="block text-sm text-[#666] hover:text-[#b45309] transition-colors">发帖</Link>
            </div>
          </div>

          {/* 右：链接 */}
          <div>
            <h4 className="text-xs font-semibold text-[#999] uppercase tracking-wider mb-3">友情链接</h4>
            <div className="space-y-2">
              <a href="https://www.crazy-repair.com" target="_blank" rel="noopener"
                className="block text-sm text-blue-600 hover:text-blue-700 transition-colors">🔧 Crazy维修</a>
              <a href="https://v.douyin.com/NvUr5C82ZDM/" target="_blank" rel="noopener"
                className="block text-sm text-[#fe2c55] hover:opacity-80 transition-colors">🎵 浩哥维修实录 · 抖音</a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#e8e2d8] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#ccc]">
            &copy; {new Date().getFullYear()} 古道论坛 — 以文会友，以友辅仁
          </p>
          <p className="text-xs text-[#ddd] flex items-center gap-1">
            Built with <Heart size={10} className="text-[#b45309]" /> by 逼哥
          </p>
        </div>
      </div>
    </footer>
  )
}
