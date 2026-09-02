import PROVERBS from '@/data/proverbs'
import ProverbDetail from './_detail'

// SEO: 每条谚语静态生成独立页面
export function generateStaticParams() {
  return PROVERBS.map((p) => ({ id: String(p.id) }))
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const item = PROVERBS.find((p) => p.id === Number(id))
  if (!item) {
    return { title: '谚语故事' }
  }
  const desc = `谚语「${item.proverb}」释义：${item.meaning}。${item.story.slice(0, 120)}… 免费注册，畅读谚语故事。`
  return {
    title: `${item.proverb} — 谚语故事`,
    description: desc,
    openGraph: {
      title: `${item.proverb} — 谚语故事`,
      description: desc,
      type: 'article',
      url: `https://www.gudaoforum.com/proverbs/${id}`,
    },
  }
}

export default function Page() {
  return <ProverbDetail />
}
