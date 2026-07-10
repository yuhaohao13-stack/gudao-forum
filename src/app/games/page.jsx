'use client'

import Link from 'next/link'
import { Gamepad2, ChevronLeft } from 'lucide-react'

const GAMES = [
  { slug: 'snake', name: '🐍 贪吃蛇', desc: '经典贪吃蛇，吃食物变长，别撞墙别咬自己', tag: '已上线' },
  { slug: 'tetris', name: '🧱 俄罗斯方块', desc: '经典方块堆叠，消行得分，挑战极限', tag: '已上线' },
  { slug: 'breakout', name: '🏓 打砖块', desc: '挡板接球打砖块，全消即胜', tag: '已上线' },
  { slug: '2048', name: '🔢 2048', desc: '合并数字方块，挑战2048！', tag: '已上线' },
  { slug: 'whackamole', name: '🔨 打地鼠', desc: '限时30秒，疯狂点击打地鼠', tag: '已上线' },
  { slug: 'invaders', name: '👾 太空侵略者', desc: '射击入侵者，保卫地球', tag: '已上线' },
  { slug: 'pacman', name: '🟡 吃豆人', desc: '迷宫吃豆，躲避鬼怪', tag: '已上线' },
  { slug: 'minesweeper', name: '💣 扫雷', desc: '推理排雷，步步为营', tag: '已上线' },
  { slug: 'dino', name: '🏃 恐龙跑酷', desc: '无尽跑酷，跳跃躲避障碍', tag: '已上线' },
  { slug: 'flappy', name: '🐦 Flappy Bird', desc: '点击穿越管道，停不下来', tag: '已上线' },
  { slug: 'racing', name: '🏎️ 赛车', desc: '3车道躲避迎面来车，越跑越远', tag: '已上线' },
  { slug: 'mario', name: '🍄 超级玛丽', desc: '经典横版过关，跳跃躲避障碍', tag: '已上线' },
  { slug: 'target', name: '🎯 打靶', desc: '限时60秒，射击移动靶子得分', tag: '已上线' },
  { slug: 'memory', name: '🧠 记忆翻牌', desc: '翻牌配对，考验记忆力', tag: '已上线' },
  { slug: 'slidingpuzzle', name: '🧩 数字华容道', desc: '滑动方块，还原数字顺序', tag: '已上线' },
  { slug: 'defender', name: '🪐 行星防御', desc: '击落陨石，保卫家园', tag: '已上线' },
  { slug: 'bounce', name: '🐱 跳跳乐', desc: '不断弹跳，挑战最高高度', tag: '已上线' },
  { slug: 'pong', name: '🕹️ 乒乓球', desc: '经典乒乓球对战AI', tag: '已上线' },
]

export default function GamesPage() {
  return (
    <div className="space-y-8">
      {/* 顶部 */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5 text-sm text-[#888] hover:text-[#1a1a1a] transition-colors">
          <ChevronLeft size={18} />
          返回首页
        </Link>
      </div>

      {/* 标题 */}
      <div className="text-center">
        <div className="text-4xl mb-3">🎮</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]">游戏娱乐厅</h1>
        <p className="text-sm text-[#888] mt-2">全部18款游戏已上线，加载后可离线畅玩</p>
      </div>

      {/* 全部游戏 */}
      <section>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {GAMES.map((g, i) => (
            <Link key={g.slug} href={`/games/${g.slug}`}
              className="group block bg-white border border-[#ece8e0] rounded-xl p-4 transition-all hover:border-[#c23531] hover:shadow-md hover:-translate-y-1">
              <div className="text-3xl mb-2">{g.name.split(' ')[0]}</div>
              <div className="font-semibold text-sm text-[#1a1a1a]">{g.name.split(' ').slice(1).join(' ')}</div>
              <div className="text-xs text-[#aaa] mt-1.5 leading-relaxed">{g.desc}</div>
              <div className="mt-2">
                <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#e8f5e9] text-[#2e7d32]">立即玩</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 离线说明 */}
      <div className="text-center pt-4 pb-8">
        <div className="inline-block bg-[#f5f5f5] rounded-xl px-5 py-3">
          <p className="text-xs text-[#888]">
            🎮 所有游戏为纯前端Canvas开发，首次加载后 
            <strong className="text-[#1a1a1a]">断网也能玩</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
