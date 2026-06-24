'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message === 'Invalid login credentials' ? '邮箱或密码错误'
        : error.message === 'Email not confirmed' ? '邮箱未验证' : error.message)
    } else { router.push('/'); router.refresh() }
    setLoading(false)
  }

  return (
    <div className="max-w-sm mx-auto mt-12 fade-in">
      <div className="paper-card p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#111]">登录</h1>
          <div className="w-8 h-0.5 bg-[#c23531] mx-auto mt-2 opacity-60" />
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs text-[#666] mb-1 font-medium">邮箱</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="ink-input" placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-xs text-[#666] mb-1 font-medium">密码</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="ink-input" />
          </div>
          {error && <div className="text-[#c23531] text-xs bg-[#c23531]/10 border border-[#c23531]/20 rounded-lg p-2.5">{error}</div>}
          <button type="submit" disabled={loading} className="btn-red w-full flex items-center justify-center gap-2">
            {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
        <p className="text-center text-xs text-[#8c8c8c] mt-4">
          还没有账号？<Link href="/register" className="text-[#c23531] hover:underline font-medium">注册</Link>
        </p>
      </div>
    </div>
  )
}
