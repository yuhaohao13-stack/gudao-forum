/**
 * 每日自动发帖脚本 — 手机电脑维修案例到技术板块
 * 每天发 5 篇，从 repair-cases.json 中轮选
 * 注意：SUPABASE_SECRET 通过环境变量传入
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync, writeFileSync } from 'fs'

const CASES_FILE = '/Users/hy/.openclaw/workspace/维修知识库/repair-cases.json'
const PROGRESS_FILE = '/Users/hy/.openclaw/workspace/维修知识库/posting-progress.json'

const SUPABASE_URL = 'https://rsndnhdimruisysacujg.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SECRET
const AUTHOR_ID = '1d5b2916-b91f-4a33-87da-120d841d0bb2'
const CATEGORY_ID = '23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8'

async function main() {
  if (!SUPABASE_KEY) {
    console.error('❌ 需要设置 SUPABASE_SECRET 环境变量')
    process.exit(1)
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

  // 读取案例
  const cases = JSON.parse(readFileSync(CASES_FILE, 'utf-8'))

  // 读取进度
  let progress = { posted: [], day: 0 }
  if (existsSync(PROGRESS_FILE)) {
    progress = JSON.parse(readFileSync(PROGRESS_FILE, 'utf-8'))
  }

  const day = progress.day + 1
  if (day > 100) {
    console.log('✅ 100天任务已完成！')
    return { done: true }
  }

  // 找出今天要发的5篇（按轮序）
  const available = cases.filter((_, i) => !progress.posted.includes(i))
  const todayPosts = available.slice(0, 5)

  if (todayPosts.length === 0) {
    console.log('所有案例已发完，重置轮序')
    progress.posted = []
    todayPosts.push(...cases.slice(0, 5))
  }

  const results = []
  for (const post of todayPosts) {
    const idx = cases.indexOf(post)
    const { error } = await supabase.from('threads').insert({
      title: post.title,
      content: post.content,
      category_id: CATEGORY_ID,
      author_id: AUTHOR_ID,
    })

    if (error) {
      console.error(`❌ 发帖失败: ${post.title}`, error.message)
      results.push({ title: post.title, status: 'failed', error: error.message })
    } else {
      console.log(`✅ 已发: ${post.title}`)
      results.push({ title: post.title, status: 'success' })
      if (!progress.posted.includes(idx)) {
        progress.posted.push(idx)
      }
    }
  }

  progress.day = day
  writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2))

  console.log(`\n📊 第 ${day}/100 天完成，共发 ${results.filter(r => r.status === 'success').length} 篇`)
  return { day, results }
}

main().catch(console.error)
