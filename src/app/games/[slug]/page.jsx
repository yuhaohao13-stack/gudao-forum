'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Gamepad2, Trophy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { submitScore, getLeaderboard } from '@/lib/submitScore'
import SnakeGame from '@/components/games/SnakeGame'
import TetrisGame from '@/components/games/TetrisGame'
import BreakoutGame from '@/components/games/BreakoutGame'
import Game2048 from '@/components/games/Game2048'
import WhackAMoleGame from '@/components/games/WhackAMoleGame'

const GAMES = [
  { slug: 'snake', name: '🐍 贪吃蛇', desc: '经典贪吃蛇，吃食物变长，别撞墙别咬自己', Component: SnakeGame },
  { slug: 'tetris', name: '🧱 俄罗斯方块', desc: '经典方块堆叠，消行得分', Component: TetrisGame },
  { slug: 'breakout', name: '🏓 打砖块', desc: '挡板接球打砖块，全消即胜', Component: BreakoutGame },
  { slug: '2048', name: '🔢 2048', desc: '合并数字方块，挑战2048', Component: Game2048 },
  { slug: 'whackamole', name: '🔨 打地鼠', desc: '限时30秒，打中地鼠得分', Component: WhackAMoleGame },
]

const gameMap = Object.fromEntries(GAMES.map(g => [g.slug, g]))

export default function GamePage() {
  const params = useParams()
  const slug = params.slug
  const { user } = useAuth()
  const game = gameMap[slug]
  const [leaderboard, setLeaderboard] = useState([])

  // 加载该游戏高分榜
  useEffect(() => {
    const load = async () => {
      if (!game || game.soon) return
      const data = await getLeaderboard(slug)
      setLeaderboard(data)
    }
    load()
  }, [slug])

  if (!game) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-4">🎮</div>
        <h1 className="text-xl font-bold text-[#1a1a1a] mb-2">游戏未找到</h1>
        <p className="text-sm text-[#888] mb-6">这个游戏不存在或尚未上线</p>
        <Link href="/" className="btn-primary">返回首页</Link>
      </div>
    )
  }

  const handleScore = async (score) => {
    if (!user) return
    const result = await submitScore(slug, score)
    if (result.isNewHigh) {
      // 刷新高分榜
      const data = await getLeaderboard(slug)
      setLeaderboard(data)
    }
  }

  const GameComponent = game.Component

  return (
    <div className="space-y-6">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5 text-sm text-[#888] hover:text-[#1a1a1a] transition-colors">
          <ChevronLeft size={18} />
          返回首页
        </Link>
        <div className="flex items-center gap-2 text-sm text-[#888]">
          <Gamepad2 size={16} />
          游戏娱乐
        </div>
      </div>

      {/* 游戏标题 */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">{game.name}</h1>
        <p className="text-sm text-[#888] mt-1">{game.desc}</p>
        {!user && (
          <p className="text-xs text-[#bbb] mt-1">
            <Link href="/login" className="text-[#c23531] hover:underline">登录</Link>后可记录高分
          </p>
        )}
      </div>

      {/* 游戏画布 */}
      <div className="flex justify-center">
        <GameComponent onScore={handleScore} />
      </div>

      {/* ===== 🏆 高分榜 ===== */}
      <section>
        <h2 className="flex items-center gap-1.5 text-xs font-semibold text-[#bbb] uppercase tracking-widest mb-2">
          <Trophy size={14} />
          {game.name} 高分榜
        </h2>
        <div className="card">
          <div className="divide-y divide-[#f5f5f5]">
            {leaderboard.length === 0 ? (
              <div className="py-10 text-center">
                <Trophy size={24} className="inline-block text-[#ddd] mb-2" />
                <p className="text-sm text-[#bbb]">还没有高分记录</p>
                <p className="text-xs text-[#ccc] mt-1">玩一局来上榜吧！</p>
              </div>
            ) : (
              leaderboard.map((entry, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    i === 0 ? 'bg-[#ffd700] text-[#1a1a1a]' :
                    i === 1 ? 'bg-[#c0c0c0] text-[#1a1a1a]' :
                    i === 2 ? 'bg-[#cd7f32] text-white' :
                    'bg-[#f5f5f5] text-[#888]'
                  }`}>{i + 1}</span>
                  <span className="text-sm font-medium text-[#1a1a1a] flex-1 truncate">{entry.username}</span>
                  <span className="text-sm font-bold text-[#c23531]">{entry.score.toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
