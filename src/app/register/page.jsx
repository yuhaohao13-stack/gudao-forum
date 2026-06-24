'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('密码至少6位'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { username, display_name: username } },
    })
    if (error) setError(error.message.includes('already') ? '该邮箱已注册' : error.message)
    else router.push('/login?registered=true')
    setLoading(false)
  }

  return (
    <div className="max-w-sm mx-auto mt-12 fade-in">
      <div className="paper-card p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#111]">注册</h1>
          <div className="w-8 h-0.5 bg-[#c23531] mx-auto mt-2 opacity-60" />
          <p className="text-[#8c8c8c] text-xs mt-2">加入古道论坛</p>
        </div>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs text-[#666] mb-1 font-medium">昵称</label>
            <input type="text" required value={username} onChange={e => setUsername(e.target.value)} className="ink-input" placeholder="你的昵称" />
          </div>
          <div>
            <label className="block text-xs text-[#666] mb-1 font-medium">邮箱</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="ink-input" placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-xs text-[#666] mb-1 font-medium">密码</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="ink-input" placeholder="至少6位" />
          </div>
          {error && <div className="text-[#c23531] text-xs bg-[#c23531]/10 border border-[#c23531]/20 rounded-lg p-2.5">{error}</div>}
          <button type="submit" disabled={loading} className="btn-red w-full flex items-center justify-center gap-2">
            {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading ? '注册中...' : '注册'}
          </button>
        </form>
        <p className="text-center text-xs text-[#8c8c8c] mt-4">
          已有账号？<Link href="/login" className="text-[#c23531] hover:underline font-medium">登录</Link>
        </p>
      </div>
    </div>
  )
}
