#!/usr/bin/env node

/**
 * 古道论坛 — 自动发帖系统（含图片上传）
 * 
 * 每天自动发5篇精贴（每个板块1篇），每篇配图
 * 共100篇（20天），发完自动停止
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import https from 'https'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const IMG_DIR = join(__dirname, 'post-images')

const SUPABASE_URL = 'https://rsndnhdimruisysacujg.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzbmRuaGRpbXJ1aXN5c2FjdWpnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjI2MDIxOCwiZXhwIjoyMDk3ODM2MjE4fQ.Q0i8WVrBjuoF4-c5Bun62YdSN2xZLYhXowofAJD5zVM'
const ADMIN_ID = '1d5b2916-b91f-4a33-87da-120d841d0bb2'

const STATE_FILE = join(__dirname, 'auto-poster-state.json')
const CONTENT_FILE = join(__dirname, 'auto-poster-content.json')

const CATEGORY_NAMES = {
  'e201f89e-c4ec-4849-a211-cb307b1b3ef5': '闲聊灌水',
  '23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8': '技术讨论',
  '435865b8-9f80-4958-a466-69483f8c2eec': '生活分享',
  'c3f00528-5e4b-485d-b248-362544a78387': '资源分享',
  '6dbfd686-80d2-43a9-ae89-2960354d7b9d': '原创小说',
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ========== 状态管理 ==========
function loadState() {
  if (!existsSync(STATE_FILE)) {
    return { totalPosted: 0, targetTotal: 100, lastRunDate: null, nextDayIndex: 0, completed: false }
  }
  return JSON.parse(readFileSync(STATE_FILE, 'utf-8'))
}

function saveState(state) {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2))
}

function loadContent() {
  return JSON.parse(readFileSync(CONTENT_FILE, 'utf-8'))
}

// ========== 下载图片 ==========
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      }
    }
    https.get(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        downloadImage(res.headers.location, filepath).then(resolve).catch(reject)
        return
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`))
        return
      }
      const chunks = []
      res.on('data', chunk => chunks.push(chunk))
      res.on('end', () => {
        const buffer = Buffer.concat(chunks)
        if (buffer[0] === 0x3c) {
          reject(new Error('非图片响应'))
          return
        }
        writeFileSync(filepath, buffer)
        resolve(filepath)
      })
    }).on('error', reject)
  })
}

// ========== 上传图片到 Supabase ==========
async function uploadImage(filepath, threadId) {
  const filename = `thread_${threadId.slice(0, 8)}.jpg`
  const storagePath = `threads/${ADMIN_ID}/${Date.now()}_${filename}`
  const fileBuffer = readFileSync(filepath)

  const { error: uploadError } = await supabase.storage
    .from('forum-images')
    .upload(storagePath, fileBuffer, {
      contentType: 'image/jpeg',
      upsert: true,
    })

  if (uploadError) throw new Error(`上传失败: ${uploadError.message}`)

  const { data: { publicUrl } } = supabase.storage
    .from('forum-images')
    .getPublicUrl(storagePath)

  return publicUrl
}

// ========== 发帖 ==========
async function postThread(title, content, categoryId, imageUrl) {
  // 先创建帖子
  const { data, error } = await supabase.from('threads').insert({
    title,
    content,
    category_id: categoryId,
    author_id: ADMIN_ID,
    images: imageUrl ? [imageUrl] : null,
  }).select('id')

  if (error) {
    console.error(`  ❌ 发帖失败: ${error.message}`)
    return null
  }
  console.log(`  ✅ 已发布: ${title.slice(0, 40)}...`)
  return data[0].id
}

// ========== 主流程 ==========
async function main() {
  console.log('')
  console.log('═══════════════════════════════')
  console.log('   古道论坛 · 自动发帖系统')
  console.log('═══════════════════════════════')
  console.log('')

  mkdirSync(IMG_DIR, { recursive: true })

  const state = loadState()
  const content = loadContent()

  if (state.completed) {
    console.log('🎉 100篇发帖任务已完成！不再执行。')
    return
  }

  const today = new Date().toISOString().split('T')[0]
  if (state.lastRunDate === today) {
    console.log('⏭️ 今天已经运行过了，跳过。')
    return
  }

  if (state.nextDayIndex >= content.length) {
    console.log('🎉 所有内容已发完！')
    state.completed = true
    saveState(state)
    return
  }

  const dayData = content[state.nextDayIndex]
  console.log(`📅 第 ${dayData.day} 天 / 共 ${content.length} 天`)
  console.log(`   今天要发 ${dayData.posts.length} 篇帖子`)
  console.log('')

  let successCount = 0
  for (const post of dayData.posts) {
    const catName = CATEGORY_NAMES[post.category_id] || '未知板块'
    console.log(`📝 [${catName}] ${post.title}`)

    let imageUrl = null

    // 如果有图片来源，下载并上传
    if (post.image_source) {
      console.log(`   📥 下载图片...`)
      const imgFilename = `post_${Date.now()}.jpg`
      const imgFilepath = join(IMG_DIR, imgFilename)

      try {
        await downloadImage(post.image_source, imgFilepath)
        console.log(`   📤 上传到Supabase...`)
        imageUrl = await uploadImage(imgFilepath, `day${dayData.day}`)
        console.log(`   ✅ 图片就绪`)
      } catch (err) {
        console.error(`   ⚠️ 图片处理失败: ${err.message}，继续发帖（无图）`)
      }
    }

    const threadId = await postThread(post.title, post.content, post.category_id, imageUrl)
    if (threadId) successCount++

    // 暂停避免请求过快
    await new Promise(r => setTimeout(r, 800))
  }

  // 更新状态
  state.totalPosted += successCount
  state.lastRunDate = today
  state.nextDayIndex++

  if (state.nextDayIndex >= content.length) {
    state.completed = true
  }

  saveState(state)

  console.log('')
  console.log('───────────────────────────────')
  console.log(`📊 本日成功: ${successCount}/${dayData.posts.length} 篇`)
  console.log(`📊 累计已发: ${state.totalPosted}/${state.targetTotal} 篇`)
  if (state.completed) {
    console.log('🎉🎉🎉 100篇全部发完！')
  } else {
    console.log(`📅 剩余天数: ${content.length - state.nextDayIndex} 天`)
  }
  console.log('───────────────────────────────')
  console.log('')
}

main().catch(err => {
  console.error('❌ 执行出错:', err)
  process.exit(1)
})
