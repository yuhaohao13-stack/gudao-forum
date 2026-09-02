import IDIOMS from '@/data/idioms'
import { notFound } from 'next/navigation'
import IdiomDetail from './_detail'

// SEO: 每个成语静态生成独立页面
export function generateStaticParams() {
  return IDIOMS.map((p) => ({ id: String(p.id) }))
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const item = IDIOMS.find((p) => p.id === Number(id))
  if (!item) {
    return { title: '成语故事' }
  }
  const desc = `成语「${item.idiom}」释义：${item.meaning}。${item.story.slice(0, 120)}… 免费注册，畅读三百个成语故事。`
  return {
    title: `${item.idiom} — 成语故事`,
    description: desc,
    alternates: { canonical: `https://www.gudaoforum.com/idioms/${id}` },
    openGraph: {
      title: `${item.idiom} — 成语故事`,
      description: desc,
      type: 'article',
      url: `https://www.gudaoforum.com/idioms/${id}`,
    },
  }
}

export default async function Page({ params }) {
  const { id } = await params
  const item = IDIOMS.find((p) => p.id === Number(id))
  if (!item) notFound()
  return <IdiomDetail />
}
