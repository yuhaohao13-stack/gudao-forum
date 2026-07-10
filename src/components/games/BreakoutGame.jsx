'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

import { useGameSound } from '@/components/games/SoundProvider'
const W = 480, H = 640
const PADDLE_W = 80, PADDLE_H = 12
const BALL_R = 6
const BRICK_ROWS = 6, BRICK_COLS = 8
const BRICK_W = 52, BRICK_H = 18, BRICK_GAP = 4, BRICK_TOP = 60
const COLORS = ['#e94560', '#f0a000', '#00f0f0', '#00f000', '#a000f0', '#f0f000']

export default function BreakoutGame({ onScore }) {
  const { play } = useGameSound()
  const canvasRef = useRef(null)
  const [state, setState] = useState('idle')
  const [score, setScore] = useState(0)
  const gameRef = useRef(null)

  const start = useCallback(() => {
    setState('playing')
    setScore(0)
  }, [])

  useEffect(() => {
    if (state !== 'playing') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let paddle = { x: (W - PADDLE_W) / 2, y: H - 40 }
    let ball = { x: W / 2, y: H - 60, dx: 4, dy: -4 }
    let gameScore = 0
    let running = true
    let mouseX = paddle.x

    // bricks
    let bricks = []
    for (let r = 0; r < BRICK_ROWS; r++) {
      for (let c = 0; c < BRICK_COLS; c++) {
        bricks.push({
          x: c * (BRICK_W + BRICK_GAP) + BRICK_GAP,
          y: r * (BRICK_H + BRICK_GAP) + BRICK_TOP,
          w: BRICK_W, h: BRICK_H,
          alive: true,
          color: COLORS[r % COLORS.length],
        })
      }
    }

    const draw = () => {
      ctx.fillStyle = '#0f0f23'
      ctx.fillRect(0, 0, W, H)

      // bricks
      bricks.forEach(b => {
        if (!b.alive) return
        ctx.fillStyle = b.color
        ctx.shadowColor = b.color
        ctx.shadowBlur = 6
        ctx.beginPath()
        ctx.roundRect(b.x, b.y, b.w, b.h, 4)
        ctx.fill()
        ctx.shadowBlur = 0
      })

      // paddle
      ctx.fillStyle = '#fff'
      ctx.shadowColor = '#fff'
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.roundRect(paddle.x, paddle.y, PADDLE_W, PADDLE_H, 6)
      ctx.fill()
      ctx.shadowBlur = 0

      // ball
      ctx.fillStyle = '#ffd700'
      ctx.shadowColor = '#ffd700'
      ctx.shadowBlur = 12
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
    }

    const tick = () => {
      if (!running) return

      // paddle follow mouse
      paddle.x = Math.max(0, Math.min(W - PADDLE_W, mouseX - PADDLE_W / 2))

      // ball movement
      ball.x += ball.dx
      ball.y += ball.dy

      // wall bounce
      if (ball.x - BALL_R <= 0 || ball.x + BALL_R >= W) ball.dx = -ball.dx
      if (ball.y - BALL_R <= 0) ball.dy = -ball.dy

      // paddle bounce
      if (ball.y + BALL_R >= paddle.y && ball.y - BALL_R <= paddle.y + PADDLE_H &&
          ball.x >= paddle.x - BALL_R && ball.x <= paddle.x + PADDLE_W + BALL_R && ball.dy > 0) {
        ball.dy = -ball.dy
        ball.y = paddle.y - BALL_R
        const hit = (ball.x - paddle.x) / PADDLE_W
        play('bounce'); ball.dx = 3 + (hit - 0.5) * 4 // angle varies by hit position
      }

      // brick collision
      bricks.forEach(b => {
        if (!b.alive) return
        if (ball.x + BALL_R > b.x && ball.x - BALL_R < b.x + b.w &&
            ball.y + BALL_R > b.y && ball.y - BALL_R < b.y + b.h) {
          b.alive = false
          gameScore += 10
          setScore(gameScore)
          // bounce direction
          const overlapX = Math.min(ball.x + BALL_R - b.x, b.x + b.w - (ball.x - BALL_R))
          const overlapY = Math.min(ball.y + BALL_R - b.y, b.y + b.h - (ball.y - BALL_R))
          if (overlapX < overlapY) ball.dx = -ball.dx
          else ball.dy = -ball.dy
        }
      })

      // bottom out
      if (ball.y - BALL_R > H) {
        running = false
        setState('over')
        setScore(gameScore)
        if (onScore) onScore(gameScore)
        return
      }

      // win check
      if (bricks.every(b => !b.alive)) {
        running = false
        setState('over')
        setScore(gameScore)
        if (onScore) onScore(gameScore)
        return
      }

      draw()
    }

    draw()
    const interval = setInterval(tick, 16)

    const mouseHandler = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = (e.clientX - rect.left) * (W / rect.width)
    }
    const touchHandler = (e) => {
      e.preventDefault()
      const rect = canvas.getBoundingClientRect()
      mouseX = (e.touches[0].clientX - rect.left) * (W / rect.width)
    }
    canvas.addEventListener('mousemove', mouseHandler)
    canvas.addEventListener('touchmove', touchHandler, { passive: false })
    canvas.addEventListener('touchstart', touchHandler, { passive: false })

    gameRef.current = () => {
      running = false; clearInterval(interval)
      canvas.removeEventListener('mousemove', mouseHandler)
      canvas.removeEventListener('touchmove', touchHandler)
      canvas.removeEventListener('touchstart', touchHandler)
    }
    return () => {
      running = false; clearInterval(interval)
      canvas.removeEventListener('mousemove', mouseHandler)
      canvas.removeEventListener('touchmove', touchHandler)
      canvas.removeEventListener('touchstart', touchHandler)
    }
  }, [state, onScore])

  useEffect(() => {
    return () => { if (gameRef.current) gameRef.current() }
  }, [])

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
        {state === 'playing' && <span className="text-xs text-[#999]">鼠标/手指移动控制挡板</span>}
      </div>
      <canvas ref={canvasRef} width={W} height={H}
        className="rounded-xl border-2 border-[#1a1a3e] shadow-lg max-w-full touch-none" />
    </div>
  )
}
