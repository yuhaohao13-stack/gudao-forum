'use client'
import Link from 'next/link'
import { Landmark } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="mt-auto py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* ===== 关于古道论坛 ===== */}
        <div className="border-t border-[#f0f0f0] pt-6 pb-6">
          <h3 className="text-xs font-semibold text-[#bbb] mb-3">🏛️ 关于古道论坛</h3>
          <div className="bg-[#fafaf8] border border-[#ece8e0] rounded-xl p-5">
            <p className="text-xs text-[#666] leading-relaxed mb-2">
              古道论坛是一个面向全球华人的国际中文社区，由威海维修博主浩哥创办并运营。
              论坛以「以文会友，以友辅仁」为核心理念，致力于打造一个既传承中华传统文化、
              又能自由交流技术生活、共同成长的精神家园。
            </p>
            <p className="text-xs text-[#666] leading-relaxed mb-2">
              我们汇集了唐诗三百首、四大名著全文阅读、成语故事三百篇、谚语故事八十篇。
              还有音乐频道（六大分类120首精选）、高清壁纸库（十大分类50套）、
              彩票模拟器以及18款免费在线小游戏（可离线畅玩）。
            </p>
            <p className="text-xs text-[#666] leading-relaxed mb-2">
              论坛设有闲聊灌水、技术讨论、生活分享、资源分享、原创小说等多个板块，
              支持在线聊天室、好友系统、私信互动。签到打卡赚积分可兑换黄金/钻石会员，
              畅享全部资源下载和内容解锁。
            </p>
            <p className="text-xs text-[#666] leading-relaxed">
              我们的站长浩哥自2007年至今一直奋斗在维修一线，Crazy维修口碑卓越。
              古道论坛和Crazy维修两站联动，注册会员即可参与讨论、下载资源、
              解锁全部内容。欢迎加入古道大家庭！
            </p>
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#f0f0f0]">
              <Link href="/register" className="text-xs font-semibold px-4 py-2 rounded-lg bg-[#b45309] text-white hover:bg-[#92400e] transition-colors">免费注册</Link>
              <Link href="/board" className="text-xs text-[#b45309] hover:underline">浏览板块 →</Link>
              <Link href="/crazy-repair" className="text-xs text-[#999] hover:text-[#666]">🔧 Crazy维修</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-[#f0f0f0] pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <p className="text-sm font-semibold text-[#888]"><Landmark size={16} className="inline-block align-text-bottom" /> {t('footer.title')}</p>
            <p className="text-xs text-[#bbb] mt-1">{t('footer.slogan')}</p>
          </div>
          <div className="flex items-center gap-5 text-xs text-[#bbb]">
            <Link href="/" className="hover:text-[#888] transition-colors">{t('footer.home')}</Link>
            <Link href="/chat" className="hover:text-[#888] transition-colors">{t('footer.chat')}</Link>
            <Link href="/search" className="hover:text-[#888] transition-colors">{t('footer.search')}</Link>
          </div>
        </div>
        <p className="text-[10px] text-[#ddd] text-center mt-6">
          &copy; {new Date().getFullYear()} {t('footer.title')}
        </p>
      </div>
    </footer>
  )
}
