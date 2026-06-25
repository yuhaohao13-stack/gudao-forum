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
  const [resetMode, setResetMode] = useState(false); const [resetSent, setResetSent] = useState(false)
  const supabase = createClient(); const router = useRouter()

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => setCooldown(c => Math.max(0, c - 1)), 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const handleLogin = async (e) => {
    e.preventDefault(); setError('')
    if (cooldown > 0) return
    const rl = checkRateLimit(`login:${email}`, 5, 60000)
    if (!rl.allowed) { setError(`登录尝试过于频繁，请 ${rl.retryAfter} 秒后再试`); setCooldown(rl.retryAfter); return }
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message === 'Invalid login credentials' ? '邮箱或密码错误' : `错误: ${error.message}`)
    } else {
      router.push('/'); router.refresh()
    }
    setLoading(false)
  }

  const handleReset = async (e) => {
    e.preventDefault(); setError('')
    if (!email.trim()) { setError('请输入邮箱'); return }
    setLoading(true)
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: 'https://www.gudaoforum.com/auth/callback?next=/',
    })
    if (resetError) setError('发送失败: ' + resetError.message)
    else setResetSent(true)
    setLoading(false)
  }

  if (resetSent) return (
    <div className="max-w-sm mx-auto mt-16 anim-fade-in">
      <div className="card p-8 text-center">
        <div className="text-3xl mb-3">📧</div>
        <h1 className="text-xl font-bold font-serif text-[#1a1a1a] mb-2">重置邮件已发送</h1>
        <p className="text-sm text-[#999]">请检查 <strong className="text-[#c23531]">{email}</strong> 的收件箱，点击邮件中的链接重置密码</p>
        <button onClick={() => { setResetMode(false); setResetSent(false) }} className="btn-ghost mt-4">返回登录</button>
      </div>
    </div>
  )

  if (resetMode) return (
    <div className="max-w-sm mx-auto mt-16 anim-fade-in">
      <div className="card p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold font-serif text-[#1a1a1a]">重置密码</h1>
          <div className="w-10 h-0.5 bg-[#c23531] mx-auto mt-3 rounded-full" />
        </div>
        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-xs text-[#888] mb-1.5 font-medium">邮箱</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="your@email.com" autoComplete="email" />
          </div>
          {error && <div className="text-xs text-[#c23531] bg-[#c23531]/8 border border-[#c23531]/15 rounded-lg p-3">{error}</div>}
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? '发送中...' : '发送重置邮件'}
          </button>
          <button type="button" onClick={() => { setResetMode(false); setError('') }} className="btn-ghost w-full justify-center text-xs">返回登录</button>
        </form>
      </div>
    </div>
  )

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
          <div className="flex items-center justify-between text-xs mt-2">
            <button type="button" onClick={() => setResetMode(true)} className="text-[#999] hover:text-[#c23531] transition-colors">忘记密码？</button>
            <Link href="/register" className="text-[#c23531] hover:underline font-medium">注册</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
