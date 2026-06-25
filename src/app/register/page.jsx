'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { validatePassword, checkRateLimit } from '@/lib/moderation'

export default function RegisterPage() {
  const [username, setUsername] = useState(''); const [email, setEmail] = useState('')
  const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const supabase = createClient(); const router = useRouter()

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => setCooldown(c => Math.max(0, c - 1)), 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const handleRegister = async (e) => {
    e.preventDefault(); setError('')
    if (cooldown > 0) return

    // 昵称校验
    if (username.trim().length < 2) { setError('昵称至少 2 个字符'); return }
    if (username.trim().length > 20) { setError('昵称不能超过 20 个字符'); return }
    if (!/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/.test(username.trim())) { setError('昵称只能包含中文、字母、数字和下划线'); return }

    // 密码强度校验
    const pwCheck = validatePassword(password)
    if (!pwCheck.valid) { setError(pwCheck.error); return }

    // 速率限制
    const rl = checkRateLimit(`register:${email}`, 3, 60000)
    if (!rl.allowed) {
      setError(`注册过于频繁，请 ${rl.retryAfter} 秒后再试`)
      setCooldown(rl.retryAfter)
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username: username.trim(), display_name: username.trim() } }
    })

    if (error) {
      setError(
        error.message.includes('already') ? '该邮箱已注册' :
        error.message.includes('weak') ? '密码强度不够' :
        error.message
      )
    } else {
      router.push('/login?registered=true')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-sm mx-auto mt-16 anim-fade-in">
      <div className="card p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold font-serif text-[#1a1a1a]">注册</h1>
          <div className="w-10 h-0.5 bg-[#c23531] mx-auto mt-3 rounded-full" />
          <p className="text-[#bbb] text-xs mt-2">加入古道论坛</p>
        </div>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs text-[#888] mb-1.5 font-medium">昵称</label>
            <input type="text" required value={username} onChange={e => setUsername(e.target.value)} className="input" placeholder="中文、字母、数字" maxLength={20} autoComplete="username" />
          </div>
          <div>
            <label className="block text-xs text-[#888] mb-1.5 font-medium">邮箱</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="your@email.com" autoComplete="email" />
          </div>
          <div>
            <label className="block text-xs text-[#888] mb-1.5 font-medium">密码</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input" placeholder="至少8位，需包含字母和数字" autoComplete="new-password" />
            <p className="text-[10px] text-[#ccc] mt-1">至少 8 位，需包含字母和数字</p>
          </div>
          {error && <div className="text-xs text-[#c23531] bg-[#c23531]/8 border border-[#c23531]/15 rounded-lg p-3">{error}</div>}
          <button type="submit" disabled={loading || cooldown > 0} className="btn-primary w-full justify-center">
            {loading ? '注册中...' : cooldown > 0 ? `请等待 ${cooldown}s` : '注册'}
          </button>
        </form>
        <p className="text-center text-xs text-[#bbb] mt-5">已有账号？<Link href="/login" className="text-[#c23531] hover:underline font-medium ml-1">登录</Link></p>
      </div>
    </div>
  )
}
