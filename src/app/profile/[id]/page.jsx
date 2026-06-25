'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'
import Link from 'next/link'

export default function ProfilePage() {
  const { id } = useParams()
  const { user, profile: myProfile } = useAuth()
  const [profile, setProfile] = useState(null)
  const [threads, setThreads] = useState([])
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({})
  const supabase = createClient()
  const isOwn = user?.id === id

  useEffect(() => {
    supabase.from('profiles').select('*').eq('id', id).single().then(({ data }) => {
      setProfile(data)
      setForm({
        display_name: data?.display_name || '',
        phone: data?.phone || '',
        gender: data?.gender || 'male',
        hobbies: data?.hobbies || '',
        bio: data?.bio || '',
        resume: data?.resume || '',
      })
      if (data) {
        supabase.from('threads').select('*, categories(name, slug)').eq('author_id', id)
          .order('created_at', { ascending: false }).limit(50)
          .then(({ data: t }) => setThreads(t || []))
      }
    })
  }, [id])

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    const { error } = await supabase.from('profiles').update({
      display_name: form.display_name.trim(),
      phone: form.phone,
      gender: form.gender,
      hobbies: form.hobbies.trim(),
      bio: form.bio.trim(),
      resume: form.resume.trim(),
    }).eq('id', id)

    if (error) {
      setMessage('保存失败: ' + error.message)
    } else {
      setMessage('✅ 保存成功')
      setProfile(prev => ({ ...prev, ...form }))
      setEditing(false)
    }
    setSaving(false)
    setTimeout(() => setMessage(''), 3000)
  }

  if (!profile) return <div className="flex justify-center py-20"><div className="w-5 h-5 border-2 border-[#c23531]/30 border-t-[#c23531] rounded-full animate-spin" /></div>

  const genderLabels = { male: '👨 男', female: '👩 女', other: '🔮 其他' }

  return (
    <div className="anim-fade-in max-w-2xl mx-auto">
      {/* 头像 & 基本信息 */}
      <div className="card p-6 sm:p-8 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-[#c23531] flex items-center justify-center text-3xl font-bold text-white shadow-sm">
          {(profile.display_name || profile.username || '?')[0]}
        </div>

        {!editing ? (
          <>
            <h1 className="text-xl font-bold font-serif text-[#1a1a1a] mt-4">{profile.display_name || profile.username}</h1>
            <p className="text-[#999] text-sm">@{profile.username}</p>

            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-[#666] flex-wrap">
              {profile.phone && <span>📱 {profile.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</span>}
              {profile.gender && <span>{genderLabels[profile.gender]}</span>}
              {profile.hobbies && <span>🎯 {profile.hobbies}</span>}
            </div>

            {profile.bio && <p className="text-[#666] text-sm mt-4 max-w-md mx-auto leading-relaxed">{profile.bio}</p>}
            {profile.resume && (
              <div className="mt-4 text-left max-w-md mx-auto">
                <p className="text-xs text-[#999] font-medium mb-1">📄 简历 / 经历</p>
                <p className="text-sm text-[#666] whitespace-pre-wrap leading-relaxed">{profile.resume}</p>
              </div>
            )}

            <div className="flex items-center justify-center gap-3 mt-5 text-xs flex-wrap">
              <span className={`px-2 py-0.5 rounded font-medium ${
                profile.role === 'admin' ? 'bg-[#c23531]/10 text-[#c23531] border border-[#c23531]/20' :
                profile.role === 'moderator' ? 'bg-[#8b6914]/10 text-[#8b6914] border border-[#8b6914]/20' :
                'text-[#999]'
              }`}>
                {profile.role === 'admin' ? '👑 管理员' : profile.role === 'moderator' ? '🛡️ 版主' : '👤 用户'}
              </span>
              <span className="text-[#ddd6c8]">·</span>
              <span className="text-[#999]">加入于 {new Date(profile.created_at).toLocaleDateString('zh-CN')}</span>
            </div>

            {isOwn && (
              <button onClick={() => setEditing(true)}
                className="btn-primary mt-5 !px-6">
                ✏️ 编辑资料
              </button>
            )}
          </>
        ) : (
          /* 编辑模式 */
          <div className="text-left mt-6 space-y-4 max-w-md mx-auto">
            <h2 className="font-bold font-serif text-[#1a1a1a] text-center">✏️ 编辑资料</h2>

            <div>
              <label className="block text-xs text-[#888] mb-1.5 font-medium">昵称 / 姓名</label>
              <input type="text" value={form.display_name}
                onChange={e => update('display_name', e.target.value)}
                className="input" maxLength={20} />
            </div>

            <div>
              <label className="block text-xs text-[#888] mb-1.5 font-medium">手机号</label>
              <input type="tel" value={form.phone}
                onChange={e => update('phone', e.target.value)}
                className="input" maxLength={11} placeholder="13812345678" />
            </div>

            <div>
              <label className="block text-xs text-[#888] mb-1.5 font-medium">性别</label>
              <div className="flex gap-3">
                {[
                  { value: 'male', label: '👨 男' },
                  { value: 'female', label: '👩 女' },
                  { value: 'other', label: '🔮 其他' },
                ].map(opt => (
                  <label key={opt.value}
                    className={`flex-1 flex items-center justify-center gap-1 p-2.5 rounded-xl border cursor-pointer transition-all text-sm font-medium ${
                      form.gender === opt.value
                        ? 'border-[#c23531] bg-[#c23531]/5 text-[#c23531]'
                        : 'border-[#eee8dc] text-[#888]'
                    }`}>
                    <input type="radio" name="gender-edit" value={opt.value}
                      checked={form.gender === opt.value}
                      onChange={e => update('gender', e.target.value)}
                      className="hidden" />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#888] mb-1.5 font-medium">兴趣爱好</label>
              <input type="text" value={form.hobbies}
                onChange={e => update('hobbies', e.target.value)}
                className="input" placeholder="摄影、编程、读书" />
            </div>

            <div>
              <label className="block text-xs text-[#888] mb-1.5 font-medium">个人介绍</label>
              <textarea value={form.bio}
                onChange={e => update('bio', e.target.value)}
                className="input min-h-[80px] resize-none" maxLength={500} />
              <p className="text-[10px] text-[#ccc] mt-1">{form.bio.length}/500</p>
            </div>

            <div>
              <label className="block text-xs text-[#888] mb-1.5 font-medium">简历 / 经历</label>
              <textarea value={form.resume}
                onChange={e => update('resume', e.target.value)}
                className="input min-h-[100px] resize-none" maxLength={2000} />
              <p className="text-[10px] text-[#ccc] mt-1">{form.resume.length}/2000</p>
            </div>

            {message && (
              <div className="text-xs text-center py-2 rounded-lg bg-green-50 border border-green-200 text-green-700">{message}</div>
            )}

            <div className="flex gap-3">
              <button onClick={() => { setEditing(false); setMessage('') }}
                className="btn-ghost flex-1 justify-center border border-[#eee8dc]">
                取消
              </button>
              <button onClick={handleSave} disabled={saving}
                className="btn-primary flex-1 justify-center">
                {saving ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 帖子列表 */}
      <div className="mt-6">
        <h2 className="font-semibold text-sm text-[#666] mb-3">
          📝 发过的帖子 <span className="font-normal text-[#bbb] ml-1">({threads.length})</span>
        </h2>
        {threads.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="text-2xl mb-2">📭</div>
            <p className="text-[#999] text-sm">还没有发过帖子</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {threads.map((t, i) => (
              <Link key={t.id} href={`/t/${t.id}`}
                className={`post-card ${i > 0 ? `anim-delay-${Math.min(i, 5)}` : ''}`}>
                <div className="text-[#1a1a1a]">
                  <div className="font-semibold truncate">{t.title}</div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-[#999] truncate min-w-0">
                      {t.categories?.name} <span className="text-[#ddd6c8] mx-1.5">·</span>
                      {new Date(t.created_at).toLocaleDateString('zh-CN')}
                    </div>
                    <div className="text-xs text-[#bbb] shrink-0 ml-3">💬 {t.reply_count || 0}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
