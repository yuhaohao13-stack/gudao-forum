import { BOOKS } from '@/data/english-books'

export async function generateMetadata({ params }) {
  const { id } = await params
  const book = BOOKS.find(b => b.id === Number(id))
  if (!book) return { title: '英语原著阅读 - 古道论坛' }
  const title = `${book.chineseTitle || book.title}（${book.title}）英文原著 - ${book.level === 'junior' ? '初中' : '高中'}阅读`
  const desc = `${book.chineseTitle || book.title}（${book.title}）英文原著在线阅读。${(book.chineseSummary || '').slice(0, 100)} 古道论坛免费英语学习。`
  return {
    title: { absolute: title },
    description: desc,
    alternates: { canonical: `https://www.gudaoforum.com/english/books/${id}` },
  }
}

export default function EnglishBookLayout({ children }) {
  return children
}
