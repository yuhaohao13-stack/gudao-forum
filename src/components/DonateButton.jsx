'use client'
import { Heart } from 'lucide-react'

export default function DonateButton({ className = '' }) {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent('open-donate'))}
      className={className || "btn-ghost flex items-center gap-1 font-bold"}
    >
      <Heart size={20} className="inline-block align-text-bottom" /> 打赏
    </button>
  )
}
