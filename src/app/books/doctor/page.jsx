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

import { doctorHandbook } from '@/data/books'

export default function DoctorPage() {
  const book = doctorHandbook
  return (
    <div>
      <PdfViewer
        pdfUrl={book.pdfUrl}
        totalPages={book.totalPages}
        bookTitle={book.title}
        bookColor="#16a34a"
      />
    </div>
  )
}
