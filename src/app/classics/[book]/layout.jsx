import CLASSICS from '@/data/classics'

// 书主页（/classics/[book]）动态 metadata + 独立 canonical
// 修复：原来继承 /classics 全局 canonical → Google 判为备用页不收录
export async function generateMetadata({ params }) {
  const { book: bookId } = await params
  const book = CLASSICS.find((b) => b.id === bookId)
  if (!book) {
    return { title: '四大名著 — 古道论坛' }
  }
  const canonical = `https://www.gudaoforum.com/classics/${bookId}`
  const desc = `《${book.title}》（${book.author}）全文阅读，共 ${book.totalChapters} 回。${book.desc} 免费注册，畅读四大名著全部章节。`
  return {
    title: `${book.title}全文阅读 - 四大名著 — 古道论坛`,
    description: desc,
    alternates: { canonical },
    openGraph: {
      title: `${book.title}全文阅读 - 四大名著`,
      description: desc,
      type: 'book',
      url: canonical,
    },
  }
}

export default function Layout({ children }) {
  return children
}
