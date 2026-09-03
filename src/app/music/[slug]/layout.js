import musicData from '@/data/music'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const category = musicData.find(c => c.id === slug)
  if (!category) return { title: '古道论坛音乐频道' }
  const name = (category.name || '').replace(/^[^\u4e00-\u9fa5A-Za-z0-9]+/, '').trim()
  return {
    title: { absolute: `${name} - 免费在线听歌 | 古道论坛音乐` },
    description: `${category.name}：${category.description || category.subtitle || ''} 古道论坛免费在线听歌。`,
    alternates: { canonical: `https://www.gudaoforum.com/music/${slug}` },
  }
}

export default function MusicCategoryLayout({ children }) {
  return children
}
