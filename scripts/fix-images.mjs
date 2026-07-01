#!/usr/bin/env node

/**
 * 修复帖子图片：下载 Unsplash 图片 → 上传 Supabase → 更新帖子
 * 
 * 1. fix-today: 修复今天已发的5篇帖子
 * 2. fix-content: 更新内容文件（移除markdown图片语法）
 * 3. update-script: 更新发帖脚本（上传图片+存images字段）
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

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ========== 下载图片 ==========
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    // Unsplash 需要 User-Agent
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      }
    }
    https.get(url, options, (res) => {
      // Unsplash 可能会重定向
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        downloadImage(res.headers.location, filepath).then(resolve).catch(reject)
        return
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`))
        return
      }
      const chunks = []
      res.on('data', chunk => chunks.push(chunk))
      res.on('end', () => {
        const buffer = Buffer.concat(chunks)
        // 检测是否真的是图片（不是HTML）
        if (buffer[0] === 0x3c) {
          reject(new Error(`非图片响应(可能是HTML): ${url}`))
          return
        }
        writeFileSync(filepath, buffer)
        resolve(filepath)
      })
    }).on('error', reject)
  })
}

// ========== 提取内容中的 Unsplash URL ==========
function extractUnsplashUrl(content) {
  const match = content.match(/!\[.*?\]\((https:\/\/images\.unsplash\.com\/[^\s)]+)\)/)
  return match ? match[1] : null
}

// ========== 清理内容中的图片语法 ==========
function cleanContent(content) {
  return content.replace(/!\[.*?\]\(https:\/\/images\.unsplash\.com\/[^\s)]+\)/g, '').trim()
}

// ========== 主流程：修复今天的帖子 ==========
async function fixTodayPosts() {
  console.log('=== 修复今天已发的帖子 ===')
  
  // 获取今天发的帖子（最新5篇）
  const { data: posts, error } = await supabase
    .from('threads')
    .select('id, title, content, images')
    .eq('author_id', ADMIN_ID)
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) {
    console.error('查询失败:', error.message)
    return
  }

  mkdirSync(IMG_DIR, { recursive: true })

  for (const post of posts) {
    const imgUrl = extractUnsplashUrl(post.content)
    if (!imgUrl) {
      console.log(`  ⏭️ ${post.title.slice(0, 30)}... 无图片`)
      continue
    }

    console.log(`  📥 下载: ${post.title.slice(0, 30)}...`)
    const filename = `thread_${post.id.slice(0, 8)}.jpg`
    const filepath = join(IMG_DIR, filename)

    try {
      await downloadImage(imgUrl, filepath)
      console.log(`  ✅ 下载完成`)

      // 上传到 Supabase Storage
      const storagePath = `threads/${ADMIN_ID}/${Date.now()}_${filename}`
      const fileBuffer = readFileSync(filepath)
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('forum-images')
        .upload(storagePath, fileBuffer, {
          contentType: 'image/jpeg',
          upsert: true,
        })

      if (uploadError) {
        console.error(`  ❌ 上传失败:`, uploadError.message)
        continue
      }

      const { data: { publicUrl } } = supabase.storage
        .from('forum-images')
        .getPublicUrl(storagePath)

      console.log(`  🔗 图片URL: ${publicUrl.slice(0, 60)}...`)

      // 更新帖子：clean content + 加images
      const newContent = cleanContent(post.content)
      const newImages = post.images || []
      newImages.push(publicUrl)

      const { error: updateError } = await supabase
        .from('threads')
        .update({ content: newContent, images: newImages })
        .eq('id', post.id)

      if (updateError) {
        console.error(`  ❌ 更新帖子失败:`, updateError.message)
      } else {
        console.log(`  ✅ 帖子已更新`)
      }

    } catch (err) {
      console.error(`  ❌ 处理失败:`, err.message)
    }
  }
}

// ========== 修复内容文件 ==========
async function fixContentFile() {
  console.log('\n=== 修复内容文件（移除markdown图片语法，记录图片URL） ===')
  
  const contentPath = join(__dirname, 'auto-poster-content.json')
  const content = JSON.parse(readFileSync(contentPath, 'utf-8'))

  for (const day of content) {
    for (const post of day.posts) {
      const imgUrl = extractUnsplashUrl(post.content)
      if (imgUrl) {
        // 记录要下载的URL（先不下载，等发帖时再下载上传）
        post.image_source = imgUrl
        post.content = cleanContent(post.content)
      }
    }
  }

  writeFileSync(contentPath, JSON.stringify(content, null, 2))
  console.log('  ✅ 内容文件已更新')
}

// ========== 主函数 ==========
async function main() {
  const action = process.argv[2] || 'all'
  
  if (action === 'fix-today' || action === 'all') {
    await fixTodayPosts()
  }
  
  if (action === 'fix-content' || action === 'all') {
    await fixContentFile()
  }

  console.log('\n=== 全部完成 ===')
}

main().catch(err => {
  console.error('❌ 执行出错:', err)
  process.exit(1)
})
