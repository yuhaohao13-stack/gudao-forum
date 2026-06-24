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
  const [previews, setPreviews] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const fileRef = useRef(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    supabase.from('categories').select('*').order('sort_order').then(({ data }) => {
      let f = data || []
      const isAdmin = profile?.role === 'admin' || profile?.role === 'moderator'
      if (!isAdmin) f = f.filter(c => c.slug !== 'announcements')
      setCategories(f)
    })
  }, [profile])

  if (!user) return <div className="text-center py-12 paper-card fade-in"><div className="text-3xl mb-2">🔐</div><p className="text-[#8c8c8c] mb-3">请先登录再发帖</p><Link href="/login" className="btn-red inline-block">去登录</Link></div>

  const handleImages = (e) => {
    const files = Array.from(e.target.files || [])
    const valid = []; const errs = []
    for (const f of files) {
      const r = validateImage(f); r.valid ? valid.push(f) : errs.push(`${f.name}: ${r.error}`)
    }
    if (errs.length) { setError(errs.join('\n')); return }
    const total = images.length + valid.length
    if (total > IMAGE_CONFIG.maxCount) { setError(`最多 ${IMAGE_CONFIG.maxCount} 张`); return }
    setImages([...images, ...valid])
    setPreviews([...previews, ...valid.map(f => URL.createObjectURL(f))])
  }

  const removeImage = (i) => { URL.revokeObjectURL(previews[i]); setImages(images.filter((_, j) => j !== i)); setPreviews(previews.filter((_, j) => j !== i)) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!title.trim() || !content.trim() || !category) { setError('请填写完整'); return }
    setLoading(true)
    try {
      const urls = []
      for (const f of images) {
        const ext = f.name.split('.').pop()
        const path = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`
        const { error: ue } = await supabase.storage.from(IMAGE_CONFIG.bucket).upload(path, f)
        if (ue) throw new Error(`图片上传失败: ${ue.message}`)
        urls.push(supabase.storage.from(IMAGE_CONFIG.bucket).getPublicUrl(path).data.publicUrl)
      }
      const { data, error: err } = await supabase.from('threads').insert({
        title: title.trim(), content: content.trim(), category_id: category, author_id: user.id,
        images: urls.length ? urls : null,
      }).select('id').single()
      if (err) throw new Error(err.message)
      router.push(`/t/${data.id}`)
    } catch (err) { setError(err.message) }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto fade-in">
      <h1 className="text-2xl font-bold text-[#2c2c2c] mb-6">✏️ 发新帖</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="paper-card p-4 space-y-4">
          <div>
            <label className="block text-xs text-[#666] mb-1.5 font-medium">版块</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="ink-input">
              <option value="">选择版块</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#666] mb-1.5 font-medium">标题</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="ink-input" placeholder="写个标题" maxLength={200} />
          </div>
          <div>
            <label className="block text-xs text-[#666] mb-1.5 font-medium">内容</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={8} className="ink-input resize-none min-h-[150px]" placeholder="写下你想说的..." maxLength={10000} />
          </div>
          <div>
            <label className="block text-xs text-[#666] mb-1.5 font-medium">图片（可选）</label>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" multiple onChange={handleImages} className="hidden" />
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => fileRef.current?.click()} className="btn-ink text-xs">📷 选择图片</button>
              <span className="text-xs text-[#8c8c8c]">{images.length}/{IMAGE_CONFIG.maxCount}</span>
            </div>
            {previews.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-2">
                {previews.map((p, i) => (
                  <div key={i} className="relative group w-[45%] sm:w-[30%]">
                    <img src={p} alt={`图片 ${i + 1}`} className="w-full h-auto max-h-40 object-cover rounded-lg border border-[#e0d8c8]" />
                    <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 w-5 h-5 bg-[#c23531] rounded-full text-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {error && <div className="text-[#c23531] text-xs bg-[#c23531]/10 border border-[#c23531]/20 rounded-lg p-2.5">{error}</div>}
        <button type="submit" disabled={loading} className="btn-red w-full !py-2.5">{loading ? '发布中...' : '发布帖子'}</button>
      </form>
    </div>
  )
}
