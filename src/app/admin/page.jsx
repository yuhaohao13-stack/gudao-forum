'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const { user, profile, loading } = useAuth()
  const [threads, setThreads] = useState([]); const [users, setUsers] = useState([]); const [tab, setTab] = useState('threads')
  const [broadcastText, setBroadcastText] = useState(''); const [broadcasting, setBroadcasting] = useState(false); const [broadcastResult, setBroadcastResult] = useState('')
  const supabase = createClient(); const router = useRouter()

  useEffect(() => { if (!loading && (!user || profile?.role !== 'admin')) router.push('/') }, [user, profile, loading])
  useEffect(() => {
    if (profile?.role !== 'admin') return
    supabase.from('threads').select('*, profiles(username, display_name), categories(name)').order('created_at', { ascending: false }).limit(50).then(({ data }) => setThreads(data || []))
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).then(({ data }) => setUsers(data || []))
  }, [profile])

  const sendBroadcast = async () => {
    if (!broadcastText.trim()) return
    if (!confirm(`确定向 ${users.length} 位用户发送站内公告？`)) return
    setBroadcasting(true); setBroadcastResult('')
    try {
      const res = await fetch('/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: broadcastText.trim() }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setBroadcastResult(data.message)
        setBroadcastText('')
      } else {
        setBroadcastResult(`❌ 发送失败: ${data.error || '未知错误'}`)
      }
    } catch (e) {
      setBroadcastResult(`❌ 网络错误: ${e.message}`)
    }
    setBroadcasting(false)
  }

  const del = async (id) => { if (!confirm('确定删除？')) return; await supabase.from('threads').delete().eq('id', id); setThreads(threads.filter(t => t.id !== id)) }

  const deleteUser = async (userId, username) => {
    if (!confirm(`确定删除用户 ${username}？\n\n将同时删除：\n- 该用户的所有帖子\n- 所有回复\n- 好友关系\n- 聊天记录\n- 个人资料`)) return
    if (!confirm('⚠️ 此操作不可撤销，确定？')) return
    try {
      await supabase.from('threads').delete().eq('author_id', userId)
      await supabase.from('replies').delete().eq('author_id', userId)
      await supabase.from('friends').delete().or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
      await supabase.from('private_messages').delete().or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      await supabase.from('chat_messages').delete().eq('user_id', userId)
      await supabase.from('profiles').delete().eq('id', userId)
      supabase.from('profiles').select('*').order('created_at', { ascending: false }).then(({ data }) => setUsers(data || []))
      alert('✅ 用户数据已删除\n\n注：如需完全删除 auth 账号，请去 Supabase→Authentication 手动删除')
    } catch (e) {
      alert('删除失败: ' + e.message)
    }
  }
  const toggle = (t, f) => async () => { await supabase.from('threads').update({ [f]: !t[f] }).eq('id', t.id); setThreads(threads.map(x => x.id === t.id ? { ...x, [f]: !x[f] } : x)) }
  const roleChg = async (id, r) => { await supabase.from('profiles').update({ role: r }).eq('id', id); setUsers(users.map(u => u.id === id ? { ...u, role: r } : u)) }

  if (loading || profile?.role !== 'admin') return <div className="flex justify-center py-20"><div className="w-5 h-5 border-[1.5px] border-[#ccc] border-t-[#1a1a1a] rounded-full animate-spin" /></div>

  return (
    <div className="anim-fade-in">
      <h1 className="text-xl font-bold font-serif text-[#1a1a1a] mb-1">⚙️ 管理后台</h1>
      <p className="text-xs text-[#aaa] mb-6">古道论坛管理中心</p>
      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab('threads')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === 'threads' ? 'bg-[#1a1a1a] text-white' : 'bg-[#f5f5f3] text-[#888] hover:text-[#1a1a1a]'}`}>帖子管理</button>
        <button onClick={() => setTab('users')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === 'users' ? 'bg-[#1a1a1a] text-white' : 'bg-[#f5f5f3] text-[#888] hover:text-[#1a1a1a]'}`}>用户管理</button>
        <button onClick={() => setTab('broadcast')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === 'broadcast' ? 'bg-[#1a1a1a] text-white' : 'bg-[#f5f5f3] text-[#888] hover:text-[#1a1a1a]'}`}>📢 公告</button>
      </div>
      {tab === 'threads' && <div className="space-y-2.5">{threads.map(t => (
        <div key={t.id} className="card p-4 flex items-start justify-between gap-3 anim-scale">
          <div className="min-w-0 flex-1"><h3 className="font-semibold text-sm truncate">{t.title}</h3><div className="text-xs text-[#aaa] mt-0.5">{t.profiles?.display_name || t.profiles?.username} · {t.categories?.name}</div></div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={toggle(t, 'is_pinned')} className={`text-xs px-2 py-1 rounded transition-colors hover:bg-[#f5f5f3] ${t.is_pinned ? 'text-[#8b6914]' : 'text-[#ccc]'}`}>📌</button>
            <button onClick={toggle(t, 'is_locked')} className={`text-xs px-2 py-1 rounded transition-colors hover:bg-[#f5f5f3] ${t.is_locked ? 'text-[#c23531]' : 'text-[#ccc]'}`}>🔒</button>
            <button onClick={() => del(t.id)} className="text-xs px-2 py-1 rounded text-[#ccc] hover:bg-[#f5f5f3] hover:text-[#c23531] transition-colors">🗑️</button>
          </div>
        </div>
      ))}</div>}
      {tab === 'users' && <div className="card overflow-hidden"><table className="w-full text-sm"><thead><tr className="text-[#aaa] border-b border-[#f0eee8] text-xs"><th className="text-left py-3 px-4 font-medium">用户</th><th className="text-left py-3 px-4 font-medium">角色</th><th className="text-left py-3 px-4 font-medium">操作</th></tr></thead><tbody>{users.map(u => (
        <tr key={u.id} className="border-b border-[#f0eee8] hover:bg-[#fafaf8] transition-colors">
          <td className="py-2.5 px-4"><div className="font-medium text-[#555]">{u.display_name || u.username}</div><div className="text-[10px] text-[#aaa]">@{u.username}</div></td>
          <td className="py-2.5 px-4"><span className={`text-[10px] px-2 py-0.5 rounded font-medium ${u.role === 'admin' ? 'bg-[#f5f0e8] text-[#8b6914] border border-[#e8e0d0]' : u.role === 'moderator' ? 'bg-[#f5f0e8] text-[#8b6914] border border-[#e8e0d0]' : 'text-[#aaa]'}`}>{u.role === 'admin' ? '管理员' : u.role === 'moderator' ? '版主' : '用户'}</span></td>
          <td className="py-2.5 px-4"><select value={u.role} onChange={e => roleChg(u.id, e.target.value)} className="bg-white border border-[#f0eee8] rounded-lg px-2 py-1 text-xs text-[#555] outline-none">{['user', 'moderator', 'admin'].map(r => <option key={r} value={r}>{r === 'admin' ? '管理员' : r === 'moderator' ? '版主' : '用户'}</option>)}</select></td>
          <td className="py-2.5 px-4">
            {u.role !== 'admin' && (
              <button onClick={() => deleteUser(u.id, u.display_name || u.username)}
                className="text-xs text-[#c23531] hover:bg-[#f5f0e8] px-2 py-1 rounded transition-colors">🗑️ 删除</button>
            )}
          </td>
        </tr>
      ))}</tbody></table></div>}
      {tab === 'broadcast' && (
        <div className="max-w-xl">
          <h2 className="font-bold font-serif text-[#1a1a1a] mb-1">📢 站内公告群发</h2>
          <p className="text-xs text-[#aaa] mb-4">发送私信公告给 <strong className="text-[#c23531]">{users.filter(u => u.id !== user?.id).length}</strong> 位注册用户</p>
          <div className="card p-5 space-y-4">
            <textarea value={broadcastText} onChange={e => setBroadcastText(e.target.value)}
              className="input min-h-[120px] resize-none" placeholder="输入公告内容..." maxLength={1000} />
            {broadcastResult && <div className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">{broadcastResult}</div>}
            <button onClick={sendBroadcast} disabled={broadcasting || !broadcastText.trim()}
              className="btn-primary disabled:opacity-50">
              {broadcasting ? '发送中...' : '📨 群发公告'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
