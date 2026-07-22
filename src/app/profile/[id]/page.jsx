'use client'

/* __BUILD_V5__ */

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'
import Breadcrumb from '@/components/Breadcrumb'
import { Crown, Shield, Pencil, MessageCircle, Users, Clock, CheckCircle, X, FileText, Inbox, Mars, Venus, Sparkles, Eye, Loader2, UserPlus, UserCheck, Inbox as InboxIcon } from 'lucide-react'
import DatePicker from '@/components/DatePicker'
import BirthPlaceSelector, { bpStr, parseBp } from '@/components/BirthPlaceSelector'
import CheckInButton from '@/components/CheckInButton'

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
  const [points, setPoints] = useState(0)
  const [exchangeMsg, setExchangeMsg] = useState('')
  const [exchanging, setExchanging] = useState('')
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({})
  const [friendUpdate, setFriendUpdate] = useState(0)

  const isSelf = user?.id === id
  const amAdmin = myProfile?.role === 'admin'

  const loadData = useCallback(async () => {
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

    const { data: t } = await supabase.from('threads')
      .select('*, categories(name, slug)').eq('author_id', id)
      .order('created_at', { ascending: false }).limit(50)
    setThreads(t || [])

    // 查好友列表：分两步，先查 friends 表拿ID，再查 profiles 表拿资料
    // friends.addressee_id 的外键是 auth.users，不能用 Supabase join 查 profiles
    const { data: f1 } = await supabase.from('friends')
      .select('addressee_id')
      .eq('requester_id', id).eq('status', 'accepted')
    const { data: f2 } = await supabase.from('friends')
      .select('requester_id')
      .eq('addressee_id', id).eq('status', 'accepted')
    const friendIds = [...new Set([
      ...(f1 || []).map(f => f.addressee_id),
      ...(f2 || []).map(f => f.requester_id),
    ])]
    if (friendIds.length > 0) {
      const { data: friendProfiles } = await supabase
        .from('profiles')
        .select('id, username, display_name, role')
        .in('id', friendIds)
      setFriends(friendProfiles || [])
    } else {
      setFriends([])
    }

    if (isSelf) {
      const { data: pr } = await supabase.from('friends')
        .select('requester_id')
        .eq('addressee_id', id).eq('status', 'pending')
      if (pr && pr.length > 0) {
        const requesterIds = pr.map(r => r.requester_id)
        const { data: requesterProfiles } = await supabase
          .from('profiles')
          .select('id, username, display_name, role')
          .in('id', requesterIds)
        setPendingRequests(requesterProfiles.map(p => ({ requester_id: p.id, requester: p })) || [])
      } else {
        setPendingRequests([])
      }
    }

    if (user && !isSelf) {
      const { data: fs } = await supabase.from('friends')
        .select('*')
        .or(`and(requester_id.eq.${user.id},addressee_id.eq.${id}),and(requester_id.eq.${id},addressee_id.eq.${user.id})`)
        .maybeSingle()
      if (fs) {
        if (fs.status === 'accepted') setFriendStatus('friends')
        else if (fs.status === 'pending' && fs.requester_id === user.id) setFriendStatus('pending_sent')
        else if (fs.status === 'pending' && fs.addressee_id === user.id) setFriendStatus('pending_received')
      }
    }

    setLoading(false)
  }, [id, user, isSelf])

  useEffect(() => { loadData() }, [loadData, friendUpdate])

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSave = async () => {
    setSaving(true); setMessage('')
    const { error } = await supabase.from('profiles').update({
      display_name: form.display_name.trim(), phone: form.phone,
      date_of_birth: form.date_of_birth, gender: form.gender,
      birth_place: form.birth_place.trim(), hobbies: form.hobbies.trim(), bio: form.bio.trim(),
      resume: form.resume.trim(),
    }).eq('id', id)
    if (error) setMessage('保存失败: ' + error.message)
    else { setMessage('✅ 保存成功'); setProfileUser(prev => ({ ...prev, ...form })); setEditing(false) }
    setSaving(false); setTimeout(() => setMessage(''), 3000)
  }

  const handleAddFriend = async () => {
    const res = await fetch('/api/friend/add', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to_user_id: id }),
    })
    const data = await res.json()
    if (data.success) setFriendStatus(data.status === 'accepted' ? 'friends' : 'pending_sent')
  }

  const handleAccept = async (rid) => {
    await supabase.from('friends').update({ status: 'accepted' }).eq('requester_id', rid).eq('addressee_id', id)
    setPendingRequests(prev => prev.filter(r => r.requester_id !== rid))
    setFriendUpdate(prev => prev + 1)
  }

  const handleReject = async (rid) => {
    await supabase.from('friends').delete().eq('requester_id', rid).eq('addressee_id', id)
    setPendingRequests(prev => prev.filter(r => r.requester_id !== rid))
  }

  // 加载积分
  const loadPoints = useCallback(async () => {
    if (!user || !isSelf) return
    const { data: p } = await supabase.from('profiles').select('points').eq('id', id).single()
    if (p) setPoints(p.points || 0)
  }, [user, isSelf, id, supabase])

  useEffect(() => { loadPoints() }, [loadPoints])

  // 监听积分更新事件（签到后自动刷新）
  useEffect(() => {
    const handler = () => loadPoints()
    window.addEventListener('points-updated', handler)
    return () => window.removeEventListener('points-updated', handler)
  }, [loadPoints])

  const handleExchange = async (target) => {
    if (exchanging) return
    setExchanging(target)
    setExchangeMsg('')
    const res = await fetch('/api/points/exchange', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target }),
    })
    const data = await res.json()
    if (data.success) {
      setPoints(data.remaining_points)
      setExchangeMsg(data.message)
      setTimeout(() => setExchangeMsg(''), 6000)
    } else {
      setExchangeMsg(data.message)
      setTimeout(() => setExchangeMsg(''), 8000)
    }
    setExchanging('')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut(); router.push('/login'); router.refresh()
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={20} className="animate-spin text-[#ccc]" /></div>
  if (!profileUser) return <div className="text-center py-20 text-[#999]">用户不存在</div>

  const isAdmin = profileUser.role === 'admin'
  const isMod = profileUser.role === 'moderator'
  const memberLevel = profileUser.membership_level || 'regular'
  const memberLabel = memberLevel === 'diamond' ? '💎 钻石会员' : memberLevel === 'gold' ? '🏆 黄金会员' : '普通会员'
  const memberColor = memberLevel === 'diamond' ? 'text-purple-600 bg-purple-50 border-purple-200' : memberLevel === 'gold' ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-gray-500 bg-gray-50 border-gray-200'
  const avatarLetter = (profileUser.display_name || profileUser.username || '?')[0]
  const genderLabel = (g) => {
    if (g === 'male') return '♂ 男'
    if (g === 'female') return '♀ 女'
    return '⚧ 其他'
  }

  return (
    <div className="anim-fade-in max-w-4xl mx-auto">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        ...(amAdmin ? [{ label: '会员管理', href: '/members' }] : []),
        { label: profileUser.display_name || profileUser.username },
      ]} />

      {/* ============ 个人信息卡片（压缩） ============ */}
      <div className="bg-white rounded-xl border border-[#eee8dc] p-4 mb-4">
        {/* 头像 + 名称 + 角色 + 操作按钮 */}
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-bold text-white shrink-0 ${isAdmin ? 'bg-[#c23531]' : isMod ? 'bg-[#8b6914]' : 'bg-[#b0a898]'}`}>
            {avatarLetter}
          </div>
          <div className="min-w-0 flex-1">
            {/* 会员等级（在名称上方） */}
            {memberLabel && (
              <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block mb-0.5 ${memberColor}`}>
                {memberLabel}
              </div>
            )}
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-[14px] font-bold text-[#1a1a1a]">{profileUser.display_name || profileUser.username}</h1>
              {profileUser.member_no && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#f5f0e8] border border-[#e8e0d0] text-[#8b6914] font-mono">#{profileUser.member_no}</span>}
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-bold">💰 {points} 积分</span>
              {isAdmin && <Crown size={14} className="text-[#c23531]" />}
              {isMod && <span className="text-[10px] text-[#8b6914] font-medium bg-[#8b6914]/10 px-1.5 py-0.5 rounded">版主</span>}
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${isAdmin ? 'bg-[#c23531]/10 text-[#c23531]' : isMod ? 'bg-[#8b6914]/10 text-[#8b6914]' : 'text-[#999]'}`}>@{profileUser.username}</span>
            </div>
            <div className="text-[10px] text-[#999] mt-0.5">加入于 {new Date(profileUser.created_at).toLocaleDateString('zh-CN')}</div>
          </div>
          <div className="shrink-0 flex items-center gap-4 flex-wrap">
            {user && !isSelf ? (
              friendStatus === 'friends' ? (
                <span className="text-xs text-green-700 font-medium px-3 py-1.5 rounded-full bg-green-50 border border-green-200"><UserCheck size={12} className="inline" /> 好友</span>
              ) : friendStatus === 'pending_sent' ? (
                <span className="text-xs text-amber-700 font-medium px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200"><Clock size={12} className="inline" /> 待同意</span>
              ) : friendStatus === 'pending_received' ? (
                <button onClick={() => handleAccept(user.id)} className="text-xs text-blue-700 font-medium px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 hover:bg-blue-100"><UserCheck size={12} className="inline" /> 接受</button>
              ) : (
                <button onClick={handleAddFriend} className="text-xs text-[#c23531] font-medium px-3 py-1.5 rounded-full border border-[#c23531]/20 hover:bg-[#c23531]/5"><UserPlus size={12} className="inline" /> 加好友</button>
              )
            ) : isSelf && !editing ? (
              <>
                <CheckInButton className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100" />
                <button onClick={() => setEditing(true)} className="text-xs text-[#c23531] font-medium px-3 py-1.5 rounded-full border border-[#c23531]/20 hover:bg-[#c23531]/5"><Pencil size={12} className="inline-block align-middle" /> 编辑</button>
                {amAdmin && <button onClick={() => router.push('/members')} className="text-xs text-[#c23531] font-medium px-3 py-1.5 rounded-full border border-[#c23531]/20 hover:bg-[#c23531]/5"><Users size={12} className="inline-block align-middle" /> 会员管理</button>}
                <button onClick={handleLogout} className="text-xs text-[#666] font-medium px-3 py-1.5 rounded-full border border-[#ddd] hover:bg-gray-50">退出</button>
                <button onClick={() => router.push('/login')} className="text-xs text-[#666] font-medium px-3 py-1.5 rounded-full border border-[#ddd] hover:bg-gray-50">切换</button>
              </>
            ) : null}
          </div>
        </div>

        {/* ===== 详细信息（紧凑单列，统一字号，空值显示-） ===== */}
        {!editing && (
          <div className="mt-2 pt-2 border-t border-[#f5f0e8] text-[14px] space-y-0.5">
            <div><span className="text-[#999]">用户名：</span><span className="text-[#666]">@{profileUser.username}</span></div>
            <div><span className="text-[#999]">邮箱：</span><span className="text-[#666]">{user?.email || (isSelf ? '未设置' : '已隐藏')}</span></div>
            <div><span className="text-[#999]">手机号：</span><span className="text-[#666]">{profileUser.phone ? profileUser.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '-'}</span></div>
            <div><span className="text-[#999]">性别：</span><span className="text-[#666]">{profileUser.gender ? genderLabel(profileUser.gender) : '-'}</span></div>
            <div><span className="text-[#999]">出生地：</span><span className="text-[#666]">{profileUser.birth_place || '-'}</span></div>
            <div><span className="text-[#999]">出生年月：</span><span className="text-[#666]">{profileUser.date_of_birth ? new Date(profileUser.date_of_birth).toLocaleDateString('zh-CN') + '（' + (new Date().getFullYear() - new Date(profileUser.date_of_birth).getFullYear()) + '岁）' : '-'}</span></div>
            <div><span className="text-[#999]">兴趣爱好：</span><span className="text-[#666]">{profileUser.hobbies || '-'}</span></div>
            <div><span className="text-[#999]">个人简介：</span><span className="text-[#666]">{profileUser.bio || '-'}</span></div>
            <div className="whitespace-pre-wrap"><span className="text-[#999]">简历：</span><span className="text-[#666]">{profileUser.resume || '-'}</span></div>
          </div>
        )}

        {/* ===== 积分兑换会员 ===== */}
        {isSelf && !editing && (
          <div className="mt-2 pt-2 border-t border-[#f5f0e8]">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#999]">积分兑换：</span>
                <button
                  onClick={() => {
                    if (confirm('确定用 5000 积分兑换黄金会员？')) handleExchange('gold')
                  }}
                  disabled={exchanging === 'gold'}
                  className="text-xs font-medium px-3 py-1.5 rounded-full border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                >{exchanging === 'gold' ? '处理中...' : '🏆 兑换黄金会员（5000积分）'}</button>
                <button
                  onClick={() => {
                    if (confirm('确定用 20000 积分兑换钻石会员？')) handleExchange('diamond')
                  }}
                  disabled={exchanging === 'diamond'}
                  className="text-xs font-medium px-3 py-1.5 rounded-full border border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
                >{exchanging === 'diamond' ? '处理中...' : '💎 兑换钻石会员（20000积分）'}</button>
              </div>
              <Link href="/lottery/upgrade" className="text-[10px] text-[#c23531] hover:text-[#a02a24]">积分不够？联系管理员充值打赏 →</Link>
            </div>
            {exchangeMsg && (
              <div className={`mt-2 text-xs px-3 py-2 rounded-lg ${exchangeMsg.includes('🎉') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                {exchangeMsg}
              </div>
            )}
          </div>
        )}

        {/* ===== 编辑模式 ===== */}
        {editing && (
          <div className="mt-2 pt-2 border-t border-[#f5f0e8] space-y-2 max-w-lg">
            <h2 className="text-sm font-bold text-[#1a1a1a]"><Pencil size={14} className="inline" /> 编辑资料</h2>
            {/* 不可更改信息提示 */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-[10px] text-amber-700 leading-relaxed">
              🔒 用户名 @{profileUser.username}、手机号、邮箱注册后不可更改
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className="block text-[10px] text-[#888] mb-0.5">昵称</label><input type="text" value={form.display_name} onChange={e => update('display_name', e.target.value)} className="input text-xs py-1" maxLength={10} /></div>
              <div><label className="block text-[10px] text-[#888] mb-0.5">出生年月</label><DatePicker value={form.date_of_birth} onChange={(d) => update('date_of_birth', d)} lang="zh" max={new Date().toISOString().split('T')[0]} /></div>
              <div><label className="block text-[10px] text-[#888] mb-0.5">出生地</label><BirthPlaceSelector value={parseBp(form.birth_place)} onChange={(v) => update('birth_place', bpStr(v))} lang="zh" /></div>
            </div>
            <div className="flex gap-2">{[{ v:'male',l:'♂ 男'},{v:'female',l:'♀ 女'},{v:'other',l:'⚧ 其他'}].map(o => (
              <label key={o.v} className={`text-xs flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border cursor-pointer ${form.gender === o.v ? 'border-[#c23531] bg-[#c23531]/5 text-[#c23531]' : 'border-[#eee8dc] text-[#888]'}`}>
                <input type="radio" name="gender-edit" value={o.v} checked={form.gender === o.v} onChange={e => update('gender', e.target.value)} className="hidden" />
                {o.l}
              </label>
            ))}</div>
            <div><label className="block text-[10px] text-[#888] mb-0.5">兴趣爱好</label><input type="text" value={form.hobbies} onChange={e => update('hobbies', e.target.value)} className="input text-xs py-1" placeholder="摄影、编程、读书" /></div>
            <div><label className="block text-[10px] text-[#888] mb-0.5">个人简介 <span className="text-[#ccc]">({form.bio.length}/500)</span></label><textarea value={form.bio} onChange={e => update('bio', e.target.value)} className="input text-xs py-1 min-h-[60px] resize-none" maxLength={500} /></div>
            <div><label className="block text-[10px] text-[#888] mb-0.5">简历 <span className="text-[#ccc]">({form.resume.length}/2000)</span></label><textarea value={form.resume} onChange={e => update('resume', e.target.value)} className="input text-xs py-1 min-h-[80px] resize-none" maxLength={2000} /></div>
            {message && <div className="text-xs text-center py-1 rounded bg-green-50 border border-green-200 text-green-700">{message}</div>}
            <div className="flex gap-2">
              <button onClick={() => { setEditing(false); setMessage('') }} className="flex-1 text-xs py-1.5 rounded-lg border border-[#eee8dc] text-[#888] hover:bg-gray-50">取消</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 text-xs py-1.5 rounded-lg bg-[#c23531] text-white hover:bg-[#a02a24]">{saving ? '保存中...' : '保存'}</button>
            </div>
          </div>
        )}
      </div>

      {/* ============ 好友请求提醒 ============ */}
      {isSelf && pendingRequests.length > 0 && (
        <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200">
          <div className="flex items-center gap-1 mb-2">
            <Users size={14} className="text-amber-600" />
            <span className="text-sm font-semibold text-amber-700">待处理的好友请求 ({pendingRequests.length})</span>
          </div>
          {pendingRequests.map(req => (
            <div key={req.requester_id} className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#b0a898] flex items-center justify-center text-[8px] text-white font-bold">{(req.requester?.display_name || req.requester?.username || '?')[0]}</div>
                <Link href={`/profile/${req.requester_id}`} className="text-sm text-[#666] hover:text-[#c23531]">{req.requester?.display_name || req.requester?.username}</Link>
                <span className="text-xs text-[#999]">请求加你为好友</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleAccept(req.requester_id)} className="text-xs px-2.5 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 font-medium">同意</button>
                <button onClick={() => handleReject(req.requester_id)} className="text-xs px-2.5 py-1 rounded bg-gray-100 text-gray-500 hover:bg-gray-200"><X size={12} className="inline" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============ 两栏：帖子 | 好友（正常大小） ============ */}
      <div className="grid grid-cols-2 gap-4">
        {/* 左：帖子 */}
        <div>
          <h2 className="font-semibold text-sm text-[#666] mb-2 flex items-center gap-1.5">
            <FileText size={16} className="text-[#c23531]" />
            帖子 <span className="font-normal text-[#aaa] text-xs">({threads.length})</span>
          </h2>
          <div className="space-y-2">
            {threads.length === 0 ? (
              <div className="card p-6 text-center">
                <InboxIcon size={24} className="inline-block text-[#ccc] mb-1" />
                <p className="text-[#999] text-sm">暂无帖子</p>
              </div>
            ) : (
              threads.map((t, i) => (
                <Link key={t.id} href={`/t/${t.id}`}
                  className="block bg-white border border-[#ece8e0] rounded-lg px-4 py-3 hover:border-[#c23531]/30 transition-all hover:shadow-sm">
                  <div className="text-sm font-medium text-[#1a1a1a] truncate">{t.title}</div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-sm text-[#999] truncate">
                      {t.categories?.name} <span className="text-[#ddd6c8] mx-1">·</span>
                      {new Date(t.created_at).toLocaleDateString('zh-CN')}
                    </div>
                    <div className="text-sm text-[#bbb] shrink-0 ml-2">
                      <MessageCircle size={14} className="inline align-text-bottom" /> {t.reply_count || 0}
                      <Eye size={14} className="inline align-text-bottom ml-1.5" /> {t.view_count || 0}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* 右：好友 */}
        <div>
          <h2 className="font-semibold text-sm text-[#666] mb-2 flex items-center gap-1.5">
            <Users size={16} className="text-[#c23531]" />
            好友 <span className="font-normal text-[#aaa] text-xs">({friends.length})</span>
          </h2>
          {isSelf ? (
            <div className="space-y-2">
              {friends.length === 0 ? (
                <div className="card p-6 text-center">
                  <Users size={24} className="inline-block text-[#ccc] mb-1" />
                  <p className="text-[#999] text-sm">暂无好友</p>
                  <p className="text-[#ccc] text-sm mt-1">去帖子页面找人加好友吧</p>
                </div>
              ) : (
                friends.map(f => (
                  <div key={f.id} className="bg-white border border-[#ece8e0] rounded-lg px-4 py-3 flex items-center justify-between hover:border-[#c23531]/30 transition-all hover:shadow-sm">
                    <Link href={`/profile/${f.id}`} className="flex items-center gap-2 min-w-0 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${f.role === 'admin' ? 'bg-[#c23531]' : 'bg-[#b0a898]'}`}>
                        {(f.display_name || f.username || '?')[0]}
                      </div>
                      <span className="text-sm font-medium text-[#1a1a1a] truncate">{f.display_name || f.username}</span>
                      {f.role === 'admin' && <Crown size={10} className="text-[#c23531] shrink-0" />}
                    </Link>
                    <Link href={`/messages/${f.id}`}
                      className="text-sm px-3 py-1.5 rounded-md bg-[#f5f5f5] text-[#666] hover:bg-[#eee] hover:text-[#c23531] transition-colors shrink-0 ml-2">
                      <MessageCircle size={14} className="inline align-text-bottom" /> 私信
                    </Link>
                  </div>
                ))
              )}
            </div>
          ) : friendStatus === 'friends' ? (
            <div className="card p-6 text-center">
              <p className="text-[#999] text-sm">已是好友 ❤️</p>
            </div>
          ) : (
            <div className="card p-6 text-center">
              <p className="text-[#999] text-sm">成为好友后可查看好友列表</p>
            </div>
          )}
        </div>
      </div>


    </div>
  )
}
