/**
 * 四大名著 (Four Great Classical Novels)
 *
 * Original text from authoritative annotated editions.
 * 水浒传 — 施耐庵 (100回校注本)
 * 三国演义 — 罗贯中 (120回校注本)
 * 西游记 — 吴承恩 (100回校注本)
 * 红楼梦 — 曹雪芹 (120回校注本)
 */

import SHUIHU_DATA from './parts/classics-shuihu'
import SANGUO_DATA from './parts/classics-sanguo'
import XIYOUJI_DATA from './parts/classics-xiyouji'
import HONGLOU_DATA from './parts/classics-honglou'

const CLASSICS = [
  {
    id: 'shuihu',
    title: '水浒传',
    author: '施耐庵',
    icon: '⚔️',
    desc: '一部以北宋末年宋江起义为背景的英雄传奇小说，描写了一百零八位好汉被逼上梁山、聚义抗暴的悲壮故事，揭示了"官逼民反"的社会现实。',
    totalChapters: 100,
    chapters: SHUIHU_DATA,
  },
  {
    id: 'sanguo',
    title: '三国演义',
    author: '罗贯中',
    icon: '🐉',
    desc: '中国第一部长篇章回体历史演义小说，以东汉末年至西晋统一近百年的历史为背景，描写了魏、蜀、吴三国之间的政治、军事和外交斗争，塑造了众多脍炙人口的英雄人物。',
    totalChapters: 120,
    chapters: SANGUO_DATA,
  },
  {
    id: 'xiyouji',
    title: '西游记',
    author: '吴承恩',
    icon: '🐵',
    desc: '中国古代第一部浪漫主义神魔小说，讲述了唐僧师徒四人历经九九八十一难，前往西天取经的传奇故事，充满了奇特的想象和深刻的寓意。',
    totalChapters: 100,
    chapters: XIYOUJI_DATA,
  },
  {
    id: 'hongloumeng',
    title: '红楼梦',
    author: '曹雪芹',
    icon: '🏮',
    desc: '中国古典文学的巅峰之作，以贾宝玉、林黛玉、薛宝钗的爱情悲剧为主线，描写了贾、史、王、薛四大家族的兴衰沉浮，深刻揭示了封建社会的黑暗和腐朽。',
    totalChapters: 120,
    chapters: HONGLOU_DATA,
  },
]

export default CLASSICS
