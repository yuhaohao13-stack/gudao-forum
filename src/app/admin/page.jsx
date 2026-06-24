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
    if (!loading && (!user || profile?.role !== 'admin')) {
      router.push('/')
    }
  }, [user, profile, loading])

  useEffect(() => {
    const fetchData = async () => {
      const { data: t } = await supabase
        .from('threads')
        .select('*, profiles(username, display_name), categories(name)')
        .order('created_at', { ascending: false })
        .limit(50)
      setThreads(t || [])

      const { data: u } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
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
    return <div className="text-center text-slate-500 py-12">加载中...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">⚙️ 管理后台</h1>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('threads')}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${tab === 'threads' ? 'bg-blue-600' : 'bg-slate-800 hover:bg-slate-700'}`}
        >
          帖子管理
        </button>
        <button
          onClick={() => setTab('users')}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${tab === 'users' ? 'bg-blue-600' : 'bg-slate-800 hover:bg-slate-700'}`}
        >
          用户管理
        </button>
      </div>

      {tab === 'threads' && (
        <div className="space-y-2">
          {threads.map((thread) => (
            <div key={thread.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {thread.is_pinned && <span className="text-xs text-yellow-400">📌</span>}
                    {thread.is_locked && <span className="text-xs text-red-400">🔒</span>}
                    <h3 className="font-semibold truncate text-sm">{thread.title}</h3>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {thread.profiles?.display_name || thread.profiles?.username} · {thread.categories?.name}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => togglePin(thread)} className="text-xs px-2 py-1 bg-slate-800 rounded hover:bg-slate-700">
                    📌
                  </button>
                  <button onClick={() => toggleLock(thread)} className="text-xs px-2 py-1 bg-slate-800 rounded hover:bg-slate-700">
                    🔒
                  </button>
                  <button onClick={() => deleteThread(thread.id)} className="text-xs px-2 py-1 bg-red-900/50 rounded hover:bg-red-800/50 text-red-400">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'users' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="text-left py-2 px-2">用户</th>
                <th className="text-left py-2 px-2">角色</th>
                <th className="text-left py-2 px-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-slate-800/50">
                  <td className="py-2 px-2">
                    <div className="font-semibold">{u.display_name || u.username}</div>
                    <div className="text-xs text-slate-500">@{u.username}</div>
                  </td>
                  <td className="py-2 px-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${u.role === 'admin' ? 'bg-yellow-600/30 text-yellow-400' : u.role === 'moderator' ? 'bg-green-600/30 text-green-400' : 'text-slate-400'}`}>
                      {u.role === 'admin' ? '管理员' : u.role === 'moderator' ? '版主' : '用户'}
                    </span>
                  </td>
                  <td className="py-2 px-2">
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs"
                    >
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
