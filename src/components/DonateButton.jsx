'use client'

import { Heart } from 'lucide-react'

export default function DonateButton({ className = '' }) {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent('open-donate'))}
      className={className || "btn-ghost flex items-center gap-1"}
    >
      <Heart size={16} />
      <span>打赏</span>
    </button>
  )
}
