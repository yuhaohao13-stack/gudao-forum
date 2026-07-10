'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

import useGameSound from '@/components/games/useGameSound'
const W = 300, H = 500
const LANE_COUNT = 3
const LANE_W = W / LANE_COUNT // 100
const CAR_W = 36, CAR_H = 60
const PLAYER_Y = H - 80

export default function RacingGame({ onScore }) {
  const { play } = useGameSound()
  const canvasRef = useRef(null)
  const gameRef = useRef(null)
  const moveDirRef = useRef(null) // -1 left, 0 none, 1 right
  const [state, setState] = useState('idle')
  const [score, setScore] = useState(0)

  const start = useCallback(() => {
    setState('playing')
    setScore(0)
    moveDirRef.current = 0
  }, [])

  useEffect(() => {
    if (state !== 'playing') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let playerX = LANE_W // center lane
    let opponents = []
    let gameScore = 0
    let running = true
    let frame = 0
    let speed = 4
    let leftPressed = false
    let rightPressed = false

    const drawCar = (x, y, color, isPlayer) => {
      // body
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.roundRect(x, y, CAR_W, CAR_H, 8)
      ctx.fill()
      // windshield
      ctx.fillStyle = isPlayer ? '#87ceeb' : '#ffcc88'
      ctx.beginPath()
      ctx.roundRect(x + 5, y + 10, CAR_W - 10, 16, 4)
      ctx.fill()
      // headlights (top for opponents, bottom for player)
      ctx.fillStyle = isPlayer ? '#ff4444' : '#ffff44'
      if (isPlayer) {
        ctx.beginPath()
        ctx.arc(x + 7, y + CAR_H - 5, 4, 0, Math.PI * 2)
        ctx.arc(x + CAR_W - 7, y + CAR_H - 5, 4, 0, Math.PI * 2)
        ctx.fill()
      } else {
        ctx.beginPath()
        ctx.arc(x + 7, y + 5, 4, 0, Math.PI * 2)
        ctx.arc(x + CAR_W - 7, y + 5, 4, 0, Math.PI * 2)
        ctx.fill()
      }
      // side windows
      ctx.fillStyle = isPlayer ? '#6699cc' : '#cc9966'
      ctx.fillRect(x + 4, y + 16, 6, 8)
      ctx.fillRect(x + CAR_W - 10, y + 16, 6, 8)
    }

    const draw = () => {
      // road background
      ctx.fillStyle = '#333'
      ctx.fillRect(0, 0, W, H)
      // lane markings
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.setLineDash([20, 15])
      for (let i = 1; i < LANE_COUNT; i++) {
        const lx = i * LANE_W
        ctx.beginPath()
        ctx.moveTo(lx, 0)
        ctx.lineTo(lx, H)
        ctx.stroke()
      }
      ctx.setLineDash([])
      // road edges
      ctx.strokeStyle = '#ffcc00'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(0, 0); ctx.lineTo(0, H)
      ctx.moveTo(W, 0); ctx.lineTo(W, H)
      ctx.stroke()
      // center line animation
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.setLineDash([30, 20])
      ctx.beginPath()
      ctx.moveTo(W / 2, frame * speed % 50)
      ctx.lineTo(W / 2, H)
      ctx.stroke()
      ctx.setLineDash([])

      // opponents
      opponents.forEach(o => {
        drawCar(o.x, o.y, o.color, false)
      })
      // player
      drawCar(playerX, PLAYER_Y, '#e94560', true)
      // score
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 16px Inter, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(`🏎 ${Math.floor(gameScore)}m`, 10, 25)
    }

    const tick = () => {
      if (!running) return
      frame++

      // movement
      const move = moveDirRef.current
      if (move === -1 || leftPressed) {
        playerX = Math.max(4, playerX - 5)
      }
      if (move === 1 || rightPressed) {
        playerX = Math.min(W - CAR_W - 4, playerX + 5)
      }

      // spawn opponents
      if (frame % Math.max(20, 50 - speed * 2) === 0 && opponents.length < 4) {
        const lane = Math.floor(Math.random() * LANE_COUNT)
        const colors = ['#4488ff', '#44cc44', '#ff8844', '#aa44ff', '#ff44aa']
        opponents.push({
          x: lane * LANE_W + (LANE_W - CAR_W) / 2,
          y: -CAR_H - 10,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }

      // move opponents
      opponents = opponents.filter(o => {
        o.y += speed
        return o.y < H + 20
      })

      // score
        play('score'); gameScore += speed / 15
      setScore(Math.floor(gameScore))

      // speed up
      speed = 4 + Math.floor(gameScore / 300)

      // collision detection
      for (const o of opponents) {
        if (playerX + 4 < o.x + CAR_W - 4 &&
            playerX + CAR_W - 4 > o.x + 4 &&
            PLAYER_Y + 4 < o.y + CAR_H - 4 &&
            PLAYER_Y + CAR_H - 4 > o.y + 4) {
          running = false
          setState('over')
          setScore(Math.floor(gameScore))
          if (onScore) onScore(Math.floor(gameScore))
          return
        }
      }

      draw()
    }

    draw()
    const interval = setInterval(tick, 16)

    const keyHandler = (e) => {
      if (!running) return
      if (e.key === 'ArrowLeft') { e.preventDefault(); leftPressed = true }
      if (e.key === 'ArrowRight') { e.preventDefault(); rightPressed = true }
    }
    const keyUpHandler = (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); leftPressed = false }
      if (e.key === 'ArrowRight') { e.preventDefault(); rightPressed = false }
    }
    window.addEventListener('keydown', keyHandler)
    window.addEventListener('keyup', keyUpHandler)

    gameRef.current = () => {
      running = false
      clearInterval(interval)
      window.removeEventListener('keydown', keyHandler)
      window.removeEventListener('keyup', keyUpHandler)
    }
    return () => {
      running = false
      clearInterval(interval)
      window.removeEventListener('keydown', keyHandler)
      window.removeEventListener('keyup', keyUpHandler)
    }
  }, [state, onScore])

  useEffect(() => { return () => gameRef.current?.() }, [])

  return (
    <div className="flex flex-col items-center gap-[16px]">
      <div className="flex items-center gap-6 flex-wrap justify-center">
        <div className="text-sm text-[#888]">距离: <span className="text-[#c23531] font-bold text-lg">{score}</span>m</div>
        {state === 'idle' && <button onClick={start} className="btn-primary" style={{fontSize:"10px",padding:"10px 20px"}}>🏁 开始比赛</button>}
        {state === 'over' && (
          <div className="flex items-center gap-3">
            <span className="text-[#e94560] font-bold text-[18px]">💥 撞车了!</span>
            <button onClick={start} className="btn-primary" style={{fontSize:"10px",padding:"10px 20px"}}>再来一局</button>
          </div>
        )}
        {state === 'playing' && <span className="text-xs text-[#999] hidden sm:inline">← → 左右移动</span>}
      </div>
      <canvas ref={canvasRef} width={W} height={H}
        className="rounded-xl border-2 border-[#888] shadow-lg touch-none" />

      {state === 'playing' && (
        <div className="w-full sm:max-w-lg">
          <div className="flex gap-[32px] justify-center">
            <button className="flex-1 max-w-[40%] h-[48px] text-[60px] font-bold bg-white border-2 border-[#ddd] rounded-2xl active:bg-[#eee] shadow-lg touch-manipulation"
              onPointerDown={e => { e.preventDefault(); moveDirRef.current = -1 }}
              onPointerUp={e => { e.preventDefault(); moveDirRef.current = 0 }}
              onPointerLeave={e => { e.preventDefault(); moveDirRef.current = 0 }}
            >←</button>
            <button className="flex-1 max-w-[40%] h-[48px] text-[60px] font-bold bg-white border-2 border-[#ddd] rounded-2xl active:bg-[#eee] shadow-lg touch-manipulation"
              onPointerDown={e => { e.preventDefault(); moveDirRef.current = 1 }}
              onPointerUp={e => { e.preventDefault(); moveDirRef.current = 0 }}
              onPointerLeave={e => { e.preventDefault(); moveDirRef.current = 0 }}
            >→</button>
          </div>
        </div>
      )}
    </div>
  )
}
