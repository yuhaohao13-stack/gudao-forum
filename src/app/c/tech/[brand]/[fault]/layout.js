// 技术板块品牌+故障页（/c/tech/Apple/不开机-死机 等）服务端 metadata
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
  const { brand, fault } = await params
  if (!brand || !fault) return { title: '维修案例 - 古道论坛' }
  const brandKey = decodeURIComponent(brand)
  const brandVal = BRAND_MAP[brandKey] || brandKey
  const faultName = decodeURIComponent(fault)
  return {
    title: { absolute: `${brandVal} ${faultName} 维修案例 | 古道论坛` },
    description: `古道论坛${brandVal}${faultName}维修案例：真实维修过程与解决方案。手机电脑芯片级维修实战记录。`,
    alternates: { canonical: `https://www.gudaoforum.com/c/tech/${encodeURIComponent(brandKey)}/${encodeURIComponent(faultName)}` },
  }
}

export default function FaultLayout({ children }) {
  return children
}
