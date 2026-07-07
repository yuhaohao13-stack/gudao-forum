'use client'
import Link from 'next/link'
import { Landmark } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="mt-auto py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
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
