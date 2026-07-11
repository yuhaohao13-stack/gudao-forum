'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'
import Breadcrumb from '@/components/Breadcrumb'
import { Crown, UserPlus, UserCheck, Clock, X, MessageCircle, Eye, Loader2, Users } from 'lucide-react'

export default function ProfilePage() {
  const { id } = useParams()
  const supabase = createClient()
  const { user, profile: myProfile } = useAuth()

  const [profileUser, setProfileUser] = useState(null)
  const [threads, setThreads] = useState([])
  const [friends, setFriends] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [friendStatus, setFriendStatus] = useState(null) // null | 'pending_sent' | 'pending_received' | 'friends'
  const [loading, setLoading] = useState(true)
  const [showAllThreads, setShowAllThreads] = useState(false)
  const [showAllFriends, setShowAllFriends] = useState(false)

  const isSelf = user?.id === id

  useEffect(() => {
    const load = async () => {
      // 用户资料
      const { data: p } = await supabase.from('profiles').select('*').eq('id', id).single()
      if (!p) { setLoading(false); return }
      setProfileUser(p)

      // 帖子（最多10条）
      const { data: t } = await supabase
        .from('threads')
        .select('*, categories(name, slug)')
        .eq('author_id', id)
        .order('created_at', { ascending: false })
        .limit(10)
      setThreads(t || [])

      // 好友列表（已接受的）
      const { data: f1 } = await supabase
        .from('friends')
        .select('*, friend:friend_id(id, username, display_name, role)')
        .eq('user_id', id)
        .eq('status', 'accepted')
      const { data: f2 } = await supabase
        .from('friends')
        .select('*, user:user_id(id, username, display_name, role)')
        .eq('friend_id', id)
        .eq('status', 'accepted')
      const myFriends = [
        ...(f1 || []).map(f => f.friend),
        ...(f2 || []).map(f => f.user),
      ]
      setFriends(myFriends)

      // 待处理的好友请求（别人发给当前profile用户的）
      const { data: pr } = await supabase
        .from('friends')
        .select('*, user:user_id(id, username, display_name, role)')
        .eq('friend_id', id)
        .eq('status', 'pending')
      setPendingRequests(pr || [])

      // 当前登录用户和这个profile用户的好友关系
      if (user && user.id !== id) {
        const { data: fs } = await supabase
          .from('friends')
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
    }
    load()
  }, [id])

  const handleAddFriend = async () => {
    const res = await fetch('/api/friend/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to_user_id: id }),
    })
    const data = await res.json()
    if (data.success) setFriendStatus(data.status === 'accepted' ? 'friends' : 'pending_sent')
  }

  const handleAcceptRequest = async (requesterId) => {
    await supabase.from('friends').update({ status: 'accepted' }).eq('user_id', requesterId).eq('friend_id', id)
    // 刷新
    const { data: ru } = await supabase.from('profiles').select('*').eq('id', requesterId).single()
    if (ru) setFriends(prev => [...prev, ru])
    setPendingRequests(prev => prev.filter(r => r.user_id !== requesterId))
    if (isSelf) setFriendStatus('friends')
  }

  const handleRejectRequest = async (requesterId) => {
    await supabase.from('friends').delete().eq('user_id', requesterId).eq('friend_id', id)
    setPendingRequests(prev => prev.filter(r => r.user_id !== requesterId))
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 size={20} className="animate-spin text-[#ccc]" /></div>
  }

  if (!profileUser) {
    return <div className="text-center py-20 text-[#999]">用户不存在</div>
  }

  const isAdmin = profileUser.role === 'admin'
  const isMod = profileUser.role === 'moderator'
  const avatarLetter = (profileUser.display_name || profileUser.username || '?')[0]

  return (
    <div className="anim-fade-in max-w-4xl mx-auto">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: profileUser.display_name || profileUser.username },
      ]} />

      {/* 用户卡片 — 紧凑版 */}
      <div className="bg-white rounded-xl border border-[#eee8dc] p-4 mb-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${isAdmin ? 'bg-[#c23531]' : isMod ? 'bg-[#8b6914]' : 'bg-[#b0a898]'}`}>
            {avatarLetter}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-[#1a1a1a]">{profileUser.display_name || profileUser.username}</h1>
              {isAdmin && <Crown size={14} className="text-[#c23531]" />}
              {isMod && <span className="text-[10px] text-[#8b6914] font-medium">版主</span>}
            </div>
            <div className="text-xs text-[#999] mt-0.5">
              @{profileUser.username} · 加入于 {new Date(profileUser.created_at).toLocaleDateString('zh-CN')}
            </div>
          </div>
          {/* 好友操作按钮 */}
          {user && !isSelf && (
            <div className="shrink-0">
              {friendStatus === 'friends' ? (
                <span className="inline-flex items-center gap-1 text-xs text-green-700 font-medium px-2.5 py-1 rounded-full bg-green-50 border border-green-200">
                  <UserCheck size={12} /> 好友
                </span>
              ) : friendStatus === 'pending_sent' ? (
                <span className="inline-flex items-center gap-1 text-xs text-amber-700 font-medium px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200">
                  <Clock size={12} /> 待同意
                </span>
              ) : friendStatus === 'pending_received' ? (
                <button onClick={() => handleAcceptRequest(user.id)}
                  className="inline-flex items-center gap-1 text-xs text-blue-700 font-medium px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors">
                  <UserCheck size={12} /> 接受
                </button>
              ) : (
                <button onClick={handleAddFriend}
                  className="inline-flex items-center gap-1 text-xs text-[#c23531] font-medium px-2.5 py-1 rounded-full border border-[#c23531]/20 hover:bg-[#c23531]/5 transition-colors">
                  <UserPlus size={12} /> 加好友
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 待处理的好友请求（显著提醒） */}
      {isSelf && pendingRequests.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Users size={12} className="text-[#c23531]" />
            <span className="text-xs font-semibold text-[#c23531]">好友请求 ({pendingRequests.length})</span>
          </div>
          <div className="bg-white rounded-xl border border-[#c23531]/20 p-3 space-y-2">
            {pendingRequests.map(req => (
              <div key={req.user_id} className="flex items-center justify-between">
                <Link href={`/profile/${req.user_id}`} className="flex items-center gap-2 hover:text-[#c23531] transition-colors">
                  <div className="w-7 h-7 rounded-full bg-[#b0a898] flex items-center justify-center text-[9px] text-white font-bold">
                    {(req.user?.display_name || req.user?.username || '?')[0]}
                  </div>
                  <span className="text-sm text-[#1a1a1a]">{req.user?.display_name || req.user?.username}</span>
                </Link>
                <div className="flex gap-1">
                  <button onClick={() => handleAcceptRequest(req.user_id)}
                    className="text-xs px-2.5 py-1 rounded-md bg-green-50 text-green-700 hover:bg-green-100 transition-colors font-medium">
                    同意
                  </button>
                  <button onClick={() => handleRejectRequest(req.user_id)}
                    className="text-xs px-2.5 py-1 rounded-md bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors">
                    <X size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 帖子 + 好友 并排 50/50 */}
      <div className="flex gap-4">
        {/* 左侧：帖子 */}
        <div className="flex-1 min-w-0 bg-white rounded-xl border border-[#eee8dc] p-3">
          <h3 className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-2 flex items-center gap-1">
            <MessageCircle size={12} /> 帖子 ({threads.length})
          </h3>
          {threads.length === 0 ? (
            <p className="text-xs text-[#ccc] py-4 text-center">暂无帖子</p>
          ) : (
            <div className="space-y-1">
              {(showAllThreads ? threads : threads.slice(0, 5)).map(t => (
                <Link key={t.id} href={`/t/${t.id}`}
                  className="block py-1.5 px-2 rounded-lg hover:bg-[#faf8f4] transition-colors">
                  <p className="text-xs text-[#1a1a1a] truncate leading-snug">{t.title}</p>
                  <div className="flex items-center gap-2 text-[10px] text-[#bbb] mt-0.5">
                    <span>{t.categories?.name}</span>
                    <span>{new Date(t.created_at).toLocaleDateString('zh-CN')}</span>
                    <span><MessageCircle size={10} className="inline" /> {t.reply_count || 0}</span>
                    <span><Eye size={10} className="inline" /> {t.view_count || 0}</span>
                  </div>
                </Link>
              ))}
              {threads.length > 5 && !showAllThreads && (
                <button onClick={() => setShowAllThreads(true)}
                  className="w-full text-center text-[10px] text-[#c23531] py-1 hover:bg-[#faf8f4] rounded-lg transition-colors">
                  查看全部 {threads.length} 条
                </button>
              )}
            </div>
          )}
        </div>

        {/* 右侧：好友 */}
        <div className="flex-1 min-w-0 bg-white rounded-xl border border-[#eee8dc] p-3">
          <h3 className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-2 flex items-center gap-1">
            <Users size={12} /> 好友 ({friends.length})
          </h3>
          {friends.length === 0 ? (
            <p className="text-xs text-[#ccc] py-4 text-center">暂无好友</p>
          ) : (
            <div className="space-y-1">
              {(showAllFriends ? friends : friends.slice(0, 5)).map(f => (
                <Link key={f.id} href={`/profile/${f.id}`}
                  className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-[#faf8f4] transition-colors">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0 ${f.role === 'admin' ? 'bg-[#c23531]' : 'bg-[#b0a898]'}`}>
                    {(f.display_name || f.username || '?')[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[#555] truncate">{f.display_name || f.username}</p>
                  </div>
                  {f.role === 'admin' && <Crown size={8} className="text-[#c23531] shrink-0" />}
                </Link>
              ))}
              {friends.length > 5 && !showAllFriends && (
                <button onClick={() => setShowAllFriends(true)}
                  className="w-full text-center text-[10px] text-[#c23531] py-1 hover:bg-[#faf8f4] rounded-lg transition-colors">
                  查看全部 {friends.length} 位好友
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
