'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { UserPlus, UserCheck, Loader2, Clock, Crown, X as XIcon, Users, Monitor, Smartphone } from 'lucide-react'

const POLL_INTERVAL = 15000

/** 为设备名配个图标 */
function DeviceIcon({ label }) {
  const isMobile = /iPhone|iPad|Android|手机/i.test(label)
  if (isMobile) return <Smartphone size={8} className="inline -mt-0.5" />
  return <Monitor size={8} className="inline -mt-0.5" />
}

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

      const otherUsers = (data.users || []).filter(u => !u.is_guest && u.user_id !== currentUserId)
      if (otherUsers.length > 0) {
        for (const u of otherUsers) {
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

  // 按 user_id 分组注册用户，收集每人的所有设备
  const groupedUsers = useMemo(() => {
    const registeredMap = {}
    for (const u of users) {
      if (u.is_guest) continue
      if (!registeredMap[u.user_id]) {
        registeredMap[u.user_id] = {
          ...u,
          devices: [],
        }
      }
      if (u.device_label && !registeredMap[u.user_id].devices.includes(u.device_label)) {
        registeredMap[u.user_id].devices.push(u.device_label)
      }
    }
    return Object.values(registeredMap)
  }, [users])

  const guestUsers = useMemo(() => users.filter(u => u.is_guest), [users])

  // 在线人数 = 唯一注册用户 + 访客
  const uniqueUserCount = groupedUsers.length + guestUsers.length

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
        className="text-[10px] text-[#c23531] hover:text-[#a02a24] font-medium opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
      >
        {actionPending[userItem.user_id] ? <Loader2 size={10} className="animate-spin inline" /> : '＋好友'}
      </button>
    )
  }

  const getAvatar = (userItem) => {
    const letter = userItem.display_name?.[0] || '?'
    const isAdmin = userItem.role === 'admin'
    const isMod = userItem.role === 'moderator'
    return <div className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[8px] font-bold text-white ${isAdmin ? 'bg-[#c23531]' : isMod ? 'bg-[#8b6914]' : 'bg-[#b0a898]'}`}>{letter}</div>
  }

  /** 渲染一个设备标签芯片 */
  const DeviceChip = ({ label }) => (
    <span className="inline-flex items-center gap-0.5 px-1.5 py-[1px] rounded-full bg-[#f0ede8] text-[#8a8070] text-[8px] leading-tight font-medium">
      <DeviceIcon label={label} />
      {label}
    </span>
  )

  /** 渲染一个分组后的注册用户行 */
  const renderGroupedUser = (u) => (
    <div key={u.user_id}
      className="flex items-center gap-1.5 py-1 px-1.5 rounded group hover:bg-[#faf8f4]"
    >
      {getAvatar(u)}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 flex-wrap">
          <span className={`text-[11px] max-w-[60px] truncate ${u.role === 'admin' ? 'text-[#c23531] font-semibold' : u.role === 'moderator' ? 'text-[#8b6914]' : 'text-[#555]'}`}>
            {u.display_name}
          </span>
          {u.role === 'admin' && <Crown size={8} className="text-[#c23531] shrink-0" />}
          {/* 设备标签并排显示 */}
          {u.devices.length > 0 && (
            <span className="flex items-center gap-1 ml-0.5">
              {u.devices.map((d, i) => (
                <DeviceChip key={i} label={d} />
              ))}
            </span>
          )}
        </div>
      </div>
      {getFriendAction(u)}
    </div>
  )

  // 侧边面板可见用户数
  const MAX_VISIBLE = Math.max(6, Math.min(12, uniqueUserCount))
  const haveOverflow = uniqueUserCount > MAX_VISIBLE

  // 侧边面板显示的排序：注册用户（按最近心跳）> 访客
  const sidebarRegistered = haveOverflow ? groupedUsers.slice(0, MAX_VISIBLE - Math.min(guestUsers.length, 2)) : groupedUsers
  const sidebarGuests = haveOverflow
    ? guestUsers.slice(0, MAX_VISIBLE - sidebarRegistered.length - 1)
    : guestUsers

  /** 全部展开模态 — 使用分组数据 */
  const FullList = ({ onClose }) => (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm max-h-[80vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#eee8dc] bg-[#faf8f4]">
          <h3 className="text-sm font-bold text-[#1a1a1a]">全部在线用户 <span className="text-[#b0a898] font-normal">({uniqueUserCount})</span></h3>
          <button onClick={onClose} className="text-[#999] hover:text-[#c23531]"><XIcon size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-2">
          {groupedUsers.length > 0 && (
            <>
              <p className="text-[9px] text-[#b0a898] uppercase tracking-wider px-1 py-1.5 font-semibold">会员</p>
              {groupedUsers.map(renderGroupedUser)}
            </>
          )}
          {guestUsers.length > 0 && (
            <>
              <p className="text-[9px] text-[#b0a898] uppercase tracking-wider px-1 py-1.5 font-semibold mt-1">访客 ({guestUsers.length})</p>
              {guestUsers.map(g => (
                <div key={`g-${g.guest_label}`} className="flex items-center gap-1.5 py-1 px-1.5 rounded">
                  <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[8px] font-bold text-white bg-[#d0d0d0]">{(g.display_name || '?')[0]}</div>
                  <span className="text-[11px] text-[#999] truncate">{g.display_name}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* 侧边面板 */}
      <div className="flex flex-col bg-white h-full">
        <div className="px-2.5 py-2 border-b border-[#eee8dc] bg-[#faf8f4] shrink-0">
          <div className="flex items-center gap-1.5">
            <Users size={12} className="text-[#b0a898]" />
            <h3 className="text-[11px] font-bold text-[#1a1a1a]">在线</h3>
            {!loading && <span className="text-[10px] text-[#b0a898]">({uniqueUserCount})</span>}
            {!loading && uniqueUserCount > 0 && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
          </div>
        </div>

        <div className="flex-1 px-1.5 py-1 flex flex-col justify-between">
          {loading ? (
            <div className="flex justify-center py-4"><Loader2 size={12} className="animate-spin text-[#ccc]" /></div>
          ) : uniqueUserCount === 0 ? (
            <div className="text-center py-4"><p className="text-[10px] text-[#ccc]">暂无</p></div>
          ) : (
            <div className="space-y-0">
              {sidebarRegistered.map(renderGroupedUser)}
              {sidebarGuests.map(g => (
                <div key={`g-${g.guest_label}`} className="flex items-center gap-1.5 py-1 px-1.5 rounded">
                  <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[8px] font-bold text-white bg-[#d0d0d0]">{(g.display_name || '?')[0]}</div>
                  <span className="text-[11px] text-[#999] truncate">{g.display_name}</span>
                </div>
              ))}
            </div>
          )}

          {haveOverflow && !loading && (
            <button
              onClick={() => setShowAll(true)}
              className="mt-auto w-full text-center text-[10px] text-[#c23531] hover:text-[#a02a24] font-medium py-1.5 border-t border-[#eee8dc] mt-1 hover:bg-[#faf8f4] transition-colors rounded-b-lg"
            >
              查看全部 {uniqueUserCount} 人 ›
            </button>
          )}
        </div>
      </div>

      {showAll && <FullList onClose={() => setShowAll(false)} />}
    </>
  )
}
