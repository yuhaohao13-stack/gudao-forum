'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, BookOpen, Download, ExternalLink, FileText } from 'lucide-react'

export default function PdfViewer({ pdfUrl, totalPages, bookTitle, bookColor = '#b45309' }) {
  const [pageNumber, setPageNumber] = useState(1)
  const [showJump, setShowJump] = useState(false)
  const [jumpInput, setJumpInput] = useState('')
  const jumpRef = useRef(null)
  const listRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (jumpRef.current && !jumpRef.current.contains(e.target)) setShowJump(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (showJump && listRef.current) {
      const item = listRef.current.querySelector(`[data-page="${pageNumber}"]`)
      if (item) item.scrollIntoView({ block: 'center', behavior: 'auto' })
    }
  }, [showJump, pageNumber])

  const goToPage = useCallback((p) => {
    const page = Math.max(1, Math.min(totalPages, p))
    setPageNumber(page)
    setShowJump(false)
  }, [totalPages])

  const handleJumpSubmit = (e) => {
    e.preventDefault()
    const p = parseInt(jumpInput)
    if (p >= 1 && p <= totalPages) goToPage(p)
    setJumpInput('')
  }

  const pdfEmbedUrl = `${pdfUrl}#page=${pageNumber}&toolbar=0&navpanes=0&scrollbar=0`

  const visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="space-y-3">
      {/* 顶部信息栏 */}
      <div className="bg-white border border-[#ece8e0] rounded-xl p-3 sm:p-4 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <BookOpen size={18} style={{ color: bookColor }} />
          <div>
            <h1 className="text-sm sm:text-base font-bold text-[#1a1a1a]">{bookTitle}</h1>
            <p className="text-[11px] text-[#999]">共 {totalPages} 页</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#999] hover:underline inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-50">
            <ExternalLink size={12} /> 新窗口
          </a>
          <a href={pdfUrl} download className="text-xs text-[#999] hover:underline inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-50">
            <Download size={12} /> 下载
          </a>
        </div>
      </div>

      {/* 书籍页渲染区 — 原生PDF嵌入 + 书本样式 */}
      <div className="bg-[#e8e4dc] border border-[#ddd8ce] rounded-xl py-4 sm:py-8 px-2 sm:px-8 flex justify-center">
        <div className="w-full max-w-[500px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] rounded-sm overflow-hidden">
          <object
            data={pdfEmbedUrl}
            type="application/pdf"
            className="w-full border-0"
            style={{ height: '75vh', minHeight: '400px' }}
          >
            <div className="flex flex-col items-center justify-center py-20 text-sm text-[#999]">
              <p>⚠️ 您的浏览器不支持直接预览PDF</p>
              <a href={pdfUrl} download className="mt-2 text-[#b45309] hover:underline">请点击下载后查看</a>
            </div>
          </object>
        </div>
      </div>

      {/* 底部导航栏 */}
      <div className="bg-white border border-[#ece8e0] rounded-xl p-3 sm:p-4">
        <div className="flex items-center justify-center gap-1 sm:gap-3">
          <button
            onClick={() => goToPage(pageNumber - 1)}
            disabled={pageNumber <= 1}
            className="btn-secondary text-xs disabled:opacity-30 disabled:cursor-not-allowed px-2 sm:px-4 py-1.5 inline-flex items-center gap-1"
          >
            <ChevronLeft size={14} />
            <span className="hidden sm:inline">上一页</span>
          </button>

          {/* 快速跳转 */}
          <div className="relative" ref={jumpRef}>
            <button
              onClick={() => setShowJump(!showJump)}
              className="bg-[#f5f5f5] hover:bg-[#eee] border border-[#ddd] rounded-lg px-3 sm:px-4 py-1.5 text-sm font-semibold text-[#1a1a1a] inline-flex items-center gap-1.5 transition-colors"
            >
              <FileText size={14} className="text-[#999]" />
              <span>{pageNumber}</span>
              <span className="text-[#999] font-normal text-xs">/ {totalPages}</span>
            </button>

            {showJump && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white border border-[#ddd] rounded-xl shadow-lg overflow-hidden z-50" style={{ width: '250px' }}>
                <form onSubmit={handleJumpSubmit} className="p-2 border-b border-[#eee] flex gap-1">
                  <input type="number" min={1} max={totalPages} value={jumpInput}
                    onChange={(e) => setJumpInput(e.target.value)}
                    placeholder="输入页码回车"
                    className="w-full text-xs px-2 py-1.5 border border-[#ddd] rounded-lg focus:outline-none focus:border-[#b45309]"
                  />
                  <button type="submit" className="text-xs bg-[#b45309] text-white px-2 py-1.5 rounded-lg hover:bg-[#92400e] shrink-0">跳</button>
                </form>
                <div ref={listRef} className="overflow-y-auto" style={{ maxHeight: '320px' }}>
                  <div className="grid grid-cols-5 gap-0.5 p-2">
                    {visiblePages.map((p) => (
                      <button key={p} data-page={p}
                        onClick={() => goToPage(p)}
                        className={`text-xs py-1.5 rounded-lg transition-colors ${p === pageNumber ? 'bg-[#b45309] text-white font-bold' : 'hover:bg-[#f5f5f5] text-[#666]'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="px-2 py-1.5 bg-[#fafafa] border-t border-[#eee] text-[10px] text-[#999] text-center">
                  共 {totalPages} 页 · 当前第 {pageNumber} 页
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => goToPage(pageNumber + 1)}
            disabled={pageNumber >= totalPages}
            className="btn-secondary text-xs disabled:opacity-30 disabled:cursor-not-allowed px-2 sm:px-4 py-1.5 inline-flex items-center gap-1"
          >
            <span className="hidden sm:inline">下一页</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* 进度条 */}
        <div className="mt-3 px-2">
          <div className="w-full bg-[#f0f0f0] rounded-full h-1.5 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-200"
              style={{ width: `${(pageNumber / totalPages) * 100}%`, backgroundColor: bookColor }} />
          </div>
        </div>
      </div>
    </div>
  )
}
