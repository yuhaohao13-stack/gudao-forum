'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

import useGameSound from '@/components/games/useGameSound'
const W = 500, H = 400
const TARGET_R = 22
const GAME_DURATION = 60
const MAX_TARGETS = 5
const SPAWN_INTERVAL = 800 // ms between spawns

export default function TargetGame({ onScore }) {
  const { play } = useGameSound()
  const { play } = useGameSound()
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
    let targets = []
    let lastSpawn = 0
    let animFrame = null
    let prevTime = 0

    const spawnTarget = () => {
      if (!running || targets.length >= MAX_TARGETS) return
      const y = 40 + Math.random() * (H - 80)
      const dir = Math.random() > 0.5 ? 1 : -1
      const x = dir === 1 ? -TARGET_R : W + TARGET_R
      const speed = 1.2 + Math.random() * 2
      const color = `hsl(${Math.floor(Math.random() * 30 + 350)}, 90%, 50%)`
      targets.push({ x, y, dir, speed, color, alive: true })
    }

    const drawCrosshair = (cx, cy, r) => {
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(cx - r * 0.5, cy)
      ctx.lineTo(cx + r * 0.5, cy)
      ctx.moveTo(cx, cy - r * 0.5)
      ctx.lineTo(cx, cy + r * 0.5)
      ctx.stroke()
      // small center dot
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2)
      ctx.fill()
    }

    const draw = (time) => {
      if (!running) return
      const dt = prevTime ? Math.min(time - prevTime, 50) : 16
      prevTime = time

      ctx.clearRect(0, 0, W, H)

      // background - shooting range
      ctx.fillStyle = '#1a1a2e'
      ctx.fillRect(0, 0, W, H)

      // horizontal guide lines
      ctx.strokeStyle = 'rgba(255,255,255,0.06)'
      ctx.lineWidth = 1
      for (let i = 0; i < H; i += 40) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(W, i)
        ctx.stroke()
      }

      // targets
      targets.forEach(t => {
        if (!t.alive) return
        // move
        t.x += t.dir * t.speed * (dt / 16)

        // draw outer glow
        ctx.shadowColor = t.color
        ctx.shadowBlur = 15

        // target body (3 rings)
        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.arc(t.x, t.y, TARGET_R, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = t.color
        ctx.beginPath()
        ctx.arc(t.x, t.y, TARGET_R - 3, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.arc(t.x, t.y, TARGET_R * 0.45, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = t.color
        ctx.beginPath()
        ctx.arc(t.x, t.y, TARGET_R * 0.28, 0, Math.PI * 2)
        ctx.fill()

        ctx.shadowBlur = 0

        // crosshair marking
        drawCrosshair(t.x, t.y, TARGET_R * 0.35)
      })

      // HUD
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 18px Inter, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(`🎯 ${gameScore}`, 15, 30)
      ctx.textAlign = 'right'
      ctx.fillText(`⏱ ${remaining}s`, W - 15, 30)

      // remove off-screen targets
      targets = targets.filter(t => {
        if (!t.alive) return false
        if (t.x < -TARGET_R * 2 || t.x > W + TARGET_R * 2) return false
        return true
      })

      // spawn new targets
      if (time - lastSpawn > SPAWN_INTERVAL) {
        lastSpawn = time
        spawnTarget()
      }

      animFrame = requestAnimationFrame(draw)
    }

    const tick = () => {
      if (!running) return
      remaining--
      setTimeLeft(remaining)
      if (remaining <= 0) {
        running = false
        if (animFrame) cancelAnimationFrame(animFrame)
          play('gameover');   play('gameover'); setState('over')
        if (onScore) onScore(gameScore)
      }
    }

    const clickHandler = (e) => {
      if (!running) return
      const rect = canvas.getBoundingClientRect()
      const scaleX = W / rect.width
      const scaleY = H / rect.height
      const mx = (e.clientX - rect.left) * scaleX
      const my = (e.clientY - rect.top) * scaleY

      let hit = false
      for (const t of targets) {
        if (!t.alive) continue
        const dist = Math.sqrt((mx - t.x) ** 2 + (my - t.y) ** 2)
        if (dist < TARGET_R) {
          t.alive = false
            play('hit');   play('hit'); gameScore += 10
          setScore(gameScore)
          hit = true
          break
        }
      }
      if (!hit) {
        gameScore = Math.max(0, gameScore - 1)
        setScore(gameScore)
      }
    }

    // initial targets
    for (let i = 0; i < 3; i++) spawnTarget()

    animFrame = requestAnimationFrame(draw)
    const timerInterval = setInterval(tick, 1000)
    canvas.addEventListener('click', clickHandler)

    gameRef.current = () => {
      running = false
      if (animFrame) cancelAnimationFrame(animFrame)
      clearInterval(timerInterval)
      canvas.removeEventListener('click', clickHandler)
    }
    return () => {
      running = false
      if (animFrame) cancelAnimationFrame(animFrame)
      clearInterval(timerInterval)
      canvas.removeEventListener('click', clickHandler)
    }
  }, [state, onScore])

  useEffect(() => { return () => gameRef.current?.() }, [])

  return (
    <div className="flex flex-col items-center gap-[16px]">
      <div className="flex items-center gap-[24px] flex-wrap justify-center">
        <div className="text-[14px] text-[#888]">得分: <span className="text-[#c23531] font-bold text-[18px]">{score}</span></div>
        {state === 'playing' && <div className="text-[14px] text-[#888]">⏱ {timeLeft}s</div>}
        {state === 'idle' && (
          <button onClick={start} className="btn-primary" style={{fontSize:"20px",padding:"20px 40px"}}>
            🎯 开始打靶
          </button>
        )}
        {state === 'over' && (
          <div className="flex items-center gap-[12px]">
            <span className="text-[#e94560] font-bold text-[18px]">🎯 射击结束!</span>
            <button onClick={start} className="btn-primary" style={{fontSize:"20px",padding:"20px 40px"}}>
              再来一局
            </button>
          </div>
        )}
        {state === 'playing' && <span className="text-[12px] text-[#999]">点击靶子 +10分，点空 -1分</span>}
      </div>
      <canvas ref={canvasRef} width={W} height={H}
        className="rounded-2xl border-2 border-[#1a1a3e] shadow-lg touch-none cursor-pointer" />
    </div>
  )
}
