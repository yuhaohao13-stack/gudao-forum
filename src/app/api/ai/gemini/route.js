import { createClient } from '@/lib/supabase/server'
import { canUseAI } from '@/lib/member'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { messages } = await req.json()
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

    const check = canUseAI(user, profile)
    if (!check.allowed) {
      return NextResponse.json({ error: check.reason, ...check }, { status: 403 })
    }

    // 扣除次数
    const { error: deductErr } = await supabase.rpc('increment_ai_queries', { user_id: user.id })
    if (deductErr) {
      return NextResponse.json({ error: '配额更新失败' }, { status: 500 })
    }

    // 调用 Gemini API
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      await supabase.rpc('decrement_ai_queries', { user_id: user.id })
      return NextResponse.json({ error: 'API未配置' }, { status: 500 })
    }

    // 构建 Gemini 请求
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: { maxOutputTokens: 4096 },
        }),
      }
    )

    if (!resp.ok) {
      await supabase.rpc('decrement_ai_queries', { user_id: user.id })
      const errText = await resp.text()
      return NextResponse.json({ error: `API错误: ${errText}` }, { status: 502 })
    }

    const data = await resp.json()
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''

    return NextResponse.json({
      reply,
      remaining: check.remaining - 1,
    })

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
