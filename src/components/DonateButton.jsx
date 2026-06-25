'use client'

export default function DonateButton({ className = '' }) {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent('open-donate'))}
      className={className || "btn-ghost flex items-center gap-1 font-bold"}
    >
      💖 打赏
    </button>
  )
}
