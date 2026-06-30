'use client'
import { Heart } from 'lucide-react'

export default function DonateButton({ className = '' }) {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent('open-donate'))}
      className={className || "btn-ghost flex items-center gap-1 font-bold"}
    >
      <Heart size={32} className="inline-block align-text-bottom" /> <span className="text-lg sm:text-xl">打赏</span>
    </button>
  )
}
