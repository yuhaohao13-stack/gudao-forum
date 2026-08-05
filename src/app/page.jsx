'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MessageCircle, Megaphone, Pin, FileText, Eye, Clock, Flame, ArrowRight, Monitor, Flower2, Package, BookOpen, Sparkles, Gamepad2, Wrench } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { canViewTech, TECH_CATEGORY_SLUG } from '@/lib/member'
import CheckInButton from '@/components/CheckInButton'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/LanguageContext'

const CAT_ICONS = {
  announcements: <Megaphone size={20} className="inline-block" />,
  random: <MessageCircle size={20} className="inline-block" />,
  tech: <Monitor size={20} className="inline-block" />,
  life: <Flower2 size={20} className="inline-block" />,
  resources: <Package size={20} className="inline-block" />,
  fiction: <BookOpen size={20} className="inline-block" />,
}

const GAMES = [
  { slug: 'racing', name: '🏎️ 赛车', desc: '躲避来车，无尽狂飙' },
  { slug: 'mario', name: '🍄 超级玛丽', desc: '经典平台跳跃，勇闯关卡' },
  { slug: 'target', name: '🎯 打靶', desc: '限时60秒，射击移动靶' },
  { slug: 'memory', name: '🧠 记忆翻牌', desc: '翻牌配对，考验记忆力' },
  { slug: 'puzzle', name: '🧩 数字华容道', desc: '滑动方块，复原顺序' },
  { slug: 'defender', name: '🪐 行星防御', desc: '保卫行星，击碎陨石' },
  { slug: 'bounce', name: '🐱 跳跳乐', desc: '不断跳跃，越跳越高' },
  { slug: 'pong', name: '🕹️ 乒乓球', desc: '经典乒乓，挑战AI' },
  { slug: 'snake', name: '🐍 贪吃蛇', desc: '吃食物变长，别碰墙' },
  { slug: 'tetris', name: '🧱 俄罗斯方块', desc: '经典方块堆叠消行' },
  { slug: 'breakout', name: '🏓 打砖块', desc: '挡板接球打砖块' },
  { slug: '2048', name: '🔢 2048', desc: '合并数字挑战极限' },
  { slug: 'whackamole', name: '🔨 打地鼠', desc: '限时30秒打地鼠' },
  { slug: 'invaders', name: '👾 太空侵略者', desc: '射击入侵者' },
  { slug: 'pacman', name: '🟡 吃豆人', desc: '迷宫吃豆躲鬼怪' },
  { slug: 'minesweeper', name: '💣 扫雷', desc: '推理排雷步步营' },
  { slug: 'dino', name: '🏃 恐龙跑酷', desc: '无尽跑酷跳障碍' },
  { slug: 'flappy', name: '🐦 Flappy Bird', desc: '点击穿越管道' },
]

export default function Home() {
  const { t } = useLanguage()
  const { user, profile } = useAuth()
  const [categories, setCategories] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [activeTab, setActiveTab] = useState('recent')
  const [totalPosts, setTotalPosts] = useState(0)
  const [totalViews, setTotalViews] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: cats } = await supabase.from('categories').select('*').order('sort_order')
      const sorted = cats || []
      const annIdx = sorted.findIndex(c => c.slug === 'announcements')
      if (annIdx > 0) { const [a] = sorted.splice(annIdx, 1); sorted.unshift(a) }
      setCategories(sorted)

      const annCat = sorted.find(c => c.slug === 'announcements')
      if (annCat) {
        // 只显示置顶帖（与板块页一致）
        const { data: a } = await supabase.from('threads').select('*, profiles(username, display_name)').eq('category_id', annCat.id).eq('is_pinned', true).order('pin_order', { ascending: true, nullsFirst: false }).order('created_at', { ascending: false }).limit(6)
        setAnnouncements(a || [])
      }

      const aid = annCat?.id
      let rq = supabase.from('threads').select('*, profiles(username, display_name), categories(name, slug)')
      if (aid) rq = rq.neq('category_id', aid)


      const { count: pc } = await supabase.from('threads').select('*', { count: 'exact', head: true })
      setTotalPosts(pc || 0)
      const { data: v } = await supabase.from('threads').select('view_count')
      setTotalViews((v || []).reduce((s, t) => s + (t.view_count || 0), 0))
      const { count: uc } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
      setTotalUsers(uc || 0)
    }
    fetchData()
  }, [])

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* ===== 站点头部（一排） ===== */}
      <div className="flex items-center justify-between gap-4 py-3 sm:py-4 flex-wrap anim-fade-in">
        <div className="flex items-center gap-3 sm:gap-5 text-sm flex-wrap">
          <span className="text-sm text-[#aaa] tracking-wide whitespace-nowrap">{t('home.slogan')}</span>
          <div className="flex items-center gap-3 sm:gap-4 text-xs text-[#999]">
            <span><strong className="text-sm font-semibold text-[#1a1a1a]">{totalPosts}</strong> {t('home.posts')}</span>
            <span className="text-[#ddd]">|</span>
            <span><strong className="text-sm font-semibold text-[#1a1a1a]">{totalViews.toLocaleString()}</strong> {t('home.views')}</span>
            <span className="text-[#ddd]">|</span>
            <Link href="/members" className="hover:text-[#c23531] transition-colors"><strong className="text-sm font-semibold text-[#1a1a1a]">{totalUsers}</strong> {t('home.members')}</Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/chat" className="btn-secondary text-xs whitespace-nowrap"><MessageCircle size={14} className="inline-block align-text-bottom" /> {t('home.chatroom')}</Link>
          <CheckInButton />
        </div>
      </div>

      {/* ===== 公告 ===== */}
      <div className="anim-up">
        <div className="bg-gradient-to-r from-[#fefaf5] to-[#fdf8f4] border border-[#eee8dc] rounded-xl px-4 py-2.5 overflow-hidden">
          <div className="flex items-center gap-2 text-xs text-[#b45309] mb-1">
            <span className="font-semibold">{t('home.service_notice')}</span>
          </div>
          <div className="overflow-hidden relative h-5">
            <div style={{ display: 'inline-block', whiteSpace: 'nowrap', animation: 'marqueeDonation 30s linear infinite' }}>
              {Array(3).fill(0).map((_, i) => (
                <span key={i} className="inline-flex items-center gap-2 text-[12px] text-[#888] mx-4">
                  {t('home.service_text')}
                </span>
              ))}
            </div>
          </div>
        </div>
        <style>{`
          @keyframes marqueeDonation {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>

      {/* ===== 站务公告 + 站长风采 ===== */}
      {announcements.length > 0 && (
        <section className="anim-up">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-[#999] tracking-wide"><Megaphone size={14} className="inline-block align-text-bottom" /> {t('home.announcements')}</span>
            <span className="tag">{t('home.pinned')}</span>
          </div>
          <div className="flex flex-row gap-1 sm:gap-3 items-stretch">
            <div className="w-1/2 shrink-0">
              <div className="card divide-y divide-[#f5f5f5]">
                {announcements.slice(0, 6).map((t, i) => (
                  <Link key={t.id} href={`/t/${t.id}`}
                    className={`flex items-center gap-2 px-3 py-2.5 hover:bg-[#fafafa] transition-colors ${i > 0 ? `anim-delay-${i}` : ''}`}>
                    <Pin size={14} className="text-[#b8860b] shrink-0 inline-block" />
                    <span className="text-sm font-medium text-[#1a1a1a] truncate">{t.title}</span>
                    <span className="ml-auto text-xs text-[#bbb] shrink-0">{new Date(t.created_at).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
                  </Link>
                ))}
              </div>
            </div>
            {/* 站长风采 — 始终在右侧，高度140px */}
            <div className="shrink-0">
              <div className="card overflow-hidden">
                <div className="px-1 sm:px-2 pt-1 pb-0.5 text-[8px] sm:text-[9px] font-medium text-[#b8860b] tracking-wider text-center border-b border-[#f5f5f5]">
                  {t('home.master_intro')}
                </div>
                <div className="flex">
                  <img
                    src="/images/hao-tiananmen.jpg?v=2"
                    alt="站长浩哥风采"
                    style={{height:'140px', width:'auto', maxWidth:'100%', display:'block'}}
                  />
                  {/* 对话气泡 — 图片虚影延伸 */}
                  <div className="flex-1 flex items-center justify-center p-2 relative overflow-hidden" style={{minWidth:'80px'}}>
                    <img
                      src="/images/hao-tiananmen.jpg?v=2"
                      alt=""
                      aria-hidden
                      className="absolute inset-0 w-full h-full object-cover object-left opacity-30"
                      style={{ filter: 'blur(10px)', transform: 'scale(1.15)' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-50/30 to-amber-100/20" />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-1.5 w-3 h-3 bg-white/90 rotate-45 z-10" />
                    <div className="relative bg-white/85 backdrop-blur-md rounded-xl px-3 py-2.5 text-center shadow-sm z-10">
                      <div className="text-[11px] sm:text-xs font-medium text-[#333] leading-relaxed">
                        {t('home.master_wish')}<br />
                        {t('home.wish_line1')}<br />
                        {t('home.wish_line2')}<br />
                        🎉
                      </div>
                      <div className="mt-1 flex justify-center gap-1.5">
                        <span className="text-[10px]">🎨</span>
                        <span className="text-[10px]">💪</span>
                        <span className="text-[10px]">💰</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      {/* ===== 版块（缩小紧凑版） ===== */}
      <section className="anim-up">
        <Link href="/board" className="inline-flex items-center gap-1 text-xs font-semibold text-[#bbb] mb-2 hover:text-[#b45309] transition-colors">{t('board.title')} <span className="text-[9px]">→</span></Link>
        {/* 维修案例：单独一排（粗体+介绍） */}
        {(() => { const techCat = categories.find(c => c.slug === 'tech'); if (!techCat) return null
          return (
            <Link key={techCat.id} href="/c/tech"
              className="block bg-gradient-to-r from-[#f7f2ea] to-[#fdfbf7] border border-[#b45309]/25 rounded-xl px-4 py-3 mb-2 transition-all hover:border-[#b45309]/50 hover:shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#b45309] to-[#d97706] text-white flex items-center justify-center text-lg shrink-0"><Wrench size={20} /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-[#1a1a1a]">维修案例</span>
                    <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-[#b45309]/10 text-[#b45309] font-medium">品牌×故障</span>
                  </div>
                  <div className="text-[10px] text-[#888] mt-0.5 leading-tight truncate">苹果/三星/华为/小米等品牌维修案例 · 不开机/屏幕/主板等故障分类 · 抖音视频同步</div>
                </div>
                <span className="text-[#b45309] text-[10px] font-semibold shrink-0">→</span>
              </div>
            </Link>
          )
        })()}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {categories.filter(c => c.slug !== 'tech' && c.slug !== 'announcements').map((c, i) => (
            <Link key={c.id} href={`/c/${c.slug}`}
              className="block bg-white border border-[#ece8e0] rounded-xl px-3 py-2.5 transition-all hover:border-[#c23531] hover:shadow-sm hover:-translate-y-0.5">
              <div className="flex items-center gap-2">
                <div className="text-base shrink-0">{CAT_ICONS[c.slug] || <FileText size={16} className="inline-block" />}</div>
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-[#1a1a1a] truncate">{c.name}</div>
                  <div className="text-[10px] text-[#aaa] truncate leading-tight">{c.description}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-2 anim-up">
        <Link href="/ai-tools">
          <div className="bg-gradient-to-r from-[#eef2ff] via-[#f0fdf4] to-[#fefce8] border border-[#d0d5e0] rounded-xl px-3 py-2.5 transition-all hover:shadow-md hover:-translate-y-0.5 h-full">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4f46e5] to-[#059669] flex items-center justify-center text-sm shrink-0 shadow-sm">🤖</div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-[#1a1a1a]">AI 智能工具箱</div>
                <div className="text-[9px] text-[#999] leading-tight">DeepSeek深度推理·Gemini极速问答</div>
              </div>
              <span className="text-[10px] text-[#4f46e5] font-medium shrink-0">→</span>
            </div>
          </div>
        </Link>
        <Link href="/maps">
          <div className="bg-gradient-to-r from-[#f5f3ff] to-[#ede9fe] border border-[#d8b4fe] rounded-xl px-3 py-2.5 transition-all hover:shadow-md hover:-translate-y-0.5 h-full">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#a855f7] flex items-center justify-center text-sm shrink-0 shadow-sm">🗺️</div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-[#1a1a1a]">地图</div>
                <div className="text-[9px] text-[#999] leading-tight">中国地图·世界地图·搜索定位</div>
              </div>
              <span className="text-[10px] text-[#7c3aed] font-medium shrink-0">→</span>
            </div>
          </div>
        </Link>
      </div>

      {/* ===== 功能入口（2×2双排） ===== */}
      <div className="grid grid-cols-2 gap-2 anim-up">
        <Link href="/chat">
          <div className="bg-gradient-to-r from-[#fdf8f4] to-[#f8f0e8] border border-[#eee8dc] rounded-xl px-3 py-2.5 transition-all hover:border-[#c23531] hover:shadow-sm hover:-translate-y-0.5 h-full">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#c23531] bg-opacity-10 flex items-center justify-center text-sm shrink-0">💬</div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-[#1a1a1a]">在线聊天室</div>
                <div className="text-[9px] text-[#999] leading-tight">会员可参与聊天</div>
              </div>
              <span className="text-[10px] text-[#c23531] font-medium shrink-0">→</span>
            </div>
          </div>
        </Link>

        <Link href="/music">
          <div className="bg-gradient-to-r from-[#fdf8f4] to-[#fefaf5] border border-[#eee8dc] rounded-xl px-3 py-2.5 transition-all hover:border-[#b45309] hover:shadow-sm hover:-translate-y-0.5 h-full">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#b45309] bg-opacity-10 flex items-center justify-center text-sm shrink-0">🎵</div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-[#1a1a1a]">音乐频道</div>
                <div className="text-[9px] text-[#999] leading-tight line-clamp-2">120首精选·六大分类</div>
              </div>
              <span className="text-[10px] text-[#b45309] font-medium shrink-0">→</span>
            </div>
          </div>
        </Link>

        <Link href="/lottery">
          <div className="bg-gradient-to-r from-[#fdf8f4] to-[#fefaf5] border border-[#eee8dc] rounded-xl px-3 py-2.5 transition-all hover:border-[#b45309] hover:shadow-sm hover:-translate-y-0.5 h-full">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#b45309] bg-opacity-10 flex items-center justify-center text-sm shrink-0">🎰</div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-[#1a1a1a]">彩票模拟器</div>
                <div className="text-[9px] text-[#999] leading-tight">双色球·大乐透·TOTO</div>
              </div>
              <span className="text-[10px] text-[#b45309] font-medium shrink-0">→</span>
            </div>
          </div>
        </Link>

        <Link href="/wallpaper">
          <div className="bg-gradient-to-r from-[#fdf8f4] to-[#fefaf5] border border-[#eee8dc] rounded-xl px-3 py-2.5 transition-all hover:border-[#b45309] hover:shadow-sm hover:-translate-y-0.5 h-full">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#b45309] bg-opacity-10 flex items-center justify-center text-sm shrink-0">🎨</div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-[#1a1a1a]">高清壁纸库</div>
                <div className="text-[9px] text-[#999] leading-tight">十大分类·电脑手机双版</div>
              </div>
              <span className="text-[10px] text-[#b45309] font-medium shrink-0">→</span>
            </div>
          </div>
        </Link>

        <Link href="/poetry">
          <div className="bg-gradient-to-r from-[#fdf8f4] to-[#fefaf5] border border-[#eee8dc] rounded-xl px-3 py-2.5 transition-all hover:border-[#b45309] hover:shadow-sm hover:-translate-y-0.5 h-full">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#b45309] bg-opacity-10 flex items-center justify-center text-sm shrink-0">📜</div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-[#1a1a1a]">唐诗三百首</div>
                <div className="text-[9px] text-[#999] leading-tight">李白·杜甫·白居易·王维</div>
              </div>
              <span className="text-[10px] text-[#b45309] font-medium shrink-0">→</span>
            </div>
          </div>
        </Link>

        <Link href="/classics">
          <div className="bg-gradient-to-r from-[#fdf8f4] to-[#fefaf5] border border-[#eee8dc] rounded-xl px-3 py-2.5 transition-all hover:border-[#b45309] hover:shadow-sm hover:-translate-y-0.5 h-full">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#b45309] bg-opacity-10 flex items-center justify-center text-sm shrink-0">📚</div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-[#1a1a1a]">四大名著</div>
                <div className="text-[9px] text-[#999] leading-tight">水浒·三国·西游·红楼</div>
              </div>
              <span className="text-[10px] text-[#b45309] font-medium shrink-0">→</span>
            </div>
          </div>
        </Link>

        <Link href="/idioms">
          <div className="bg-gradient-to-r from-[#fdf8f4] to-[#fefaf5] border border-[#eee8dc] rounded-xl px-3 py-2.5 transition-all hover:border-[#b45309] hover:shadow-sm hover:-translate-y-0.5 h-full">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#b45309] bg-opacity-10 flex items-center justify-center text-sm shrink-0">📖</div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-[#1a1a1a]">成语故事</div>
                <div className="text-[9px] text-[#999] leading-tight">三百经典·寓教于乐</div>
              </div>
              <span className="text-[10px] text-[#b45309] font-medium shrink-0">→</span>
            </div>
          </div>
        </Link>

        <Link href="/proverbs">
          <div className="bg-gradient-to-r from-[#fdf8f4] to-[#fefaf5] border border-[#eee8dc] rounded-xl px-3 py-2.5 transition-all hover:border-[#b45309] hover:shadow-sm hover:-translate-y-0.5 h-full">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#b45309] bg-opacity-10 flex items-center justify-center text-sm shrink-0">💬</div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-[#1a1a1a]">谚语故事</div>
                <div className="text-[9px] text-[#999] leading-tight">民间智慧·口口相传</div>
              </div>
              <span className="text-[10px] text-[#b45309] font-medium shrink-0">→</span>
            </div>
          </div>
        </Link>

        <Link href="/english/junior">
          <div className="bg-gradient-to-r from-[#f0faf0] to-[#e8f5e8] border border-[#dce8dc] rounded-xl px-3 py-2.5 transition-all hover:border-[#16a34a] hover:shadow-sm hover:-translate-y-0.5 h-full">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-green-500 bg-opacity-10 flex items-center justify-center text-sm shrink-0">🌱</div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-[#1a1a1a]">初中词汇与名著</div>
                <div className="text-[9px] text-[#999] leading-tight">中考英语·1815词</div>
              </div>
              <span className="text-[10px] text-[#16a34a] font-medium shrink-0">→</span>
            </div>
          </div>
        </Link>

        <Link href="/english/senior">
          <div className="bg-gradient-to-r from-[#fefaf0] to-[#fef5e8] border border-[#ece0cc] rounded-xl px-3 py-2.5 transition-all hover:border-[#b45309] hover:shadow-sm hover:-translate-y-0.5 h-full">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 bg-opacity-10 flex items-center justify-center text-sm shrink-0">🌿</div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-[#1a1a1a]">高中词汇与名著</div>
                <div className="text-[9px] text-[#999] leading-tight">台湾学测·3754词</div>
              </div>
              <span className="text-[10px] text-[#b45309] font-medium shrink-0">→</span>
            </div>
          </div>
        </Link>

        <Link href="/books/militia">
          <div className="bg-gradient-to-r from-[#f5f5f5] to-[#eee] border border-[#ddd] rounded-xl px-3 py-2.5 transition-all hover:border-[#555] hover:shadow-sm hover:-translate-y-0.5 h-full">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#444] bg-opacity-10 flex items-center justify-center text-sm shrink-0">🪖</div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-[#1a1a1a]">民兵训练手册</div>
                <div className="text-[9px] text-[#999] leading-tight">一九七六年版·十四章节</div>
              </div>
              <span className="text-[10px] text-[#555] font-medium shrink-0">→</span>
            </div>
          </div>
        </Link>

        <Link href="/books/doctor">
          <div className="bg-gradient-to-r from-[#f0faf0] to-[#e8f5e8] border border-[#dce8dc] rounded-xl px-3 py-2.5 transition-all hover:border-[#16a34a] hover:shadow-sm hover:-translate-y-0.5 h-full">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-green-500 bg-opacity-10 flex items-center justify-center text-sm shrink-0">🏥</div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-[#1a1a1a]">新赤脚医生手册</div>
                <div className="text-[9px] text-[#999] leading-tight">全民健康·二十五章节</div>
              </div>
              <span className="text-[10px] text-[#16a34a] font-medium shrink-0">→</span>
            </div>
          </div>
        </Link>
      </div>

      {/* ===== 🎮 游戏娱乐（游戏加载后可离线畅玩） ===== */}
      <section className="anim-up">
        <Link href="/games" className="flex items-center gap-1.5 text-xs font-semibold text-[#bbb] mb-2 hover:text-[#b45309] transition-colors">
          <Gamepad2 size={14} />
          {t('home.games')}
          <span className="font-normal lowercase text-[10px] text-[#ccc]">{t('home.games_hint')}</span>
          <span className="text-[9px]">→</span>
        </Link>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {GAMES.map((g, i) => (
            <Link key={g.slug} href={`/games/${g.slug}`}
              className="block bg-white border border-[#ece8e0] rounded-xl px-3 py-2.5 transition-all hover:border-[#c23531] hover:shadow-sm hover:-translate-y-0.5">
              <div className="text-lg mb-0.5">{g.name.split(' ')[0]}</div>
              <div className="font-semibold text-xs text-[#1a1a1a]">{g.name.split(' ').slice(1).join(' ')}</div>
              <div className="text-[10px] text-[#aaa] mt-0.5">{g.desc}</div>
            </Link>
          ))}
        </div>
      </section>



    </div>
  )
}

