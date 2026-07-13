import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const supabaseUrl = process.env.SUPABASE_URL || 'https://rsndnhdimruisysacujg.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })

const categories = [
  { dir: 'sleep-music', prefix: 's' },
  { dir: 'classic-8090', prefix: 'c' },
  { dir: 'folk', prefix: 'f' },
  { dir: 'viral-hits', prefix: 'v' },
  { dir: 'chinese-classics', prefix: 'z' },
  { dir: 'english-songs', prefix: 'e' },
]

const baseDir = '/tmp/forum-music-final'

async function uploadAll() {
  for (const cat of categories) {
    const dir = join(baseDir, cat.dir)
    let files
    try {
      files = readdirSync(dir).filter(f => f.endsWith('.mp3'))
    } catch {
      console.log(`${cat.dir}: directory not found, skipping`)
      continue
    }
    
    console.log(`\n=== ${cat.dir} (${files.length} files) ===`)
    
    for (const file of files.sort()) {
      // Extract number from filename like s01.mp3 or s01_x.mp3
      const num = file.replace(/^[a-z](\d+).*\.mp3$/, (m, n) => n.padStart(2, '0'))
      const songId = `${cat.prefix}${num}`
      const filePath = join(dir, file)
      
      console.log(`Uploading ${file} → music/${cat.dir}/${songId}.mp3 ...`)
      
      const { error } = await supabase.storage
        .from('music')
        .upload(`${cat.dir}/${songId}.mp3`, readFileSync(filePath), {
          contentType: 'audio/mpeg',
          upsert: true,
        })
      
      if (error) {
        console.log(`  ❌ ${songId}: ${error.message}`)
      } else {
        console.log(`  ✅ ${songId}`)
      }
    }
  }
  
  console.log('\n=== Upload complete! ===')
}

uploadAll().catch(console.error)
