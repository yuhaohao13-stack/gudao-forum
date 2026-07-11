'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'
import Breadcrumb from '@/components/Breadcrumb'
import { Crown, Shield, Pencil, MessageCircle, Users, Clock, CheckCircle, X, FileText, Inbox, Mars, Venus, Sparkles, Eye, Loader2, UserPlus, UserCheck } from 'lucide-react'

export default function ProfilePage() {
  const { id } = useParams()
  const supabase = createClient()
  const { user, profile: myProfile } = useAuth()
  const router = useRouter()

  const [profileUser, setProfileUser] = useState(null)
  const [threads, setThreads] = useState([])
  const [friends, setFriends] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [friendStatus, setFriendStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({})
  const [friendUpdate, setFriendUpdate] = useState(0)
  const [showAllThreads, setShowAllThreads] = useState(false)
  const [showAllFriends, setShowAllFriends] = useState(false)

  const isSelf = user?.id === id
  const amAdmin = myProfile?.role === 'admin'

  const loadData = useCallback(async () => {
    // Profile 所有字段
    const { data: p } = await supabase.from('profiles').select('*').eq('id', id).single()
    if (!p) { setLoading(false); return }
    setProfileUser(p)
    setForm({
      display_name: p.display_name || '',
      phone: p.phone || '',
      date_of_birth: p.date_of_birth || '',
      gender: p.gender || 'male',
      hobbies: p.hobbies || '',
      bio: p.bio || '',
      resume: p.resume || '',
      birth_place: p.birth_place || '',
    })

    // Threads
    const { data: t } = await supabase.from('threads')
      .select('*, categories(name, slug)').eq('author_id', id)
      .order('created_at', { ascending: false }).limit(10)
    setThreads(t || [])

    // Friends (accepted)
    const { data: f1 } = await supabase.from('friends')
      .select('*, friend:friend_id(id, username, display_name, role)')
      .eq('user_id', id).eq('status', 'accepted')
    const { data: f2 } = await supabase.from('friends')
      .select('*, user:user_id(id, username, display_name, role)')
      .eq('friend_id', id).eq('status', 'accepted')
    setFriends([...(f1 || []).map(f => f.friend), ...(f2 || []).map(f => f.user)])

    // Pending requests (别人发给当前用户)
    if (isSelf) {
      const { data: pr } = await supabase.from('friends')
        .select('*, user:user_id(id, username, display_name, role)')
        .eq('friend_id', id).eq('status', 'pending')
      setPendingRequests(pr || [])
    }

    // Friend status (非自己)
    if (user && !isSelf) {
      const { data: fs } = await supabase.from('friends')
        .select('*')
        .or(`and(user_id.eq.${user.id},friend_id.eq.${id}),and(user_id.eq.${id},friend_id.eq.${user.id})`)
        .maybeSingle()
      if (fs) {
        if (fs.status === 'accepted') setFriendStatus('friends')
        else if (fs.status === 'pending' && fs.user_id === user.id) setFriendStatus('pending_sent')
        else if (fs.status === 'pending' && fs.friend_id === user.id) setFriendStatus('pending_received')
      }
    }

    setLoading(false)
  }, [id, user, isSelf])

  useEffect(() => { loadData() }, [loadData, friendUpdate])

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSave = async () => {
    setSaving(true); setMessage('')
    const { error } = await supabase.from('profiles').update({
      display_name: form.display_name.trim(),
      phone: form.phone,
      date_of_birth: form.date_of_birth,
      gender: form.gender,
      hobbies: form.hobbies.trim(),
      bio: form.bio.trim(),
      resume: form.resume.trim(),
    }).eq('id', id)
    if (error) setMessage('保存失败: ' + error.message)
    else {
      setMessage('✅ 保存成功')
      setProfileUser(prev => ({ ...prev, ...form }))
      setEditing(false)
    }
    setSaving(false)
    setTimeout(() => setMessage(''), 3000)
  }

  const handleAddFriend = async () => {
    const res = await fetch('/api/friend/add', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to_user_id: id }),
    })
    const data = await res.json()
    if (data.success) setFriendStatus(data.status === 'accepted' ? 'friends' : 'pending_sent')
  }

  const handleAcceptRequest = async (requesterId) => {
    await supabase.from('friends').update({ status: 'accepted' }).eq('user_id', requesterId).eq('friend_id', id)
    setPendingRequests(prev => prev.filter(r => r.user_id !== requesterId))
    setFriendUpdate(prev => prev + 1)
  }

  const handleRejectRequest = async (requesterId) => {
    await supabase.from('friends').delete().eq('user_id', requesterId).eq('friend_id', id)
    setPendingRequests(prev => prev.filter(r => r.user_id !== requesterId))
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={20} className="animate-spin text-[#ccc]" /></div>
  if (!profileUser) return <div className="text-center py-20 text-[#999]">用户不存在</div>

  const isAdmin = profileUser.role === 'admin'
  const isMod = profileUser.role === 'moderator'
  const avatarLetter = (profileUser.display_name || profileUser.username || '?')[0]
  const genderLabel = (g) => {
    const icon = g === 'male' ? <Mars size={10} className="inline" /> : g === 'female' ? <Venus size={10} className="inline" /> : <Sparkles size={10} className="inline" />
    const text = g === 'male' ? '男' : g === 'female' ? '女' : '其他'
    return <>{icon} {text}</>
  }

  return (
    <div className="anim-fade-in max-w-4xl mx-auto">
      {/* 面包屑 */}
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        ...(amAdmin ? [{ label: '会员管理', href: '/members' }] : []),
        { label: profileUser.display_name || profileUser.username },
      ]} />

      {/* ===== 用户卡片 ===== */}
      <div className="bg-white rounded-xl border border-[#eee8dc] p-3 mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${isAdmin ? 'bg-[#c23531]' : isMod ? 'bg-[#8b6914]' : 'bg-[#b0a898]'}`}>
            {avatarLetter}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-sm font-bold text-[#1a1a1a]">{profileUser.display_name || profileUser.username}</h1>
              {profileUser.member_no && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#f5f0e8] border border-[#e8e0d0] text-[#8b6914] font-mono">#{profileUser.member_no}</span>
              )}
              {isAdmin && <Crown size={12} className="text-[#c23531]" />}
              {isMod && <span className="text-[9px] text-[#8b6914] font-medium bg-[#8b6914]/10 px-1.5 py-0.5 rounded">版主</span>}
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                isAdmin ? 'bg-[#c23531]/10 text-[#c23531] border border-[#c23531]/20' :
                isMod ? 'bg-[#8b6914]/10 text-[#8b6914] border border-[#8b6914]/20' :
                'text-[#999]'
              }`}>@{profileUser.username}</span>
            </div>
            <div className="text-[9px] text-[#999]">加入于 {new Date(profileUser.created_at).toLocaleDateString('zh-CN')}</div>
          </div>
          {/* 操作按钮 */}
          {user && !isSelf && (
            <div className="shrink-0">
              {friendStatus === 'friends' ? (
                <span className="text-[10px] text-green-700 font-medium px-2 py-0.5 rounded-full bg-green-50 border border-green-200"><UserCheck size={10} className="inline" /> 好友</span>
              ) : friendStatus === 'pending_sent' ? (
                <span className="text-[10px] text-amber-700 font-medium px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200"><Clock size={10} className="inline" /> 待同意</span>
              ) : friendStatus === 'pending_received' ? (
                <button onClick={() => handleAcceptRequest(user.id)} className="text-[10px] text-blue-700 font-medium px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"><UserCheck size={10} className="inline" /> 接受</button>
              ) : (
                <button onClick={handleAddFriend} className="text-[10px] text-[#c23531] font-medium px-2 py-0.5 rounded-full border border-[#c23531]/20 hover:bg-[#c23531]/5 transition-colors"><UserPlus size={10} className="inline" /> 加好友</button>
              )}
            </div>
          )}
          {isSelf && !editing && (
            <button onClick={() => setEditing(true)} className="text-[10px] text-[#c23531] font-medium px-2 py-0.5 rounded-full border border-[#c23531]/20 hover:bg-[#c23531]/5 transition-colors shrink-0"><Pencil size={10} className="inline" /> 编辑资料</button>
          )}
        </div>

        {/* ===== 详细信息 ===== */}
        {!editing && (
          <>
            <div className="mt-2 border-t border-[#f5f0e8] pt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
              <div><span className="text-[#999]">用户名：</span><span className="text-[#666]">@{profileUser.username}</span></div>
              {profileUser.phone && <div><span className="text-[#999]">手机号：</span><span className="text-[#666]">{profileUser.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</span></div>}
              {profileUser.gender && <div><span className="text-[#999]">性别：</span><span className="text-[#666]">{genderLabel(profileUser.gender)}</span></div>}
              {profileUser.birth_place && <div><span className="text-[#999]">出生地：</span><span className="text-[#666]">{profileUser.birth_place}</span></div>}
              {profileUser.date_of_birth && <div><span className="text-[#999]">出生年月：</span><span className="text-[#666]">{new Date(profileUser.date_of_birth).toLocaleDateString('zh-CN')}（{new Date().getFullYear() - new Date(profileUser.date_of_birth).getFullYear()}岁）</span></div>}
              {profileUser.hobbies && <div className="col-span-2"><span className="text-[#999]">兴趣爱好：</span><span className="text-[#666]">{profileUser.hobbies}</span></div>}
            </div>
            {profileUser.bio && <p className="text-[10px] text-[#555] mt-1.5 bg-[#faf8f4] rounded-lg px-2 py-1.5 leading-relaxed"><span className="font-medium text-[#999]">个人简介：</span>{profileUser.bio}</p>}
            {profileUser.resume && <p className="text-[10px] text-[#555] mt-1 bg-[#faf8f4] rounded-lg px-2 py-1.5 whitespace-pre-wrap leading-relaxed"><span className="font-medium text-[#999]">简历：</span>{profileUser.resume}</p>}
          </>
        )}

        {/* ===== 编辑模式 ===== */}
        {editing && (
          <div className="mt-2 border-t border-[#f5f0e8] pt-2 space-y-2">
            <h2 className="text-[11px] font-bold text-[#1a1a1a]"><Pencil size={11} className="inline" /> 编辑资料</h2>
            <div className="grid grid-cols-2 gap-2">
              <div><label className="block text-[9px] text-[#888] mb-0.5">昵称</label><input type="text" value={form.display_name} onChange={e => update('display_name', e.target.value)} className="input text-xs py-1" maxLength={10} /></div>
              <div><label className="block text-[9px] text-[#888] mb-0.5">手机号</label><input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} className="input text-xs py-1" maxLength={11} placeholder="13812345678" /></div>
              <div><label className="block text-[9px] text-[#888] mb-0.5">出生年月</label><input type="date" value={form.date_of_birth} onChange={e => update('date_of_birth', e.target.value)} className="input text-xs py-1" max={new Date().toISOString().split('T')[0]} /></div>
              <div><label className="block text-[9px] text-[#888] mb-0.5">出生地</label><input type="text" value={form.birth_place} onChange={e => update('birth_place', e.target.value)} className="input text-xs py-1" placeholder="山东/威海" /></div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[{ v: 'male', l: '♂ 男' }, { v: 'female', l: '♀ 女' }, { v: 'other', l: '⚧ 其他' }].map(opt => (
                <label key={opt.v} className={`text-[10px] flex items-center justify-center gap-1 py-1.5 rounded-lg border cursor-pointer ${form.gender === opt.v ? 'border-[#c23531] bg-[#c23531]/5 text-[#c23531]' : 'border-[#eee8dc] text-[#888]'}`}>
                  <input type="radio" name="gender-edit" value={opt.v} checked={form.gender === opt.v} onChange={e => update('gender', e.target.value)} className="hidden" />
                  {opt.l}
                </label>
              ))}
            </div>
            <div><label className="block text-[9px] text-[#888] mb-0.5">兴趣爱好</label><input type="text" value={form.hobbies} onChange={e => update('hobbies', e.target.value)} className="input text-xs py-1" placeholder="摄影、编程、读书" /></div>
            <div><label className="block text-[9px] text-[#888] mb-0.5">个人简介 <span className="text-[#ccc]">({form.bio.length}/500)</span></label><textarea value={form.bio} onChange={e => update('bio', e.target.value)} className="input text-xs py-1 min-h-[60px] resize-none" maxLength={500} /></div>
            <div><label className="block text-[9px] text-[#888] mb-0.5">简历 <span className="text-[#ccc]">({form.resume.length}/2000)</span></label><textarea value={form.resume} onChange={e => update('resume', e.target.value)} className="input text-xs py-1 min-h-[80px] resize-none" maxLength={2000} /></div>
            {message && <div className="text-[10px] text-center py-1 rounded bg-green-50 border border-green-200 text-green-700">{message}</div>}
            <div className="flex gap-2 pt-1">
              <button onClick={() => { setEditing(false); setMessage('') }} className="flex-1 text-[10px] py-1.5 rounded-lg border border-[#eee8dc] text-[#888] hover:bg-gray-50 transition-colors">取消</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 text-[10px] py-1.5 rounded-lg bg-[#c23531] text-white hover:bg-[#a02a24] transition-colors">{saving ? '保存中...' : '保存'}</button>
            </div>
          </div>
        )}
      </div>

      {/* ===== 待处理的好友请求 ===== */}
      {isSelf && pendingRequests.length > 0 && (
        <div className="mb-3 bg-amber-50 rounded-xl border border-amber-200 p-3">
          <div className="flex items-center gap-1 mb-1.5">
            <Users size={12} className="text-amber-600" />
            <span className="text-[11px] font-semibold text-amber-700">待处理的好友请求 ({pendingRequests.length})</span>
          </div>
          {pendingRequests.map(req => (
            <div key={req.user_id} className="flex items-center justify-between py-1">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-[#b0a898] flex items-center justify-center text-[7px] text-white font-bold">{(req.user?.display_name || req.user?.username || '?')[0]}</div>
                <Link href={`/profile/${req.user_id}`} className="text-[11px] text-[#666] hover:text-[#c23531] transition-colors">{req.user?.display_name || req.user?.username}</Link><span className="text-[9px] text-[#999]">请求加你为好友</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleAcceptRequest(req.user_id)} className="text-[9px] px-2 py-0.5 rounded bg-green-100 text-green-700 hover:bg-green-200 transition-colors font-medium">同意</button>
                <button onClick={() => handleRejectRequest(req.user_id)} className="text-[9px] px-2 py-0.5 rounded bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"><X size={10} className="inline" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== 两栏：帖子 + 好友 ===== */}
      <div className="flex gap-3">
        {/* 左：帖子 */}
        <div className="flex-1 min-w-0 bg-white rounded-xl border border-[#eee8dc] p-3">
          <h3 className="text-[10px] font-semibold text-[#888] uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <FileText size={10} /> 帖子 ({threads.length})
          </h3>
          {threads.length === 0 ? (
            <p className="text-[10px] text-[#ccc] py-3 text-center">暂无帖子</p>
          ) : (
            <div className="space-y-px">
              {(showAllThreads ? threads : threads.slice(0, 5)).map(t => (
                <Link key={t.id} href={`/t/${t.id}`}
                  className="block py-1 px-1.5 rounded hover:bg-[#faf8f4] transition-colors">
                  <p className="text-[10px] text-[#1a1a1a] truncate leading-tight font-medium">{t.title}</p>
                  <div className="flex items-center gap-1.5 text-[8px] text-[#bbb]">
                    <span>{t.categories?.name}</span>
                    <span>{new Date(t.created_at).toLocaleDateString('zh-CN')}</span>
                    <span><MessageCircle size={8} className="inline" />{t.reply_count || 0}</span>
                    <span><Eye size={8} className="inline" />{t.view_count || 0}</span>
                  </div>
                </Link>
              ))}
              {threads.length > 5 && !showAllThreads && (
                <button onClick={() => setShowAllThreads(true)}
                  className="w-full text-center text-[9px] text-[#c23531] py-0.5 hover:bg-[#faf8f4] rounded transition-colors">查看全部 {threads.length} 条</button>
              )}
            </div>
          )}
        </div>

        {/* 右：好友 */}
        <div className="flex-1 min-w-0 bg-white rounded-xl border border-[#eee8dc] p-3">
          <h3 className="text-[10px] font-semibold text-[#888] uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Users size={10} /> 好友 ({friends.length})
          </h3>
          {friends.length === 0 ? (
            <p className="text-[10px] text-[#ccc] py-3 text-center">暂无好友</p>
          ) : (
            <div className="space-y-px">
              {(showAllFriends ? friends : friends.slice(0, 5)).map(f => (
                <Link key={f.id} href={`/profile/${f.id}`}
                  className="flex items-center gap-1.5 py-1 px-1.5 rounded hover:bg-[#faf8f4] transition-colors">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold text-white shrink-0 ${f.role === 'admin' ? 'bg-[#c23531]' : 'bg-[#b0a898]'}`}>
                    {(f.display_name || f.username || '?')[0]}
                  </div>
                  <span className="text-[10px] text-[#555] truncate flex-1">{f.display_name || f.username}</span>
                  {f.role === 'admin' && <Crown size={7} className="text-[#c23531] shrink-0" />}
                </Link>
              ))}
              {friends.length > 5 && !showAllFriends && (
                <button onClick={() => setShowAllFriends(true)}
                  className="w-full text-center text-[9px] text-[#c23531] py-0.5 hover:bg-[#faf8f4] rounded transition-colors">查看全部 {friends.length} 位</button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 退出登录 */}
      {isSelf && (
        <div className="mt-3 text-center">
          <button onClick={handleLogout} className="text-[10px] text-[#c23531] opacity-60 hover:opacity-100 transition-opacity">退出登录</button>
          {amAdmin && <Link href="/members" className="text-[10px] text-[#999] ml-3 hover:text-[#c23531] transition-colors">会员管理</Link>}
        </div>
      )}
    </div>
  )
}
