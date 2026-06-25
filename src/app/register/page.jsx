'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { validatePassword, validatePhone, checkRateLimit } from '@/lib/moderation'

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '', email: '', password: '', phone: '', gender: 'male',
    hobbies: '', bio: '', resume: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => setCooldown(c => Math.max(0, c - 1)), 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (cooldown > 0) return

    const { username, email, password, phone, gender, hobbies, bio, resume } = form

    // 昵称校验
    if (username.trim().length < 2) { setError('昵称至少 2 个字符'); return }
    if (username.trim().length > 20) { setError('昵称不能超过 20 个字符'); return }
    if (!/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/.test(username.trim())) { setError('昵称只能包含中文、字母、数字和下划线'); return }

    // 手机号校验
    const phoneCheck = validatePhone(phone)
    if (!phoneCheck.valid) { setError(phoneCheck.error); return }

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
      options: {
        data: {
          username: username.trim(),
          display_name: username.trim(),
          phone: phoneCheck.phone,
          gender,
          hobbies: hobbies.trim(),
          bio: bio.trim(),
          resume: resume.trim(),
        },
      },
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

  const inputClass = "input"

  return (
    <div className="max-w-lg mx-auto mt-8 mb-16 anim-fade-in">
      <div className="card p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold font-serif text-[#1a1a1a]">注册</h1>
          <div className="w-10 h-0.5 bg-[#c23531] mx-auto mt-3 rounded-full" />
          <p className="text-[#bbb] text-xs mt-2">加入古道论坛</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* 必填区 */}
          <div className="space-y-4">
            <p className="text-[10px] text-[#c23531] font-medium tracking-wide">必填信息</p>

            <div>
              <label className="block text-xs text-[#888] mb-1.5 font-medium">昵称 / 姓名 <span className="text-[#c23531]">*</span></label>
              <input type="text" required value={form.username}
                onChange={e => update('username', e.target.value)}
                className={inputClass} placeholder="例如：张三" maxLength={20} autoComplete="name" />
            </div>

            <div>
              <label className="block text-xs text-[#888] mb-1.5 font-medium">邮箱 <span className="text-[#c23531]">*</span></label>
              <input type="email" required value={form.email}
                onChange={e => update('email', e.target.value)}
                className={inputClass} placeholder="your@email.com" autoComplete="email" />
            </div>

            <div>
              <label className="block text-xs text-[#888] mb-1.5 font-medium">手机号 <span className="text-[#c23531]">*</span></label>
              <input type="tel" required value={form.phone}
                onChange={e => update('phone', e.target.value)}
                className={inputClass} placeholder="13812345678" maxLength={11} autoComplete="tel" />
              <p className="text-[10px] text-[#ccc] mt-1">请输入真实的 11 位手机号</p>
            </div>

            <div>
              <label className="block text-xs text-[#888] mb-1.5 font-medium">性别 <span className="text-[#c23531]">*</span></label>
              <div className="flex gap-3">
                {[
                  { value: 'male', label: '👨 男' },
                  { value: 'female', label: '👩 女' },
                  { value: 'other', label: '🔮 其他' },
                ].map(opt => (
                  <label key={opt.value}
                    className={`flex-1 flex items-center justify-center gap-1 p-3 rounded-xl border cursor-pointer transition-all text-sm font-medium ${
                      form.gender === opt.value
                        ? 'border-[#c23531] bg-[#c23531]/5 text-[#c23531]'
                        : 'border-[#eee8dc] text-[#888] hover:border-[#c23531]/30'
                    }`}>
                    <input type="radio" name="gender" value={opt.value}
                      checked={form.gender === opt.value}
                      onChange={e => update('gender', e.target.value)}
                      className="hidden" />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#888] mb-1.5 font-medium">密码 <span className="text-[#c23531]">*</span></label>
              <input type="password" required value={form.password}
                onChange={e => update('password', e.target.value)}
                className={inputClass} placeholder="至少8位，需包含字母和数字" autoComplete="new-password" />
              <p className="text-[10px] text-[#ccc] mt-1">至少 8 位，需包含字母和数字</p>
            </div>
          </div>

          {/* 选填区 */}
          <div className="pt-4 border-t border-[#f0e8dc] space-y-4">
            <p className="text-[10px] text-[#999] tracking-wide">选填信息</p>

            <div>
              <label className="block text-xs text-[#888] mb-1.5 font-medium">兴趣爱好</label>
              <input type="text" value={form.hobbies}
                onChange={e => update('hobbies', e.target.value)}
                className={inputClass} placeholder="例如：摄影、编程、读书" />
            </div>

            <div>
              <label className="block text-xs text-[#888] mb-1.5 font-medium">个人介绍</label>
              <textarea value={form.bio}
                onChange={e => update('bio', e.target.value)}
                className={`${inputClass} min-h-[80px] resize-none`} placeholder="简单介绍一下自己..." maxLength={500} />
              <p className="text-[10px] text-[#ccc] mt-1">{form.bio.length}/500</p>
            </div>

            <div>
              <label className="block text-xs text-[#888] mb-1.5 font-medium">简历 / 经历</label>
              <textarea value={form.resume}
                onChange={e => update('resume', e.target.value)}
                className={`${inputClass} min-h-[100px] resize-none`} placeholder="工作经历、专业技能等..." maxLength={2000} />
              <p className="text-[10px] text-[#ccc] mt-1">{form.resume.length}/2000</p>
            </div>
          </div>

          {error && <div className="text-xs text-[#c23531] bg-[#c23531]/8 border border-[#c23531]/15 rounded-lg p-3">{error}</div>}

          <button type="submit" disabled={loading || cooldown > 0}
            className="btn-primary w-full justify-center !py-2.5">
            {loading ? '注册中...' : cooldown > 0 ? `请等待 ${cooldown}s` : '注册'}
          </button>
        </form>

        <p className="text-center text-xs text-[#bbb] mt-5">
          已有账号？<Link href="/login" className="text-[#c23531] hover:underline font-medium ml-1">登录</Link>
        </p>
      </div>
    </div>
  )
}
