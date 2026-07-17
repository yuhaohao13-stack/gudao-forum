'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { UserPlus, UserCheck, Loader2, Clock, Crown, X as XIcon, Users, Monitor, Smartphone } from 'lucide-react'

const POLL_INTERVAL = 15000

/** 为设备名配个小图标 */
function DeviceIcon({ label }) {
  const isMobile = /iPhone|iPad|Android|手机/i.test(label)
  if (isMobile) return <Smartphone size={8} className="inline -mt-0.5" />
  return <Monitor size={8} className="inline -mt-0.5" />
}

export default function OnlineUsersPanel({ roomSlug, currentUserId, onUserDevices }) {
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
      const rawUsers = data.users || []
      setUsers(rawUsers)

      // 同步设备映射给父组件
      if (onUserDevices) {
        const deviceMap = {}
        for (const u of rawUsers) {
          if (u.is_guest || !u.user_id) continue
          if (!deviceMap[u.user_id]) deviceMap[u.user_id] = []
          if (u.device_label && !deviceMap[u.user_id].includes(u.device_label)) {
            deviceMap[u.user_id].push(u.device_label)
          }
        }
        onUserDevices(deviceMap)
      }

      const otherUsers = rawUsers.filter(u => !u.is_guest && u.user_id !== currentUserId)
      if (otherUsers.length > 0) {
        for (const u of otherUsers) {
          fetchFriendStatus(u.user_id)
        }
      }
    } catch (e) {
    } finally {
      setLoading(false)
    }
  }, [roomSlug, currentUserId, onUserDevices])

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

  // 将 API 返回的条目按 user_id 分组排序（同一用户的多设备上下挨着）
  const sortedUsers = useMemo(() => {
    const registered = users.filter(u => !u.is_guest)
    const guests = users.filter(u => u.is_guest)

    // 注册用户按 user_id 分组排序
    const grouped = {}
    for (const u of registered) {
      if (!grouped[u.user_id]) grouped[u.user_id] = []
      grouped[u.user_id].push(u)
    }
    const sortedRegistered = Object.values(grouped).flat()

    return [...sortedRegistered, ...guests]
  }, [users])

  // 原始条目数（用于计数）
  const rawCount = users.length

  // 判断连续两条是否同一用户（用于视觉分组）
  const isSameUser = (curr, prev) => {
    if (!prev || curr.is_guest || prev.is_guest) return false
    return curr.user_id === prev.user_id
  }

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

  const getAvatar = (u) => {
    const letter = u.display_name?.[0] || '?'
    if (u.is_guest) return <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[8px] font-bold text-white bg-[#d0d0d0]">{letter}</div>
    const isAdmin = u.role === 'admin'
    const isMod = u.role === 'moderator'
    return <div className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[8px] font-bold text-white ${isAdmin ? 'bg-[#c23531]' : isMod ? 'bg-[#8b6914]' : 'bg-[#b0a898]'}`}>{letter}</div>
  }

  /** 渲染单行 — 每个设备一行 */
  const renderUserRow = (u, idx) => {
    const sameAsPrev = isSameUser(u, sortedUsers[idx - 1])

    return (
      <div key={`${u.user_id || 'g'}-${u.device_label || u.guest_label}-${idx}`}
        className={`flex items-center gap-1.5 py-1 px-1.5 rounded group hover:bg-[#faf8f4] ${sameAsPrev ? 'mt-0 border-t-0' : 'mt-0'}`}
      >
        <div className="shrink-0">
          {getAvatar(u)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className={`text-[11px] truncate max-w-[60px] ${u.is_guest ? 'text-[#999]' : u.role === 'admin' ? 'text-[#c23531] font-semibold' : u.role === 'moderator' ? 'text-[#8b6914]' : 'text-[#555]'}`}>
              {u.display_name}
            </span>
            {!u.is_guest && u.role === 'admin' && <Crown size={8} className="text-[#c23531] shrink-0" />}
            {/* 会员等级标识 */}
            {!u.is_guest && u.membership_level === 'gold' && <span className="text-[11px] shrink-0" title="黄金会员">🏆</span>}
            {!u.is_guest && u.membership_level === 'diamond' && <span className="text-[11px] shrink-0" title="钻石会员">💎</span>}
            {/* 设备标签 — 和用户名同行 */}
            {!u.is_guest && u.device_label && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-[1px] rounded-full bg-[#f0ede8] text-[#8a8070] text-[8px] leading-tight font-medium ml-1 shrink-0">
                <DeviceIcon label={u.device_label} />
                {u.device_label}
              </span>
            )}
          </div>
        </div>
        {getFriendAction(u)}
      </div>
    )
  }

  // 计算可见条目（侧边面板空间有限）
  const MAX_VISIBLE = Math.max(6, Math.min(12, rawCount))
  const haveOverflow = rawCount > MAX_VISIBLE
  const visibleRows = haveOverflow ? sortedUsers.slice(0, MAX_VISIBLE - 1) : sortedUsers

  /** 全部展开模态 */
  const FullList = ({ onClose }) => (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm max-h-[80vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#eee8dc] bg-[#faf8f4]">
          <h3 className="text-sm font-bold text-[#1a1a1a]">全部在线 <span className="text-[#b0a898] font-normal">({rawCount})</span></h3>
          <button onClick={onClose} className="text-[#999] hover:text-[#c23531]"><XIcon size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-2">
          {sortedUsers.length > 0 && (
            <>
              {/* 有注册用户时显示会员头 */}
              {sortedUsers.some(u => !u.is_guest) && (
                <p className="text-[9px] text-[#b0a898] uppercase tracking-wider px-1 py-1.5 font-semibold">会员</p>
              )}
              {sortedUsers.map((u, i) => {
                if (u.is_guest) {
                  // 在渲染访客前加分区头（仅首次遇到访客）
                  const firstGuestIdx = sortedUsers.findIndex(x => x.is_guest)
                  const isFirstGuest = i === firstGuestIdx
                  const prevIsGuest = i > 0 && sortedUsers[i - 1]?.is_guest
                  return (
                    <React.Fragment key={`g-${u.guest_label}`}>
                      {isFirstGuest && !prevIsGuest && (
                        <p className="text-[9px] text-[#b0a898] uppercase tracking-wider px-1 py-1.5 font-semibold mt-1">访客 ({sortedUsers.filter(x => x.is_guest).length})</p>
                      )}
                      <div className="flex items-center gap-1.5 py-1 px-1.5 rounded">
                        <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[8px] font-bold text-white bg-[#d0d0d0]">{(u.display_name || '?')[0]}</div>
                        <span className="text-[11px] text-[#999] truncate">{u.display_name}</span>
                      </div>
                    </React.Fragment>
                  )
                }
                return renderUserRow(u, i)
              })}
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
            {!loading && <span className="text-[10px] text-[#b0a898]">({rawCount})</span>}
            {!loading && rawCount > 0 && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
          </div>
        </div>

        <div className="flex-1 px-1.5 py-1 flex flex-col justify-between">
          {loading ? (
            <div className="flex justify-center py-4"><Loader2 size={12} className="animate-spin text-[#ccc]" /></div>
          ) : rawCount === 0 ? (
            <div className="text-center py-4"><p className="text-[10px] text-[#ccc]">暂无</p></div>
          ) : (
            <div className="space-y-0">
              {visibleRows.map((u, i) => {
                if (u.is_guest) {
                  return (
                    <div key={`g-${u.guest_label}`} className="flex items-center gap-1.5 py-1 px-1.5 rounded">
                      <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[8px] font-bold text-white bg-[#d0d0d0]">{(u.display_name || '?')[0]}</div>
                      <span className="text-[11px] text-[#999] truncate">{u.display_name}</span>
                    </div>
                  )
                }
                return renderUserRow(u, i)
              })}
            </div>
          )}

          {haveOverflow && !loading && (
            <button
              onClick={() => setShowAll(true)}
              className="mt-auto w-full text-center text-[10px] text-[#c23531] hover:text-[#a02a24] font-medium py-1.5 border-t border-[#eee8dc] mt-1 hover:bg-[#faf8f4] transition-colors rounded-b-lg"
            >
              查看全部 {rawCount} ›
            </button>
          )}
        </div>
      </div>

      {showAll && <FullList onClose={() => setShowAll(false)} />}
    </>
  )
}
