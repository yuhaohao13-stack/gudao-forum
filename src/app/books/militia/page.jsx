'use client'

import dynamic from 'next/dynamic'

const PdfViewer = dynamic(() => import('@/components/PdfViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="text-sm text-[#999] animate-pulse">加载阅读器中...</div>
    </div>
  ),
})

import { militiaHandbook } from '@/data/books'

export default function MilitiaPage() {
  const book = militiaHandbook
  return (
    <div>
      <PdfViewer
        pdfUrl={book.pdfUrl}
        totalPages={book.totalPages}
        bookTitle={book.title}
        bookColor="#555"
      />
    </div>
  )
}
