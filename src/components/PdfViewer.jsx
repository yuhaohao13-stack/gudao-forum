'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, BookOpen, Download, ExternalLink, Maximize2, Minus, Plus, Search } from 'lucide-react'

export default function PdfViewer({ pdfUrl, totalPages, bookTitle, bookColor = '#b45309' }) {
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [showJump, setShowJump] = useState(false)
  const [jumpInput, setJumpInput] = useState('')
  const jumpRef = useRef(null)
  const listRef = useRef(null)

  // Close jump list when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (jumpRef.current && !jumpRef.current.contains(e.target)) {
        setShowJump(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Scroll to current page in jump list
  useEffect(() => {
    if (showJump && listRef.current) {
      const item = listRef.current.querySelector(`[data-page="${pageNumber}"]`)
      if (item) {
        item.scrollIntoView({ block: 'center', behavior: 'auto' })
      }
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
    if (p >= 1 && p <= totalPages) {
      goToPage(p)
    }
    setJumpInput('')
  }

  // Generate page list for quick jump (all pages)
  const pageList = Array.from({ length: totalPages }, (_, i) => i + 1)

  // Calculate visible range in the scrollable list around current page
  const visiblePages = pageList

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

      {/* PDF 渲染区域 */}
      <div className="bg-[#f5f5f5] border border-[#ece8e0] rounded-xl overflow-hidden">
        <div className="w-full overflow-auto flex justify-center bg-[#555] min-h-[400px] max-h-[75vh]">
          <iframe
            src={`${pdfUrl}#page=${pageNumber}&zoom=${scale * 100}`}
            className="border-0 bg-white"
            style={{ width: '100%', height: '75vh' }}
            title={`${bookTitle} - 第${pageNumber}页`}
          />
        </div>
      </div>

      {/* 底部导航栏 */}
      <div className="bg-white border border-[#ece8e0] rounded-xl p-3">
        <div className="flex items-center justify-center gap-1 sm:gap-3">
          {/* 上一页 */}
          <button
            onClick={() => goToPage(pageNumber - 1)}
            disabled={pageNumber <= 1}
            className="btn-secondary text-xs disabled:opacity-30 disabled:cursor-not-allowed px-2 sm:px-3 py-1.5 inline-flex items-center gap-1"
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
              <span>{pageNumber}</span>
              <span className="text-[#999] font-normal text-xs">/ {totalPages}</span>
              <ChevronRight size={12} className={`transition-transform ${showJump ? 'rotate-90' : ''}`} />
            </button>

            {/* 跳转下拉框 */}
            {showJump && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white border border-[#ddd] rounded-xl shadow-lg overflow-hidden z-50" style={{ width: '240px' }}>
                {/* 输入框 */}
                <form onSubmit={handleJumpSubmit} className="p-2 border-b border-[#eee]">
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={1}
                      max={totalPages}
                      value={jumpInput}
                      onChange={(e) => setJumpInput(e.target.value)}
                      placeholder="输入页码回车跳转..."
                      className="w-full text-xs px-2 py-1.5 border border-[#ddd] rounded-lg focus:outline-none focus:border-[#b45309]"
                    />
                    <button type="submit" className="text-xs bg-[#b45309] text-white px-2 py-1.5 rounded-lg hover:bg-[#92400e]">
                      跳
                    </button>
                  </div>
                </form>

                {/* 页码列表 - 滑动选择，限高10个 */}
                <div
                  ref={listRef}
                  className="overflow-y-auto"
                  style={{ maxHeight: '320px' }}
                >
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

                {/* 页数提示 */}
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
            className="btn-secondary text-xs disabled:opacity-30 disabled:cursor-not-allowed px-2 sm:px-3 py-1.5 inline-flex items-center gap-1"
          >
            <span className="hidden sm:inline">下一页</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* 当前页进度条 */}
        <div className="mt-2 px-2">
          <div className="w-full bg-[#f0f0f0] rounded-full h-1 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-150"
              style={{ width: `${(pageNumber / totalPages) * 100}%`, backgroundColor: bookColor }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
