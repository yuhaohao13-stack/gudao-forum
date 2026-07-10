'use client'

export default function SoundToggle({ enabled, onToggle, size = 'md' }) {
  const btnSize = size === 'lg' ? 'w-[44px] h-[44px] text-[22px]' : 'w-[36px] h-[36px] text-[18px]'
  return (
    <button
      onClick={onToggle}
      className={`${btnSize} flex items-center justify-center rounded-full border-2 shadow-lg transition-all duration-200 active:scale-90 touch-manipulation ${
        enabled
          ? 'bg-[#e8f5e9] border-[#2e7d32]'
          : 'bg-[#f5f5f5] border-[#ccc]'
      }`}
      title={enabled ? '关闭声音' : '开启声音'}
    >
      {enabled ? '🔊' : '🔇'}
    </button>
  )
}
