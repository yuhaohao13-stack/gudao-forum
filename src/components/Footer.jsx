export default function Footer() {
  return (
    <footer className="mt-auto py-6">
      <div className="ink-divider mx-4 mb-4" />
      <div className="max-w-4xl mx-auto px-4 text-center">
        <p className="text-xs text-[#b0a898] tracking-wider">
          🏛️ 古道论坛 &copy; {new Date().getFullYear()} · 以文会友，以友辅仁
        </p>
        <p className="text-[10px] text-[#c8c0b0] mt-1">Next.js · Supabase</p>
      </div>
    </footer>
  )
}
