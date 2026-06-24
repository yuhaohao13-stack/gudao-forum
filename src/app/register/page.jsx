'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [username, setUsername] = useState(''); const [email, setEmail] = useState('')
  const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  const supabase = createClient(); const router = useRouter()

  const handleRegister = async (e) => {
    e.preventDefault(); setError('')
    if (password.length < 6) { setError('密码至少6位'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { username, display_name: username } } })
    if (error) setError(error.message.includes('already') ? '该邮箱已注册' : error.message)
    else router.push('/login?registered=true')
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
            <input type="text" required value={username} onChange={e => setUsername(e.target.value)} className="input" placeholder="你的昵称" />
          </div>
          <div>
            <label className="block text-xs text-[#888] mb-1.5 font-medium">邮箱</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-xs text-[#888] mb-1.5 font-medium">密码</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input" placeholder="至少6位" />
          </div>
          {error && <div className="text-xs text-[#c23531] bg-[#c23531]/8 border border-[#c23531]/15 rounded-lg p-3">{error}</div>}
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">{loading ? '注册中...' : '注册'}</button>
        </form>
        <p className="text-center text-xs text-[#bbb] mt-5">已有账号？<Link href="/login" className="text-[#c23531] hover:underline font-medium ml-1">登录</Link></p>
      </div>
    </div>
  )
}
