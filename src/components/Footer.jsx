export default function Footer() {
  return (
    <footer className="mt-auto py-8 text-center border-t border-slate-800/30">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-center gap-3 text-sm text-slate-500 mb-2">
          <span className="text-amber-500/50">🏛️</span>
          <span className="text-gradient text-xs">古道论坛</span>
          <span className="text-amber-500/50">🏛️</span>
        </div>
        <p className="text-xs text-slate-600">
          &copy; {new Date().getFullYear()} 古道论坛 &middot; 自由讨论，友善交流
        </p>
        <p className="text-[10px] text-slate-700 mt-1">
          Powered by Next.js &middot; Supabase &middot; PWA
        </p>
      </div>
    </footer>
  )
}
