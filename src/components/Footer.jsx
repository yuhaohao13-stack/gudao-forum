'use client'
import Link from 'next/link'
import { Landmark, BookOpen, Scale, Medal, Mail, MessageCircle } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()
  return (
    <footer className="mt-auto pt-12 pb-6 bg-white border-t border-[#ece8e0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* ===== 横排底部导航 ===== */}
        <div className="py-6 border-b border-[#f0f0f0] space-y-3">
          <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-xs text-[#777]">
            <span className="font-semibold text-[#1c1917] mr-1"><BookOpen size={12} className="inline-block text-[#b45309]" /> 快速链接：</span>
            <Link href="/rules" className="hover:text-[#b45309] transition-colors">古道社区规则</Link>
            <span className="text-[#ddd]">·</span>
            <Link href="/lottery/upgrade" className="hover:text-[#b45309] transition-colors">会员积分规则</Link>
            <span className="text-[#ddd]">·</span>
            <Link href="/board" className="hover:text-[#b45309] transition-colors">📋 论坛板块</Link>
            <span className="text-[#ddd]">·</span>
            <Link href="/chat" className="hover:text-[#b45309] transition-colors">💬 在线聊天</Link>
            <span className="text-[#ddd]">·</span>
            <Link href="/search" className="hover:text-[#b45309] transition-colors">🔍 搜索</Link>
            <span className="text-[#ddd]">·</span>
            <Link href="/crazy-repair" className="hover:text-[#b45309] transition-colors">🔧 Crazy维修</Link>
          </div>
          <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-xs text-[#777]">
            <span className="font-semibold text-[#1c1917] mr-1"><Mail size={12} className="inline-block text-[#b45309]" /> 联系方式：</span>
            <span>📧 994730969@qq.com</span>
            <span className="text-[#ddd]">·</span>
            <span>💬 微信：crazy-repair</span>
            <span className="text-[#ddd]">·</span>
            <span>📧 yuhaohao13@gmail.com</span>
            <span className="text-[#ddd]">·</span>
            <span className="text-[#999]">客服时间：8:00-22:00</span>
          </div>
        </div>

        {/* ===== 底部信息 ===== */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <p className="text-sm font-semibold text-[#888]">
              <Landmark size={16} className="inline-block align-text-bottom" /> 古道论坛
            </p>
            <p className="text-xs text-[#bbb] mt-1">以文会友，以友辅仁</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#bbb]">
            <Link href="/" className="hover:text-[#888] transition-colors">首页</Link>
            <Link href="/rules" className="hover:text-[#888] transition-colors">社区规则</Link>
            <Link href="/chat" className="hover:text-[#888] transition-colors">聊天室</Link>
            <Link href="/board" className="hover:text-[#888] transition-colors">板块</Link>
          </div>
        </div>

        {/* ===== 最终解释权声明 ===== */}
        <div className="mt-6 pt-4 border-t border-[#f5f5f0] text-center">
          <p className="text-[10px] text-[#ccc] leading-relaxed">
            © {year} 古道论坛 · 所有内容和网站运营，最终解释权归古道论坛管理团队所有
          </p>
          <p className="text-[10px] text-[#ddd] mt-1">
            本站文章仅代表作者观点，不代表古道论坛立场 · 如有侵权请联系删除
          </p>
        </div>

      </div>
    </footer>
  )
}
