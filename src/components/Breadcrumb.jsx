'use client'

import Link from 'next/link'

/**
 * 面包屑导航组件
 * crumbs: [{ label, href? }]
 * 例：<Breadcrumb crumbs={[{label:'首页', href:'/'},{label:'聊天室', href:'/chat'},{label:'谈古论今'}]} />
 */
export default function Breadcrumb({ crumbs, className = '' }) {
  return (
    <nav className={`flex items-center gap-1 text-xs text-[#b0a898] ${className}`}>
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-[#d5d0c8] select-none">›</span>}
          {crumb.href ? (
            <Link
              href={crumb.href}
              className="hover:text-[#c23531] transition-colors hover:underline"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="text-[#666]">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
