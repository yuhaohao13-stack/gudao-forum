'use client'

import PdfViewer from '@/components/PdfViewer'
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
