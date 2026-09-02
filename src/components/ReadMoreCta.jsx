'use client'

import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { canViewGoldContent } from '@/lib/member'

// 阅读更多 CTA：未登录→注册；普通会员→升级；黄金/钻石→不显示
export default function ReadMoreCta({ label = '畅读全部内容' }) {
  const { user, profile } = useAuth()
  const goldCheck = canViewGoldContent(user, profile)
  if (goldCheck.allowed) return null
  const href = user ? '/rules' : '/register'
  const btnText = user ? `升级会员 · ${label}` : `免费注册 · ${label}`
  return (
    <div className="mt-5 text-center">
      <Link href={href} className="inline-flex items-center gap-1.5 text-xs font-semibold px-5 py-2.5 rounded-lg bg-[#b45309] text-white hover:bg-[#92400e] transition-colors">
        {btnText}
      </Link>
      {!user && (
        <p className="text-[10px] text-[#b0a898] mt-3">已是会员？<Link href="/login" className="text-[#b45309] hover:underline">登录</Link></p>
      )}
    </div>
  )
}
