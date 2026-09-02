import POEMS from '@/data/poetry'
import PoemDetail from './_detail'

// SEO: 每首诗静态生成独立页面（构建时预渲染，爬虫直接可见完整标题/描述/开头正文）
export function generateStaticParams() {
  return POEMS.map((p) => ({ id: String(p.id) }))
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const poem = POEMS.find((p) => p.id === Number(id))
  if (!poem) {
    return { title: '唐诗三百首' }
  }
  const preview = poem.content.slice(0, 160).replace(/\s+/g, ' ')
  const desc = `${poem.title}，唐代诗人${poem.author}。${preview}${poem.content.length > 160 ? '…' : ''} 免费注册，畅读全诗与注释赏析。`
  return {
    title: `${poem.title}（${poem.author}）— 唐诗三百首`,
    description: desc,
    openGraph: {
      title: `${poem.title}（${poem.author}）— 唐诗三百首`,
      description: desc,
      type: 'article',
      url: `https://www.gudaoforum.com/poetry/${id}`,
    },
  }
}

export default async function Page({ params }) {
  const { id } = await params
  const poem = POEMS.find((p) => p.id === Number(id))
  if (!poem) {
    return <PoemDetail />
  }
  return <PoemDetail />
}
