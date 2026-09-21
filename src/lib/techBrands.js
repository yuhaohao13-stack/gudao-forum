// 维修案例（tech 版块）品牌分类 —— 与 Crazy维修 站的品牌分类对齐
// key = URL 用；brand = 数据库 brand 字段的值；name/desc = 展示
export const TECH_BRANDS = [
  { key: 'Apple', brand: '苹果 Apple', name: '苹果', desc: 'iPhone / iPad / MacBook' },
  { key: 'Samsung', brand: '三星 Samsung', name: '三星', desc: 'Galaxy 手机 / 平板' },
  { key: 'Huawei', brand: '华为 Huawei', name: '华为', desc: 'Mate / P / nova 系列' },
  { key: 'Xiaomi', brand: '小米 Xiaomi', name: '小米', desc: '小米 / 红米 / Poco' },
  { key: 'OPPO', brand: 'OPPO', name: 'OPPO', desc: 'Find / Reno / A 系列' },
  { key: 'vivo', brand: 'vivo', name: 'vivo', desc: 'X / iQOO / Y 系列' },
  { key: 'OnePlus', brand: '一加 OnePlus', name: '一加', desc: 'OnePlus / Nord / Ace' },
  { key: 'Honor', brand: '荣耀 Honor', name: '荣耀', desc: 'Magic / 数字 / X 系列' },
  { key: 'Motorola', brand: '摩托罗拉 Motorola', name: '摩托罗拉', desc: 'Edge / Razr / Moto' },
  { key: 'RedMagic', brand: '红魔 RedMagic', name: '红魔', desc: '努比亚红魔游戏手机' },
  { key: 'Sharp', brand: 'Sharp', name: '夏普', desc: 'AQUOS 日系手机' },
  { key: 'ASUS', brand: '华硕 ASUS', name: '华硕', desc: 'ROG / Zenfone' },
  { key: 'Other Android', brand: '其他安卓 Other', name: '其他安卓', desc: 'Realme / Nothing / 其他' },
  { key: 'PC', brand: '电脑主板 PC', name: '电脑主板', desc: '联想 / 戴尔 / 惠普 / 华硕 / MacBook' },
  { key: 'Console', brand: '游戏机 Console', name: '游戏机', desc: 'Switch / PS5 / Xbox' },
  { key: 'Camera', brand: '相机 Camera', name: '相机', desc: '数码相机 / 镜头' },
  { key: 'Watch', brand: '手表 Watch', name: '手表', desc: 'Apple Watch / 智能手表' },
  { key: 'Headphones', brand: '耳机 Headphones', name: '耳机', desc: 'AirPods / 蓝牙耳机' },
  { key: 'Kobo', brand: 'Kobo 电子书', name: 'Kobo 电子书', desc: 'Kobo / Kindle 电子书' },
  { key: 'General', brand: '通用 General', name: '通用', desc: '通用维修技巧 / 工具' },
]

// 数据库 brand 值 → 展示名（老数据兼容）
export const BRAND_LABEL = Object.fromEntries(TECH_BRANDS.map(b => [b.brand, b.brand]))

// URL key → 数据库 brand 值
export const BRAND_BY_KEY = Object.fromEntries(TECH_BRANDS.map(b => [b.key, b.brand]))

// Crazy维修站 /cases 的 tag → 论坛品牌（发布脚本与回填用）
export const REPAIR_TAG_TO_BRAND = {
  'iPhone': '苹果 Apple',
  'iPad': '苹果 Apple',
  'MacBook': '苹果 Apple',
  '三星': '三星 Samsung',
  '华为': '华为 Huawei',
  '小米': '小米 Xiaomi',
  'OPPO': 'OPPO',
  'vivo': 'vivo',
  '一加': '一加 OnePlus',
  '荣耀': '荣耀 Honor',
  '摩托罗拉': '摩托罗拉 Motorola',
  '红魔': '红魔 RedMagic',
  'Sharp': 'Sharp',
  '华硕': '华硕 ASUS',
  '联想': '电脑主板 PC',
  '戴尔': '电脑主板 PC',
  '惠普': '电脑主板 PC',
  '电脑/笔记本': '电脑主板 PC',
  '游戏机': '游戏机 Console',
  '相机': '相机 Camera',
  '手表': '手表 Watch',
  '耳机': '耳机 Headphones',
  'Kobo电子书': 'Kobo 电子书',
  '手机通用': '通用 General',
  '其他': '通用 General',
}

export function brandForRepairTag(tag) {
  return REPAIR_TAG_TO_BRAND[tag] || '其他安卓 Other'
}
