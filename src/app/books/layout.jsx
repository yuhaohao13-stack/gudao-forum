'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

export default function BooksLayout({ children }) {
  const path = usePathname()
  const segments = path.split('/').filter(Boolean)

  // Build breadcrumbs
  const crumbs = []
  if (segments.length >= 1 && segments[0] === 'books') {
    const bookKey = segments[1] // militia or doctor
    const bookNames = {
      militia: '民兵训练手册',
      doctor: '新赤脚医生手册',
    }
    const bookName = bookNames[bookKey] || ''

    crumbs.push({ label: '首页', href: '/' })
    crumbs.push({ label: bookName, href: `/books/${bookKey}` })

    if (segments.length >= 3) {
      // Has chapter slug - get title from data
      crumbs.push({ label: '', href: null })
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-6 px-3 sm:px-4">
      {/* 面包屑导航 */}
      <nav className="flex items-center gap-1.5 text-xs text-[#999] mb-4 flex-wrap">
        <Link href="/" className="hover:text-[#b45309] transition-colors inline-flex items-center gap-1">
          <Home size={12} />
          首页
        </Link>
        {segments.length >= 2 && (
          <>
            <ChevronRight size={12} className="text-[#ccc]" />
            <Link href={`/books/${segments[1]}`} className="hover:text-[#b45309] transition-colors">
              {segments[1] === 'militia' ? '民兵训练手册' : '新赤脚医生手册'}
            </Link>
          </>
        )}
        {segments.length >= 3 && (
          <>
            <ChevronRight size={12} className="text-[#ccc]" />
            <span className="text-[#666]">章节内容</span>
          </>
        )}
      </nav>

      {children}
    </div>
  )
}
