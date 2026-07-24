import { createClient } from '@/lib/supabase/server'
import { canUseAI } from '@/lib/member'
import { NextResponse } from 'next/server'

// DeepSeek 聊天 API
export async function POST(req) {
  try {
    const { messages } = await req.json()
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 })
    }

    // 验证用户
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 })

    // 获取用户资料
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

    // 检查权限
    const check = canUseAI(user, profile)
    if (!check.allowed) {
      return NextResponse.json({ error: check.reason, ...check }, { status: 403 })
    }

    // 扣除次数（调用前先扣，失败再加回）
    const { error: deductErr } = await supabase.rpc('increment_ai_queries', { user_id: user.id })
    if (deductErr) {
      return NextResponse.json({ error: '配额更新失败' }, { status: 500 })
    }

    // 调用 DeepSeek API
    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      // 扣回次数
      await supabase.rpc('decrement_ai_queries', { user_id: user.id })
      return NextResponse.json({ error: 'API未配置' }, { status: 500 })
    }

    const resp = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'system', content: '你是一个有帮助的AI助手。' }, ...messages],
        max_tokens: 4096,
        stream: false,
      }),
    })

    if (!resp.ok) {
      // API调用失败，加回次数
      await supabase.rpc('decrement_ai_queries', { user_id: user.id })
      const errText = await resp.text()
      return NextResponse.json({ error: `API错误: ${errText}` }, { status: 502 })
    }

    const data = await resp.json()
    return NextResponse.json({
      reply: data.choices?.[0]?.message?.content || '',
      remaining: check.remaining - 1,
    })

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
