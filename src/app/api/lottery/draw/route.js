import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function drawSSQ(selectedNums) {
  let reds, blue;
  if (selectedNums && selectedNums.red && selectedNums.red.length >= 6) {
    // 复式/胆拖模式 — 从选中号码中随机抽6个
    const shuffled = [...selectedNums.red].sort(() => Math.random() - 0.5)
    reds = shuffled.slice(0, 6).sort((a,b) => a-b)
  } else {
    // 普通随机
    const pool = Array.from({length: 33}, (_, i) => i + 1)
    const shuffled = pool.sort(() => Math.random() - 0.5)
    reds = shuffled.slice(0, 6).sort((a,b) => a-b)
  }
  
  if (selectedNums && selectedNums.blue) {
    blue = selectedNums.blue
  } else {
    blue = Math.floor(Math.random() * 16) + 1
  }
  return { red: reds, blue }
}

function drawDLT(selectedNums) {
  const frontPool = Array.from({length: 35}, (_, i) => i + 1)
  const backPool = Array.from({length: 12}, (_, i) => i + 1)
  const front = frontPool.sort(() => Math.random() - 0.5).slice(0, 5).sort((a,b) => a-b)
  const back = backPool.sort(() => Math.random() - 0.5).slice(0, 2).sort((a,b) => a-b)
  return { front, back }
}

function drawFC3D() {
  return String(Math.floor(Math.random() * 1000)).padStart(3, '0')
}

function draw4D() {
  return String(Math.floor(Math.random() * 10000)).padStart(4, '0')
}

function drawTOTO(systemSize) {
  const pool = Array.from({length: 49}, (_, i) => i + 1)
  const count = systemSize || 6
  return pool.sort(() => Math.random() - 0.5).slice(0, count).sort((a,b) => a-b)
}

function formatResult(type, numbers) {
  switch(type) {
    case 'ssq': return `红球: ${numbers.red.join(', ')}  蓝球: ${numbers.blue}`
    case 'dlt': return `前区: ${numbers.front.join(', ')}  后区: ${numbers.back.join(', ')}`
    case 'fc3d': return numbers
    case 'sg4d': return numbers
    case 'toto': return numbers.join(', ')
  }
}

export async function POST(request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: '请先登录', needUpgrade: true }, { status: 401 })

    const { lottery_type, ticket_numbers } = await request.json()
    if (!lottery_type) return NextResponse.json({ error: '请选择彩票类型' }, { status: 400 })

    // 获取会员等级
    const { data: profile } = await supabase
      .from('profiles')
      .select('membership_level, gold_draws_remaining')
      .eq('id', user.id)
      .single()

    const level = profile?.membership_level || 'regular'
    if (level !== 'diamond') {
      return NextResponse.json({ error: '仅钻石会员可摇奖', needUpgrade: true }, { status: 403 })
    }

    // 执行摇奖
    let numbers, systemSize;
    switch(lottery_type) {
      case 'ssq': numbers = drawSSQ(ticket_numbers); break
      case 'dlt': numbers = drawDLT(ticket_numbers); break
      case 'fc3d': numbers = drawFC3D(); break
      case 'sg4d': numbers = draw4D(); break
      case 'toto': 
        systemSize = ticket_numbers?.systemSize || 6
        numbers = drawTOTO(systemSize)
        break
      default: return NextResponse.json({ error: '无效彩票类型' }, { status: 400 })
    }

    // 记录摇奖结果
    await supabase
      .from('lottery_records')
      .insert({
        user_id: user.id,
        lottery_type,
        numbers,
        ticket_numbers: ticket_numbers || null
      })

    // 获取最新剩余次数
    const remaining = 99999

    return NextResponse.json({
      numbers,
      formatted: formatResult(lottery_type, numbers),
      draws_remaining: remaining,
      level
    })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ draws_remaining: 0, level: 'regular' })

    const { data: profile } = await supabase
      .from('profiles')
      .select('membership_level, gold_draws_remaining')
      .eq('id', user.id)
      .single()

    const level = profile?.membership_level || 'regular'
    const remaining = level === 'diamond' ? 99999 
      : level === 'gold' ? (profile?.gold_draws_remaining || 0) 
      : 0

    // Also fetch recent records
    const { data: records } = await supabase
      .from('lottery_records')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    // Fetch recent donations for scrolling
    const { data: donations } = await supabase
      .from('donations')
      .select('username, amount, plan, created_at')
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(50)

    return NextResponse.json({ 
      draws_remaining: remaining, 
      level, 
      records: records || [],
      donations: donations || []
    })
  } catch (e) {
    return NextResponse.json({ draws_remaining: 0, level: 'regular', records: [], donations: [] })
  }
}

// 管理员接口：升级会员
export async function PUT(request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 })

    const { data: admin } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (admin?.role !== 'admin') return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })

    const { user_id, level, draws } = await request.json()
    if (!user_id || !level) return NextResponse.json({ error: '缺少参数' }, { status: 400 })

    const updates = { membership_level: level }
    if (level === 'gold') updates.gold_draws_remaining = draws || 500
    if (level === 'diamond') updates.gold_draws_remaining = 99999

    await supabase.from('profiles').update(updates).eq('id', user_id)

    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
