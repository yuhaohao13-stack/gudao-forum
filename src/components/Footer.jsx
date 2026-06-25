import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-auto py-8 sm:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="border-t border-[#ece8e0] pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <p className="text-sm font-serif font-semibold text-[#666] tracking-wide">
                🏛️ 古道论坛
              </p>
              <p className="text-xs text-[#b0a898] mt-0.5">
                以文会友，以友辅仁
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#b0a898]">
              <Link href="/" className="hover:text-[#c23531] transition-colors">首页</Link>
              <Link href="/chat" className="hover:text-[#c23531] transition-colors">聊天室</Link>
              <span>·</span>
              <span>Next.js · Supabase</span>
            </div>
          </div>
          <p className="text-[10px] text-[#d0c8b8] text-center mt-4">
            &copy; {new Date().getFullYear()} 古道论坛
          </p>
        </div>
      </div>
    </footer>
  )
}
