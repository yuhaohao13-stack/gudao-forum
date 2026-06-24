export default function Footer() {
  return (
    <footer className="mt-auto py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="border-t border-[#eee8dc] pt-6 text-center">
          <p className="text-xs text-[#b0a898] tracking-wider">
            🏛️ 古道论坛 &copy; {new Date().getFullYear()} — 以文会友，以友辅仁
          </p>
          <p className="text-[10px] text-[#d0c8b8] mt-1">
            Next.js · Supabase · PWA
          </p>
        </div>
      </div>
    </footer>
  )
}
