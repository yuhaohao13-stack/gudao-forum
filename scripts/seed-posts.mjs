/**
 * 古道论坛 — 批量填充帖子
 * 用法：node scripts/seed-posts.mjs <管理员邮箱>
 *
 * 需要先在 .env.local 里配好 Supabase 密钥
 * 需要管理员 service_role 密钥（在 Supabase Settings → API → service_role key）
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('请先设置环境变量：')
  console.error('  NEXT_PUBLIC_SUPABASE_URL')
  console.error('  SUPABASE_SERVICE_KEY')
  process.exit(1)
}

const adminEmail = process.argv[2] // 不再必须

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// 获取管理员 ID（用用户名搜索）
const { data: adminUser, error: userErr } = await supabase
  .from('profiles')
  .select('id')
  .eq('username', '浩哥')
  .single()

if (userErr || !adminUser) {
  console.error('找不到用户「浩哥」，确认已注册并设为管理员')
  console.error(userErr)
  process.exit(1)
}

const adminId = adminUser.id
console.log('管理员 ID:', adminId)
console.log('发帖人: 浩哥')
console.log('')

// 获取版块
const { data: categories } = await supabase.from('categories').select('*')
const catMap = {}
for (const c of categories) {
  catMap[c.slug] = c.id
}

// ===== 帖子内容 =====

const posts = [
  // === 闲聊灌水 ===
  {
    category: 'random',
    title: '大家平时下班/放学后都干嘛？',
    content: '我先来：打游戏+刷视频，感觉一天就过去了。想看看有没有什么有意义的爱好可以培养一下？',
  },
  {
    category: 'random',
    title: '如果你有一百万，你会怎么花？',
    content: '纯属畅想帖哈哈。我先说：买房付首付，剩下的存银行吃利息，然后继续上班。感觉一百万现在真的不算什么了。',
  },
  {
    category: 'random',
    title: '分享一个你最近才知道的冷知识',
    content: '我先来：香蕉其实是浆果，草莓反而不是。有没有什么冷知识让大家涨涨见识？',
  },
  {
    category: 'random',
    title: '今天天气真好，适合出去走走',
    content: '难得的好天气，阳光明媚但不热。刚刚出去溜达了一圈，心情特别好。大家有空也多出去走走，别老宅着。',
  },
  {
    category: 'random',
    title: '推荐一部你最近看的好剧/好电影',
    content: '最近剧荒了，求推荐！我个人比较喜欢悬疑和科幻类的，动漫也行。大家有没有什么宝藏作品？',
  },

  // === 技术讨论 ===
  {
    category: 'tech',
    title: 'Next.js App Router 和 Pages Router 到底怎么选？',
    content: '新项目不知道该用哪个。App Router 是趋势，但 Pages Router 更成熟稳定。有实际用过的大佬分享一下经验吗？',
  },
  {
    category: 'tech',
    title: '程序员必知的 10 个 VSCode 插件',
    content: '1. GitLens — 看代码历史\n2. Prettier — 格式化代码\n3. ESLint — 代码检查\n4. Tailwind CSS IntelliSense\n5. Thunder Client — API调试\n6. Docker\n7. GitHub Copilot\n8. Error Lens\n9. Material Icon Theme\n10. Code Runner\n\n大家还有什么好插件推荐？',
  },
  {
    category: 'tech',
    title: '聊聊你用过最好的编程语言',
    content: '我先说：TypeScript。类型安全、生态系统强大、全栈都能写。虽然不是最快的，但开发体验最好。大家觉得呢？',
  },
  {
    category: 'tech',
    title: '搭建个人网站/博客的几种免费方案对比',
    content: '方案一：GitHub Pages + Jekyll/Hugo — 完全免费\n方案二：Vercel + Next.js — 免费，灵活\n方案三：Cloudflare Pages — 免费，全球CDN\n方案四：直接 Notion + 第三方工具 — 最省事\n\n我个人推荐方案二，可控性最强。',
  },
  {
    category: 'tech',
    title: 'AI 编程工具实测对比：Cursor vs Copilot vs 通义灵码',
    content: '用了三个月的 Cursor，感觉确实比 Copilot 更懂上下文。通义灵码对中文理解最好，但生成质量一般。大家现在用什么？',
  },

  // === 生活分享 ===
  {
    category: 'life',
    title: '分享一道自己最拿手的菜',
    content: '我的拿手菜是可乐鸡翅，做法简单还好吃：\n1. 鸡翅正反面划两刀\n2. 姜蒜爆香，下鸡翅煎到两面金黄\n3. 倒一听可乐 + 两勺生抽 + 一勺老抽\n4. 中火煮15分钟，大火收汁\n\n大家也来分享分享！',
  },
  {
    category: 'life',
    title: '周末好去处推荐 — 适合一个人去的 5 个地方',
    content: '1. 图书馆/书店 — 安静，能待一天\n2. 博物馆/美术馆 — 涨知识还能拍照\n3. 咖啡馆 — 带本书或电脑\n4. 公园/植物园 — 亲近自然\n5. 健身房/游泳馆 — 运动释放压力\n\n一个人也可以很快乐！',
  },
  {
    category: 'life',
    title: '最近在听的歌单分享',
    content: '最近循环的歌：\n- 晚风 — 好听的钢琴曲\n- 起风了 — 每次听都有感触\n- 平凡之路 — 朴树yyds\n\n大家最近在听什么？有没有宝藏歌单推荐？',
  },
  {
    category: 'life',
    title: '打工人带饭日记：一周不重样便当',
    content: '周一：番茄炒蛋 + 煎鸡胸肉 + 杂粮饭\n周二：青椒肉丝 + 清炒西兰花\n周三：照烧鸡腿 + 炒时蔬\n周四：鱼香肉丝 + 凉拌黄瓜\n周五：咖喱鸡肉饭\n\n自己做饭又省钱又健康，强烈推荐试试！',
  },
  {
    category: 'life',
    title: '大家每个月花多少钱在房租上？',
    content: '坐标一线城市，房租3000+，占工资快30%了。感觉压力不小，但又不想住太远。大家的情况怎么样？有没有什么租房经验分享？',
  },

  // === 资源分享 ===
  {
    category: 'resources',
    title: '程序员必备免费电子书合集',
    content: '分享几个高质量的免费编程书籍：\n1. 《CSAPP》— 深入理解计算机系统\n2. 《算法导论》— 算法圣经\n3. 《Clean Code》— 代码整洁之道\n4. 《Designing Data-Intensive Applications》\n5. 《You Don\'t Know JS》系列\n\n都是经典中的经典，值得反复读。',
  },
  {
    category: 'resources',
    title: '推荐几个免费好用的在线工具网站',
    content: '1. Excalidraw — 在线白板，画图神器\n2. Photopea — 在线PS，不用下载\n3. Remove.bg — 一键去背景\n4. Coolors — 配色方案生成\n5. Carbon — 代码截图美化\n6. Regex101 — 正则表达式测试\n\n全部免费，收藏不吃灰！',
  },
  {
    category: 'resources',
    title: 'GitHub 上那些让人惊艳的开源项目',
    content: '最近发现几个不错的项目：\n1. n8n — 开源自动化工作流\n2. Appwrite — 开源 Firebase 替代\n3. Documenso — 开源 DocuSign\n4. Cal.com — 开源 Calendly\n\n开源的力量太强大了。',
  },
  {
    category: 'resources',
    title: '免费学习资源的宝藏网站整理',
    content: '1. Coursera — 名校公开课（可旁听免费）\n2. MIT OpenCourseWare — MIT 全部课程免费\n3. 中国大学MOOC — 国内名校课程\n4. FreeCodeCamp — 全栈开发免费教程\n5. O\'Reilly 免费电子书（部分）\n\n知识不应该被付费墙挡住。',
  },
  {
    category: 'resources',
    title: '设计师/自媒体人必备的免费素材站',
    content: '图片：Unsplash, Pexels, Pixabay\n图标：Flaticon, Icons8, Lucide\n字体：Google Fonts, 字由\n模板：Canva, Figma Community\n音频：Uppbeat, Pixabay Music\n\n省下来的订阅费够吃好几顿好的了！',
  },
]

// 批量插入
console.log(`准备插入 ${posts.length} 条帖子...`)

for (const post of posts) {
  const { data, error } = await supabase.from('threads').insert({
    title: post.title,
    content: post.content,
    category_id: catMap[post.category],
    author_id: adminId,
  }).select('id')

  if (error) {
    console.error(`❌ 插入失败 [${post.category}] ${post.title.slice(0, 20)}:`, error.message)
  } else {
    console.log(`✅ [${post.category}] ${post.title.slice(0, 30)}...`)
  }
}

console.log('\n🎉 全部完成！')
