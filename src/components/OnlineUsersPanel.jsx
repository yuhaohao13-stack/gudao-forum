'use client'

import { useEffect, useState, useCallback } from 'react'
import { UserPlus, UserCheck, Loader2, Clock, Crown, X as XIcon, Users } from 'lucide-react'

const POLL_INTERVAL = 15000

export default function OnlineUsersPanel({ roomSlug, currentUserId }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [friendStatuses, setFriendStatuses] = useState({})
  const [actionPending, setActionPending] = useState({})
  const [message, setMessage] = useState('')
  const [showAll, setShowAll] = useState(false)

  const fetchOnlineUsers = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat/online-users?room_slug=${roomSlug}`)
      if (!res.ok) return
      const data = await res.json()
      setUsers(data.users || [])

      const registeredUsers = (data.users || []).filter(u => !u.is_guest && u.user_id !== currentUserId)
      if (registeredUsers.length > 0) {
        for (const u of registeredUsers) {
          fetchFriendStatus(u.user_id)
        }
      }
    } catch (e) {
    } finally {
      setLoading(false)
    }
  }, [roomSlug, currentUserId])

  const fetchFriendStatus = async (targetUserId) => {
    try {
      const res = await fetch(`/api/friend/check?user_id=${targetUserId}`)
      if (!res.ok) return
      const data = await res.json()
      setFriendStatuses(prev => ({ ...prev, [targetUserId]: data.status }))
    } catch (e) {}
  }

  const handleAddFriend = async (targetUserId) => {
    setActionPending(prev => ({ ...prev, [targetUserId]: true }))
    setMessage('')
    try {
      const res = await fetch('/api/friend/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to_user_id: targetUserId }),
      })
      const data = await res.json()
      if (data.success) {
        setFriendStatuses(prev => ({ ...prev, [targetUserId]: 'pending_sent' }))
        setMessage(data.message || '好友请求已发送')
      } else {
        setMessage(data.error || '添加失败')
      }
    } catch (e) {
      setMessage('添加失败，请稍后再试')
    } finally {
      setActionPending(prev => ({ ...prev, [targetUserId]: false }))
      setTimeout(() => setMessage(''), 3000)
    }
  }

  useEffect(() => {
    fetchOnlineUsers()
    const interval = setInterval(fetchOnlineUsers, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchOnlineUsers])

  const getFriendAction = (userItem) => {
    if (userItem.is_guest || !userItem.user_id || userItem.user_id === currentUserId) return null
    const status = friendStatuses[userItem.user_id]
    if (status === 'friends') return <span className="text-[10px] text-green-600 font-medium"><UserCheck size={10} className="inline" /> 好友</span>
    if (status === 'pending_sent') return <span className="text-[10px] text-amber-600 font-medium"><Clock size={10} className="inline" /> 待同意</span>
    if (status === 'pending_received') return <span className="text-[10px] text-blue-600 font-medium">已申请</span>
    return (
      <button
        onClick={(e) => { e.stopPropagation(); handleAddFriend(userItem.user_id) }}
        disabled={actionPending[userItem.user_id]}
        className="text-[10px] text-[#c23531] hover:text-[#a02a24] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {actionPending[userItem.user_id] ? <Loader2 size={10} className="animate-spin inline" /> : '＋好友'}
      </button>
    )
  }

  const getAvatar = (u) => {
    const letter = u.display_name?.[0] || '?'
    if (u.is_guest) return <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[8px] font-bold text-white bg-[#d0d0d0]">{letter}</div>
    const isAdmin = u.role === 'admin'
    const isMod = u.role === 'moderator'
    return <div className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[8px] font-bold text-white ${isAdmin ? 'bg-[#c23531]' : isMod ? 'bg-[#8b6914]' : 'bg-[#b0a898]'}`}>{letter}</div>
  }

  const renderUser = (u) => (
    <div key={u.is_guest ? `g-${u.guest_label}` : u.user_id}
      className="flex items-center gap-1.5 py-1 px-1.5 rounded group hover:bg-[#faf8f4]"
    >
      {getAvatar(u)}
      <div className="flex-1 min-w-0 flex items-center gap-1">
        <span className={`text-[11px] truncate ${u.is_guest ? 'text-[#999]' : u.role === 'admin' ? 'text-[#c23531] font-semibold' : u.role === 'moderator' ? 'text-[#8b6914]' : 'text-[#555]'}`}>
          {u.display_name}
        </span>
        {!u.is_guest && u.role === 'admin' && <Crown size={8} className="text-[#c23531] shrink-0" />}
      </div>
      {getFriendAction(u)}
    </div>
  )

  const registeredUsers = users.filter(u => !u.is_guest)
  const guestUsers = users.filter(u => u.is_guest)

  // 主面板：固定显示，不滚动，超出显示更多按钮
  const MAX_VISIBLE = Math.max(6, Math.min(12, registeredUsers.length > 0 ? registeredUsers.length + 2 + guestUsers.length : guestUsers.length + 2))
  const haveOverflow = (registeredUsers.length + guestUsers.length) > MAX_VISIBLE
  const visibleUsers = haveOverflow
    ? [...registeredUsers, ...guestUsers].slice(0, MAX_VISIBLE - 1)
    : [...registeredUsers, ...guestUsers]

  // 展开后的全列表
  const FullList = ({ onClose }) => (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm max-h-[80vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#eee8dc] bg-[#faf8f4]">
          <h3 className="text-sm font-bold text-[#1a1a1a]">全部在线用户 <span className="text-[#b0a898] font-normal">({users.length})</span></h3>
          <button onClick={onClose} className="text-[#999] hover:text-[#c23531]"><XIcon size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-2">
          {registeredUsers.length > 0 && (
            <>
              <p className="text-[9px] text-[#b0a898] uppercase tracking-wider px-1 py-1.5 font-semibold">会员</p>
              {registeredUsers.map(renderUser)}
            </>
          )}
          {guestUsers.length > 0 && (
            <>
              <p className="text-[9px] text-[#b0a898] uppercase tracking-wider px-1 py-1.5 font-semibold mt-1">访客 ({guestUsers.length})</p>
              {guestUsers.map(renderUser)}
            </>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* 侧边面板 — 占1/4宽度，不自滚动，超过显示更多 */}
      <div className="flex flex-col bg-white h-full">
        <div className="px-2.5 py-2 border-b border-[#eee8dc] bg-[#faf8f4] shrink-0">
          <div className="flex items-center gap-1.5">
            <Users size={12} className="text-[#b0a898]" />
            <h3 className="text-[11px] font-bold text-[#1a1a1a]">在线</h3>
            {!loading && <span className="text-[10px] text-[#b0a898]">({users.length})</span>}
            {!loading && users.length > 0 && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
          </div>
        </div>

        <div className="flex-1 px-1.5 py-1 flex flex-col justify-between">
          {loading ? (
            <div className="flex justify-center py-4"><Loader2 size={12} className="animate-spin text-[#ccc]" /></div>
          ) : users.length === 0 ? (
            <div className="text-center py-4"><p className="text-[10px] text-[#ccc]">暂无</p></div>
          ) : (
            <div className="space-y-0">
              {visibleUsers.map(u => (
                u.is_guest
                  ? <div key={`g-${u.guest_label}`} className="flex items-center gap-1.5 py-1 px-1.5 rounded"><span className="w-5 h-5 rounded-full bg-[#d0d0d0] flex items-center justify-center text-[8px] text-white font-bold">{(u.display_name || '?')[0]}</span><span className="text-[11px] text-[#999] truncate">{u.display_name}</span></div>
                  : renderUser(u)
              ))}
            </div>
          )}

          {haveOverflow && !loading && (
            <button
              onClick={() => setShowAll(true)}
              className="mt-auto w-full text-center text-[10px] text-[#c23531] hover:text-[#a02a24] font-medium py-1.5 border-t border-[#eee8dc] mt-1 hover:bg-[#faf8f4] transition-colors rounded-b-lg"
            >
              查看全部 {users.length} 人 ›
            </button>
          )}
        </div>
      </div>

      {/* 全部展开模态 */}
      {showAll && <FullList onClose={() => setShowAll(false)} />}
    </>
  )
}
