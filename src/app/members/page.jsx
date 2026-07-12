'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Users, Trash2, Crown, Shield, User as UserIcon, Search, X, ChevronLeft, ChevronRight, Eye, UserPlus, Download, UserCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'
import Breadcrumb from '@/components/Breadcrumb'

export default function MembersPage() {
  const { user, profile, loading: authLoading } = useAuth()
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [deleting, setDeleting] = useState(null)
  const [friendStatus, setFriendStatus] = useState({})
  const [addingFriend, setAddingFriend] = useState({})
  const supabase = createClient()
  const router = useRouter()
  const PER_PAGE = 20

  useEffect(() => {
    if (!authLoading && (!user || profile?.role !== 'admin')) {
      router.push('/')
    }
  }, [user, profile, authLoading, router])

  useEffect(() => {
    if (profile?.role !== 'admin') return
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).then(async ({ data }) => {
      setUsers(data || [])
      setFilteredUsers(data || [])
      // 加载管理员的好友关系
      const { data: myFriends } = await supabase
        .from('friends')
        .select('requester_id, addressee_id')
        .or(
          user.id ? `and(requester_id.eq.${user.id},status.eq.accepted),and(addressee_id.eq.${user.id},status.eq.accepted)` : 'false'
        )
      const friendSet = {}
      if (myFriends) {
        myFriends.forEach(f => {
          if (f.requester_id === user.id) friendSet[f.addressee_id] = true
          if (f.addressee_id === user.id) friendSet[f.requester_id] = true
        })
      }
      setFriendStatus(friendSet)
    })
  }, [profile, user])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users)
    } else {
      const q = searchQuery.toLowerCase()
      setFilteredUsers(users.filter(u =>
        (u.display_name || '').toLowerCase().includes(q) ||
        (u.username || '').toLowerCase().includes(q)
      ))
    }
    setPage(1)
  }, [searchQuery, users])

  const totalPages = Math.ceil(filteredUsers.length / PER_PAGE)
  const paginatedUsers = filteredUsers.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const deleteUser = async (userId, username) => {
    if (!confirm(`确定删除用户 ${username}？\n\n将同时删除该用户的所有帖子、回复、好友关系、聊天记录和个人资料。`)) return
    if (!confirm('⚠️ 此操作不可撤销，确定？')) return
    setDeleting(userId)
    try {
      await supabase.from('threads').delete().eq('author_id', userId)
      await supabase.from('replies').delete().eq('author_id', userId)
      await supabase.from('friends').delete().or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
      await supabase.from('private_messages').delete().or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      await supabase.from('chat_messages').delete().eq('user_id', userId)
      await supabase.from('profiles').delete().eq('id', userId)
      const { data: remaining } = await supabase
        .from('profiles').select('*').order('created_at', { ascending: false })
      setUsers(remaining || [])
    } catch (e) {
      alert('删除失败: ' + e.message)
    }
    setDeleting(null)
  }

  const addFriend = async (userId) => {
    setAddingFriend(prev => ({ ...prev, [userId]: true }))
    try {
      const res = await fetch('/api/friend/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to_user_id: userId }),
      })
      const data = await res.json()
      if (data.success) {
        setFriendStatus(prev => ({ ...prev, [userId]: true }))
      } else {
        alert(data.error || '添加失败')
      }
    } catch (e) {
      alert('网络错误: ' + e.message)
    }
    setAddingFriend(prev => ({ ...prev, [userId]: false }))
  }

  const exportCSV = () => {
    const header = 'ID,用户名,昵称,角色,性别,手机号,出生年月,出生地,兴趣爱好,个人简介,注册时间'
    const rows = users.map(u =>
      `"${u.id}","${u.username || ''}","${(u.display_name || '').replace(/"/g, '""')}","${u.role || 'user'}","${u.gender || ''}","${u.phone || ''}","${u.date_of_birth || ''}","${(u.birth_place || '').replace(/"/g, '""')}","${(u.hobbies || '').replace(/"/g, '""')}","${(u.bio || '').replace(/"/g, '""')}","${new Date(u.created_at).toLocaleDateString('zh-CN')}"`
    )
    const csv = header + '\n' + rows.join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '会员列表.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (authLoading || profile?.role !== 'admin') {
    return <div className="flex justify-center py-20">
      <div className="w-5 h-5 border-2 border-[#c23531]/30 border-t-[#c23531] rounded-full animate-spin" />
    </div>
  }

  return (
    <div className="anim-fade-in">
      <Breadcrumb crumbs={[{ label: '首页', href: '/' }, { label: '会员管理' }]} className="mb-4" />

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a1a] flex items-center gap-2">
            <Users size={22} className="text-[#c23531]" />
            会员管理
          </h1>
          <p className="text-xs text-[#aaa] mt-1">共 {users.length} 位注册会员</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV}
            className="text-xs px-4 py-2 rounded-lg bg-[#b45309] text-white hover:bg-[#92400e] transition-colors flex items-center gap-1.5 font-medium shadow-sm">
            <Download size={14} />
            导出CSV
          </button>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bbb]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜索用户名..."
              className="pl-8 pr-8 py-2 border border-[#ece8e0] rounded-xl text-sm bg-white text-[#1a1a1a] placeholder:text-[#ccc] outline-none focus:border-[#c23531] transition-colors w-48"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#bbb] hover:text-[#666]">
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 会员卡片列表 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {paginatedUsers.map(u => (
          <div key={u.id}
            className="bg-white border border-[#ece8e0] rounded-xl p-4 transition-all hover:border-[#c23531]/30 hover:shadow-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#c23531] flex items-center justify-center text-base text-white font-bold shrink-0">
                {(u.display_name || u.username || '?')[0]}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <Link href={`/profile/${u.id}`} className="font-semibold text-sm text-[#1a1a1a] truncate hover:text-[#c23531] transition-colors">
                    {u.display_name || u.username}
                  </Link>
                  <span className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    u.role === 'admin' ? 'bg-[#c23531]/10 text-[#c23531]' :
                    u.role === 'moderator' ? 'bg-[#8b6914]/10 text-[#8b6914]' :
                    'bg-[#f5f5f5] text-[#999]'
                  }`}>
                    {u.role === 'admin' ? <><Crown size={10} className="inline-block align-text-bottom" /> 管理员</> :
                     u.role === 'moderator' ? <><Shield size={10} className="inline-block align-text-bottom" /> 版主</> :
                     <><UserIcon size={10} className="inline-block align-text-bottom" /> 用户</>}
                  </span>
                </div>
                <div className="text-[11px] text-[#aaa] mt-0.5">
                  @{u.username}
                  <span className="mx-1">·</span>
                  {new Date(u.created_at).toLocaleDateString('zh-CN')}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link href={`/profile/${u.id}`}
                className="text-xs px-4 py-2 rounded-lg bg-[#f5f5f5] text-[#666] hover:bg-[#eee] hover:text-[#1a1a1a] transition-colors"
                title="查看详情">
                <Eye size={14} />
              </Link>
              {u.id !== user.id && !friendStatus[u.id] && (
                <button onClick={() => addFriend(u.id)}
                  disabled={addingFriend[u.id]}
                  className={`text-xs px-4 py-2 rounded-lg transition-colors ${
                    addingFriend[u.id]
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-[#e8f5e9] text-[#2e7d32] hover:bg-[#c8e6c9]'
                  }`}
                  title="添加好友">
                  <UserPlus size={14} />
                </button>
              )}
              {friendStatus[u.id] && (
                <span className="text-xs px-4 py-2 rounded-lg bg-green-50 text-green-700 border border-green-200" title="已是好友">
                  <UserCheck size={14} />
                </span>
              )}
              {u.role !== 'admin' && (
                <button onClick={() => deleteUser(u.id, u.display_name || u.username)}
                  disabled={deleting === u.id}
                  className="text-xs px-4 py-2 rounded-lg bg-[#fef2f0] text-[#c23531] hover:bg-[#fde0db] transition-colors disabled:opacity-50"
                  title="删除用户">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 空状态 */}
      {paginatedUsers.length === 0 && (
        <div className="card p-12 text-center">
          <div className="mb-3"><Users size={36} className="inline-block text-[#ccc]" /></div>
          <p className="text-[#999] text-sm">暂无匹配的会员</p>
        </div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg border border-[#ece8e0] text-xs text-[#666] hover:text-[#1a1a1a] hover:border-[#c23531] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={14} className="inline-block" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                p === page
                  ? 'bg-[#c23531] text-white'
                  : 'border border-[#ece8e0] text-[#666] hover:border-[#c23531] hover:text-[#1a1a1a]'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-lg border border-[#ece8e0] text-xs text-[#666] hover:text-[#1a1a1a] hover:border-[#c23531] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={14} className="inline-block" />
          </button>
        </div>
      )}
    </div>
  )
}
