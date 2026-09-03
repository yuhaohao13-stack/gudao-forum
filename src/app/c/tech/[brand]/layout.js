// 技术板块品牌页（/c/tech/Apple 等）服务端 metadata
// URL key → 展示名（与 page.jsx 的 BRAND_MAP 一致）
const BRAND_MAP = {
  'Apple': '苹果 Apple',
  'Samsung': '三星 Samsung',
  'Huawei': '华为 Huawei',
  'Xiaomi': '小米 Xiaomi',
  'Other Android': '其他安卓 Other',
  'PC': '电脑主板 PC',
  'General': '通用 General',
}

export async function generateMetadata({ params }) {
  const { brand } = await params
  if (!brand) return { title: '维修案例 - 古道论坛' }
  const key = decodeURIComponent(brand)
  const brandVal = BRAND_MAP[key] || key
  return {
    title: { absolute: `${brandVal} 维修案例 - 故障分类 | 古道论坛` },
    description: `古道论坛${brandVal}维修案例故障分类：屏幕、电池、主板、充电、进水等维修案例。手机电脑芯片级维修实战记录。`,
    alternates: { canonical: `https://www.gudaoforum.com/c/tech/${encodeURIComponent(key)}` },
  }
}

export default function BrandLayout({ children }) {
  return children
}
