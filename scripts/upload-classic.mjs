#!/usr/bin/env node
// Upload all classic MP3s to Supabase storage, replacing old files
import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const supabaseUrl = process.env.SUPABASE_URL || 'https://rsndnhdimruisysacujg.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })

const baseDir = '/tmp/classic-music'
const categories = [
  'sleep-music', 'classic-8090', 'folk', 'viral-hits', 'chinese-classics', 'english-songs'
]

async function uploadAll() {
  let totalUploaded = 0
  let totalFailed = 0

  for (const cat of categories) {
    const dir = join(baseDir, cat)
    let files
    try {
      files = readdirSync(dir).filter(f => f.endsWith('.mp3')).sort()
    } catch {
      console.log(`\n${cat}: no files, skipping`)
      continue
    }

    console.log(`\n--- ${cat} (${files.length} songs) ---`)

    for (const file of files) {
      const filePath = join(dir, file)
      const storagePath = `${cat}/${file}`
      
      try {
        const { error } = await supabase.storage
          .from('music')
          .upload(storagePath, readFileSync(filePath), {
            contentType: 'audio/mpeg',
            upsert: true,
          })

        if (error) {
          console.log(`  ❌ ${file}: ${error.message}`)
          totalFailed++
        } else {
          console.log(`  ✅ ${file} (${(readFileSync(filePath).length / 1024 / 1024).toFixed(1)}MB)`)
          totalUploaded++
        }
      } catch (e) {
        console.log(`  ❌ ${file}: ${e.message}`)
        totalFailed++
      }
    }
  }

  console.log(`\n=== Upload complete! ${totalUploaded} uploaded, ${totalFailed} failed ===`)
  
  // Test a few URLs
  console.log('\n=== Testing URLs ===')
  const tests = ['classic-8090/c01.mp3', 'chinese-classics/z01.mp3', 'english-songs/e03.mp3']
  for (const test of tests) {
    const url = `${supabaseUrl}/storage/v1/object/public/music/${test}`
    try {
      const res = await fetch(url, { method: 'HEAD' })
      console.log(`  ${test}: ${res.status} ${res.statusText}`)
    } catch (e) {
      console.log(`  ${test}: ${e.message}`)
    }
  }
}

uploadAll().catch(console.error)
