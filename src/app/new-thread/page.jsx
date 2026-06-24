'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { validateImage, IMAGE_CONFIG } from '@/lib/moderation'

export default function NewThreadPage() {
  const { user, profile } = useAuth()
  const [categories, setCategories] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchCategories = async () => {
      const { data: cats } = await supabase.from('categories').select('*').order('sort_order')
      let filtered = cats || []
      const isAdmin = profile?.role === 'admin' || profile?.role === 'moderator'
      if (!isAdmin) filtered = filtered.filter(c => c.slug !== 'announcements')
      setCategories(filtered)
    }
    fetchCategories()
  }, [profile])

  if (!user) {
    return (
      <div className="text-center py-12 glass-card fade-in">
        <div className="text-3xl mb-2">🔐</div>
        <p className="text-slate-400 mb-3">请先登录再发帖</p>
        <Link href="/login" className="btn-amber inline-block">去登录</Link>
      </div>
    )
  }

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || [])
    const validFiles = []; const errors = []
    for (const file of files) {
      const result = validateImage(file)
      result.valid ? validFiles.push(file) : errors.push(`${file.name}: ${result.error}`)
    }
    if (errors.length > 0) { setError(errors.join('\n')); return }
    const total = images.length + validFiles.length
    if (total > IMAGE_CONFIG.maxCount) { setError(`最多上传 ${IMAGE_CONFIG.maxCount} 张图片`); return }
    setImages([...images, ...validFiles])
    setImagePreviews([...imagePreviews, ...validFiles.map(f => URL.createObjectURL(f))])
  }

  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index])
    setImages(images.filter((_, i) => i !== index))
    setImagePreviews(imagePreviews.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!title.trim() || !content.trim() || !category) { setError('请填写完整信息'); return }
    setLoading(true)
    try {
      const imageUrls = []
      for (const file of images) {
        const ext = file.name.split('.').pop()
        const filePath = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`
        const { error: uploadError } = await supabase.storage.from(IMAGE_CONFIG.bucket).upload(filePath, file)
        if (uploadError) throw new Error(`图片上传失败: ${uploadError.message}`)
        const { data: { publicUrl } } = supabase.storage.from(IMAGE_CONFIG.bucket).getPublicUrl(filePath)
        imageUrls.push(publicUrl)
      }
      const { data, error: err } = await supabase.from('threads').insert({
        title: title.trim(), content: content.trim(), category_id: category, author_id: user.id,
        images: imageUrls.length > 0 ? imageUrls : null,
      }).select('id').single()
      if (err) throw new Error(err.message)
      router.push(`/t/${data.id}`)
    } catch (err) { setError(err.message) }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto fade-in">
      <h1 className="text-2xl font-bold text-gradient mb-6">✏️ 发新帖</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="glass-card p-4 space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">版块</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="input-field">
              <option value="">选择版块</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">标题</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              className="input-field" placeholder="写个吸引人的标题" maxLength={200} />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">内容</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)}
              rows={8} className="input-field resize-none min-h-[150px]"
              placeholder="写下你想说的..." maxLength={10000} />
          </div>

          {/* 图片 */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">图片（可选）</label>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp"
              multiple onChange={handleImageSelect} className="hidden" />
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg px-3 py-2 text-xs transition-all">
                📷 选择图片
              </button>
              <span className="text-xs text-slate-500">{images.length}/{IMAGE_CONFIG.maxCount}</span>
              <span className="text-xs text-slate-600 ml-auto">友善发言</span>
            </div>
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-2">
                {imagePreviews.map((preview, i) => (
                  <div key={i} className="relative group w-[45%] sm:w-[30%]">
                    <img src={preview} alt={`图片 ${i + 1}`}
                      className="w-full h-auto max-h-40 object-cover rounded-lg border border-slate-700/50" />
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-600/80 rounded-full text-xs flex items-center justify-center
                                 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-500">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="text-red-400 text-xs bg-red-900/20 border border-red-800/30 rounded-lg p-2.5">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading}
          className="btn-amber w-full flex items-center justify-center gap-2 !py-2.5"
        >
          {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {loading ? '发布中...' : '发布帖子'}
        </button>
      </form>
    </div>
  )
}
