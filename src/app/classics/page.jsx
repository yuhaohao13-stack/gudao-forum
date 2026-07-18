'use client'

import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'
import CLASSICS from '@/data/classics'

export default function ClassicsPage() {
  return (
    <div className="anim-fade-in max-w-3xl mx-auto">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '四大名著' },
      ]} className="mb-3" />

      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">📚</span>
        <h1 className="text-base font-bold text-[#1a1a1a]">四大名著</h1>
        <span className="text-[10px] text-[#b0a898] ml-auto">中国古典文学巅峰</span>
      </div>

      <p className="text-xs text-[#888] leading-relaxed mb-5">
        四大名著是中国古典文学的瑰宝，承载着千年的文化智慧与艺术成就。
        从英雄传奇到神魔幻想，从历史风云到世家兴衰，每一部都是一座不朽的文学丰碑。
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CLASSICS.map((book) => (
          <Link
            key={book.id}
            href={`/classics/${book.id}`}
            className="bg-white border border-[#ece8e0] rounded-lg px-4 py-4 hover:border-[#b45309]/40 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0 mt-0.5">{book.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-sm font-bold text-[#1a1a1a]">{book.title}</h2>
                  <span className="text-[10px] text-[#b0a898]">{book.author}</span>
                </div>
                <p className="text-[10px] text-[#888] leading-relaxed line-clamp-3 mb-2">
                  {book.desc}
                </p>
                <div className="flex items-center gap-2 text-[9px] text-[#b0a898]">
                  <BookOpen size={11} />
                  <span>{book.totalChapters} 回</span>
                  <span className="text-[#b45309] opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                    阅读 →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-[#ece8e0]">
        <p className="text-[9px] text-[#b0a898] text-center leading-relaxed">
          四大名著又称四大小说，是指《水浒传》《三国演义》《西游记》《红楼梦》四部中国古典章回体小说。
          它们是中华民族宝贵的文化遗产，在世界文学史上占有重要地位。
        </p>
      </div>
    </div>
  )
}
