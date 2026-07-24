'use client'

import PdfViewer from '@/components/PdfViewer'
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
