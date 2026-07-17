// 高清壁纸分类数据
// 图片使用 picsum.photos 占位，每张图不同 seed 保证固定显示

const CATEGORIES = [
  {
    id: 'magazine',
    name: '杂志封面',
    icon: '📰',
    desc: '时尚杂志风格高清壁纸，简约高级感',
    keywords: '杂志封面壁纸,时尚壁纸,高清杂志封面,Mac壁纸,iPhone壁纸',
    wallpapers: [
      { id: 'm1', title: '时尚简约', seed: 'mag-1' },
      { id: 'm2', title: '高级质感', seed: 'mag-2' },
      { id: 'm3', title: '艺术排版', seed: 'mag-3' },
      { id: 'm4', title: '复古格调', seed: 'mag-4' },
      { id: 'm5', title: '极简封面', seed: 'mag-5' },
    ],
  },
  {
    id: 'space',
    name: '火星宇宙',
    icon: '🚀',
    desc: '浩瀚星河、火星地表、宇宙深处壮丽景观',
    keywords: '宇宙壁纸,星空壁纸,火星壁纸,太空壁纸,银河壁纸',
    wallpapers: [
      { id: 's1', title: '璀璨星河', seed: 'spc-1' },
      { id: 's2', title: '火星地表', seed: 'spc-2' },
      { id: 's3', title: '银河隧道', seed: 'spc-3' },
      { id: 's4', title: '星云漩涡', seed: 'spc-4' },
      { id: 's5', title: '深空探秘', seed: 'spc-5' },
    ],
  },
  {
    id: 'people',
    name: '人物写真',
    icon: '👤',
    desc: '人像摄影、街拍风尚、肖像艺术高清壁纸',
    keywords: '人物壁纸,人像壁纸,写真壁纸,人物摄影,高清人像',
    wallpapers: [
      { id: 'p1', title: '街头光影', seed: 'ppl-1' },
      { id: 'p2', title: '黑白肖像', seed: 'ppl-2' },
      { id: 'p3', title: '自然光韵', seed: 'ppl-3' },
      { id: 'p4', title: '都市剪影', seed: 'ppl-4' },
      { id: 'p5', title: '艺术人像', seed: 'ppl-5' },
    ],
  },
  {
    id: 'mountains',
    name: '山川树木',
    icon: '🏔️',
    desc: '壮丽山川、森林秘境、自然风光高清壁纸',
    keywords: '山川壁纸,森林壁纸,自然风光,高清风景,山脉壁纸',
    wallpapers: [
      { id: 'mt1', title: '雪山巍峨', seed: 'mnt-1' },
      { id: 'mt2', title: '森林晨曦', seed: 'mnt-2' },
      { id: 'mt3', title: '峡谷深处', seed: 'mnt-3' },
      { id: 'mt4', title: '云雾缭绕', seed: 'mnt-4' },
      { id: 'mt5', title: '林间溪流', seed: 'mnt-5' },
    ],
  },
  {
    id: 'seasons',
    name: '四季风光',
    icon: '🌸',
    desc: '春华秋实、夏雨冬雪，四季更迭之美',
    keywords: '四季壁纸,春天壁纸,秋天壁纸,冬天壁纸,季节风景',
    wallpapers: [
      { id: 'se1', title: '春暖花开', seed: 'sea-1' },
      { id: 'se2', title: '夏日蝉鸣', seed: 'sea-2' },
      { id: 'se3', title: '秋叶金黄', seed: 'sea-3' },
      { id: 'se4', title: '冬日雪景', seed: 'sea-4' },
      { id: 'se5', title: '雨后彩虹', seed: 'sea-5' },
    ],
  },
  {
    id: 'anime',
    name: '动漫人物',
    icon: '🎨',
    desc: '热门动漫角色、二次元唯美插画壁纸',
    keywords: '动漫壁纸,二次元壁纸,动漫人物壁纸,插画壁纸,高清动漫',
    wallpapers: [
      { id: 'a1', title: '日系唯美', seed: 'ani-1' },
      { id: 'a2', title: '赛博朋克', seed: 'ani-2' },
      { id: 'a3', title: '治愈画风', seed: 'ani-3' },
      { id: 'a4', title: '战斗热血', seed: 'ani-4' },
      { id: 'a5', title: '古风意境', seed: 'ani-5' },
    ],
  },
  {
    id: 'city',
    name: '城市建筑',
    icon: '🏙️',
    desc: '摩天大楼、城市夜景、建筑美学高清壁纸',
    keywords: '城市壁纸,建筑壁纸,夜景壁纸,都市壁纸,摩天大楼',
    wallpapers: [
      { id: 'c1', title: '城市天际', seed: 'cty-1' },
      { id: 'c2', title: '霓虹夜景', seed: 'cty-2' },
      { id: 'c3', title: '建筑线条', seed: 'cty-3' },
      { id: 'c4', title: '老街小巷', seed: 'cty-4' },
      { id: 'c5', title: '桥与河流', seed: 'cty-5' },
    ],
  },
  {
    id: 'ocean',
    name: '海洋星辰',
    icon: '🌊',
    desc: '蔚蓝大海、海浪沙滩、海底世界壁纸',
    keywords: '海洋壁纸,大海壁纸,沙滩壁纸,海浪壁纸,海底世界',
    wallpapers: [
      { id: 'o1', title: '碧海蓝天', seed: 'ocn-1' },
      { id: 'o2', title: '海浪拍岸', seed: 'ocn-2' },
      { id: 'o3', title: '夕阳海岸', seed: 'ocn-3' },
      { id: 'o4', title: '海底珊瑚', seed: 'ocn-4' },
      { id: 'o5', title: '星空海面', seed: 'ocn-5' },
    ],
  },
  {
    id: 'flowers',
    name: '花鸟鱼虫',
    icon: '🌸',
    desc: '花卉特写、鸟类摄影、微观世界壁纸',
    keywords: '花朵壁纸,花鸟壁纸,花卉摄影,动物壁纸,自然微距',
    wallpapers: [
      { id: 'f1', title: '玫瑰绽放', seed: 'flw-1' },
      { id: 'f2', title: '蝴蝶采蜜', seed: 'flw-2' },
      { id: 'f3', title: '翠鸟立枝', seed: 'flw-3' },
      { id: 'f4', title: '向日葵田', seed: 'flw-4' },
      { id: 'f5', title: '荷塘月色', seed: 'flw-5' },
    ],
  },
  {
    id: 'minimal',
    name: '极简抽象',
    icon: '◆',
    desc: '几何图形、渐变色块、极简艺术壁纸',
    keywords: '极简壁纸,抽象壁纸,几何壁纸,渐变壁纸,简约壁纸',
    wallpapers: [
      { id: 'mi1', title: '几何构成', seed: 'min-1' },
      { id: 'mi2', title: '渐变韵律', seed: 'min-2' },
      { id: 'mi3', title: '线条艺术', seed: 'min-3' },
      { id: 'mi4', title: '色彩碰撞', seed: 'min-4' },
      { id: 'mi5', title: '留白之美', seed: 'min-5' },
    ],
  },
]

// 生成图片URL
export function getDesktopUrl(seed) {
  return `https://picsum.photos/seed/${seed}/1920/1080`
}

export function getMobileUrl(seed) {
  return `https://picsum.photos/seed/${seed}mb/1080/1920`
}

export default CATEGORIES
