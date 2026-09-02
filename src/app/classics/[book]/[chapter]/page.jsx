import Link from 'next/link'
import { notFound } from 'next/navigation'
import CLASSICS from '@/data/classics'
import CLASSICS_SEO from '@/data/classics-seo'
import ReadMoreCta from '@/components/ReadMoreCta'
import ClassicsChapterFull from './_detail'

// SEO: 四大名著全部章回静态生成（440 页），每页独立标题 + 正文开头预览（方案C：公开开头、全文注册）
export function generateStaticParams() {
  const out = []
  for (const b of CLASSICS) {
    const seo = CLASSICS_SEO[b.id] || []
    for (const ch of seo) out.push({ book: b.id, chapter: String(ch.id) })
  }
  return out
}

function getSeo(bookId, chapterId) {
  const book = CLASSICS.find((b) => b.id === bookId)
  const chapters = CLASSICS_SEO[bookId] || []
  const chapter = chapters.find((c) => c.id === Number(chapterId))
  return { book, chapter }
}

export async function generateMetadata({ params }) {
  const { book: bookId, chapter: chapterId } = await params
  const { book, chapter } = getSeo(bookId, chapterId)
  if (!book || !chapter) {
    return { title: '四大名著' }
  }
  const preview = (chapter.preview || '').replace(/\s+/g, ' ').slice(0, 150)
  const desc = `${chapter.title}——选自《${book.title}》（${book.author}）。${preview}… 免费注册，畅读全部章节。`
  return {
    title: `${chapter.title} - 《${book.title}》`,
    description: desc,
    openGraph: {
      title: `${chapter.title} - 《${book.title}》`,
      description: desc,
      type: 'article',
      url: `https://www.gudaoforum.com/classics/${bookId}/${chapterId}`,
    },
  }
}

export default async function Page({ params }) {
  const { book: bookId, chapter: chapterId } = await params
  const { book, chapter } = getSeo(bookId, chapterId)

  if (!book || !chapter) {
    return (
      <div className="text-center py-20 anim-fade-in">
        <div className="mb-3"><span className="text-3xl">📕</span></div>
        <p className="text-[#999] text-sm">该章节不存在</p>
        <Link href="/classics" className="text-[11px] text-[#b45309] hover:underline mt-2 inline-block">返回四大名著</Link>
      </div>
    )
  }

  const paragraphs = (chapter.preview || '').split('\n').map((s) => s.trim()).filter(Boolean)

  return (
    <div className="anim-fade-in max-w-3xl mx-auto pb-12">
      <nav className="text-[11px] text-[#b0a898] mb-3 flex items-center gap-1 flex-wrap">
        <Link href="/" className="hover:text-[#b45309]">首页</Link>
        <span>/</span>
        <Link href="/classics" className="hover:text-[#b45309]">四大名著</Link>
        <span>/</span>
        <Link href={`/classics/${book.id}`} className="hover:text-[#b45309]">{book.title}</Link>
        <span>/</span>
        <span className="text-[#666]">{chapter.title}</span>
      </nav>

      <div className="mb-4">
        <Link href={`/classics/${book.id}`} className="inline-flex items-center gap-1 text-[10px] text-[#b45309]/60 hover:text-[#b45309] transition-colors mb-2">
          <span>←</span>返回目录
        </Link>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{book.icon}</span>
          <h1 className="text-sm font-bold text-[#1a1a1a] leading-tight">{chapter.title}</h1>
        </div>
        <p className="text-[10px] text-[#b0a898]">《{book.title}》 · {book.author} · 第 {chapter.id} 回 · 全文 {book.totalChapters} 回</p>
      </div>

      {/* SEO 公开预览：正文开头，爬虫可直接索引 */}
      <div className="bg-white border border-[#ece8e0] rounded-lg px-4 py-5 sm:px-6 sm:py-6">
        <div className="leading-7 sm:leading-8 text-[13px] sm:text-[14px] text-[#2a2a2a] space-y-3"
          style={{ fontFamily: "'Noto Serif SC', 'Source Han Serif SC', 'SimSun', 'STSong', serif" }}>
          {paragraphs.map((p, idx) => (
            <p key={idx} className="text-justify indent-8">{p}</p>
          ))}
          <p className="text-justify indent-8 text-[#b45309]/70">……（本章全文共 8 千余字，注册会员即可畅读全部章节）</p>
        </div>
      </div>

      <ReadMoreCta />

      <div className="mt-4 text-center">
        <Link href={`/classics/${book.id}`} className="inline-flex items-center gap-1 text-[10px] text-[#b45309]/60 hover:text-[#b45309] transition-colors">
          <span className="text-[11px]">📖</span>返回《{book.title}》目录
        </Link>
      </div>

      {/* 已登录会员：全文阅读（客户端加载正文） */}
      <ClassicsChapterFull />
    </div>
  )
}
