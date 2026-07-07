'use client'
import { Heart } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'

export default function DonateButton({ className = '' }) {
  const { t } = useLanguage()
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent('open-donate'))}
      className={className || "btn-ghost flex items-center gap-1 font-semibold"}
    >
      <Heart size={16} className="inline-block" fill="currentColor" /> <span className="text-sm">打赏</span>
    </button>
  )
}
