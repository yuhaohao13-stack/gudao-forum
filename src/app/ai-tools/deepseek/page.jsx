'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { canUseAI, MemberLockOverlay } from '@/lib/member'
import Link from 'next/link'
import { Send, ChevronLeft, Bot, User, Loader2, AlertCircle } from 'lucide-react'

export default function DeepSeekChatPage() {
  const { user, profile, loading: authLoading } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [lockInfo, setLockInfo] = useState(null)
  const [remaining, setRemaining] = useState(null)
  const [max, setMax] = useState(null)
  const inputRef = useRef(null)
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!authLoading && user && profile) {
      const check = canUseAI(user, profile)
      if (!check.allowed) setLockInfo(check)
      else { setRemaining(check.remaining); setMax(check.max) }
    }
  }, [user, profile, authLoading])

  const sendMessage = async () => {
    if (!input.trim() || sending) return
    const userMsg = input.trim()
    setInput('')

    const newMessages = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setSending(true)

    try {
      const resp = await fetch('/api/ai/deepseek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.content })) }),
      })

      const data = await resp.json()

      if (!resp.ok) {
        if (data.reason && data.reason === 'exhausted') {
          setLockInfo({ allowed: false, reason: 'exhausted' })
          setMessages(newMessages)
          return
        }
        setMessages([...newMessages, { role: 'assistant', content: `⚠️ ${data.error || '请求失败'}` }])
        return
      }

      setMessages([...newMessages, { role: 'assistant', content: data.reply }])
      setRemaining(data.remaining)
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: '⚠️ 网络错误，请重试' }])
    } finally {
      setSending(false)
    }
  }

  if (authLoading) return <div className="flex justify-center py-20"><Loader2 size={28} className="animate-spin text-[#b45309]" /></div>

  if (lockInfo) {
    return (
      <div className="max-w-3xl mx-auto py-6 px-3">
        <Link href="/ai-tools" className="text-xs text-[#b45309] hover:underline inline-flex items-center gap-1 mb-4">
          <ChevronLeft size={12} /> 返回工具箱
        </Link>
        <MemberLockOverlay show={true} reason={lockInfo.reason} />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-6 px-3 sm:px-4">
      {/* 顶栏 */}
      <div className="flex items-center justify-between mb-3">
        <Link href="/ai-tools" className="text-xs text-[#b45309] hover:underline inline-flex items-center gap-1">
          <ChevronLeft size={12} /> 工具箱
        </Link>
        <div className="text-[10px] text-[#999]">
          剩余 <span className="font-bold text-[#b45309]">{remaining}</span> / {max} 次
        </div>
      </div>

      {/* 聊天区 */}
      <div className="bg-white border border-[#ece8e0] rounded-xl overflow-hidden flex flex-col" style={{ maxHeight: '70vh', minHeight: '400px' }}>
        <div className="bg-gradient-to-r from-[#eef2ff] to-[#e0e7ff] px-4 py-2.5 border-b border-[#c7d2fe]">
          <div className="flex items-center gap-2">
            <Bot size={16} className="text-[#4f46e5]" />
            <span className="text-xs font-semibold text-[#4f46e5]">DeepSeek V4 — 深度推理模型</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-12 text-xs text-[#bbb]">
              <Bot size={32} className="mx-auto mb-2 text-[#ddd]" />
              <p>输入您的问题，开始与 DeepSeek 对话</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : ''}`}>
              {m.role === 'assistant' && <Bot size={20} className="shrink-0 mt-1 text-[#4f46e5]" />}
              <div className={`text-xs sm:text-sm px-3 py-2 rounded-xl max-w-[85%] whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-[#4f46e5] text-white rounded-br-sm'
                  : 'bg-[#f5f5f5] text-[#1a1a1a] rounded-bl-sm'
              }`}>
                {m.content}
              </div>
              {m.role === 'user' && <User size={20} className="shrink-0 mt-1 text-[#4f46e5]" />}
            </div>
          ))}
          {sending && (
            <div className="flex gap-2">
              <Bot size={20} className="shrink-0 mt-1 text-[#4f46e5]" />
              <div className="text-xs bg-[#f5f5f5] px-3 py-2 rounded-xl rounded-bl-sm">
                <Loader2 size={14} className="animate-spin inline-block" /> 思考中...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* 输入区 */}
        <div className="border-t border-[#ece8e0] p-3 sm:p-4">
          <div className="flex gap-2 sm:gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="输入您的问题..."
              className="flex-1 text-sm sm:text-base px-4 py-3 border border-[#ddd] rounded-xl focus:outline-none focus:border-[#4f46e5]"
              disabled={sending}
            />
            <button
              onClick={sendMessage}
              disabled={sending || !input.trim()}
              className="bg-[#4f46e5] text-white px-4 sm:px-6 py-3 rounded-xl hover:bg-[#4338ca] disabled:opacity-40 transition-colors text-sm sm:text-base font-medium"
            >
              <Send size={18} />
            </button>
          </div>
          <div className="text-[11px] text-[#bbb] mt-2 text-center">
            剩余 {remaining} 次 · 黄金100次 · 钻石1000次
          </div>
        </div>
      </div>
    </div>
  )
}
