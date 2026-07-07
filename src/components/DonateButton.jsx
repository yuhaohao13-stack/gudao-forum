'use client'
import { Heart } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'

export default function DonateButton({ className = '' }) {
  const { t } = useLanguage()

  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent('open-donate'))}
      className={
        className ||
        'flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors px-2 py-1.5 rounded-md hover:bg-slate-50'
      }
    >
      <Heart size={13} />
      <span>赞助</span>
    </button>
  )
}
