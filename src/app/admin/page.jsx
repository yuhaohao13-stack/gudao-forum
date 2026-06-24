'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const { user, profile, loading } = useAuth()
  const [threads, setThreads] = useState([])
  const [users, setUsers] = useState([])
  const [tab, setTab] = useState('threads')
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'admin')) router.push('/')
  }, [user, profile, loading])

  useEffect(() => {
    const fetchData = async () => {
      const { data: t } = await supabase
        .from('threads').select('*, profiles(username, display_name), categories(name)')
        .order('created_at', { ascending: false }).limit(50)
      setThreads(t || [])
      const { data: u } = await supabase
        .from('profiles').select('*').order('created_at', { ascending: false })
      setUsers(u || [])
    }
    if (profile?.role === 'admin') fetchData()
  }, [profile])

  const deleteThread = async (id) => {
    if (!confirm('确定删除这个帖子？')) return
    await supabase.from('threads').delete().eq('id', id)
    setThreads(threads.filter(t => t.id !== id))
  }
  const toggleLock = async (thread) => {
    await supabase.from('threads').update({ is_locked: !thread.is_locked }).eq('id', thread.id)
    setThreads(threads.map(t => t.id === thread.id ? { ...t, is_locked: !t.is_locked } : t))
  }
  const togglePin = async (thread) => {
    await supabase.from('threads').update({ is_pinned: !thread.is_pinned }).eq('id', thread.id)
    setThreads(threads.map(t => t.id === thread.id ? { ...t, is_pinned: !t.is_pinned } : t))
  }
  const changeRole = async (userId, role) => {
    await supabase.from('profiles').update({ role }).eq('id', userId)
    setUsers(users.map(u => u.id === userId ? { ...u, role } : u))
  }

  if (loading || profile?.role !== 'admin') {
    return <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
    </div>
  }

  return (
    <div className="fade-in">
      <h1 className="text-2xl font-bold text-gradient mb-1">⚙️ 管理后台</h1>
      <p className="text-xs text-slate-500 mb-6">古道论坛管理中心</p>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab('threads')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            tab === 'threads' ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg' : 'glass-card text-slate-400 hover:text-slate-200'}`}>
          帖子管理
        </button>
        <button onClick={() => setTab('users')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            tab === 'users' ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg' : 'glass-card text-slate-400 hover:text-slate-200'}`}>
          用户管理
        </button>
      </div>

      {tab === 'threads' && (
        <div className="space-y-2">
          {threads.map((thread) => (
            <div key={thread.id} className="glass-card p-4 fade-in-scale">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-sm truncate">{thread.title}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {thread.profiles?.display_name || thread.profiles?.username} · {thread.categories?.name}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => togglePin(thread)}
                    className={`text-xs px-2 py-1 rounded hover:bg-slate-800 transition-colors ${thread.is_pinned ? 'text-yellow-400' : 'text-slate-500'}`}>
                    📌
                  </button>
                  <button onClick={() => toggleLock(thread)}
                    className={`text-xs px-2 py-1 rounded hover:bg-slate-800 transition-colors ${thread.is_locked ? 'text-red-400' : 'text-slate-500'}`}>
                    🔒
                  </button>
                  <button onClick={() => deleteThread(thread.id)}
                    className="text-xs px-2 py-1 rounded hover:bg-red-900/30 text-slate-500 hover:text-red-400 transition-colors">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'users' && (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800/50 text-xs">
                <th className="text-left py-3 px-3 font-medium">用户</th>
                <th className="text-left py-3 px-3 font-medium">角色</th>
                <th className="text-left py-3 px-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="font-medium text-slate-200">{u.display_name || u.username}</div>
                    <div className="text-[10px] text-slate-500">@{u.username}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      u.role === 'admin' ? 'bg-amber-600/20 text-amber-400 border border-amber-700/30'
                      : u.role === 'moderator' ? 'bg-green-600/20 text-green-400 border border-green-700/30'
                      : 'text-slate-500'}`}>
                      {u.role === 'admin' ? '管理员' : u.role === 'moderator' ? '版主' : '用户'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <select value={u.role} onChange={(e) => changeRole(u.id, e.target.value)}
                      className="bg-slate-800/50 border border-slate-700/50 rounded px-2 py-1 text-xs text-slate-200">
                      <option value="user">用户</option>
                      <option value="moderator">版主</option>
                      <option value="admin">管理员</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
