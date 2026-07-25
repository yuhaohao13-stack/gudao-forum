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

        {/* ===== 两栏底部导航 ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pb-8 border-b border-[#f0f0f0]">

          {/* 快速链接 */}
          <div>
            <h3 className="text-xs font-bold text-[#1c1917] mb-3 flex items-center gap-1.5">
              <BookOpen size={14} className="text-[#b45309]" /> 快速链接
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/rules" className="text-xs text-[#777] hover:text-[#b45309] transition-colors flex items-center gap-1.5">
                  <Scale size={12} /> 古道社区规则
                </Link>
              </li>
              <li>
                <Link href="/lottery/upgrade" className="text-xs text-[#777] hover:text-[#b45309] transition-colors flex items-center gap-1.5">
                  <Medal size={12} /> 会员积分规则
                </Link>
              </li>
              <li>
                <Link href="/board" className="text-xs text-[#777] hover:text-[#b45309] transition-colors">📋 论坛板块</Link>
              </li>
              <li>
                <Link href="/chat" className="text-xs text-[#777] hover:text-[#b45309] transition-colors">💬 在线聊天</Link>
              </li>
              <li>
                <Link href="/search" className="text-xs text-[#777] hover:text-[#b45309] transition-colors">🔍 搜索</Link>
              </li>
              <li>
                <Link href="/crazy-repair" className="text-xs text-[#777] hover:text-[#b45309] transition-colors">🔧 Crazy维修</Link>
              </li>
            </ul>
          </div>

          {/* 联系方式 */}
          <div>
            <h3 className="text-xs font-bold text-[#1c1917] mb-3 flex items-center gap-1.5">
              <Mail size={14} className="text-[#b45309]" /> 联系方式
            </h3>
            <ul className="space-y-2">
              <li className="text-xs text-[#777] flex items-center gap-1.5">
                <Mail size={12} /> 994730969@qq.com
              </li>
              <li className="text-xs text-[#777] flex items-center gap-1.5">
                <MessageCircle size={12} /> 微信：crazy-repair
              </li>
              <li className="text-xs text-[#777] flex items-center gap-1.5">
                📧 yuhaohao13@gmail.com
              </li>
              <li className="text-xs text-[#999] mt-2">
                客服时间：周一至周日 8:00-22:00
              </li>
            </ul>
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
