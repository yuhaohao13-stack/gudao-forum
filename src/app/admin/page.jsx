'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const { user, profile, loading } = useAuth()
  const [threads, setThreads] = useState([]); const [users, setUsers] = useState([]); const [tab, setTab] = useState('threads')
  const supabase = createClient(); const router = useRouter()

  useEffect(() => { if (!loading && (!user || profile?.role !== 'admin')) router.push('/') }, [user, profile, loading])
  useEffect(() => {
    if (profile?.role !== 'admin') return
    supabase.from('threads').select('*, profiles(username, display_name), categories(name)').order('created_at', { ascending: false }).limit(50).then(({ data }) => setThreads(data || []))
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).then(({ data }) => setUsers(data || []))
  }, [profile])

  const del = async (id) => { if (!confirm('确定删除？')) return; await supabase.from('threads').delete().eq('id', id); setThreads(threads.filter(t => t.id !== id)) }
  const toggle = (t, f) => async () => { await supabase.from('threads').update({ [f]: !t[f] }).eq('id', t.id); setThreads(threads.map(x => x.id === t.id ? { ...x, [f]: !x[f] } : x)) }
  const roleChg = async (id, r) => { await supabase.from('profiles').update({ role: r }).eq('id', id); setUsers(users.map(u => u.id === id ? { ...u, role: r } : u)) }

  if (loading || profile?.role !== 'admin') return <div className="flex justify-center py-20"><div className="w-5 h-5 border-2 border-[#c23531]/30 border-t-[#c23531] rounded-full animate-spin" /></div>

  return (
    <div className="anim-fade-in">
      <h1 className="text-2xl font-bold font-serif text-[#1a1a1a] mb-1">⚙️ 管理后台</h1>
      <p className="text-xs text-[#999] mb-6">古道论坛管理中心</p>
      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab('threads')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${tab === 'threads' ? 'bg-[#c23531] text-white shadow-sm' : 'bg-white text-[#666] border border-[#eee8dc]'}`}>帖子管理</button>
        <button onClick={() => setTab('users')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${tab === 'users' ? 'bg-[#c23531] text-white shadow-sm' : 'bg-white text-[#666] border border-[#eee8dc]'}`}>用户管理</button>
      </div>
      {tab === 'threads' && <div className="space-y-2.5">{threads.map(t => (
        <div key={t.id} className="card p-4 flex items-start justify-between gap-3 anim-scale">
          <div className="min-w-0 flex-1"><h3 className="font-semibold text-sm truncate">{t.title}</h3><div className="text-xs text-[#999] mt-0.5">{t.profiles?.display_name || t.profiles?.username} · {t.categories?.name}</div></div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={toggle(t, 'is_pinned')} className={`text-xs px-2 py-1 rounded transition-colors hover:bg-[#c23531]/10 ${t.is_pinned ? 'text-[#8b6914]' : 'text-[#bbb]'}`}>📌</button>
            <button onClick={toggle(t, 'is_locked')} className={`text-xs px-2 py-1 rounded transition-colors hover:bg-[#c23531]/10 ${t.is_locked ? 'text-[#c23531]' : 'text-[#bbb]'}`}>🔒</button>
            <button onClick={() => del(t.id)} className="text-xs px-2 py-1 rounded text-[#bbb] hover:bg-[#c23531]/10 hover:text-[#c23531] transition-colors">🗑️</button>
          </div>
        </div>
      ))}</div>}
      {tab === 'users' && <div className="card overflow-hidden"><table className="w-full text-sm"><thead><tr className="text-[#999] border-b border-[#f0e8dc] text-xs"><th className="text-left py-3 px-4 font-medium">用户</th><th className="text-left py-3 px-4 font-medium">角色</th><th className="text-left py-3 px-4 font-medium">操作</th></tr></thead><tbody>{users.map(u => (
        <tr key={u.id} className="border-b border-[#f0e8dc]/50 hover:bg-[#c23531]/5 transition-colors">
          <td className="py-2.5 px-4"><div className="font-medium text-[#333]">{u.display_name || u.username}</div><div className="text-[10px] text-[#999]">@{u.username}</div></td>
          <td className="py-2.5 px-4"><span className={`text-[10px] px-2 py-0.5 rounded font-medium ${u.role === 'admin' ? 'bg-[#c23531]/10 text-[#c23531] border border-[#c23531]/20' : u.role === 'moderator' ? 'bg-[#8b6914]/10 text-[#8b6914] border border-[#8b6914]/20' : 'text-[#999]'}`}>{u.role === 'admin' ? '管理员' : u.role === 'moderator' ? '版主' : '用户'}</span></td>
          <td className="py-2.5 px-4"><select value={u.role} onChange={e => roleChg(u.id, e.target.value)} className="bg-white border border-[#eee8dc] rounded-lg px-2 py-1 text-xs text-[#333] outline-none">{['user', 'moderator', 'admin'].map(r => <option key={r} value={r}>{r === 'admin' ? '管理员' : r === 'moderator' ? '版主' : '用户'}</option>)}</select></td>
        </tr>
      ))}</tbody></table></div>}
    </div>
  )
}
