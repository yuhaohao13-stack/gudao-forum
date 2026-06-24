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

    if (password.length < 6) {
      setError('密码至少6位')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, display_name: username },
      },
    })

    if (error) {
      if (error.message.includes('already')) {
        setError('该邮箱已注册')
      } else {
        setError(error.message)
      }
    } else {
      router.push('/login?registered=true')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-sm mx-auto mt-12">
      <h1 className="text-2xl font-bold text-center mb-6">注册</h1>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-300 mb-1">昵称</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="你的昵称"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">邮箱</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">密码</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="至少6位"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg py-2 font-semibold transition-colors"
        >
          {loading ? '注册中...' : '注册'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-400 mt-4">
        已有账号？{' '}
        <Link href="/login" className="text-blue-400 hover:underline">登录</Link>
      </p>
    </div>
  )
}
