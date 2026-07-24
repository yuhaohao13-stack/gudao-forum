'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, BookOpen, Download, ExternalLink, Loader2, FileText } from 'lucide-react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'

// 配置 PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

export default function PdfViewer({ pdfUrl, totalPages, bookTitle, bookColor = '#b45309' }) {
  const [pageNumber, setPageNumber] = useState(1)
  const [numPages, setNumPages] = useState(null)
  const [pageWidth, setPageWidth] = useState(500)
  const [loading, setLoading] = useState(true)
  const [showJump, setShowJump] = useState(false)
  const [jumpInput, setJumpInput] = useState('')
  const containerRef = useRef(null)
  const jumpRef = useRef(null)
  const listRef = useRef(null)

  // 响应式计算页面宽度
  useEffect(() => {
    const calcWidth = () => {
      if (containerRef.current) {
        const cw = containerRef.current.clientWidth
        // 书籍宽度：最宽480px，适应容器宽度-40px
        setPageWidth(Math.min(480, Math.max(300, cw - 40)))
      }
    }
    calcWidth()
    window.addEventListener('resize', calcWidth)
    return () => window.removeEventListener('resize', calcWidth)
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      if (jumpRef.current && !jumpRef.current.contains(e.target)) {
        setShowJump(false)
      }
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

  function onDocumentLoadSuccess({ numPages: np }) {
    setNumPages(np)
    setLoading(false)
  }

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
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#999] hover:underline inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-50"
          >
            <ExternalLink size={12} /> 新窗口
          </a>
          <a
            href={pdfUrl}
            download
            className="text-xs text-[#999] hover:underline inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-50"
          >
            <Download size={12} /> 下载
          </a>
        </div>
      </div>

      {/* 书籍页渲染区 */}
      <div
        ref={containerRef}
        className="bg-[#f0ede8] border border-[#e0dcd4] rounded-xl py-6 sm:py-10 flex justify-center items-start min-h-[400px]"
      >
        {loading && (
          <div className="flex flex-col items-center gap-3 py-20">
            <Loader2 size={32} className="animate-spin text-[#b45309]" />
            <span className="text-sm text-[#999]">加载中...</span>
          </div>
        )}

        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(err) => {
            console.error('PDF load error:', err)
            setLoading(false)
          }}
          loading={<div className="py-20 text-center text-sm text-[#999]">加载PDF中...</div>}
          className="flex justify-center"
        >
          <div
            className="bg-white shadow-[0_2px_12px_rgba(0,0,0,0.12)] rounded-sm overflow-hidden transition-all duration-200"
            style={{ width: pageWidth }}
          >
            <Page
              pageNumber={pageNumber}
              width={pageWidth}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="block"
              loading={
                <div className="flex items-center justify-center" style={{ height: pageWidth * 1.4 }}>
                  <Loader2 size={24} className="animate-spin text-[#ccc]" />
                </div>
              }
            />
          </div>
        </Document>
      </div>

      {/* 底部导航栏 */}
      <div className="bg-white border border-[#ece8e0] rounded-xl p-3 sm:p-4">
        <div className="flex items-center justify-center gap-1 sm:gap-3">
          {/* 上一页 */}
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
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={jumpInput}
                    onChange={(e) => setJumpInput(e.target.value)}
                    placeholder="输入页码回车"
                    className="w-full text-xs px-2 py-1.5 border border-[#ddd] rounded-lg focus:outline-none focus:border-[#b45309]"
                  />
                  <button type="submit" className="text-xs bg-[#b45309] text-white px-2 py-1.5 rounded-lg hover:bg-[#92400e] shrink-0">
                    跳
                  </button>
                </form>
                <div ref={listRef} className="overflow-y-auto" style={{ maxHeight: '320px' }}>
                  <div className="grid grid-cols-5 gap-0.5 p-2">
                    {visiblePages.map((p) => (
                      <button
                        key={p}
                        data-page={p}
                        onClick={() => goToPage(p)}
                        className={`text-xs py-1.5 rounded-lg transition-colors ${
                          p === pageNumber
                            ? 'bg-[#b45309] text-white font-bold'
                            : 'hover:bg-[#f5f5f5] text-[#666]'
                        }`}
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

          {/* 下一页 */}
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
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{ width: `${(pageNumber / totalPages) * 100}%`, backgroundColor: bookColor }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
