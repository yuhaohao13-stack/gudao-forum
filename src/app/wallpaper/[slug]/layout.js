import CATEGORIES from '@/data/wallpapers'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const category = CATEGORIES.find(c => c.id === slug)
  if (!category) return { title: '古道论坛高清壁纸' }
  return {
    title: { absolute: `${category.name}壁纸 - 高清免费下载 | 古道论坛` },
    description: `${category.name}高清壁纸：${category.desc} 桌面1920×1080+手机1080×1920，免费下载。`,
    keywords: category.keywords || `${category.name}壁纸,高清壁纸,免费壁纸`,
    alternates: { canonical: `https://www.gudaoforum.com/wallpaper/${slug}` },
  }
}

export default function WallpaperCategoryLayout({ children }) {
  return children
}
