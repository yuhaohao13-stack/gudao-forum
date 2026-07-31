'use client'
import { useEffect } from 'react'

/**
 * 通用SEO组件 — 给'use client'页面设置独立title+description+keywords
 * 用法：<Seo title="页面标题" description="页面描述" keywords="可选关键词" />
 */
export default function Seo({ title, description, keywords }) {
  useEffect(() => {
    // 设置标题
    if (title) {
      document.title = title
    }
    // 设置描述
    if (description) {
      let meta = document.querySelector('meta[name="description"]')
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'description'
        document.head.appendChild(meta)
      }
      meta.content = description
    }
    // 设置关键词
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
