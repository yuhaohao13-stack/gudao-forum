'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const W = 500, H = 300
const DINO_W = 30, DINO_H = 40
const GROUND_Y = H - 40
const OBSTACLE_W = 20

export default function DinoRunGame({ onScore }) {
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

    let dino = { x: 60, y: GROUND_Y - DINO_H, vy: 0, jumping: false }
    let obstacles = []
    let gameScore = 0
    let running = true
    let speed = 5
    let frame = 0
    let jumpPressed = false

    const draw = () => {
      ctx.fillStyle = '#f7f7f7'; ctx.fillRect(0, 0, W, H)
      // ground
      ctx.strokeStyle = '#535353'; ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(0, GROUND_Y); ctx.lineTo(W, GROUND_Y); ctx.stroke()
      // ground line pattern
      ctx.strokeStyle = '#ccc'; ctx.lineWidth = 1
      for (let x = (frame * 2) % 20; x < W; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, GROUND_Y + 5); ctx.lineTo(x + 10, GROUND_Y + 5); ctx.stroke()
      }
      // dino
      ctx.fillStyle = '#535353'
      ctx.fillRect(dino.x, dino.y, DINO_W, DINO_H)
      // eye
      ctx.fillStyle = '#fff'
      ctx.fillRect(dino.x + 20, dino.y + 6, 6, 6)
      ctx.fillStyle = '#000'
      ctx.fillRect(dino.x + 23, dino.y + 8, 3, 3)
      // legs animation
      if (!dino.jumping && Math.floor(frame / 5) % 2 === 0) {
        ctx.fillRect(dino.x + 4, dino.y + DINO_H, 6, 6)
        ctx.fillRect(dino.x + 18, dino.y + DINO_H, 6, 6)
      }
      // obstacles
      obstacles.forEach(o => {
        ctx.fillStyle = '#535353'
        ctx.fillRect(o.x, o.y, o.w, o.h)
      })
      // score
      ctx.fillStyle = '#535353'; ctx.font = 'bold 18px Inter, sans-serif'
      ctx.textAlign = 'right'; ctx.fillText(`🏃 ${Math.floor(gameScore)}`, W - 15, 30)
    }

    const tick = () => {
      if (!running) return
      frame++

      // gravity
      dino.vy += 0.6
      dino.y += dino.vy
      if (dino.y >= GROUND_Y - DINO_H) { dino.y = GROUND_Y - DINO_H; dino.vy = 0; dino.jumping = false }

      // jump
      if (jumpPressed && !dino.jumping) { dino.vy = -11; dino.jumping = true; jumpPressed = false }

      // spawn obstacles
      if (frame % (60 - Math.min(speed * 3, 35)) === 0 && obstacles.length < 3) {
        const h = 20 + Math.floor(Math.random() * 25)
        obstacles.push({ x: W, y: GROUND_Y - h, w: OBSTACLE_W, h })
      }

      // move obstacles
      obstacles = obstacles.filter(o => {
        o.x -= speed
        return o.x > -OBSTACLE_W
      })

      // score
      gameScore += speed / 10
      setScore(Math.floor(gameScore))

      // speed up
      speed = 5 + Math.floor(gameScore / 200)

      // collision
      for (const o of obstacles) {
        if (dino.x + DINO_W > o.x + 4 && dino.x < o.x + o.w - 4 &&
            dino.y + DINO_H > o.y + 4 && dino.y < o.y + o.h - 4) {
          running = false; setState('over')
          if (onScore) onScore(Math.floor(gameScore))
        }
      }

      draw()
    }

    draw()
    const interval = setInterval(tick, 16)

    const jumpHandler = (e) => {
      if ((e.key === ' ' || e.key === 'ArrowUp') && running) { e.preventDefault(); jumpPressed = true }
    }
    window.addEventListener('keydown', jumpHandler)

    // touch
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); jumpPressed = true })

    gameRef.current = () => {
      running = false; clearInterval(interval)
      window.removeEventListener('keydown', jumpHandler)
    }
    return () => {
      running = false; clearInterval(interval)
      window.removeEventListener('keydown', jumpHandler)
    }
  }, [state, onScore])

  useEffect(() => { return () => gameRef.current?.() }, [])

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6 flex-wrap justify-center">
        <div className="text-sm text-[#888]">距离: <span className="text-[#c23531] font-bold text-lg">{score}</span></div>
        {state === 'idle' && <button onClick={start} className="btn-primary">开始游戏</button>}
        {state === 'over' && (
          <div className="flex items-center gap-3">
            <span className="text-[#e94560] font-bold">游戏结束</span>
            <button onClick={start} className="btn-primary">再来一局</button>
          </div>
        )}
        {state === 'playing' && <span className="text-xs text-[#999] hidden sm:inline">空格/↑跳跃</span>}
      </div>
      <canvas ref={canvasRef} width={W} height={H}
        className="rounded-xl border-2 border-[#ccc] shadow-lg touch-none" />
      <div className="sm:hidden text-xs text-[#999]">点击画布跳跃</div>
    </div>
  )
}
