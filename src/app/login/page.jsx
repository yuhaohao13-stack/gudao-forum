'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Cake, Smartphone, CheckCircle, PartyPopper, ArrowRight } from 'lucide-react'
import { checkRateLimit } from '@/lib/moderation'
import { useLanguage } from '@/lib/LanguageContext'

export default function LoginPage() {
  const { t } = useLanguage()
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('')
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [resetStep, setResetStep] = useState(0)  // 0=none, 1=输入邮箱, 2=验证, 3=设置新密码, 4=完成
  const [resetEmail, setResetEmail] = useState('')
  const [resetMethod, setResetMethod] = useState('name')
  const [resetName, setResetName] = useState(''); const [resetDob, setResetDob] = useState('')
  const [resetPhone, setResetPhone] = useState('')
  const [newPassword, setNewPassword] = useState(''); const [confirmPassword, setConfirmPassword] = useState('')
  const supabase = createClient(); const router = useRouter()

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => setCooldown(c => Math.max(0, c - 1)), 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  // ——— 登录 ———
  const handleLogin = async (e) => {
    e.preventDefault(); setError('')
    if (cooldown > 0) return
    const rl = checkRateLimit(`login:${email}`, 5, 60000)
    if (!rl.allowed) { setError(`登录尝试过于频繁`); setCooldown(rl.retryAfter); return }
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) setError(err.message === 'Invalid login credentials' ? '邮箱或密码错误' : `错误: ${err.message}`)
    else { router.push('/'); router.refresh() }
    setLoading(false)
  }

  // ——— 步骤1：验证邮箱是否存在 ———
  const handleStep1 = async (e) => {
    e.preventDefault(); setError('')
    if (!resetEmail.trim()) { setError('请输入邮箱'); return }
    setLoading(true)
    // 检查邮箱是否注册（试试登录就知道存不存在）
    const { error: err } = await supabase.auth.signInWithPassword({ email: resetEmail.trim(), password: '___check_only___' })
    if (err && err.message === 'Invalid login credentials') {
      // 邮箱存在（密码不对说明存在）
      setResetStep(2)
    } else if (err && err.message === 'Email not confirmed') {
      setResetStep(2)
    } else {
      setError('该邮箱未注册，请检查')
    }
    setLoading(false)
  }

  // ——— 步骤2：验证身份（三选一） ———
  const handleStep2 = async (e) => {
    e.preventDefault(); setError('')
    setLoading(true)

    if (resetMethod === 'name') {
      if (!resetName.trim() || !resetDob) { setError('请填写姓名和出生日期'); setLoading(false); return }
      const { data } = await supabase.rpc('reset_password_by_profile', {
        target_name: resetName.trim(), target_dob: resetDob,
      })
      if (!data || data === 'NOT_FOUND') { setError('姓名与出生日期不匹配'); setLoading(false); return }
      if (data === resetEmail.trim()) { setResetStep(3); setLoading(false); return }
      setError('信息与账号不匹配'); setLoading(false); return
    }

    if (resetMethod === 'dob') {
      if (!resetDob) { setError('请选择出生日期'); setLoading(false); return }
      const { data: profiles } = await supabase.from('profiles').select('id').eq('date_of_birth', resetDob)
      if (!profiles || profiles.length === 0) { setError('出生日期不匹配'); setLoading(false); return }
      // 检查这批用户里是否有当前邮箱
      const ids = profiles.map(p => p.id)
      const { data: fnData } = await supabase.rpc('get_email_by_user_id', { target_id: ids[0] })
      if (fnData === resetEmail.trim()) { setResetStep(3); setLoading(false); return }
      setError('出生日期不匹配'); setLoading(false)
    }

    if (resetMethod === 'phone') {
      if (!resetPhone.trim()) { setError('请输入手机号'); setLoading(false); return }
      const cleaned = resetPhone.replace(/\s|-/g, '')
      if (!/^1[3-9]\d{9}$/.test(cleaned)) { setError('请输入正确的11位手机号'); setLoading(false); return }
      const { data: profiles } = await supabase.from('profiles').select('id').eq('phone', cleaned)
      if (!profiles || profiles.length === 0) { setError('该手机号未注册'); setLoading(false); return }
      setResetStep(3); setLoading(false)
    }
  }

  // ——— 步骤3：设置新密码 ———
  const handleStep3 = async (e) => {
    e.preventDefault(); setError('')
    if (newPassword.length < 8) { setError('密码至少8位'); return }
    if (newPassword !== confirmPassword) { setError('两次密码不一致'); return }
    if (!/[A-Za-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) { setError('密码需包含字母和数字'); return }
    setLoading(true)
    const { data, error: rpcErr } = await supabase.rpc('reset_user_password', {
      target_email: resetEmail.trim(),
      new_password: newPassword,
    })
    if (rpcErr || data !== 'OK') { setError('重置失败，请稍后再试'); setLoading(false); return }
    setResetStep(4); setLoading(false)
  }

  // ===== UI =====
  const methodBtns = [
    { key: 'name', label: <><User size={14} className="inline-block align-text-bottom" /> {t('profile.name')}+{t('profile.dob')}</> },
    { key: 'dob', label: <><Cake size={14} className="inline-block align-text-bottom" /> {t('profile.dob')}</> },
    { key: 'phone', label: <><Smartphone size={14} className="inline-block align-text-bottom" /> {t('profile.phone')}</> },
  ]

  const loginForm = (
    <div className="max-w-sm mx-auto mt-16 anim-fade-in">
      <div className="card p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">{t('auth.login')}</h1>
          <div className="w-10 h-0.5 bg-[#c23531] mx-auto mt-3 rounded-full" />
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div><label className="block text-xs text-[#888] mb-1.5 font-medium">{t('auth.email')}</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="your@email.com" autoComplete="email" /></div>
          <div><label className="block text-xs text-[#888] mb-1.5 font-medium">{t('auth.password')}</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input" autoComplete="current-password" /></div>
          {error && <div className="text-xs text-[#c23531] bg-[#c23531]/8 border border-[#c23531]/15 rounded-lg p-3">{error}</div>}
          <button type="submit" disabled={loading || cooldown > 0} className="btn-primary w-full justify-center">
            {loading ? t('auth.logging_in') : cooldown > 0 ? `${t('auth.wait')} ${cooldown}${t('common.seconds')}` : t('auth.login')}
          </button>
          <div className="flex items-center justify-between text-xs mt-2">
            <button type="button" onClick={() => { setResetStep(1); setError(''); setResetEmail(email) }}
              className="text-[#999] hover:text-[#c23531] transition-colors">{t('auth.forgot_password')}</button>
            <Link href="/register" className="text-[#c23531] hover:underline font-medium">{t('auth.register')}</Link>
          </div>
        </form>
      </div>
    </div>
  )

  // 步骤1：输入邮箱
  if (resetStep === 1) return (
    <div className="max-w-sm mx-auto mt-16 anim-fade-in">
      <div className="card p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">{t('auth.reset_password')}</h1>
          <div className="w-10 h-0.5 bg-[#c23531] mx-auto mt-3 rounded-full" />
          <p className="text-xs text-[#999] mt-2">{t('auth.enter_email')}</p>
        </div>
        <form onSubmit={handleStep1} className="space-y-4">
          <div><label className="block text-xs text-[#888] mb-1.5 font-medium">{t('auth.email')}</label>
            <input type="email" required value={resetEmail} onChange={e => setResetEmail(e.target.value)}
              className="input" placeholder="your@email.com" autoComplete="email" /></div>
          {error && <div className="text-xs text-[#c23531] bg-[#c23531]/8 border border-[#c23531]/15 rounded-lg p-3">{error}</div>}
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">{loading ? t('auth.wait')+'...' : '下一步'}</button>
          <button type="button" onClick={() => { setResetStep(0); setError('') }} className="btn-ghost w-full justify-center text-xs">{t('auth.back_login')}</button>
        </form>
      </div>
    </div>
  )

  // 步骤2：三选一验证
  if (resetStep === 2) return (
    <div className="max-w-sm mx-auto mt-16 anim-fade-in">
      <div className="card p-8">
        <div className="text-center mb-5">
          <h1 className="text-lg font-bold text-[#1a1a1a]">{t('auth.verify_identity')}</h1>
          <p className="text-xs text-[#999] mt-1">{t('auth.choose_method')}</p>
          <p className="text-xs text-[#c23531] font-medium mt-2">{resetEmail.replace(/(.{3}).+(@.+)/, '$1***$2')}</p>
        </div>
        <div className="flex gap-1 mb-5 bg-[#f5f0e8] rounded-xl p-1">
          {methodBtns.map(m => (
            <button key={m.key} onClick={() => { setResetMethod(m.key); setError('') }}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                resetMethod === m.key ? 'bg-white text-[#c23531]' : 'text-[#999]'
              }`}>{m.label}</button>
          ))}
        </div>
        <form onSubmit={handleStep2} className="space-y-4">
          {resetMethod === 'name' && (
            <><div><label className="block text-xs text-[#888] mb-1.5 font-medium">{t('profile.name')}</label>
              <input type="text" required value={resetName} onChange={e => setResetName(e.target.value)} className="input" placeholder="注册时的姓名" /></div>
              <div><label className="block text-xs text-[#888] mb-1.5 font-medium">{t('profile.dob')}</label>
              <input type="date" required value={resetDob} onChange={e => setResetDob(e.target.value)} className="input" /></div></>
          )}
          {resetMethod === 'dob' && (
            <div><label className="block text-xs text-[#888] mb-1.5 font-medium">{t('profile.dob')}</label>
            <input type="date" required value={resetDob} onChange={e => setResetDob(e.target.value)} className="input" /></div>
          )}
          {resetMethod === 'phone' && (
            <div><label className="block text-xs text-[#888] mb-1.5 font-medium">{t('profile.phone')}</label>
            <input type="tel" required value={resetPhone} onChange={e => setResetPhone(e.target.value)} className="input" placeholder="13812345678" maxLength={11} /></div>
          )}
          {error && <div className="text-xs text-[#c23531] bg-[#c23531]/8 border border-[#c23531]/15 rounded-lg p-3">{error}</div>}
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">{loading ? t('auth.wait')+'...' : t('auth.verify_identity')}</button>
          <button type="button" onClick={() => { setResetStep(1); setError('') }} className="btn-ghost w-full justify-center text-xs">{t('auth.back')}</button>
        </form>
      </div>
    </div>
  )

  // 步骤3：设置新密码
  if (resetStep === 3) return (
    <div className="max-w-sm mx-auto mt-16 anim-fade-in">
      <div className="card p-8">
        <div className="text-center mb-6">
          <div className="mb-2"><CheckCircle size={32} className="inline-block text-green-600" /></div>
          <h1 className="text-lg font-bold text-[#1a1a1a]">{t('auth.verified')}</h1>
          <p className="text-xs text-[#999] mt-1">{t('auth.set_new_password')}</p>
        </div>
        <form onSubmit={handleStep3} className="space-y-4">
          <div><label className="block text-xs text-[#888] mb-1.5 font-medium">{t('auth.password')}</label>
            <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)}
              className="input" placeholder={t('auth.password_placeholder')} autoComplete="new-password" /></div>
          <div><label className="block text-xs text-[#888] mb-1.5 font-medium">{t('auth.confirm_password')}</label>
            <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              className="input" placeholder={t('auth.confirm_password')} /></div>
          {error && <div className="text-xs text-[#c23531] bg-[#c23531]/8 border border-[#c23531]/15 rounded-lg p-3">{error}</div>}
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">{loading ? t('auth.wait')+'...' : t('auth.reset_password')}</button>
        </form>
      </div>
    </div>
  )

  // 步骤4：完成
  if (resetStep === 4) return (
    <div className="max-w-sm mx-auto mt-16 anim-fade-in">
      <div className="card p-8 text-center">
        <div className="mb-3"><PartyPopper size={40} className="inline-block" /></div>
        <h1 className="text-xl font-bold text-[#1a1a1a] mb-2">{t('auth.password_reset')}</h1>
        <p className="text-sm text-[#999]">{t('auth.use_new_password')}</p>
        <button onClick={() => { setResetStep(0); setPassword(''); setEmail(resetEmail); setError('') }}
          className="btn-primary mt-5">{t('auth.go_login')}</button>
      </div>
    </div>
  )

  return loginForm
}
