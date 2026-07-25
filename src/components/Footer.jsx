'use client'
import Link from 'next/link'
import { Landmark, BookOpen, Mail, Scale, Medal, MessageCircle, ExternalLink } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()
  return (
    <footer className="mt-auto py-12 bg-white border-t border-[#ece8e0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* ===== 三列底部导航 ===== */}
        <div className="flex flex-col md:flex-row gap-8 pb-8 border-b border-[#f0f0f0]">

          <div className="flex-1 min-w-0 space-y-4">
          {/* 第一列：关于古道论坛 */}
            <div className="flex items-center gap-2">
              <Landmark size={18} className="text-[#b45309]" />
              <span className="text-base font-bold text-[#1c1917]">古道论坛</span>
            </div>
            <p className="text-xs text-[#999] italic">以文会友，以友辅仁</p>
            <p className="text-xs text-[#777] leading-relaxed">
              面向全球华人的国际中文社区，由威海维修博主浩哥创办运营。
              传承中华传统文化，自由交流技术生活，共建温暖精神家园。
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Link href="/" className="text-[#b45309] hover:underline">首页</Link>
              <span className="text-[#ddd]">|</span>
              <Link href="/rules" className="text-[#b45309] hover:underline">社区规则</Link>
              <span className="text-[#ddd]">|</span>
              <Link href="/chat" className="text-[#b45309] hover:underline">聊天室</Link>
              <span className="text-[#ddd]">|</span>
              <Link href="/board" className="text-[#b45309] hover:underline">板块</Link>
            </div>
            <div className="pt-3 border-t border-[#f5f5f0] space-y-1">
              <p className="text-[10px] text-[#bbb] leading-relaxed">
                © {year} 古道论坛 · 所有内容和网站运营，最终解释权归古道论坛管理团队所有
              </p>
              <p className="text-[10px] text-[#ddd] leading-relaxed">
                本站文章仅代表作者观点，不代表古道论坛立场 · 如有侵权请联系删除
              </p>
            </div>
          </div>

          <div className="flex-1 min-w-0 space-y-3">
          {/* 第二列：快速链接 */}
            <h3 className="text-xs font-bold text-[#1c1917] flex items-center gap-1.5">
              <BookOpen size={14} className="text-[#b45309]" /> 快速链接
            </h3>
            <ul className="space-y-2.5">
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
                <Link href="/register" className="text-xs text-[#777] hover:text-[#b45309] transition-colors">📝 免费注册</Link>
              </li>
              <li>
                <Link href="/crazy-repair" className="text-xs text-[#777] hover:text-[#b45309] transition-colors">🔧 Crazy维修</Link>
              </li>
            </ul>
          </div>

          <div className="flex-1 min-w-0 space-y-3">
          {/* 第三列：联系方式 */}
            <h3 className="text-xs font-bold text-[#1c1917] flex items-center gap-1.5">
              <Mail size={14} className="text-[#b45309]" /> 联系方式
            </h3>
            <ul className="space-y-2.5">
              <li className="text-xs text-[#777] flex items-center gap-1.5">
                <Mail size={12} /> 994730969@qq.com
              </li>
              <li className="text-xs text-[#777] flex items-center gap-1.5">
                <MessageCircle size={12} /> 微信：crazy-repair
              </li>
              <li className="text-xs text-[#777] flex items-center gap-1.5">
                📧 yuhaohao13@gmail.com
              </li>
              <li className="text-xs text-[#999] pt-1 border-t border-[#f5f5f0]">
                客服时间：周一至周日 8:00-22:00
              </li>
              <li className="pt-2">
                <Link
                  href="/register"
                  className="inline-block text-xs font-semibold px-4 py-2 rounded-lg bg-[#b45309] text-white hover:bg-[#92400e] transition-colors"
                >
                  ✨ 免费注册
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  )
}
