'use client'

import PdfViewer from '@/components/PdfViewer'
import { militiaHandbook } from '@/data/books'

export default function MilitiaPage() {
  return (
    <PdfViewer
      bookId="militia"
      totalPages={militiaHandbook.totalPages}
      bookTitle={militiaHandbook.title}
      bookColor="#555"
    />
  )
}
