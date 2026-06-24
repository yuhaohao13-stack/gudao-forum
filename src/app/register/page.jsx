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
    if (error) {
      setError(error.message.includes('already') ? '该邮箱已注册' : error.message)
    } else {
      router.push('/login?registered=true')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-sm mx-auto mt-12 fade-in">
      <div className="glass-card p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gradient">注册</h1>
          <p className="text-slate-500 text-sm mt-1">加入古道论坛社区</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">昵称</label>
            <input type="text" required value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field" placeholder="你的昵称" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">邮箱</label>
            <input type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field" placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">密码</label>
            <input type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field" placeholder="至少6位" />
          </div>
          {error && (
            <div className="text-red-400 text-xs bg-red-900/20 border border-red-800/30 rounded-lg p-2.5">
              {error}
            </div>
          )}
          <button type="submit" disabled={loading}
            className="btn-amber w-full flex items-center justify-center gap-2"
          >
            {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading ? '注册中...' : '注册'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-4">
          已有账号？{' '}
          <Link href="/login" className="text-amber-400 hover:underline font-medium">登录</Link>
        </p>
      </div>
    </div>
  )
}
