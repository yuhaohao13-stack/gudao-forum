'use client'

import { useDonate } from './DonateContext'

export default function DonateButton({ className = '' }) {
  const { openModal } = useDonate()
  return (
    <button onClick={openModal} className={className || "btn-ghost flex items-center gap-1"}>
      💖 打赏
    </button>
  )
}
