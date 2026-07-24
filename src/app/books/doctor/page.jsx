'use client'

import PdfViewer from '@/components/PdfViewer'
import { doctorHandbook } from '@/data/books'

export default function DoctorPage() {
  return (
    <PdfViewer
      bookId="doctor"
      totalPages={doctorHandbook.totalPages}
      bookTitle={doctorHandbook.title}
      bookColor="#16a34a"
    />
  )
}
