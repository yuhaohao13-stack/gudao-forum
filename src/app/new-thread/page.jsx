'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewThreadPage() {
  const { user } = useAuth()
  const [categories, setCategories] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    supabase.from('categories').select('*').order('sort_order')
      .then(({ data }) => setCategories(data || []))
  }, [])

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 mb-4">请先登录再发帖</p>
        <Link href="/login" className="text-blue-400 hover:underline">去登录</Link>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !category) {
      setError('请填写完整信息')
      return
    }
    setLoading(true)
    setError('')

    const { data, error: err } = await supabase.from('threads').insert({
      title: title.trim(),
      content: content.trim(),
      category_id: category,
      author_id: user.id,
    }).select('id').single()

    if (err) {
      setError(err.message)
    } else {
      router.push(`/t/${data.id}`)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">✏️ 发新帖</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-300 mb-1">版块</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="">选择版块</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">标题</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="写个吸引人的标题"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">内容</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
            placeholder="写下你想说的..."
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          {loading ? '发布中...' : '发布帖子'}
        </button>
      </form>
    </div>
  )
}
