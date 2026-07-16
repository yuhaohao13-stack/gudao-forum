'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'
import { Settings, Megaphone, Pin, Lock, Trash2, Send, Crown, Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const { user, profile, loading } = useAuth()
  const [threads, setThreads] = useState([]); const [users, setUsers] = useState([]); const [tab, setTab] = useState('threads'); const [donations, setDonations] = useState([])
  const [broadcastText, setBroadcastText] = useState(''); const [broadcasting, setBroadcasting] = useState(false); const [broadcastResult, setBroadcastResult] = useState('')
  const supabase = createClient(); const router = useRouter()

  useEffect(() => { if (!loading && (!user || profile?.role !== 'admin')) router.push('/') }, [user, profile, loading])
  useEffect(() => {
    if (profile?.role !== 'admin') return
    supabase.from('threads').select('*, profiles(username, display_name), categories(name)').order('created_at', { ascending: false }).limit(50).then(({ data }) => setThreads(data || []))
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).then(({ data }) => setUsers(data || []))
    supabase.from('donations').select('*, profiles!inner(username, display_name)').order('created_at', { ascending: false }).limit(100).then(({ data }) => setDonations(data || [])).catch(() => {})
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
    if (!confirm(`确定删除用户 ${username}？\n\n将同时删除该用户所有数据`)) return
    if (!confirm('⚠️ 此操作不可撤销，确定？')) return
    try {
      await supabase.from('threads').delete().eq('author_id', userId)
      await supabase.from('replies').delete().eq('author_id', userId)
      await supabase.from('friends').delete().or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
      await supabase.from('private_messages').delete().or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      await supabase.from('chat_messages').delete().eq('user_id', userId)
      await supabase.from('profiles').delete().eq('id', userId)
      supabase.from('profiles').select('*').order('created_at', { ascending: false }).then(({ data }) => setUsers(data || []))
      alert('✅ 用户数据已删除')
    } catch (e) { alert('删除失败: ' + e.message) }
  }
  const toggle = (t, f) => async () => { await supabase.from('threads').update({ [f]: !t[f] }).eq('id', t.id); setThreads(threads.map(x => x.id === t.id ? { ...x, [f]: !x[f] } : x)) }
  const roleChg = async (id, r) => { await supabase.from('profiles').update({ role: r }).eq('id', id); setUsers(users.map(u => u.id === id ? { ...u, role: r } : u)) }

  if (loading || profile?.role !== 'admin') return <div className="flex justify-center py-20"><div className="w-5 h-5 border-[1.5px] border-[#ddd] border-t-[#1a1a1a] rounded-full animate-spin" /></div>

  return (
    <div className="anim-fade-in">
      <h1 className="text-xl font-bold text-[#1a1a1a] mb-1"><Settings size={20} className="inline-block align-text-bottom" /> 管理后台</h1>
      <p className="text-xs text-[#aaa] mb-6">古道论坛管理中心</p>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['threads', 'users', 'membership', 'donations', 'broadcast'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === t ? 'bg-[#b45309] text-white' : 'text-[#999] hover:text-[#1a1a1a] hover:bg-[#f5f5f5]'}`}>
            {t === 'threads' ? '帖子管理' : t === 'users' ? '用户管理' : t === 'membership' ? <><Crown size={14} className="inline-block align-text-bottom" /> 会员</> : t === 'donations' ? '打赏记录' : <><Megaphone size={14} className="inline-block align-text-bottom" /> 公告</>}
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

      {tab === 'membership' && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="font-bold text-[#1a1a1a]"><Crown size={16} className="inline-block align-text-bottom" /> 会员等级管理</h2>
            <span className="text-xs text-[#aaa]">管理彩票模拟器会员等级</span>
          </div>
          <div className="border border-[#f0f0f0] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[#aaa] border-b border-[#f0f0f0] text-xs">
                  <th className="text-left py-3 px-4 font-medium">用户</th>
                  <th className="text-left py-3 px-4 font-medium">论坛角色</th>
                  <th className="text-left py-3 px-4 font-medium">会员等级</th>
                  <th className="text-left py-3 px-4 font-medium">剩余摇奖</th>
                  <th className="text-left py-3 px-4 font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f5f5]">
                {users.map(u => {
                  const ml = u.membership_level || 'regular'
                  return (
                    <tr key={u.id} className="hover:bg-[#fafafa] transition-colors">
                      <td className="py-2.5 px-4">
                        <div className="font-medium text-[#555]">{u.display_name || u.username}</div>
                        <div className="text-[10px] text-[#aaa]">@{u.username}</div>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="tag">{u.role === 'admin' ? '管理员' : '用户'}</span>
                      </td>
                      <td className="py-2.5 px-4">
                        {ml === 'diamond' ? <span className="text-[#00BFFF] font-semibold flex items-center gap-1"><Shield size={14} /> 钻石会员</span>
                          : ml === 'gold' ? <span className="text-[#FFD700] font-semibold flex items-center gap-1"><Crown size={14} /> 黄金会员</span>
                          : <span className="text-[#999]">普通会员</span>}
                      </td>
                      <td className="py-2.5 px-4 text-xs text-[#888]">
                        {ml === 'diamond' ? '♾️ 无限' : ml === 'gold' ? (u.gold_draws_remaining || 0) + '次' : '-'}
                      </td>
                      <td className="py-2.5 px-4 flex gap-1.5 flex-wrap">
                        <select value={ml}
                          onChange={async e => {
                            const level = e.target.value
                            if (!confirm(`确定将 ${u.display_name || u.username} 设为${level === 'diamond' ? '钻石' : level === 'gold' ? '黄金' : '普通'}会员？`)) return
                            const draws = level === 'gold' ? 500 : level === 'diamond' ? 99999 : 0
                            await supabase.from('profiles').update({ membership_level: level, gold_draws_remaining: draws }).eq('id', u.id)
                            supabase.from('profiles').select('*').order('created_at', { ascending: false }).then(({ data }) => setUsers(data || []))
                          }}
                          className="bg-white border border-[#f0f0f0] rounded-md px-2 py-1 text-xs text-[#555] outline-none">
                          <option value="regular">普通</option>
                          <option value="gold">黄金 ¥9.9</option>
                          <option value="diamond">钻石 ¥99</option>
                        </select>
                        {ml === 'gold' && (
                          <input type="number" defaultValue={u.gold_draws_remaining || 500}
                            className="w-16 bg-white border border-[#f0f0f0] rounded-md px-2 py-1 text-xs text-[#555] outline-none"
                            placeholder="次数"
                            onBlur={async e => {
                              const val = parseInt(e.target.value)
                              if (val > 0 && val !== (u.gold_draws_remaining || 0)) {
                                await supabase.from('profiles').update({ gold_draws_remaining: val }).eq('id', u.id)
                                supabase.from('profiles').select('*').order('created_at', { ascending: false }).then(({ data }) => setUsers(data || []))
                              }
                            }}
                          />
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'donations' && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="font-bold text-[#1a1a1a]">💰 打赏记录</h2>
            <span className="text-xs text-[#aaa]">用户打赏后联系你，你来这里手动记录并升级</span>
          </div>
          
          {/* 手动添加打赏 */}
          <div className="bg-[#fefaf5] border border-[#eee8dc] rounded-xl p-4 mb-4">
            <h3 className="text-sm font-bold text-[#1c1917] mb-3">➕ 手动添加打赏记录</h3>
            <div className="flex flex-wrap gap-2 items-end">
              <div>
                <label className="text-[10px] text-[#888] block mb-0.5">用户名</label>
                <input id="donate-username"
                  className="bg-white border border-[#f0f0f0] rounded-md px-3 py-1.5 text-xs text-[#555] outline-none focus:border-[#b45309] w-28"
                  placeholder="输入用户名" />
              </div>
              <div>
                <label className="text-[10px] text-[#888] block mb-0.5">金额</label>
                <select id="donate-amount"
                  className="bg-white border border-[#f0f0f0] rounded-md px-3 py-1.5 text-xs text-[#555] outline-none">
                  <option value="9.9">¥9.9（黄金）</option>
                  <option value="99">¥99（钻石）</option>
                </select>
              </div>
              <button onClick={async () => {
                const username = document.getElementById('donate-username')?.value?.trim()
                const amount = parseFloat(document.getElementById('donate-amount')?.value || '9.9')
                if (!username) return alert('请输入用户名')
                
                // Find user
                const { data: user } = await supabase.from('profiles').select('id,display_name,username').or('username.eq.' + username + ',display_name.eq.' + username).maybeSingle()
                if (!user) return alert('未找到用户「' + username + '」，请先确认用户已注册')
                
                const plan = amount >= 50 ? 'diamond' : 'gold'
                const draws = plan === 'diamond' ? 99999 : 500
                
                // Insert donation record
                await supabase.from('donations').insert({
                  user_id: user.id,
                  username: user.display_name || user.username,
                  amount: amount,
                  plan: plan,
                  status: 'completed'
                })
                
                // Upgrade user
                await supabase.from('profiles').update({ membership_level: plan, gold_draws_remaining: draws }).eq('id', user.id)
                
                document.getElementById('donate-username').value = ''
                alert('✅ ' + username + ' 已升级为' + (plan === 'diamond' ? '钻石' : '黄金') + '会员！')
                
                // Refresh
                supabase.from('donations').select('*, profiles!inner(username, display_name)').order('created_at', { ascending: false }).limit(100).then(({ data }) => setDonations(data || [])).catch(() => {})
                supabase.from('profiles').select('*').order('created_at', { ascending: false }).then(({ data }) => setUsers(data || []))
              }} className="px-3 py-1.5 bg-[#b45309] text-white text-xs font-medium rounded-lg hover:bg-[#92400e] transition-colors">
                添加并升级
              </button>
            </div>
            <p className="text-[10px] text-[#aaa] mt-2">用户打赏后联系你 → 输入用户名 → 选金额 → 一键升级</p>
          </div>
          
          <p className="text-xs text-[#aaa] mb-4">打赏记录列表</p>
          <div className="border border-[#f0f0f0] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[#aaa] border-b border-[#f0f0f0] text-xs">
                  <th className="text-left py-3 px-4 font-medium">用户</th>
                  <th className="text-left py-3 px-4 font-medium">金额</th>
                  <th className="text-left py-3 px-4 font-medium">套餐</th>
                  <th className="text-left py-3 px-4 font-medium">状态</th>
                  <th className="text-left py-3 px-4 font-medium">时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f5f5]">
                {donations.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-xs text-[#aaa]">暂无打赏记录</td></tr>
                ) : donations.map(d => (
                  <tr key={d.id} className="hover:bg-[#fafafa] transition-colors">
                    <td className="py-2.5 px-4 font-medium text-[#555]">{d.profiles?.display_name || d.username}</td>
                    <td className="py-2.5 px-4 text-[#b45309] font-semibold">¥{d.amount}</td>
                    <td className="py-2.5 px-4">{d.plan === 'diamond' ? <span className="text-[#00BFFF]">💎 钻石</span> : <span className="text-[#FFD700]">🏆 黄金</span>}</td>
                    <td className="py-2.5 px-4"><span className={"tag " + (d.status === 'completed' ? 'text-green-600' : d.status === 'pending' ? 'text-[#b45309]' : 'text-red-500')}>{d.status === 'completed' ? '已完成' : d.status === 'pending' ? '待确认' : '已取消'}</span></td>
                    <td className="py-2.5 px-4 text-xs text-[#aaa]">{new Date(d.created_at).toLocaleString('zh-CN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'broadcast' && (
        <div className="max-w-xl">
          <h2 className="font-bold text-[#1a1a1a] mb-1"><Megaphone size={16} className="inline-block align-text-bottom" /> 站内公告群发</h2>
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
