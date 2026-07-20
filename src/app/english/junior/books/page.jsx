'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, UserRound } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'
import GoldLock from '@/components/GoldLock'
import { useAuth } from '@/components/AuthProvider'
import { canViewGoldContent, MemberLockOverlay } from '@/lib/member'
import { JUNIOR_BOOKS } from '@/data/english-books'

export default function JuniorBooksPage() {
  const { user, profile } = useAuth()
  const check = canViewGoldContent(user, profile)

  useEffect(() => { document.title = '初中英文书籍 — 古道论坛';
    let m = document.querySelector('meta[name=description]');
    if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m); }
    m.content = '初中英文名著阅读，5本经典原著：鲁滨逊漂流记、爱丽丝梦游仙境、汤姆索亚历险记、金银岛、绿野仙踪。公版正版全文阅读。';
    let k = document.querySelector('meta[name=keywords]');
    if (!k) { k = document.createElement('meta'); k.name = 'keywords'; document.head.appendChild(k); }
    k.content = '初中英文书籍,英文名著阅读,鲁滨逊漂流记英文版,爱丽丝梦游仙境英文,汤姆索亚历险记英文,金银岛英文,绿野仙踪英文,青少年英语阅读' }, [])

  return (
    <div className="anim-fade-in max-w-3xl mx-auto pb-6">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '英语学习', href: '/english' },
        { label: '英文书籍（初中）' },
      ]} className="mb-3" />

      <Link href="/english" className="inline-flex items-center gap-1 text-[11px] text-[#b0a898] hover:text-[#b45309] transition-colors mb-3">
        <ChevronRight className="w-3 h-3 rotate-180" />
        返回英语学习
      </Link>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🌱</span>
        <h1 className="text-base font-bold text-[#1a1a1a]">初中英文书籍</h1>
        <span className="text-[10px] text-[#b0a898] ml-auto">{JUNIOR_BOOKS.length} 本</span>
      </div>

      <p className="text-[11px] text-[#666] mb-4 leading-relaxed bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
        📚 经典英文原著，含原文章节和中文注释，适合初中生阅读
      </p>

      {/* 未登录访客：显示注册引导（和诗歌页一样） */}
      {!user ? (
        <div className="bg-white border border-[#ece8e0] rounded-xl px-5 py-12 sm:px-8 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-3">
            <UserRound size={24} className="text-[#b45309]" />
          </div>
          <p className="text-sm text-[#888] mb-4">注册会员即可浏览初中英文书籍全部内容</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/register" className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-[#b45309] text-white hover:bg-[#92400e] transition-colors">
              免费注册
            </Link>
            <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg border border-[#b45309] text-[#b45309] hover:bg-amber-50 transition-colors">
              登录
            </Link>
          </div>
        </div>
      ) : /* 已登录未付费：显示升级提示 + GoldLock 预览 */
      !check.allowed ? (
        <>
          <div className="mb-3 px-3 py-3 rounded-lg bg-amber-50 border border-amber-200 text-center">
            <p className="text-xs text-[#92400e] font-medium mb-1">🔒 初中英文书籍仅限黄金/钻石会员浏览</p>
            <Link href="/members" className="text-[11px] text-[#b45309] hover:underline">
              查看会员权益 →
            </Link>
          </div>
          <GoldLock previewLines={3} className="space-y-4">
            {JUNIOR_BOOKS.map(book => (
              <div key={book.id} className="block group">
                <div className="bg-white border border-[#ece8e0] rounded-xl p-4 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-2xl shrink-0 border border-green-200">
                      {book.coverEmoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-[#1c1917]">
                        {book.title}<span className="text-[#999] font-normal">（{book.chineseTitle}）</span>
                      </h3>
                      <p className="text-[10px] text-[#b0a898]">{book.author} · {book.year} · {book.difficulty} · {book.wordCount}</p>
                      <p className="text-[10px] text-[#666] mt-1 line-clamp-2">{book.chineseSummary}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">初中</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">{book.chapters}章</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#ccc] shrink-0 mt-4" />
                  </div>
                </div>
              </div>
            ))}
          </GoldLock>
        </>
      ) : (
        /* 黄金/钻石会员：显示全部 */
        <div className="space-y-4">
          {JUNIOR_BOOKS.map(book => (
            <Link key={book.id} href={`/english/books/${book.id}`} className="block group">
              <div className="bg-white border border-[#ece8e0] rounded-xl p-4 shadow-sm hover:shadow-md hover:border-[#b45309]/30 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-2xl shrink-0 border border-green-200">
                    {book.coverEmoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-[#1c1917] group-hover:text-[#b45309] transition-colors">
                      {book.title}<span className="text-[#999] font-normal">（{book.chineseTitle}）</span>
                    </h3>
                    <p className="text-[10px] text-[#b0a898]">{book.author} · {book.year} · {book.difficulty} · {book.wordCount}</p>
                    <p className="text-[10px] text-[#666] mt-1 line-clamp-2">{book.chineseSummary}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">初中</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">{book.chapters}章</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#ccc] group-hover:text-[#b45309] group-hover:translate-x-0.5 transition-all shrink-0 mt-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="text-center mt-6">
        <Link href="/english" className="inline-flex items-center gap-1 text-[11px] text-[#b45309] hover:underline">← 返回英语学习</Link>
      </div>
    </div>
  )
}
