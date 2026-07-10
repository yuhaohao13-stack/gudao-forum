'use client'

import { useEffect, useState, useCallback } from 'react'
import { UserPlus, UserCheck, Loader2, Clock, Crown } from 'lucide-react'

const POLL_INTERVAL = 15000  // 每15秒刷新一次在线列表

export default function OnlineUsersPanel({ roomSlug, currentUserId }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [friendStatuses, setFriendStatuses] = useState({})  // { user_id: 'friends' | 'pending' | 'none' }
  const [actionPending, setActionPending] = useState({})     // { user_id: true }
  const [message, setMessage] = useState('')

  // 获取在线用户列表
  const fetchOnlineUsers = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat/online-users?room_slug=${roomSlug}`)
      if (!res.ok) return
      const data = await res.json()
      setUsers(data.users || [])

      // 检查注册用户的好友状态
      const registeredUsers = (data.users || []).filter(u => !u.is_guest && u.user_id !== currentUserId)
      if (registeredUsers.length > 0) {
        for (const u of registeredUsers) {
          fetchFriendStatus(u.user_id)
        }
      }
    } catch (e) {
      // 静默失败
    } finally {
      setLoading(false)
    }
  }, [roomSlug, currentUserId])

  // 检查好友状态
  const fetchFriendStatus = async (targetUserId) => {
    try {
      const res = await fetch(`/api/friend/check?user_id=${targetUserId}`)
      if (!res.ok) return
      const data = await res.json()
      setFriendStatuses(prev => ({ ...prev, [targetUserId]: data.status }))
    } catch (e) {
      // 静默
    }
  }

  // 添加好友
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

  // 初始加载 + 轮询
  useEffect(() => {
    fetchOnlineUsers()
    const interval = setInterval(fetchOnlineUsers, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchOnlineUsers])

  // 获取用户的状态信息
  const getFriendAction = (userItem) => {
    if (userItem.is_guest || !userItem.user_id || userItem.user_id === currentUserId) {
      return null
    }

    const status = friendStatuses[userItem.user_id]

    if (status === 'friends') {
      return (
        <span className="inline-flex items-center gap-0.5 text-[10px] text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded-full">
          <UserCheck size={10} /> 好友
        </span>
      )
    }

    if (status === 'pending_sent') {
      return (
        <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-600 font-medium bg-amber-50 px-1.5 py-0.5 rounded-full">
          <Clock size={10} /> 待同意
        </span>
      )
    }

    if (status === 'pending_received') {
      return (
        <span className="inline-flex items-center gap-0.5 text-[10px] text-blue-600 font-medium bg-blue-50 px-1.5 py-0.5 rounded-full">
          已申请
        </span>
      )
    }

    return (
      <button
        onClick={(e) => {
          e.stopPropagation()
          handleAddFriend(userItem.user_id)
        }}
        disabled={actionPending[userItem.user_id]}
        className="inline-flex items-center gap-0.5 text-[10px] text-[#c23531] hover:text-[#a02a24] font-medium px-1.5 py-0.5 rounded-full border border-[#c23531]/30 hover:border-[#c23531]/60 transition-colors disabled:opacity-50"
      >
        {actionPending[userItem.user_id] ? (
          <Loader2 size={10} className="animate-spin" />
        ) : (
          <UserPlus size={10} />
        )}
        加好友
      </button>
    )
  }

  // 获取头像/首字母
  const getAvatar = (userItem) => {
    const letter = userItem.display_name?.[0] || '?'
    if (userItem.is_guest) {
      return (
        <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold text-white bg-[#8b8b8b]/60">
          {letter}
        </div>
      )
    }
    const isAdmin = userItem.role === 'admin'
    const isMod = userItem.role === 'moderator'
    return (
      <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold text-white ${
        isAdmin ? 'bg-[#c23531]' : isMod ? 'bg-[#8b6914]' : 'bg-[#b0a898]'
      }`}>
        {letter}
      </div>
    )
  }

  const registeredUsers = users.filter(u => !u.is_guest)
  const guestUsers = users.filter(u => u.is_guest)

  return (
    <div className="w-48 shrink-0 flex flex-col rounded-xl border border-[#eee8dc] bg-white overflow-hidden">
      {/* 标题 */}
      <div className="px-3 py-2.5 border-b border-[#eee8dc] bg-[#faf8f4]">
        <h3 className="text-xs font-bold text-[#1a1a1a]">在线用户</h3>
        <p className="text-[10px] text-[#b0a898] mt-0.5">共 {users.length} 人在线</p>
      </div>

      {/* 用户列表 */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 size={14} className="animate-spin text-[#ccc]" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-[10px] text-[#ccc]">暂无在线用户</p>
          </div>
        ) : (
          <div className="px-2 py-1.5 space-y-0.5">
            {/* 注册用户 */}
            {registeredUsers.length > 0 && (
              <>
                <p className="text-[9px] text-[#b0a898] uppercase tracking-wider px-1 py-1 font-semibold">会员</p>
                {registeredUsers.map((u) => (
                  <div
                    key={u.user_id}
                    className={`flex items-center gap-2 px-1.5 py-1.5 rounded-lg transition-colors ${
                      u.user_id === currentUserId ? 'bg-[#c23531]/5' : 'hover:bg-[#faf8f4]'
                    }`}
                  >
                    {getAvatar(u)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className={`text-xs font-medium truncate ${
                          u.role === 'admin' ? 'text-[#c23531]' : u.role === 'moderator' ? 'text-[#8b6914]' : 'text-[#555]'
                        }`}>
                          {u.display_name}
                        </span>
                        {u.role === 'admin' && <Crown size={9} className="text-[#c23531] shrink-0 opacity-60" />}
                      </div>
                      <div className="mt-0.5">
                        {getFriendAction(u)}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* 访客 */}
            {guestUsers.length > 0 && (
              <>
                <p className="text-[9px] text-[#b0a898] uppercase tracking-wider px-1 py-1 font-semibold">访客 {guestUsers.length > 0 && `(${guestUsers.length})`}</p>
                {guestUsers.map((u, idx) => (
                  <div key={`guest-${u.guest_label}-${idx}`} className="flex items-center gap-2 px-1.5 py-1 rounded-lg">
                    {getAvatar(u)}
                    <span className="text-xs text-[#888] truncate">{u.display_name}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* 消息提示 */}
      {message && (
        <div className="px-2 py-1.5 border-t border-[#eee8dc] bg-[#faf8f4]">
          <p className="text-[10px] text-[#c23531] text-center">{message}</p>
        </div>
      )}
    </div>
  )
}
