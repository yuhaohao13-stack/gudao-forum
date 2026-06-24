'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { checkContent, validateImage, IMAGE_CONFIG } from '@/lib/moderation'

export default function NewThreadPage() {
  const { user } = useAuth()
  const [categories, setCategories] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [images, setImages] = useState([]) // File[]
  const [imagePreviews, setImagePreviews] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)
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
        <Link href="/login" className="text-amber-400 hover:underline">去登录</Link>
      </div>
    )
  }

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || [])
    const validFiles = []
    const errors = []

    for (const file of files) {
      const result = validateImage(file)
      if (result.valid) {
        validFiles.push(file)
      } else {
        errors.push(`${file.name}: ${result.error}`)
      }
    }

    if (errors.length > 0) {
      setError(errors.join('\n'))
      return
    }

    const total = images.length + validFiles.length
    if (total > IMAGE_CONFIG.maxCount) {
      setError(`最多上传 ${IMAGE_CONFIG.maxCount} 张图片`)
      return
    }

    setImages([...images, ...validFiles])

    // 生成预览
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file))
    setImagePreviews([...imagePreviews, ...newPreviews])
  }

  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index])
    setImages(images.filter((_, i) => i !== index))
    setImagePreviews(imagePreviews.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!title.trim() || !content.trim() || !category) {
      setError('请填写完整信息')
      return
    }

    // 内容审查
    const titleCheck = checkContent(title, true)
    if (!titleCheck.pass) {
      setError(`标题包含不良内容：「${titleCheck.word}」`)
      return
    }

    const contentCheck = checkContent(content)
    if (!contentCheck.pass) {
      setError(`内容包含不良内容：「${contentCheck.word}」`)
      return
    }

    setLoading(true)

    try {
      // 上传图片
      const imageUrls = []
      for (const file of images) {
        const ext = file.name.split('.').pop()
        const filePath = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from(IMAGE_CONFIG.bucket)
          .upload(filePath, file)

        if (uploadError) throw new Error(`图片上传失败: ${uploadError.message}`)

        const { data: { publicUrl } } = supabase.storage
          .from(IMAGE_CONFIG.bucket)
          .getPublicUrl(filePath)

        imageUrls.push(publicUrl)
      }

      // 发布帖子
      const { data, error: err } = await supabase.from('threads').insert({
        title: title.trim(),
        content: content.trim(),
        category_id: category,
        author_id: user.id,
        images: imageUrls.length > 0 ? imageUrls : null,
      }).select('id').single()

      if (err) throw new Error(err.message)
      router.push(`/t/${data.id}`)

    } catch (err) {
      setError(err.message)
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
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
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
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition-colors"
            placeholder="写个吸引人的标题"
            maxLength={200}
          />
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">内容</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-amber-500 transition-colors resize-none"
            placeholder="写下你想说的..."
            maxLength={10000}
          />
        </div>

        {/* 图片上传 */}
        <div>
          <label className="block text-sm text-slate-300 mb-1">
            图片（可选，最多 3 张，每张不超过 5MB）
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            multiple
            onChange={handleImageSelect}
            className="hidden"
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg px-3 py-2 text-sm transition-colors"
            >
              📷 选择图片
            </button>
            <span className="text-xs text-slate-400">{images.length}/{IMAGE_CONFIG.maxCount}</span>
          </div>
          {imagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-2">
              {imagePreviews.map((preview, i) => (
                <div key={i} className="relative group w-[45%] sm:w-[30%]">
                  <img
                    src={preview}
                    alt={`图片 ${i + 1}`}
                    className="w-full h-auto max-h-60 object-cover rounded-lg border border-slate-700"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full text-xs flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity shadow-lg"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="text-red-400 text-sm bg-red-900/30 border border-red-800 rounded-lg p-3 whitespace-pre-wrap">
            {error}
          </div>
        )}

        <div className="text-xs text-slate-500">
          🚫 禁止发布色情、暴力、种族歧视、侮辱性言论
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          {loading ? '发布中...' : '发布帖子'}
        </button>
      </form>
    </div>
  )
}
