'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Pencil, Image, X } from 'lucide-react'
import { validateImage, checkContent, validateInput, IMAGE_CONFIG } from '@/lib/moderation'

export default function NewThreadPage() {
  const { user, profile } = useAuth()
  const [categories, setCategories] = useState([]); const [title, setTitle] = useState('')
  const [content, setContent] = useState(''); const [category, setCategory] = useState('')
  const [images, setImages] = useState([]); const [previews, setPreviews] = useState([])
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  const fileRef = useRef(null)
  const supabase = createClient(); const router = useRouter()

  useEffect(() => {
    supabase.from('categories').select('*').order('sort_order').then(({ data }) => {
      let f = data || []; const isAdmin = profile?.role === 'admin' || profile?.role === 'moderator'
      if (!isAdmin) f = f.filter(c => c.slug !== 'announcements')
      setCategories(f)
    })
  }, [profile])

  if (!user) return <div className="border border-dashed border-[#eee] rounded-xl p-10 text-center anim-fade-in"><p className="text-[#aaa] mb-3">请先登录再发帖</p><Link href="/login" className="btn-primary">去登录</Link></div>

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []); const valid = []; const errs = []
    for (const f of files) { const r = validateImage(f); r.valid ? valid.push(f) : errs.push(`${f.name}: ${r.error}`) }
    if (errs.length) { setError(errs.join('\n')); return }
    if (images.length + valid.length > IMAGE_CONFIG.maxCount) { setError(`最多 ${IMAGE_CONFIG.maxCount} 张`); return }
    setImages([...images, ...valid]); setPreviews([...previews, ...valid.map(f => URL.createObjectURL(f))])
  }

  const removeImage = (i) => { URL.revokeObjectURL(previews[i]); setImages(images.filter((_, j) => j !== i)); setPreviews(previews.filter((_, j) => j !== i)) }

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('')
    if (!title.trim() || !content.trim() || !category) { setError('请填写完整'); return }
    const titleCheck = checkContent(title, true)
    if (!titleCheck.pass) { setError('标题包含不当内容'); return }
    const contentCheck = checkContent(content)
    if (!contentCheck.pass) { setError('内容包含不当言论'); return }
    const inputValid = validateInput(content)
    if (!inputValid.valid) { setError(inputValid.error); return }
    setLoading(true)
    try {
      const urls = []
      for (const f of images) {
        const ext = f.name.split('.').pop(); const path = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`
        const { error: ue } = await supabase.storage.from(IMAGE_CONFIG.bucket).upload(path, f)
        if (ue) throw new Error(`图片上传失败: ${ue.message}`)
        urls.push(supabase.storage.from(IMAGE_CONFIG.bucket).getPublicUrl(path).data.publicUrl)
      }
      const { data, error: err } = await supabase.from('threads').insert({
        title: title.trim(), content: content.trim(), category_id: category, author_id: user.id, images: urls.length ? urls : null,
      }).select('id').single()
      if (err) throw new Error(err.message)
      router.push(`/t/${data.id}`)
    } catch (err) { setError(err.message) }
    setLoading(false)
  }

  return (
    <div className="w-full sm:max-w-2xl sm:mx-auto anim-fade-in">
      <h1 className="text-xl font-bold text-[#1a1a1a] mb-6"><Pencil size={20} className="inline-block align-text-bottom" /> 发新帖</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="border border-[#f0f0f0] rounded-xl p-5 sm:p-6 space-y-5">
          <div>
            <label className="block text-xs text-[#aaa] mb-1.5 font-medium">版块</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="input">
              <option value="">选择版块</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#aaa] mb-1.5 font-medium">标题</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="input" placeholder="写个标题" maxLength={200} />
          </div>
          <div>
            <label className="block text-xs text-[#aaa] mb-1.5 font-medium">内容</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={8} className="input resize-none min-h-[160px]" placeholder="写下你想说的..." maxLength={10000} />
          </div>
          <div>
            <label className="block text-xs text-[#aaa] mb-1.5 font-medium">图片（可选）</label>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" multiple onChange={handleImages} className="hidden" />
            <button type="button" onClick={() => fileRef.current?.click()} className="btn-ghost border border-[#f0f0f0] text-xs rounded-md"><Image size={14} className="inline-block align-text-bottom" /> 选择图片</button>
            {previews.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-2">
                {previews.map((p, i) => (
                  <div key={i} className="relative group w-[45%] sm:w-[30%]">
                    <img src={p} alt="" className="w-full h-auto max-h-40 object-cover rounded-xl border border-[#f0f0f0]" />
                    <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 w-5 h-5 bg-[#1a1a1a] rounded-full text-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X size={10} /></button>
                  </div>
                ))}
              </div>
            )}
            <span className="text-xs text-[#ccc] ml-2">{images.length}/{IMAGE_CONFIG.maxCount} · 每张 ≤5MB</span>
          </div>
        </div>
        {error && <div className="text-xs text-[#c23531] bg-[#fef2f0] border border-[#fde0dc] rounded-lg p-3">{error}</div>}
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center !py-2.5 text-sm">{loading ? '发布中...' : '发布帖子'}</button>
      </form>
    </div>
  )
}
