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
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? '邮箱或密码错误'
        : error.message === 'Email not confirmed'
          ? '邮箱未验证，请检查收件箱'
          : error.message)
    } else {
      router.push('/')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="max-w-sm mx-auto mt-12">
      <h1 className="text-2xl font-bold text-center mb-6">登录</h1>

      <form onSubmit={handleLogin} className="space-y-4">
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
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg py-2 font-semibold transition-colors"
        >
          {loading ? '登录中...' : '登录'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-400 mt-4">
        还没有账号？{' '}
        <Link href="/register" className="text-blue-400 hover:underline">注册</Link>
      </p>
    </div>
  )
}
