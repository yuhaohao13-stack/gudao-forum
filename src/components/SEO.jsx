'use client'

import { useEffect } from 'react'

export default function SEO({ title, description, keywords }) {
  useEffect(() => {
    // 设置标题
    document.title = title 
      ? `${title} — 古道论坛 | 国际中文社区`
      : '古道论坛 | 国际中文社区 · 以文会友 · 在线聊天'

    // 设置 meta description
    if (description) {
      let meta = document.querySelector('meta[name="description"]')
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'description'
        document.head.appendChild(meta)
      }
      meta.content = description
    }

    // 设置 meta keywords
    if (keywords) {
      let meta = document.querySelector('meta[name="keywords"]')
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'keywords'
        document.head.appendChild(meta)
      }
      meta.content = keywords
    }
  }, [title, description, keywords])

  return null
}
