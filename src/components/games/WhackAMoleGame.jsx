'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const COLS = 3, ROWS = 2
const HOLE_R = 48
const PADDING = 20
const CANVAS_W = COLS * (HOLE_R * 2 + PADDING) + PADDING
const CANVAS_H = ROWS * (HOLE_R * 2 + PADDING) + PADDING + 60
const GAME_DURATION = 30 // seconds

export default function WhackAMoleGame({ onScore }) {
  const canvasRef = useRef(null)
  const [state, setState] = useState('idle')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const gameRef = useRef(null)

  const start = useCallback(() => {
    setState('playing')
    setScore(0)
    setTimeLeft(GAME_DURATION)
  }, [])

  useEffect(() => {
    if (state !== 'playing') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let running = true
    let gameScore = 0
    let remaining = GAME_DURATION
    let mole = { row: -1, col: -1, visible: false, timer: null }

    // hole positions
    const holes = []
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++)
        holes.push({
          x: PADDING + c * (HOLE_R * 2 + PADDING) + HOLE_R,
          y: PADDING + r * (HOLE_R * 2 + PADDING) + HOLE_R + 50,
        })

    const showMole = () => {
      if (!running) return
      const idx = Math.floor(Math.random() * holes.length)
      mole.row = Math.floor(idx / COLS)
      mole.col = idx % COLS
      mole.visible = true
      if (mole.timer) clearTimeout(mole.timer)
      mole.timer = setTimeout(() => {
        mole.visible = false
        if (running) showMole()
      }, 800 + Math.random() * 400)
    }

    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)
      ctx.fillStyle = '#2d5a27'
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

      // grass pattern
      for (let i = 0; i < 20; i++) {
        ctx.fillStyle = `hsl(${120 + Math.random() * 20}, 50%, ${25 + Math.random() * 15}%)`
        const gx = Math.random() * CANVAS_W, gy = Math.random() * CANVAS_H
        ctx.fillRect(gx, gy, 3, 8 + Math.random() * 8)
      }

      // holes and moles
      holes.forEach((h, i) => {
        // hole
        ctx.fillStyle = '#3d2b1f'
        ctx.beginPath()
        ctx.ellipse(h.x, h.y + 10, HOLE_R - 5, 12, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#4a3728'
        ctx.beginPath()
        ctx.arc(h.x, h.y, HOLE_R - 5, 0, Math.PI)
        ctx.fill()

        // mole
        if (mole.visible && i === mole.row * COLS + mole.col) {
          ctx.fillStyle = '#8B4513'
          ctx.beginPath()
          ctx.arc(h.x, h.y - 10, 20, Math.PI, 0)
          ctx.fill()
          // face
          ctx.fillStyle = '#333'
          ctx.beginPath()
          ctx.arc(h.x - 6, h.y - 14, 3, 0, Math.PI * 2)
          ctx.arc(h.x + 6, h.y - 14, 3, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#ff6b6b'
          ctx.beginPath()
          ctx.arc(h.x, h.y - 6, 4, 0, Math.PI)
          ctx.fill()
        }
      })

      // score and time
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 20px Inter, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(`得分: ${gameScore}`, 15, 30)
      ctx.textAlign = 'right'
      ctx.fillText(`时间: ${remaining}s`, CANVAS_W - 15, 30)
    }

    draw()
    showMole()

    const interval = setInterval(() => {
      remaining--
      setTimeLeft(remaining)
      if (remaining <= 0) {
        running = false
        clearInterval(interval)
        if (mole.timer) clearTimeout(mole.timer)
        setState('over')
        if (onScore) onScore(gameScore)
      }
      draw()
    }, 1000)

    const clickHandler = (e) => {
      if (!running || !mole.visible) return
      const rect = canvas.getBoundingClientRect()
      const scaleX = CANVAS_W / rect.width
      const scaleY = CANVAS_H / rect.height
      const mx = (e.clientX - rect.left) * scaleX
      const my = (e.clientY - rect.top) * scaleY
      const h = holes[mole.row * COLS + mole.col]
      const dist = Math.sqrt((mx - h.x) ** 2 + (my - h.y) ** 2)
      if (dist < HOLE_R) {
        gameScore += 10
        setScore(gameScore)
        mole.visible = false
        if (mole.timer) clearTimeout(mole.timer)
        setTimeout(() => { if (running) showMole() }, 300)
      }
    }
    canvas.addEventListener('click', clickHandler)

    gameRef.current = () => {
      running = false; clearInterval(interval)
      if (mole.timer) clearTimeout(mole.timer)
      canvas.removeEventListener('click', clickHandler)
    }
    return () => {
      running = false; clearInterval(interval)
      if (mole.timer) clearTimeout(mole.timer)
      canvas.removeEventListener('click', clickHandler)
    }
  }, [state, onScore])

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6 flex-wrap justify-center">
        <div className="text-sm text-[#888]">得分: <span className="text-[#c23531] font-bold text-lg">{score}</span></div>
        {state === 'playing' && <div className="text-sm text-[#888]">⏱ {timeLeft}s</div>}
        {state === 'idle' && <button onClick={start} className="btn-primary">开始游戏</button>}
        {state === 'over' && (
          <div className="flex items-center gap-3">
            <span className="text-[#e94560] font-bold">游戏结束</span>
            <button onClick={start} className="btn-primary">再来一局</button>
          </div>
        )}
        {state === 'playing' && <span className="text-xs text-[#999]">点击地鼠打它！</span>}
      </div>
      <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H}
        className="rounded-xl border-2 border-[#2d5a27] shadow-lg max-w-full cursor-pointer" />
    </div>
  )
}
