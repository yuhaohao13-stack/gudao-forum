'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="mt-auto border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <div className="w-5 h-5 rounded bg-slate-700 flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">古</span>
              </div>
              <span className="text-sm font-semibold text-slate-600">古道论坛</span>
            </div>
            <p className="text-xs text-slate-400">{t('footer.slogan')}</p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-600 transition-colors">
              首页
            </Link>
            <Link href="/chat" className="hover:text-slate-600 transition-colors">
              聊天室
            </Link>
            <Link href="/search" className="hover:text-slate-600 transition-colors">
              搜索
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-[10px] text-slate-300 text-center mt-6">
          &copy; {new Date().getFullYear()} 古道论坛
        </p>
      </div>
    </footer>
  )
}
