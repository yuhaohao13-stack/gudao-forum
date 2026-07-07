'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'
import { Settings, Megaphone, Pin, Lock, Trash2, Send } from 'lucide-react'
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
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: broadcastText.trim() }),
      })
      const data = await res.json()
      if (res.ok && data.success) { setBroadcastResult(data.message); setBroadcastText('') }
      else { setBroadcastResult(`❌ 发送失败: ${data.error || '未知错误'}`) }
    } catch (e) { setBroadcastResult(`❌ 网络错误: ${e.message}`) }
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
    } catch (e) { alert('删除失败: ' + e.message) }
  }
  const toggle = (t, f) => async () => { await supabase.from('threads').update({ [f]: !t[f] }).eq('id', t.id); setThreads(threads.map(x => x.id === t.id ? { ...x, [f]: !x[f] } : x)) }
  const roleChg = async (id, r) => { await supabase.from('profiles').update({ role: r }).eq('id', id); setUsers(users.map(u => u.id === id ? { ...u, role: r } : u)) }

  if (loading || profile?.role !== 'admin') return <div className="flex justify-center py-20"><div className="w-5 h-5 border-[1.5px] border-[#ddd] border-t-[#1c1917] rounded-full animate-spin" /></div>

  return (
    <div className="anim-fade-in">
      <h1 className="text-xl font-bold text-[#1c1917] mb-1"><Settings size={20} className="inline-block align-text-bottom" /> 管理后台</h1>
      <p className="text-xs text-[#aaa] mb-6">古道论坛管理中心</p>

      <div className="flex gap-2 mb-6">
        {['threads', 'users', 'broadcast'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === t ? 'bg-[#1c1917] text-white' : 'text-[#999] hover:text-[#1c1917] hover:bg-[#f5f5f5]'}`}>
            {t === 'threads' ? '帖子管理' : t === 'users' ? '用户管理' : <><Megaphone size={14} className="inline-block align-text-bottom" /> 公告</>}
          </button>
        ))}
      </div>

      {tab === 'threads' && (
        <div className="border border-[#f0f0f0] rounded-xl divide-y divide-[#f5f5f5]">
          {threads.map(t => (
            <div key={t.id} className="px-4 py-3 flex items-start justify-between gap-3 hover:bg-[#fafafa]">
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-sm truncate">{t.title}</h3>
                <div className="text-xs text-[#aaa] mt-0.5">{t.profiles?.display_name || t.profiles?.username} · {t.categories?.name}</div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={toggle(t, 'is_pinned')} className={`text-xs px-2 py-1 rounded transition-colors hover:bg-[#f5f5f5] ${t.is_pinned ? 'text-[#8b6914]' : 'text-[#ddd]'}`}><Pin size={14} className="inline-block" /></button>
                <button onClick={toggle(t, 'is_locked')} className={`text-xs px-2 py-1 rounded transition-colors hover:bg-[#f5f5f5] ${t.is_locked ? 'text-[#c23531]' : 'text-[#ddd]'}`}><Lock size={14} className="inline-block" /></button>
                <button onClick={() => del(t.id)} className="text-xs px-2 py-1 rounded text-[#ddd] hover:bg-[#f5f5f5] hover:text-[#c23531] transition-colors"><Trash2 size={14} className="inline-block" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'users' && (
        <div className="border border-[#f0f0f0] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#aaa] border-b border-[#f0f0f0] text-xs">
                <th className="text-left py-3 px-4 font-medium">用户</th>
                <th className="text-left py-3 px-4 font-medium">角色</th>
                <th className="text-left py-3 px-4 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f5f5]">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-[#fafafa] transition-colors">
                  <td className="py-2.5 px-4">
                    <div className="font-medium text-[#555]">{u.display_name || u.username}</div>
                    <div className="text-[10px] text-[#aaa]">@{u.username}</div>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="tag">{u.role === 'admin' ? '管理员' : u.role === 'moderator' ? '版主' : '用户'}</span>
                  </td>
                  <td className="py-2.5 px-4 flex gap-2">
                    <select value={u.role} onChange={e => roleChg(u.id, e.target.value)}
                      className="bg-white border border-[#f0f0f0] rounded-md px-2 py-1 text-xs text-[#555] outline-none">
                      {['user', 'moderator', 'admin'].map(r => <option key={r} value={r}>{r === 'admin' ? '管理员' : r === 'moderator' ? '版主' : '用户'}</option>)}
                    </select>
                    {u.role !== 'admin' && (
                      <button onClick={() => deleteUser(u.id, u.display_name || u.username)}
                        className="text-xs text-[#c23531] hover:bg-[#fef2f0] px-2 py-1 rounded transition-colors"><Trash2 size={12} className="inline-block align-text-bottom" /> 删除</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'broadcast' && (
        <div className="max-w-xl">
          <h2 className="font-bold text-[#1c1917] mb-1"><Megaphone size={16} className="inline-block align-text-bottom" /> 站内公告群发</h2>
          <p className="text-xs text-[#aaa] mb-4">发送私信公告给 <strong className="text-[#c23531]">{users.filter(u => u.id !== user?.id).length}</strong> 位注册用户</p>
          <div className="border border-[#f0f0f0] rounded-xl p-5 space-y-4">
            <textarea value={broadcastText} onChange={e => setBroadcastText(e.target.value)}
              className="input min-h-[120px] resize-none" placeholder="输入公告内容..." maxLength={1000} />
            {broadcastResult && <div className="text-xs text-green-700 bg-[#f0fdf0] border border-[#dceddc] rounded-lg p-3">{broadcastResult}</div>}
            <button onClick={sendBroadcast} disabled={broadcasting || !broadcastText.trim()}
              className="btn-primary disabled:opacity-50">{broadcasting ? '发送中...' : <><Send size={14} className="inline-block align-text-bottom" /> 群发公告</>}</button>
          </div>
        </div>
      )}
    </div>
  )
}
