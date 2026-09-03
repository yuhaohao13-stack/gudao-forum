import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// 普通板块页（/c/random /c/life 等）服务端 metadata
async function getCategory(slug) {
  if (!slug) return null
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null
  try {
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { auth: { persistSession: false, autoRefreshToken: false } }
    )
    const { data } = await supabase.from('categories').select('id, name, slug, icon').eq('slug', slug).maybeSingle()
    return data
  } catch (e) {
    return null
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  if (!slug) return { title: '古道论坛' }
  const cat = await getCategory(slug)
  const name = cat?.name || slug
  const icon = cat?.icon || ''
  return {
    title: { absolute: `${icon} ${name} - 板块帖子 | 古道论坛` },
    description: `古道论坛「${name}」板块：浏览最新帖子、参与讨论。以文会友，以友辅仁，免费注册即刻加入。`,
    alternates: { canonical: `https://www.gudaoforum.com/c/${slug}` },
  }
}

export default function CategoryLayout({ children }) {
  return children
}
