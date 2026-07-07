'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mars, Venus, Sparkles, RefreshCw } from 'lucide-react'
import { validatePassword, validatePhone, checkRateLimit } from '@/lib/moderation'
import { useLanguage } from '@/lib/LanguageContext'

const pageLoadTime = Date.now()

function generateCaptcha() {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

export default function RegisterPage() {
  const { t } = useLanguage()
  const [captchaCode, setCaptchaCode] = useState('')
  const [form, setForm] = useState({
    _honeypot: '',
    _captcha: '',
    username: '', email: '', password: '', phone: '', gender: 'male',
    date_of_birth: '', hobbies: '', bio: '', resume: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const supabase = createClient()
  const router = useRouter()

  // 初始化验证码
  useEffect(() => { setCaptchaCode(generateCaptcha()) }, [])

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

    const { username, email, password, phone, gender, date_of_birth, hobbies, bio, resume, _honeypot, _captcha } = form

    // 蜜罐检测：隐藏字段被填了说明是机器人
    if (_honeypot) { setError('提交过快，请稍后再试'); return }

    // 时间检测：注册页面打开不到3秒就提交 → 机器人
    if (Date.now() - pageLoadTime < 3000) { setError('请稍等几秒再提交'); return }

    // 验证码校验
    if (_captcha !== captchaCode) { setError('验证码错误'); setCaptchaCode(generateCaptcha()); return }

    // 昵称校验
    if (username.trim().length < 2) { setError('昵称至少 2 个字符'); return }
    if (username.trim().length > 10) { setError('昵称不能超过 10 个字符'); return }
    if (!/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/.test(username.trim())) { setError('昵称只能包含中文、字母、数字和下划线'); return }

    // 出生日期校验
    if (!date_of_birth) { setError('请选择出生日期'); return }
    const dobDate = new Date(date_of_birth)
    const today = new Date()
    const age = today.getFullYear() - dobDate.getFullYear()
    if (age < 10 || age > 120) { setError('出生日期不合法，请检查'); return }

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
          date_of_birth,
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
          <h1 className="text-2xl font-bold text-[#1a1a1a]">{t('auth.register')}</h1>
          <div className="w-10 h-0.5 bg-[#c23531] mx-auto mt-3 rounded-full" />
          <p className="text-[#bbb] text-xs mt-2">{t('footer.title')}</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* 必填区 */}
          <div className="space-y-4">
            {/* 蜜罐：对用户不可见，机器人会填 */}
            <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
              <input type="text" value={form._honeypot} onChange={e => update('_honeypot', e.target.value)} tabIndex={-1} autoComplete="off" />
            </div>
            <p className="text-[10px] text-[#c23531] font-medium tracking-wide">Required</p>

            <div>
              <label className="block text-xs text-[#888] mb-1.5 font-medium">{t('auth.display_name')} <span className="text-[#c23531]">*</span></label>
              <input type="text" required value={form.username}
                onChange={e => update('username', e.target.value)}
                className={inputClass} placeholder="例如：张三" maxLength={10} autoComplete="name" />
            </div>

            <div>
              <label className="block text-xs text-[#888] mb-1.5 font-medium">{t('auth.email')} <span className="text-[#c23531]">*</span></label>
              <input type="email" required value={form.email}
                onChange={e => update('email', e.target.value)}
                className={inputClass} placeholder="your@email.com" autoComplete="email" />
            </div>

            <div>
              <label className="block text-xs text-[#888] mb-1.5 font-medium">{t('profile.phone')} <span className="text-[#c23531]">*</span></label>
              <input type="tel" required value={form.phone}
                onChange={e => update('phone', e.target.value)}
                className={inputClass} placeholder="13812345678" maxLength={11} autoComplete="tel" />
              <p className="text-[10px] text-[#ccc] mt-1">请输入真实的 11 位手机号</p>
            </div>

            <div>
              <label className="block text-xs text-[#888] mb-1.5 font-medium">{t('auth.dob_field')} <span className="text-[#c23531]">*</span></label>
              <input type="date" required value={form.date_of_birth}
                onChange={e => update('date_of_birth', e.target.value)}
                className={inputClass} max={new Date().toISOString().split('T')[0]} />
            </div>

            <div>
              <label className="block text-xs text-[#888] mb-1.5 font-medium">{t('profile.gender')} <span className="text-[#c23531]">*</span></label>
              <div className="flex gap-3">
                {[
                  { value: 'male', label: <><Mars size={16} className="inline-block align-text-bottom" /> {t('profile.male')}</> },
                  { value: 'female', label: <><Venus size={16} className="inline-block align-text-bottom" /> {t('profile.female')}</> },
                  { value: 'other', label: <><Sparkles size={16} className="inline-block align-text-bottom" /> {t('profile.other')}</> },
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
              <label className="block text-xs text-[#888] mb-1.5 font-medium">{t('auth.password')} <span className="text-[#c23531]">*</span></label>
              <input type="password" required value={form.password}
                onChange={e => update('password', e.target.value)}
                className={inputClass} placeholder={t('auth.password_placeholder')} autoComplete="new-password" />
              <p className="text-[10px] text-[#ccc] mt-1">至少 8 位，需包含字母和数字</p>
            </div>
          </div>

          {/* 选填区 */}
          <div className="pt-4 border-t border-[#f0e8dc] space-y-4">
            <p className="text-[10px] text-[#999] tracking-wide">Optional</p>

            <div>
              <label className="block text-xs text-[#888] mb-1.5 font-medium">{t('profile.hobbies')}</label>
              <input type="text" value={form.hobbies}
                onChange={e => update('hobbies', e.target.value)}
                className={inputClass} placeholder="例如：摄影、编程、读书" />
            </div>

            <div>
              <label className="block text-xs text-[#888] mb-1.5 font-medium">{t('profile.bio')}</label>
              <textarea value={form.bio}
                onChange={e => update('bio', e.target.value)}
                className={`${inputClass} min-h-[80px] resize-none`} placeholder="简单介绍一下自己..." maxLength={500} />
              <p className="text-[10px] text-[#ccc] mt-1">{form.bio.length}/500</p>
            </div>

            <div>
              <label className="block text-xs text-[#888] mb-1.5 font-medium">{t('profile.resume')}</label>
              <textarea value={form.resume}
                onChange={e => update('resume', e.target.value)}
                className={`${inputClass} min-h-[100px] resize-none`} placeholder="工作经历、专业技能等..." maxLength={2000} />
              <p className="text-[10px] text-[#ccc] mt-1">{form.resume.length}/2000</p>
            </div>
          </div>

          {/* 验证码 */}
          <div className="pt-2">
            <label className="block text-xs text-[#888] mb-2 font-medium">Captcha <span className="text-[#c23531]">*</span></label>
            <div className="flex items-center gap-3">
              <div className="flex gap-1 select-none">
                {captchaCode.split('').map((digit, i) => (
                  <span key={i}
                    className="inline-flex items-center justify-center w-9 h-10 rounded-lg text-lg font-bold tracking-wider shadow-sm"
                    style={{
                      backgroundColor: ['#fef3c7', '#fee2e2', '#dbeafe', '#dcfce7'][i % 4],
                      color: ['#92400e', '#991b1b', '#1e40af', '#166534'][i % 4],
                      transform: `rotate(${[-3, 2, -2, 4][i]}deg)`,
                      fontFamily: 'monospace',
                    }}
                  >{digit}</span>
                ))}
              </div>
              <input type="text" value={form._captcha}
                onChange={e => update('_captcha', e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="input w-24 text-center text-lg font-bold tracking-widest" placeholder="输入" maxLength={4} autoComplete="off" />
              <button type="button" onClick={() => setCaptchaCode(generateCaptcha())}
                className="btn-ghost text-xs shrink-0" title="换一张"><RefreshCw size={14} className="inline-block" /></button>
            </div>
          </div>

          {error && <div className="text-xs text-[#c23531] bg-[#c23531]/8 border border-[#c23531]/15 rounded-lg p-3">{error}</div>}

          <button type="submit" disabled={loading || cooldown > 0}
            className="btn-primary w-full justify-center !py-2.5">
            {loading ? t('auth.logging_in') : cooldown > 0 ? `${t('auth.wait')} ${cooldown}${t('common.seconds')}` : t('auth.register')}
          </button>
        </form>

        <p className="text-center text-xs text-[#bbb] mt-5">
          <Link href="/login" className="text-[#c23531] hover:underline font-medium ml-1">{t('auth.login')}</Link>
        </p>
      </div>
    </div>
  )
}
