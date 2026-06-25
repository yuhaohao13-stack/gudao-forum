'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { checkRateLimit } from '@/lib/moderation'

export default function LoginPage() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('')
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [resetMode, setResetMode] = useState(false)
  const [resetName, setResetName] = useState(''); const [resetDob, setResetDob] = useState('')
  const [foundEmail, setFoundEmail] = useState('')
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
    if (!rl.allowed) { setError(`登录尝试过于频繁`); setCooldown(rl.retryAfter); return }
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message === 'Invalid login credentials' ? '邮箱或密码错误' : `错误: ${error.message}`)
    else { router.push('/'); router.refresh() }
    setLoading(false)
  }

  const handleReset = async (e) => {
    e.preventDefault(); setError(''); setFoundEmail('')
    if (!resetName.trim() || !resetDob) { setError('请填写姓名和出生日期'); return }
    setLoading(true)
    // 调用存储函数查找邮箱
    const { data, error: fnErr } = await supabase.rpc('reset_password_by_profile', {
      target_name: resetName.trim(),
      target_dob: resetDob,
    })
    if (fnErr || !data || data === 'NOT_FOUND') { setError('姓名与出生日期不匹配，请检查'); setLoading(false); return }
    setFoundEmail(data)
    setLoading(false)
  }

  const sendResetEmail = async () => {
    setLoading(true); setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(foundEmail, {
      redirectTo: 'https://www.gudaoforum.com/auth/callback?next=/',
    })
    if (error) setError('发送失败: ' + error.message)
    else setFoundEmail('SENT')
    setLoading(false)
  }

  // ===== UI =====

  const loginForm = (
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
            <button type="button" onClick={() => { setResetMode(true); setError('') }} className="text-[#999] hover:text-[#c23531] transition-colors">忘记密码？</button>
            <Link href="/register" className="text-[#c23531] hover:underline font-medium">注册</Link>
          </div>
        </form>
      </div>
    </div>
  )

  const resetForm = (
    <div className="max-w-sm mx-auto mt-16 anim-fade-in">
      <div className="card p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold font-serif text-[#1a1a1a]">找回密码</h1>
          <div className="w-10 h-0.5 bg-[#c23531] mx-auto mt-3 rounded-full" />
          <p className="text-xs text-[#999] mt-2">输入注册时的姓名和出生日期</p>
        </div>

        {foundEmail === 'SENT' ? (
          <div className="text-center py-4">
            <div className="text-3xl mb-3">📧</div>
            <p className="text-sm text-[#666]">重置邮件已发送到您的注册邮箱</p>
            <p className="text-xs text-[#999] mt-2">请检查收件箱，点击链接重置密码</p>
            <button onClick={() => { setResetMode(false); setFoundEmail(''); setError('') }}
              className="btn-ghost mt-4">返回登录</button>
          </div>
        ) : foundEmail ? (
          <div className="text-center py-4 space-y-4">
            <div className="text-3xl mb-2">✅</div>
            <p className="text-sm text-[#666]">身份验证通过</p>
            <p className="text-xs text-[#999]">注册邮箱：<strong className="text-[#c23531]">{foundEmail.replace(/(.{3}).+(.{2})/, '$1****$2')}</strong></p>
            <button onClick={sendResetEmail} disabled={loading}
              className="btn-primary">发送重置邮件</button>
            <div>
              <button onClick={() => { setResetMode(false); setFoundEmail(''); setError('') }}
                className="btn-ghost text-xs">返回登录</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs text-[#888] mb-1.5 font-medium">姓名</label>
              <input type="text" required value={resetName} onChange={e => setResetName(e.target.value)}
                className="input" placeholder="注册时的姓名" autoComplete="name" />
            </div>
            <div>
              <label className="block text-xs text-[#888] mb-1.5 font-medium">出生日期</label>
              <input type="date" required value={resetDob} onChange={e => setResetDob(e.target.value)}
                className="input" />
            </div>
            {error && <div className="text-xs text-[#c23531] bg-[#c23531]/8 border border-[#c23531]/15 rounded-lg p-3">{error}</div>}
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? '验证中...' : '验证身份'}
            </button>
            <button type="button" onClick={() => { setResetMode(false); setError(''); setFoundEmail('') }}
              className="btn-ghost w-full justify-center text-xs">返回登录</button>
          </form>
        )}
      </div>
    </div>
  )

  return resetMode ? resetForm : loginForm
}
