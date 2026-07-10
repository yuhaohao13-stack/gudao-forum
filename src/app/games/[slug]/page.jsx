'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Gamepad2, Trophy, LogIn, UserPlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { submitScore, getLeaderboard } from '@/lib/submitScore'
import SnakeGame from '@/components/games/SnakeGame'
import TetrisGame from '@/components/games/TetrisGame'
import BreakoutGame from '@/components/games/BreakoutGame'
import Game2048 from '@/components/games/Game2048'
import WhackAMoleGame from '@/components/games/WhackAMoleGame'
import InvadersGame from '@/components/games/InvadersGame'
import PacmanGame from '@/components/games/PacmanGame'
import MinesweeperGame from '@/components/games/MinesweeperGame'
import DinoRunGame from '@/components/games/DinoRunGame'
import FlappyBirdGame from '@/components/games/FlappyBirdGame'
import RacingGame from '@/components/games/RacingGame'
import MarioGame from '@/components/games/MarioGame'
import TargetGame from '@/components/games/TargetGame'
import MemoryGame from '@/components/games/MemoryGame'
import SlidingPuzzle from '@/components/games/SlidingPuzzle'
import DefenderGame from '@/components/games/DefenderGame'
import BounceGame from '@/components/games/BounceGame'
import PongGame from '@/components/games/PongGame'

const GAMES = [
  { slug: 'snake', name: '🐍 贪吃蛇', desc: '经典贪吃蛇，吃食物变长，别撞墙别咬自己', Component: SnakeGame,
    tips: { pc: '键盘方向键 ↑↓←→ 控制蛇的移动方向', mobile: '滑动画布 或 点击下方方向按钮移动' } },
  { slug: 'tetris', name: '🧱 俄罗斯方块', desc: '经典方块堆叠，消行得分', Component: TetrisGame,
    tips: { pc: '↑旋转 ↓加速 ←→移动 空格直接落底', mobile: '点击下方按钮：左移 / 旋转 / 右移 / 下落 / 落底' } },
  { slug: 'breakout', name: '🏓 打砖块', desc: '挡板接球打砖块，全消即胜', Component: BreakoutGame,
    tips: { pc: '鼠标左右移动控制挡板接球', mobile: '手指在画布上滑动控制挡板' } },
  { slug: '2048', name: '🔢 2048', desc: '合并数字方块，挑战2048！', Component: Game2048,
    tips: { pc: '方向键 ↑↓←→ 滑动合并数字', mobile: '手指在画布上滑动合并数字' } },
  { slug: 'whackamole', name: '🔨 打地鼠', desc: '限时30秒，疯狂点击打地鼠', Component: WhackAMoleGame,
    tips: { pc: '鼠标点击地鼠击打得分', mobile: '手指点击地鼠击打得分' } },
  { slug: 'invaders', name: '👾 太空侵略者', desc: '射击入侵者，保卫地球', Component: InvadersGame,
    tips: { pc: '←→ 移动飞船 空格键射击', mobile: '点击下方按钮：左移 / 射击 / 右移' } },
  { slug: 'pacman', name: '🟡 吃豆人', desc: '迷宫吃豆，躲避鬼怪', Component: PacmanGame,
    tips: { pc: '方向键 ↑↓←→ 控制吃豆人', mobile: '滑动画布 或 点击方向按钮控制' } },
  { slug: 'minesweeper', name: '💣 扫雷', desc: '推理排雷，步步为营', Component: MinesweeperGame,
    tips: { pc: '左键点击翻开格子 · 右键标记🚩', mobile: '点击翻开格子（长按标记开发中）' } },
  { slug: 'dino', name: '🏃 恐龙跑酷', desc: '无尽跑酷，跳跃躲避障碍', Component: DinoRunGame,
    tips: { pc: '空格键 或 ↑ 上箭头 跳跃', mobile: '点击画布跳跃' } },
  { slug: 'flappy', name: '🐦 Flappy Bird', desc: '点击穿越管道，停不下来', Component: FlappyBirdGame,
    tips: { pc: '空格键 或 ↑ 上箭头 飞行', mobile: '点击画布飞行' } },
  { slug: 'racing', name: '🏎️ 赛车', desc: '3车道躲避迎面来车，越跑越远', Component: RacingGame,
    tips: { pc: '← → 切换车道躲避来车', mobile: '点击按钮切换车道' } },
  { slug: 'mario', name: '🍄 超级玛丽', desc: '经典横版过关，跳跃躲避障碍', Component: MarioGame,
    tips: { pc: '空格/↑跳跃，自动前进', mobile: '点击跳跃' } },
  { slug: 'target', name: '🎯 打靶', desc: '限时60秒，射击移动靶子得分', Component: TargetGame,
    tips: { pc: '鼠标点击射击靶子', mobile: '点击射击靶子' } },
  { slug: 'memory', name: '🧠 记忆翻牌', desc: '翻牌配对，考验记忆力', Component: MemoryGame,
    tips: { pc: '点击翻牌，配对两张相同的', mobile: '点击翻牌' } },
  { slug: 'slidingpuzzle', name: '🧩 数字华容道', desc: '滑动方块，还原数字顺序', Component: SlidingPuzzle,
    tips: { pc: '点击方块滑动到空格', mobile: '点击方块滑动' } },
  { slug: 'defender', name: '🪐 行星防御', desc: '击落陨石，保卫家园', Component: DefenderGame,
    tips: { pc: '←→移动 空格射击', mobile: '点击按钮操作' } },
  { slug: 'bounce', name: '🐱 跳跳乐', desc: '不断弹跳，挑战最高高度', Component: BounceGame,
    tips: { pc: '←→ 左右移动 踩平台', mobile: '点击按钮左右移动' } },
  { slug: 'pong', name: '🕹️ 乒乓球', desc: '经典乒乓球对战AI', Component: PongGame,
    tips: { pc: '鼠标上下移动控制球拍', mobile: '手指滑动控制球拍' } },
]

const gameMap = Object.fromEntries(GAMES.map(g => [g.slug, g]))

export default function GamePage() {
  const params = useParams()
  const slug = params.slug
  const { user, loading } = useAuth()
  const game = gameMap[slug]
  const [leaderboard, setLeaderboard] = useState([])

  useEffect(() => {
    const load = async () => {
      if (!game) return
      const data = await getLeaderboard(slug)
      setLeaderboard(data)
    }
    load()
  }, [slug, game])

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
      const data = await getLeaderboard(slug)
      setLeaderboard(data)
    }
  }

  // 🔒 未登录 → 显示注册/登录提示
  if (!loading && !user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 text-sm text-[#888] hover:text-[#1a1a1a] transition-colors">
            <ChevronLeft size={18} /> 返回首页
          </Link>
          <div className="flex items-center gap-2 text-sm text-[#888]">
            <Gamepad2 size={16} /> 游戏娱乐
          </div>
        </div>
        <div className="text-center py-16">
          <div className="text-6xl mb-6">🎮</div>
          <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">{game.name}</h1>
          <p className="text-sm text-[#888] mb-2">{game.desc}</p>
          <div className="max-w-sm mx-auto mt-8 bg-white border border-[#ece8e0] rounded-2xl p-8 shadow-sm">
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="text-lg font-bold text-[#1a1a1a] mb-2">注册后可畅玩</h2>
            <p className="text-sm text-[#888] mb-6">注册登录后即可玩全部游戏，<br />还能冲击高分榜！</p>
            <div className="flex flex-col gap-3">
              <Link href="/register" className="btn-primary text-base py-3 flex items-center justify-center gap-2">
                <UserPlus size={18} /> 免费注册
              </Link>
              <Link href="/login" className="btn-secondary text-base py-3 flex items-center justify-center gap-2">
                <LogIn size={18} /> 已有账号？登录
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ⏳ 加载中
  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-8 h-8 border-2 border-[#ddd] border-t-[#1a1a1a] rounded-full animate-spin mx-auto" />
      </div>
    )
  }

  const GameComponent = game.Component

  return (
    <div className="space-y-6">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5 text-sm text-[#888] hover:text-[#1a1a1a] transition-colors">
          <ChevronLeft size={18} /> 返回首页
        </Link>
        <div className="flex items-center gap-2 text-sm text-[#888]">
          <Gamepad2 size={16} /> 游戏娱乐
        </div>
      </div>

      {/* 游戏标题 */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">{game.name}</h1>
        <p className="text-sm text-[#888] mt-1">{game.desc}</p>
      </div>

      {/* 游戏画布 */}
      <div className="flex justify-center">
        <GameComponent onScore={handleScore} />
      </div>

      {/* 💡 操作说明 */}
      <div className="max-w-md mx-auto w-full">
        <div className="bg-[#fafaf8] border border-[#ece8e0] rounded-xl px-5 py-4">
          <div className="text-xs font-semibold text-[#999] mb-2">💡 操作说明</div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm text-[#666]">
              <span className="text-base">🖥️</span>
              <span>{game.tips.pc}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#666]">
              <span className="text-base">📱</span>
              <span>{game.tips.mobile}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🏆 高分榜 */}
      <section>
        <h2 className="flex items-center gap-1.5 text-xs font-semibold text-[#bbb] uppercase tracking-widest mb-2">
          <Trophy size={14} /> {game.name} 高分榜
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
