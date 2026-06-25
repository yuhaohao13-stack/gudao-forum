'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { checkRateLimit, validateInput } from '@/lib/moderation'

export default function LoginPage() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('')
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const supabase = createClient(); const router = useRouter()

  // 冷却倒计时
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => setCooldown(c => Math.max(0, c - 1)), 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const handleLogin = async (e) => {
    e.preventDefault(); setError('')
    if (cooldown > 0) return

    // 输入校验
    const inputCheck = validateInput(email, 100) && validateInput(password, 128)
    if (!inputCheck) return

    // 速率限制（按 IP 用 email 代替）
    const rl = checkRateLimit(`login:${email}`, 5, 60000)
    if (!rl.allowed) {
      setError(`登录尝试过于频繁，请 ${rl.retryAfter} 秒后再试`)
      setCooldown(rl.retryAfter)
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      const msg = error.message === 'Invalid login credentials'
        ? '邮箱或密码错误'
        : error.message === 'Email not confirmed'
          ? '邮箱未验证，请检查收件箱'
          : error.message === 'Invalid API key'
            ? '服务暂时不可用'
            : error.message
      setError(msg)
    } else {
      router.push('/'); router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="max-w-sm mx-auto mt-16 anim-fade-in">
      <div className="card p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold font-serif text-[#1a1a1a]">登录</h1>
          <div className="w-10 h-0.5 bg-[#c23531] mx-auto mt-3 rounded-full" />
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs text-[#888] mb-1.5 font-medium">邮箱</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="your@email.com" autoComplete="email" />
          </div>
          <div>
            <label className="block text-xs text-[#888] mb-1.5 font-medium">密码</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input" autoComplete="current-password" />
          </div>
          {error && <div className="text-xs text-[#c23531] bg-[#c23531]/8 border border-[#c23531]/15 rounded-lg p-3">{error}</div>}
          <button type="submit" disabled={loading || cooldown > 0} className="btn-primary w-full justify-center">
            {loading ? '登录中...' : cooldown > 0 ? `请等待 ${cooldown}s` : '登录'}
          </button>
        </form>
        <p className="text-center text-xs text-[#bbb] mt-5">还没有账号？<Link href="/register" className="text-[#c23531] hover:underline font-medium ml-1">注册</Link></p>
      </div>
    </div>
  )
}
