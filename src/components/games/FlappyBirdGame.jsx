'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

import { useGameSound } from '@/components/games/SoundProvider'
const W = 350, H = 500
const BIRD_R = 12
const PIPE_W = 50, PIPE_GAP = 140
const GRAVITY = 0.4, FLAP = -7

export default function FlappyBirdGame({ onScore }) {
  const { play } = useGameSound()
  const canvasRef = useRef(null)
  const gameRef = useRef(null)
  const [state, setState] = useState('idle')
  const [score, setScore] = useState(0)

  const start = useCallback(() => { setState('playing'); setScore(0) }, [])

  useEffect(() => {
    if (state !== 'playing') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let bird = { x: 80, y: H / 2, vy: 0 }
    let pipes = []
    let gameScore = 0
    let running = true
    let frame = 0
    let flapPressed = false

    const draw = () => {
      // sky gradient
      const grad = ctx.createLinearGradient(0, 0, 0, H)
      grad.addColorStop(0, '#87ceeb'); grad.addColorStop(1, '#e0f0ff')
      ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H)
      // clouds
      ctx.fillStyle = 'rgba(255,255,255,0.6)'
      for (let i = 0; i < 3; i++) {
        const cx = (frame * 0.3 + i * 120) % (W + 80) - 40, cy = 30 + i * 40
        ctx.beginPath(); ctx.arc(cx, cy, 25, 0, Math.PI * 2); ctx.fill()
        ctx.beginPath(); ctx.arc(cx + 20, cy - 5, 20, 0, Math.PI * 2); ctx.fill()
        ctx.beginPath(); ctx.arc(cx + 35, cy, 18, 0, Math.PI * 2); ctx.fill()
      }
      // pipes
      pipes.forEach(p => {
        const grad2 = ctx.createLinearGradient(p.x, 0, p.x + PIPE_W, 0)
        grad2.addColorStop(0, '#5a8f3c'); grad2.addColorStop(0.3, '#7ec850'); grad2.addColorStop(0.7, '#7ec850'); grad2.addColorStop(1, '#4a7a2c')
        ctx.fillStyle = grad2
        // top pipe
        ctx.fillRect(p.x, 0, PIPE_W, p.top)
        ctx.fillRect(p.x - 3, p.top - 20, PIPE_W + 6, 20)
        // bottom pipe
        ctx.fillRect(p.x, p.top + PIPE_GAP, PIPE_W, H - p.top - PIPE_GAP)
        ctx.fillRect(p.x - 3, p.top + PIPE_GAP, PIPE_W + 6, 20)
        // highlight
        ctx.fillStyle = 'rgba(255,255,255,0.1)'
        ctx.fillRect(p.x + 5, 0, 8, p.top)
        ctx.fillRect(p.x + 5, p.top + PIPE_GAP, 8, H - p.top - PIPE_GAP)
      })
      // bird
      ctx.save(); ctx.translate(bird.x, bird.y)
      const angle = Math.min(bird.vy * 0.08, 0.5)
      ctx.rotate(angle)
      ctx.fillStyle = '#ffd700'
      ctx.shadowColor = '#ffd700'; ctx.shadowBlur = 8
      ctx.beginPath(); ctx.arc(0, 0, BIRD_R, 0, Math.PI * 2); ctx.fill()
      ctx.shadowBlur = 0
      // eye
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(5, -4, 6, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(7, -4, 3, 0, Math.PI * 2); ctx.fill()
      // beak
      ctx.fillStyle = '#ff6644'; ctx.beginPath()
      ctx.moveTo(BIRD_R + 2, 2); ctx.lineTo(BIRD_R + 10, 4); ctx.lineTo(BIRD_R + 2, 6)
      ctx.closePath(); ctx.fill()
      ctx.restore()
      // score
      ctx.fillStyle = '#fff'; ctx.font = 'bold 32px Inter, sans-serif'
      ctx.textAlign = 'center'; ctx.fillText(gameScore, W / 2, 50)
      ctx.strokeStyle = '#000'; ctx.lineWidth = 2
      ctx.strokeText(gameScore, W / 2, 50)
    }

    const tick = () => {
      if (!running) return
      frame++

      // flap
        play('jump'); if (flapPressed) { bird.vy = FLAP; flapPressed = false }

      // physics
      bird.vy += GRAVITY
      bird.y += bird.vy

      // spawn pipes
      if (pipes.length === 0 || pipes[pipes.length - 1].x < W - 200) {
        const top = 40 + Math.random() * (H - PIPE_GAP - 120)
        pipes.push({ x: W, top })
      }

      // move pipes
      pipes = pipes.filter(p => {
        p.x -= 3
        return p.x > -PIPE_W
      })

      // scoring
      pipes.forEach(p => {
        if (!p.scored && p.x + PIPE_W < bird.x) {
          p.scored = true; gameScore++; setScore(gameScore)
        }
      })

      // collision
      if (bird.y + BIRD_R > H || bird.y - BIRD_R < 0) {
        running = false;   play('gameover'); setState('over'); if (onScore) onScore(gameScore); return
      }
      for (const p of pipes) {
        if (bird.x + BIRD_R > p.x && bird.x - BIRD_R < p.x + PIPE_W) {
          if (bird.y - BIRD_R < p.top || bird.y + BIRD_R > p.top + PIPE_GAP) {
            running = false; setState('over'); if (onScore) onScore(gameScore); return
          }
        }
      }

      draw()
    }

    draw()
    const interval = setInterval(tick, 16)

    const flapHandler = (e) => {
      if ((e.key === ' ' || e.key === 'ArrowUp') && running) { e.preventDefault(); flapPressed = true }
    }
    window.addEventListener('keydown', flapHandler)

    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); flapPressed = true })
    canvas.addEventListener('click', () => { if (running) flapPressed = true })

    gameRef.current = () => {
      running = false; clearInterval(interval)
      window.removeEventListener('keydown', flapHandler)
    }
    return () => {
      running = false; clearInterval(interval)
      window.removeEventListener('keydown', flapHandler)
    }
  }, [state, onScore])

  useEffect(() => { return () => gameRef.current?.() }, [])

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6 flex-wrap justify-center">
        <div className="text-sm text-[#888]">得分: <span className="text-[#c23531] font-bold text-lg">{score}</span></div>
        {state === 'idle' && <button onClick={start} className="btn-primary">开始游戏</button>}
        {state === 'over' && (
          <div className="flex items-center gap-3">
            <span className="text-[#e94560] font-bold">游戏结束</span>
            <button onClick={start} className="btn-primary">再来一局</button>
          </div>
        )}
        {state === 'playing' && <span className="text-xs text-[#999] hidden sm:inline">空格/↑ 飞行</span>}
      </div>
      <canvas ref={canvasRef} width={W} height={H}
        className="rounded-xl border-2 border-[#87ceeb] shadow-lg touch-none" />
      <div className="sm:hidden text-xs text-[#999]">点击画布飞行</div>
    </div>
  )
}
