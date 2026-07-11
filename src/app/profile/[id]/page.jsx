'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Lock, Mars, Venus, Sparkles, Crown, Shield, User as UserIcon, Pencil, MessageCircle, Users, Clock, Mail, CheckCircle, X, FileText, Inbox, Bell, Search, Eye } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { useLanguage } from '@/lib/LanguageContext'
import Link from 'next/link'

export default function ProfilePage() {
  const { t } = useLanguage()
  const { id } = useParams()
  const { user, profile: myProfile } = useAuth()
  const [profile, setProfile] = useState(null)
  const [threads, setThreads] = useState([])
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({})
  const supabase = createClient()
  const router = useRouter()
  const isOwn = user?.id === id

  // 好友相关
  const [friendship, setFriendship] = useState(null)
  const [friends, setFriends] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [friendAction, setFriendAction] = useState('')

  // 加载好友数据
  const loadFriendData = useCallback(async () => {
    if (!profile || !user) return

    if (user.id === id) {
      // 自己的好友列表
      const { data: fData } = await supabase.from('friends').select('*')
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`).eq('status', 'accepted')
      const list = fData || []
      const ids = [...new Set(list.flatMap(f => [f.requester_id, f.addressee_id]).filter(i => i !== user.id))]
      if (ids.length > 0) {
        const { data: pData } = await supabase.from('profiles').select('id,username,display_name').in('id', ids)
        const pmap = {}
        for (const p of pData || []) pmap[p.id] = p
        for (const f of list) {
          const oid = f.requester_id === user.id ? f.addressee_id : f.requester_id
          f._friendProfile = pmap[oid] || null
        }
      }
      setFriends(list)

      // 好友请求（我收到的待处理请求）
      const { data: rData } = await supabase.from('friends').select('*')
        .eq('addressee_id', user.id).eq('status', 'pending')
      const reqList = rData || []
      const reqIds = [...new Set(reqList.map(r => r.requester_id))]
      if (reqIds.length > 0) {
        const { data: pData } = await supabase.from('profiles').select('id,username,display_name').in('id', reqIds)
        const pmap = {}
        for (const p of pData || []) pmap[p.id] = p
        for (const r of reqList) r._requesterProfile = pmap[r.requester_id] || null
      }
      setPendingRequests(reqList)
    } else {
      // 查看他人好友关系
      const { data } = await supabase.from('friends').select('*')
        .or(`and(requester_id.eq.${user.id},addressee_id.eq.${id}),and(requester_id.eq.${id},addressee_id.eq.${user.id})`)
        .single()
      setFriendship(data?.status || null)
    }
  }, [profile?.id, user?.id, id])

  useEffect(() => {
    loadFriendData()
  }, [loadFriendData])

  const sendFriendRequest = async () => {
    setFriendAction('发送中...')

    // 检查自己是否是管理员
    if (myProfile?.role === 'admin') {
      // 管理员直接通过
      const { error } = await supabase.from('friends').insert({
        requester_id: user.id,
        addressee_id: id,
        status: 'accepted',
      })
      if (error) {
        setFriendAction('添加失败')
      } else {
        setFriendship('accepted')
        setFriendAction('✅ 已添加好友')
        // 刷新好友列表
        loadFriendData()
      }
      setTimeout(() => setFriendAction(''), 3000)
      return
    }

    // 普通用户
    const { error } = await supabase.from('friends').insert({
      requester_id: user.id,
      addressee_id: id,
      status: 'pending',
    })
    if (error) setFriendAction('请求失败')
    else { setFriendship('pending'); setFriendAction('✅ 已发送请求') }
    setTimeout(() => setFriendAction(''), 3000)
  }

  const acceptFriend = async (reqId, requesterId) => {
    // 接受好友请求：更新状态
    await supabase.from('friends').update({ status: 'accepted' }).eq('id', reqId)

    // 从待处理列表中移除
    setPendingRequests(prev => prev.filter(r => r.id !== reqId))

    // 立即将新好友加入好友列表
    const friendProfile = pendingRequests.find(r => r.id === reqId)?._requesterProfile || {}
    const newFriend = {
      id: `new-${reqId}`,
      requester_id: requesterId,
      addressee_id: user.id,
      status: 'accepted',
      _friendProfile: {
        id: requesterId,
        username: friendProfile.username,
        display_name: friendProfile.display_name,
      },
    }
    setFriends(prev => [newFriend, ...prev])
  }

  const rejectFriend = async (reqId) => {
    await supabase.from('friends').update({ status: 'rejected' }).eq('id', reqId)
    setPendingRequests(prev => prev.filter(r => r.id !== reqId))
  }

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('profiles').select('*').eq('id', id).single()

      if (data && user?.id === id) {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (authUser?.user_metadata?.birth_place) data.birth_place = authUser.user_metadata.birth_place
      }

      setProfile(data)
      setForm({
        display_name: data?.display_name || '',
        phone: data?.phone || '',
        date_of_birth: data?.date_of_birth || '',
        gender: data?.gender || 'male',
        hobbies: data?.hobbies || '',
        bio: data?.bio || '',
        resume: data?.resume || '',
        birth_place: data?.birth_place || '',
      })
      if (data) {
        supabase.from('threads').select('*, categories(name, slug)').eq('author_id', id)
          .order('created_at', { ascending: false }).limit(50)
          .then(({ data: t }) => setThreads(t || []))
      }
    })()
  }, [id])

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    const { error } = await supabase.from('profiles').update({
      display_name: form.display_name.trim(),
      phone: form.phone,
      date_of_birth: form.date_of_birth,
      gender: form.gender,
      hobbies: form.hobbies.trim(),
      bio: form.bio.trim(),
      resume: form.resume.trim(),
    }).eq('id', id)

    await supabase.auth.updateUser({
      data: { birth_place: form.birth_place }
    })

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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  if (!user) return (
    <div className="card p-8 text-center anim-fade-in max-w-md mx-auto mt-16">
      <div className="mb-3"><Lock size={32} className="inline-block" /></div>
      <p className="text-[#999] mb-3">{t('profile.login_required')}</p>
      <Link href="/login" className="btn-primary">{t('auth.go_login')}</Link>
    </div>
  )

  if (!profile) return <div className="flex justify-center py-20"><div className="w-5 h-5 border-2 border-[#c23531]/30 border-t-[#c23531] rounded-full animate-spin" /></div>

  const genderLabel = (g) => {
    const icon = g === 'male' ? <Mars size={13} className="inline-block align-text-bottom" /> : g === 'female' ? <Venus size={13} className="inline-block align-text-bottom" /> : <Sparkles size={13} className="inline-block align-text-bottom" />
    const text = g === 'male' ? t('profile.male') : g === 'female' ? t('profile.female') : t('profile.other')
    return <>{icon} {text}</>
  }

  return (
    <div className="anim-fade-in max-w-4xl mx-auto">
      {/* ===== 头像 & 基本信息（压缩版） ===== */}
      <div className="card p-4 sm:p-5">
        <div className="flex items-start gap-4">
          {/* 头像 */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#c23531] flex items-center justify-center text-2xl font-bold text-white shrink-0">
            {(profile.display_name || profile.username || '?')[0]}
          </div>

          {!editing ? (
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold text-[#1a1a1a]">{profile.display_name || profile.username}</h1>
                {profile.member_no && (
                  <span className="px-2 py-0.5 rounded-full bg-[#f5f0e8] border border-[#e8e0d0] text-[10px] font-mono text-[#8b6914]">
                    #{profile.member_no}
                  </span>
                )}
                <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                  profile.role === 'admin' ? 'bg-[#c23531]/10 text-[#c23531] border border-[#c23531]/20' :
                  profile.role === 'moderator' ? 'bg-[#8b6914]/10 text-[#8b6914] border border-[#8b6914]/20' :
                  'text-[#999]'
                }`}>
                  {profile.role === 'admin' ? <><Crown size={12} className="inline-block align-text-bottom" /> 管理员</> : profile.role === 'moderator' ? <><Shield size={12} className="inline-block align-text-bottom" /> 版主</> : <><UserIcon size={12} className="inline-block align-text-bottom" /> 用户</>}
                </span>
              </div>
              <p className="text-xs text-[#aaa]">@{profile.username} · {t('profile.join_at')} {new Date(profile.created_at).toLocaleDateString('zh-CN')}</p>

              {/* 个人信息微缩行 */}
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5 text-xs text-[#888]">
                {profile.gender && <span>{genderLabel(profile.gender)}</span>}
                {profile.birth_place && <span>📍 {profile.birth_place}</span>}
                {profile.hobbies && <span>🎯 {profile.hobbies}</span>}
                {profile.date_of_birth && <span>🎂 {new Date(profile.date_of_birth).toLocaleDateString('zh-CN')}</span>}
              </div>

              {profile.bio && (
                <p className="text-xs text-[#666] mt-1.5 leading-relaxed line-clamp-2">{profile.bio}</p>
              )}
              {profile.resume && !profile.bio && (
                <p className="text-xs text-[#666] mt-1.5 leading-relaxed line-clamp-2">{profile.resume}</p>
              )}

              {/* 操作按钮 */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {isOwn ? (
                  <>
                    <button onClick={() => setEditing(true)} className="btn-primary !px-4 !py-1.5 !text-xs"><Pencil size={13} className="inline-block align-text-bottom" /> {t('profile.edit')}</button>
                    <button onClick={() => router.push('/login')} className="btn-ghost !text-xs !px-3 !py-1.5 border border-[#eee8dc] text-[#888] hover:text-[#1a1a1a] rounded-lg">切换账号</button>
                    <button onClick={handleLogout} className="btn-ghost !text-xs !px-3 !py-1.5 border border-[#c23531]/20 text-[#c23531] hover:bg-[#c23531]/5 rounded-lg">退出登录</button>
                    <Link href="/members" className="btn-ghost !text-xs !px-3 !py-1.5 border border-[#eee8dc] text-[#888] hover:text-[#c23531] rounded-lg"><Users size={13} className="inline-block align-text-bottom" /> 会员管理</Link>
                  </>
                ) : user ? (
                  friendship === 'accepted' ? (
                    <div className="flex gap-1.5">
                      <Link href={`/messages/${id}`} className="btn-primary !px-4 !py-1.5 !text-xs"><MessageCircle size={13} className="inline-block align-text-bottom" /> {t('profile.send_message')}</Link>
                      <button onClick={async () => {
                        if (!confirm('确定删除好友？')) return
                        await supabase.from('friends').delete().or(`and(requester_id.eq.${user.id},addressee_id.eq.${id}),and(requester_id.eq.${id},addressee_id.eq.${user.id})`)
                        setFriendship(null)
                      }} className="btn-ghost !text-xs !px-3 !py-1.5 border border-[#eee8dc] text-[#999] hover:text-[#c23531] rounded-lg">{t('profile.remove_friend')}</button>
                    </div>
                  ) : friendship === 'pending' ? (
                    <span className="text-xs text-[#999] bg-[#f5f0e8] px-3 py-1.5 rounded-full"><Clock size={13} className="inline-block align-text-bottom" /> {t('profile.friend_pending')}</span>
                  ) : (
                    <button onClick={sendFriendRequest} disabled={!!friendAction}
                      className="btn-primary !px-4 !py-1.5 !text-xs disabled:opacity-50">
                      {friendAction || <><Users size={13} className="inline-block align-text-bottom" /> {t('profile.add_friend')}</>}
                    </button>
                  )
                ) : null}
              </div>
            </div>
          ) : (
            /* 编辑模式 */
            <div className="flex-1 text-left space-y-3">
              <h2 className="font-bold text-[#1a1a1a] text-sm"><Pencil size={14} className="inline-block align-text-bottom" /> {t('profile.edit')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-[#888] mb-1 font-medium">{t('auth.display_name')}</label>
                  <input type="text" value={form.display_name}
                    onChange={e => update('display_name', e.target.value)}
                    className="!text-xs input" maxLength={10} />
                </div>
                <div>
                  <label className="block text-[10px] text-[#888] mb-1 font-medium">{t('profile.phone')}</label>
                  <input type="tel" value={form.phone}
                    onChange={e => update('phone', e.target.value)}
                    className="!text-xs input" maxLength={11} placeholder="13812345678" />
                </div>
                <div>
                  <label className="block text-[10px] text-[#888] mb-1 font-medium">{t('profile.dob')}</label>
                  <input type="date" value={form.date_of_birth}
                    onChange={e => update('date_of_birth', e.target.value)}
                    className="!text-xs input" max={new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <label className="block text-[10px] text-[#888] mb-1 font-medium">{t('profile.gender')}</label>
                  <div className="flex gap-1.5">
                    {[
                      { value: 'male', label: <><Mars size={13} className="inline-block align-text-bottom" /> {t('profile.male')}</> },
                      { value: 'female', label: <><Venus size={13} className="inline-block align-text-bottom" /> {t('profile.female')}</> },
                      { value: 'other', label: <><Sparkles size={13} className="inline-block align-text-bottom" /> {t('profile.other')}</> },
                    ].map(opt => (
                      <label key={opt.value}
                        className={`flex-1 flex items-center justify-center gap-0.5 p-1.5 rounded-lg border cursor-pointer transition-all text-[11px] font-medium ${
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
                  <label className="block text-[10px] text-[#888] mb-1 font-medium">省市</label>
                  <input type="text" value={form.birth_place}
                    onChange={e => update('birth_place', e.target.value)}
                    className="!text-xs input" placeholder="山东/威海" />
                </div>
                <div>
                  <label className="block text-[10px] text-[#888] mb-1 font-medium">{t('profile.hobbies')}</label>
                  <input type="text" value={form.hobbies}
                    onChange={e => update('hobbies', e.target.value)}
                    className="!text-xs input" placeholder="摄影、编程、读书" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-[#888] mb-1 font-medium">{t('profile.bio')}</label>
                  <textarea value={form.bio}
                    onChange={e => update('bio', e.target.value)}
                    className="!text-xs input min-h-[60px] resize-none" maxLength={500} />
                  <p className="text-[9px] text-[#ccc] mt-0.5">{form.bio.length}/500</p>
                </div>
                <div>
                  <label className="block text-[10px] text-[#888] mb-1 font-medium">{t('profile.resume')}</label>
                  <textarea value={form.resume}
                    onChange={e => update('resume', e.target.value)}
                    className="!text-xs input min-h-[60px] resize-none" maxLength={2000} />
                  <p className="text-[9px] text-[#ccc] mt-0.5">{form.resume.length}/2000</p>
                </div>
              </div>
              {message && (
                <div className="text-xs text-center py-1.5 rounded-lg bg-green-50 border border-green-200 text-green-700">{message}</div>
              )}
              <div className="flex gap-2">
                <button onClick={() => { setEditing(false); setMessage('') }}
                  className="btn-ghost flex-1 justify-center border border-[#eee8dc] !text-xs !py-1.5">{t('common.cancel')}</button>
                <button onClick={handleSave} disabled={saving}
                  className="btn-primary flex-1 justify-center !text-xs !py-1.5">{saving ? t('common.saving') : t('common.save')}</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== 待处理的好友请求（显著提醒，始终可见） ===== */}
      {isOwn && pendingRequests.length > 0 && (
        <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 anim-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-amber-400 text-white flex items-center justify-center text-xs font-bold">{pendingRequests.length}</span>
            <h3 className="text-sm font-bold text-amber-800">
              <Bell size={16} className="inline-block align-text-bottom text-amber-500" /> 待处理的好友请求
            </h3>
          </div>
          {pendingRequests.map(req => (
            <div key={req.id} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-amber-100/50 transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-[#c23531] flex items-center justify-center text-xs text-white font-bold shrink-0">
                  {(req._requesterProfile?.display_name || req._requesterProfile?.username || '?')[0]}
                </div>
                <div className="min-w-0">
                  <Link href={`/profile/${req.requester_id}`} className="text-sm font-medium text-[#1a1a1a] hover:text-[#c23531] transition-colors">
                    {req._requesterProfile?.display_name || req._requesterProfile?.username || '用户'}
                  </Link>
                  <p className="text-[10px] text-[#999]">请求加你为好友</p>
                </div>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button onClick={() => acceptFriend(req.id, req.requester_id)}
                  className="text-xs text-white bg-green-500 px-3 py-1.5 rounded-full hover:bg-green-600 transition-colors font-medium">
                  <CheckCircle size={13} className="inline-block align-text-bottom" /> 同意
                </button>
                <button onClick={() => rejectFriend(req.id)}
                  className="text-xs text-[#999] bg-white border border-[#e0e0e0] px-3 py-1.5 rounded-full hover:bg-[#f5f5f5] transition-colors">
                  <X size={13} className="inline-block align-text-bottom" /> 拒绝
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== 两栏布局：帖子 | 好友 ===== */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 左栏：发布的帖子 */}
        <div>
          <h2 className="font-semibold text-sm text-[#666] mb-2 flex items-center gap-1.5">
            <FileText size={14} className="text-[#c23531]" />
            帖子 <span className="font-normal text-[#aaa] text-xs">({threads.length})</span>
          </h2>
          <div className="space-y-1.5">
            {threads.length === 0 ? (
              <div className="card p-6 text-center">
                <div className="mb-1"><Inbox size={24} className="inline-block text-[#ccc]" /></div>
                <p className="text-[#999] text-xs">{t('profile.no_posts')}</p>
              </div>
            ) : (
              threads.map((t, i) => (
                <Link key={t.id} href={`/t/${t.id}`
                } className="block bg-white border border-[#ece8e0] rounded-lg px-3 py-2 hover:border-[#c23531]/30 transition-all hover:shadow-sm">
                  <div className="text-sm font-medium text-[#1a1a1a] truncate">{t.title}</div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-[10px] text-[#999] truncate min-w-0">
                      {t.categories?.name}
                      <span className="text-[#ddd6c8] mx-1">·</span>
                      {new Date(t.created_at).toLocaleDateString('zh-CN')}
                    </div>
                    <div className="text-[10px] text-[#bbb] shrink-0 ml-2"><MessageCircle size={11} className="inline-block align-text-bottom" /> {t.reply_count || 0}</div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* 右栏：好友列表 */}
        <div>
          <h2 className="font-semibold text-sm text-[#666] mb-2 flex items-center gap-1.5">
            <Users size={14} className="text-[#c23531]" />
            好友 <span className="font-normal text-[#aaa] text-xs">({friends.length})</span>
          </h2>
          {isOwn ? (
            <div className="space-y-1.5">
              {friends.length === 0 ? (
                <div className="card p-6 text-center">
                  <div className="mb-1"><Users size={24} className="inline-block text-[#ccc]" /></div>
                  <p className="text-[#999] text-xs">{t('profile.no_friends')}</p>
                  <p className="text-[#ccc] text-[10px] mt-1">去帖子页面找人加好友吧</p>
                </div>
              ) : (
                friends.map(f => {
                  const friendId = f.requester_id === user?.id ? f.addressee_id : f.requester_id
                  const friendName = f._friendProfile?.display_name || f._friendProfile?.username || '用户'
                  return (
                    <div key={f.id} className="bg-white border border-[#ece8e0] rounded-lg px-3 py-2 flex items-center justify-between hover:border-[#c23531]/30 transition-all hover:shadow-sm">
                      <Link href={`/profile/${friendId}`} className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="w-7 h-7 rounded-full bg-[#c23531] flex items-center justify-center text-xs text-white font-bold shrink-0">
                          {(friendName || '?')[0]}
                        </div>
                        <span className="text-sm font-medium text-[#1a1a1a] truncate">{friendName}</span>
                      </Link>
                      <Link href={`/messages/${friendId}`} className="text-[10px] px-2 py-1 rounded-md bg-[#f5f5f5] text-[#666] hover:bg-[#eee] hover:text-[#c23531] transition-colors shrink-0 ml-2">
                        <MessageCircle size={12} className="inline-block align-text-bottom" />
                      </Link>
                    </div>
                  )
                })
              )}
            </div>
          ) : friendship === 'accepted' ? (
            <div className="card p-6 text-center">
              <div className="mb-1"><Users size={24} className="inline-block text-[#ccc]" /></div>
              <p className="text-[#999] text-xs">已是好友 ❤️</p>
            </div>
          ) : (
            <div className="card p-6 text-center">
              <div className="mb-1"><Lock size={24} className="inline-block text-[#ccc]" /></div>
              <p className="text-[#999] text-xs">成为好友后可查看好友列表</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
