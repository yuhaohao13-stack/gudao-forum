'use client'
import Link from 'next/link'
import { Landmark, BookOpen, Mail, Scale, Medal, MessageCircle } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()
  return (
    <footer className="mt-auto py-10 bg-white border-t border-[#f0f0f0]">
      <div className="max-w-4xl mx-auto px-4">
        <div className="pb-6 border-b border-[#f5f5f0]" style={{display:'flex',flexDirection:'row',gap:'2.5rem',alignItems:'flex-start',flexWrap:'wrap'}}>

          {/* 第一列：关于古道论坛 */}
          <div className="flex-1 min-w-0" style={{minWidth:200}}>
            <div className="flex items-center gap-1.5 mb-2">
              <Landmark size={15} className="text-[#b45309]" />
              <span className="text-sm font-bold text-[#555]">古道论坛</span>
            </div>
            <p className="text-xs text-[#aaa] italic mb-2">以文会友，以友辅仁</p>
            <p className="text-xs text-[#bbb] leading-relaxed mb-3">
              面向全球华人的国际中文社区，由威海维修博主浩哥创办运营。
              传承中华传统文化，自由交流技术生活。
            </p>
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#bbb] mb-3">
              <Link href="/" className="text-[#b45309] hover:underline">首页</Link>
              <span className="text-[#e0e0e0]">|</span>
              <Link href="/rules" className="text-[#b45309] hover:underline">社区规则</Link>
              <span className="text-[#e0e0e0]">|</span>
              <Link href="/chat" className="text-[#b45309] hover:underline">聊天室</Link>
              <span className="text-[#e0e0e0]">|</span>
              <Link href="/board" className="text-[#b45309] hover:underline">板块</Link>
            </div>
            <div className="space-y-0.5">
              <p className="text-[11px] text-[#ccc] leading-relaxed">
                © {year} 古道论坛 · 最终解释权归古道论坛管理团队
              </p>
              <p className="text-[11px] text-[#ddd] leading-relaxed">
                文章仅代表作者观点 · 如有侵权请联系删除
              </p>
            </div>
          </div>

          {/* 第二列：快速链接 */}
          <div className="flex-1 min-w-0" style={{minWidth:140}}>
            <h3 className="text-xs font-semibold text-[#888] mb-2.5 flex items-center gap-1">
              <BookOpen size={13} className="text-[#b45309]" /> 快速链接
            </h3>
            <ul style={{listStyle:'none',padding:0,margin:0}}>
              {[
                {href:'/rules',icon:<Scale size={11}/>,label:'古道社区规则'},
                {href:'/lottery/upgrade',icon:<Medal size={11}/>,label:'会员积分规则'},
                {href:'/board',icon:'📋',label:'论坛板块'},
                {href:'/chat',icon:'💬',label:'在线聊天'},
                {href:'/search',icon:'🔍',label:'搜索'},
                {href:'/register',icon:'📝',label:'免费注册'},
                {href:'/crazy-repair',icon:'🔧',label:'Crazy维修'},
              ].map((link,i)=>(
                <li key={i} style={{marginBottom:'5px'}}>
                  <Link href={link.href} className="text-xs text-[#aaa] hover:text-[#b45309] transition-colors" style={{display:'flex',alignItems:'center',gap:'4px'}}>
                    {link.icon} {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 第三列：联系方式 */}
          <div className="flex-1 min-w-0" style={{minWidth:160}}>
            <h3 className="text-xs font-semibold text-[#888] mb-2.5 flex items-center gap-1">
              <Mail size={13} className="text-[#b45309]" /> 联系方式
            </h3>
            <ul style={{listStyle:'none',padding:0,margin:0}}>
              {[
                {icon:<Mail size={11}/>,label:'994730969@qq.com'},
                {icon:<MessageCircle size={11}/>,label:'微信：crazy-repair'},
                {icon:'📧',label:'yuhaohao13@gmail.com'},
              ].map((item,i)=>(
                <li key={i} style={{marginBottom:'5px'}} className="text-xs text-[#aaa] flex items-center gap-1">
                  {item.icon} {item.label}
                </li>
              ))}
            </ul>
            <p className="text-xs text-[#ccc] mt-2.5 pt-2 border-t border-[#f5f5f0]">客服时间：周一至周日 8:00-22:00</p>
            <div className="mt-2">
              <Link href="/register" className="inline-block text-xs font-medium px-3 py-1.5 rounded-lg bg-[#b45309] text-white hover:bg-[#92400e] transition-colors">
                ✨ 免费注册
              </Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  )
}
