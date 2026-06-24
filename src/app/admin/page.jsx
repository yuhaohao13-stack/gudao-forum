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

  useEffect(() => { if (!loading && (!user || profile?.role !== 'admin')) router.push('/') }, [user, profile, loading])
  useEffect(() => {
    if (profile?.role !== 'admin') return
    supabase.from('threads').select('*, profiles(username, display_name), categories(name)').order('created_at', { ascending: false }).limit(50).then(({ data }) => setThreads(data || []))
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).then(({ data }) => setUsers(data || []))
  }, [profile])

  const del = async (id) => { if (!confirm('确定删除？')) return; await supabase.from('threads').delete().eq('id', id); setThreads(threads.filter(t => t.id !== id)) }
  const toggle = (thread, field) => async () => { await supabase.from('threads').update({ [field]: !thread[field] }).eq('id', thread.id); setThreads(threads.map(t => t.id === thread.id ? { ...t, [field]: !t[field] } : t)) }
  const roleChg = async (uid, role) => { await supabase.from('profiles').update({ role }).eq('id', uid); setUsers(users.map(u => u.id === uid ? { ...u, role } : u)) }

  if (loading || profile?.role !== 'admin') return <div className="flex items-center justify-center py-20"><div className="w-5 h-5 border-2 border-[#c23531]/30 border-t-[#c23531] rounded-full animate-spin" /></div>

  return (
    <div className="fade-in">
      <h1 className="text-2xl font-bold text-[#2c2c2c] mb-1">⚙️ 管理后台</h1>
      <p className="text-xs text-[#8c8c8c] mb-6">古道论坛管理中心</p>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab('threads')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === 'threads' ? 'bg-[#c23531] text-white shadow-sm' : 'bg-white/60 text-[#666] hover:text-[#c23531] border border-[#e0d8c8]'}`}>帖子管理</button>
        <button onClick={() => setTab('users')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === 'users' ? 'bg-[#c23531] text-white shadow-sm' : 'bg-white/60 text-[#666] hover:text-[#c23531] border border-[#e0d8c8]'}`}>用户管理</button>
      </div>

      {tab === 'threads' && (
        <div className="space-y-2">
          {threads.map(t => (
            <div key={t.id} className="paper-card p-4 fade-in-scale flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm text-[#2c2c2c] truncate">{t.title}</h3>
                <div className="text-xs text-[#8c8c8c] mt-0.5">{t.profiles?.display_name || t.profiles?.username} · {t.categories?.name}</div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={toggle(t, 'is_pinned')} className={`text-xs px-2 py-1 rounded hover:bg-[#c23531]/10 transition-colors ${t.is_pinned ? 'text-[#8b6914]' : 'text-[#8c8c8c]'}`}>📌</button>
                <button onClick={toggle(t, 'is_locked')} className={`text-xs px-2 py-1 rounded hover:bg-[#c23531]/10 transition-colors ${t.is_locked ? 'text-[#c23531]' : 'text-[#8c8c8c]'}`}>🔒</button>
                <button onClick={() => del(t.id)} className="text-xs px-2 py-1 rounded hover:bg-[#c23531]/10 text-[#8c8c8c] hover:text-[#c23531] transition-colors">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'users' && (
        <div className="paper-card overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="text-[#8c8c8c] border-b border-[#e0d8c8] text-xs"><th className="text-left py-3 px-3 font-medium">用户</th><th className="text-left py-3 px-3 font-medium">角色</th><th className="text-left py-3 px-3 font-medium">操作</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-[#e0d8c8]/50 hover:bg-[#c23531]/5 transition-colors">
                  <td className="py-2.5 px-3"><div className="font-medium text-[#333]">{u.display_name || u.username}</div><div className="text-[10px] text-[#8c8c8c]">@{u.username}</div></td>
                  <td className="py-2.5 px-3"><span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${u.role === 'admin' ? 'bg-[#c23531]/10 text-[#c23531] border border-[#c23531]/20' : u.role === 'moderator' ? 'bg-[#8b6914]/10 text-[#8b6914] border border-[#8b6914]/20' : 'text-[#8c8c8c]'}`}>{u.role === 'admin' ? '管理员' : u.role === 'moderator' ? '版主' : '用户'}</span></td>
                  <td className="py-2.5 px-3">
                    <select value={u.role} onChange={e => roleChg(u.id, e.target.value)} className="bg-white border border-[#ddd6c8] rounded px-2 py-1 text-xs text-[#333]">
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
