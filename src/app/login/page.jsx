'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('')
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  const supabase = createClient(); const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message === 'Invalid login credentials' ? '邮箱或密码错误' : error.message === 'Email not confirmed' ? '邮箱未验证，请检查收件箱' : error.message)
    else { router.push('/'); router.refresh() }
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
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-xs text-[#888] mb-1.5 font-medium">密码</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input" />
          </div>
          {error && <div className="text-xs text-[#c23531] bg-[#c23531]/8 border border-[#c23531]/15 rounded-lg p-3">{error}</div>}
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">{loading ? '登录中...' : '登录'}</button>
        </form>
        <p className="text-center text-xs text-[#bbb] mt-5">还没有账号？<Link href="/register" className="text-[#c23531] hover:underline font-medium ml-1">注册</Link></p>
      </div>
    </div>
  )
}
