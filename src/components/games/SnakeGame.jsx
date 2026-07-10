'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const SIZE = 20, CELL = 18, CANVAS = SIZE * CELL
const INIT_SNAKE = [{ x: 10, y: 10 }]
const DIRS = { ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 } }

export default function SnakeGame({ onScore }) {
  const canvasRef = useRef(null)
  const setDirRef = useRef(null) // 暴露给外部按钮
  const gameRef = useRef(null)
  const [state, setState] = useState('idle')
  const [score, setScore] = useState(0)

  const start = useCallback(() => {
    setState('playing')
    setScore(0)
  }, [])

  useEffect(() => {
    if (state !== 'playing') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let snake = INIT_SNAKE.map(p => ({ ...p }))
    let dir = { x: 1, y: 0 }
    let nextDir = { x: 1, y: 0 }
    let food = { x: 15, y: 10 }
    let gameScore = 0
    let running = true

    const setDirection = (d) => {
      if (d.x + dir.x === 0 && d.y + dir.y === 0) return
      nextDir = d
    }
    setDirRef.current = setDirection

    const draw = () => {
      ctx.fillStyle = '#1a1a2e'
      ctx.fillRect(0, 0, CANVAS, CANVAS)
      ctx.strokeStyle = '#16213e'
      ctx.lineWidth = 0.5
      for (let i = 0; i <= SIZE; i++) {
        ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, CANVAS); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(CANVAS, i * CELL); ctx.stroke()
      }
      snake.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? '#e94560' : '#0f3460'
        ctx.shadowColor = i === 0 ? '#e94560' : 'transparent'
        ctx.shadowBlur = i === 0 ? 8 : 0
        ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2)
        ctx.shadowBlur = 0
      })
      ctx.fillStyle = '#ffd700'
      ctx.shadowColor = '#ffd700'
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
    }

    const spawnFood = () => {
      const occupied = new Set(snake.map(s => `${s.x},${s.y}`))
      let pos
      do { pos = { x: Math.floor(Math.random() * SIZE), y: Math.floor(Math.random() * SIZE) } }
      while (occupied.has(`${pos.x},${pos.y}`))
      food = pos
    }

    const tick = () => {
      if (!running) return
      dir = { ...nextDir }
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y }
      if (head.x < 0 || head.x >= SIZE || head.y < 0 || head.y >= SIZE) {
        running = false; setState('over'); setScore(gameScore); if (onScore) onScore(gameScore); return
      }
      if (snake.some(s => s.x === head.x && s.y === head.y)) {
        running = false; setState('over'); setScore(gameScore); if (onScore) onScore(gameScore); return
      }
      snake.unshift(head)
      if (head.x === food.x && head.y === food.y) { gameScore += 10; setScore(gameScore); spawnFood() }
      else snake.pop()
      draw()
    }

    spawnFood(); draw()
    const interval = setInterval(tick, 180)
    const keyHandler = (e) => {
      const d = DIRS[e.key]; if (!d) return; e.preventDefault(); setDirection(d)
    }
    window.addEventListener('keydown', keyHandler)

    // 滑动支持
    let tx = 0, ty = 0
    const ts = (e) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY }
    const te = (e) => {
      const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty
      const ax = Math.abs(dx), ay = Math.abs(dy)
      if (Math.max(ax, ay) < 20) return
      if (ax > ay) setDirection(dx > 0 ? DIRS.ArrowRight : DIRS.ArrowLeft)
      else setDirection(dy > 0 ? DIRS.ArrowDown : DIRS.ArrowUp)
    }
    canvas.addEventListener('touchstart', ts)
    canvas.addEventListener('touchend', te)

    gameRef.current = () => {
      running = false; clearInterval(interval)
      window.removeEventListener('keydown', keyHandler)
      canvas.removeEventListener('touchstart', ts)
      canvas.removeEventListener('touchend', te)
    }
    return () => {
      running = false; clearInterval(interval)
      window.removeEventListener('keydown', keyHandler)
      canvas.removeEventListener('touchstart', ts)
      canvas.removeEventListener('touchend', te)
    }
  }, [state, onScore])

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center justify-center gap-4">
        <div className="text-sm font-medium text-[#888]">得分: <span className="text-[#c23531] font-bold text-lg">{score}</span></div>
        {state === 'idle' && <button onClick={start} className="btn-primary">开始游戏</button>}
        {state === 'over' && (
          <div className="flex items-center gap-3">
            <span className="text-[#e94560] font-bold">游戏结束</span>
            <button onClick={start} className="btn-primary">再来一局</button>
          </div>
        )}
        {state === 'playing' && <span className="text-xs text-[#999]">滑动或按键控制</span>}
      </div>
      <canvas ref={canvasRef} width={CANVAS} height={CANVAS}
        className="rounded-xl border-2 border-[#1a1a2e] shadow-lg touch-none" />

      {state === 'playing' && (
        <div className="w-full" style={{maxWidth:CANVAS+'px'}}>
          <div className="flex justify-center mb-2">
            <button className="flex-1 max-w-[30%] h-20 text-4xl font-bold bg-white border-2 border-[#ddd] rounded-2xl active:bg-[#eee] shadow-lg touch-manipulation"
              onTouchStart={e => { e.preventDefault(); setDirRef.current?.(DIRS.ArrowUp) }}
            >↑</button>
          </div>
          <div className="flex gap-5">
            <button className="flex-1 h-20 text-4xl font-bold bg-white border-2 border-[#ddd] rounded-2xl active:bg-[#eee] shadow-lg touch-manipulation"
              onTouchStart={e => { e.preventDefault(); setDirRef.current?.(DIRS.ArrowLeft) }}
            >←</button>
            <button className="flex-1 h-20 text-4xl font-bold bg-white border-2 border-[#ddd] rounded-2xl active:bg-[#eee] shadow-lg touch-manipulation"
              onTouchStart={e => { e.preventDefault(); setDirRef.current?.(DIRS.ArrowDown) }}
            >↓</button>
            <button className="flex-1 h-20 text-4xl font-bold bg-white border-2 border-[#ddd] rounded-2xl active:bg-[#eee] shadow-lg touch-manipulation"
              onTouchStart={e => { e.preventDefault(); setDirRef.current?.(DIRS.ArrowRight) }}
            >→</button>
          </div>
        </div>
      )}
    </div>
  )
}
