'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

import useGameSound from '@/components/games/useGameSound'
const W = 400, H = 600
const PLAYER_W = 30, PLAYER_H = 30
const PLATFORM_W = 70, PLATFORM_H = 14
const GRAVITY = 0.5
const JUMP_VEL = -10
const MOVE_SPEED = 5

export default function BounceGame({ onScore }) {
  const { play } = useGameSound()
  const { play } = useGameSound()
  const canvasRef = useRef(null)
  const gameRef = useRef(null)
  const [state, setState] = useState('idle')
  const [score, setScore] = useState(0)
  const keysRef = useRef({ left: false, right: false })

  const start = useCallback(() => { setState('playing'); setScore(0) }, [])

  const pressLeft = useCallback(() => { keysRef.current.left = true }, [])
  const releaseLeft = useCallback(() => { keysRef.current.left = false }, [])
  const pressRight = useCallback(() => { keysRef.current.right = true }, [])
  const releaseRight = useCallback(() => { keysRef.current.right = false }, [])

  useEffect(() => {
    if (state !== 'playing') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let player = {
      x: W / 2 - PLAYER_W / 2,
      y: H - 150,
      vy: 0,
    }

    let platforms = []
    let cameraY = 0
    let gameScore = 0
    let running = true

    // generate initial platforms
    for (let i = 0; i < 10; i++) {
      platforms.push({
        x: Math.random() * (W - PLATFORM_W),
        y: H - 60 - i * 70,
        w: PLATFORM_W,
        h: PLATFORM_H,
        moving: Math.random() < 0.2,
        dir: Math.random() < 0.5 ? 1 : -1,
        speed: 1 + Math.random() * 1.5,
      })
    }

    const generatePlatforms = () => {
      const highestY = platforms.reduce((min, p) => Math.min(min, p.y), Infinity)
      while (platforms.length < 18) {
        const lastY = platforms.length > 0
          ? platforms[platforms.length - 1].y
          : highestY
        const y = lastY - 50 - Math.random() * 50
        platforms.push({
          x: Math.random() * (W - PLATFORM_W),
          y,
          w: PLATFORM_W,
          h: PLATFORM_H,
          moving: Math.random() < 0.2,
          dir: Math.random() < 0.5 ? 1 : -1,
          speed: 1 + Math.random() * 1.5,
        })
      }
    }

    generatePlatforms()

    const draw = () => {
      // background - gradient from dark blue
      const grad = ctx.createLinearGradient(0, 0, 0, H)
      grad.addColorStop(0, '#1a1a3e')
      grad.addColorStop(0.5, '#162447')
      grad.addColorStop(1, '#0f0f23')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)

      // stars
      ctx.fillStyle = 'rgba(255,255,255,0.3)'
      for (let i = 0; i < 30; i++) {
        const sx = (i * 37 + 13) % W
        const sy = (i * 53 + 7) % H
        ctx.fillRect(sx, sy, 2, 2)
      }

      // platforms
      platforms.forEach(p => {
        const py = p.y - cameraY
        if (py < -30 || py > H + 30) return

        // platform shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)'
        ctx.fillRect(p.x + 3, py + 3, p.w, p.h)

        // platform color
        if (p.moving) {
          ctx.fillStyle = '#e94560'
        } else {
          const hue = 200 + (p.y * 0.02) % 60
          ctx.fillStyle = `hsl(${hue}, 70%, 55%)`
        }
        ctx.beginPath()
        ctx.roundRect(p.x, py, p.w, p.h, 4)
        ctx.fill()

        // highlight on top
        ctx.fillStyle = 'rgba(255,255,255,0.2)'
        ctx.fillRect(p.x + 4, py + 2, p.w - 8, 4)
      })

      // player
      const px = player.x
      const py = player.y - cameraY

      // player shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)'
      ctx.fillRect(px + 3, py + 3, PLAYER_W, PLAYER_H)

      // player body
      ctx.fillStyle = '#ffd700'
      ctx.shadowColor = '#ffd700'
      ctx.shadowBlur = 8
      ctx.fillRect(px, py, PLAYER_W, PLAYER_H)
      ctx.shadowBlur = 0

      // face
      ctx.fillStyle = '#000'
      // eyes
      ctx.fillRect(px + 7, py + 8, 4, 4)
      ctx.fillRect(px + 19, py + 8, 4, 4)
      // mouth
      if (player.vy < 0) {
        // smile (going up)
        ctx.fillRect(px + 9, py + 18, 12, 3)
        ctx.fillRect(px + 9, py + 18, 3, 2)
        ctx.fillRect(px + 18, py + 18, 3, 2)
      } else {
        ctx.fillRect(px + 9, py + 19, 12, 2)
      }

      // score
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 24px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(Math.floor(gameScore), W / 2, 40)
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 2
      ctx.strokeText(Math.floor(gameScore), W / 2, 40)
    }

    const tick = () => {
      if (!running) return

      // horizontal movement from ref
      const keys = keysRef.current
      if (keys.left) player.x -= MOVE_SPEED
      if (keys.right) player.x += MOVE_SPEED
      player.x = Math.max(0, Math.min(W - PLAYER_W, player.x))

      // gravity
      player.vy += GRAVITY
      player.y += player.vy

      // camera follows player
      const targetCam = player.y - H * 0.55
      cameraY = Math.max(0, cameraY + (targetCam - cameraY) * 0.15)

      // update moving platforms
      platforms.forEach(p => {
        if (p.moving) {
          p.x += p.dir * p.speed
          if (p.x < 0 || p.x + p.w > W) p.dir *= -1
        }
      })

      // platform collision (only when falling)
      if (player.vy > 0) {
        platforms.forEach(p => {
          const playerBottom = player.y + PLAYER_H
          const prevBottom = playerBottom - player.vy
          if (
            player.x + PLAYER_W > p.x &&
            player.x < p.x + p.w &&
            playerBottom >= p.y &&
            playerBottom <= p.y + p.h + player.vy &&
            prevBottom <= p.y + 5
          ) {
            player.y = p.y - PLAYER_H
            player.vy = JUMP_VEL
            gameScore += 1
            setScore(Math.floor(gameScore))
            if (onScore) onScore(Math.floor(gameScore))
          }
        })
      }

      // generate new platforms ahead
      const highestY = platforms.reduce((min, p) => Math.min(min, p.y), Infinity)
      if (highestY > cameraY - 200) {
        generatePlatforms()
      }

      // remove platforms far below
      platforms = platforms.filter(p => p.y - cameraY < H + 60)

      // game over
      if (player.y - cameraY > H + 50) {
        running = false
          play('gameover');   play('gameover'); setState('over')
        if (onScore) onScore(Math.floor(gameScore))
        return
      }

      draw()
    }

    draw()
    const interval = setInterval(tick, 16)

    const keyDown = (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); keysRef.current.left = true }
      if (e.key === 'ArrowRight') { e.preventDefault(); keysRef.current.right = true }
    }
    const keyUp = (e) => {
      if (e.key === 'ArrowLeft') { keysRef.current.left = false }
      if (e.key === 'ArrowRight') { keysRef.current.right = false }
    }
    window.addEventListener('keydown', keyDown)
    window.addEventListener('keyup', keyUp)

    const touchHandler = (e) => {
      if (!running) return
      const rect = canvas.getBoundingClientRect()
      const tx = (e.touches[0].clientX - rect.left) * (W / rect.width)
      keysRef.current.left = tx < W / 2
      keysRef.current.right = tx >= W / 2
    }
    const touchEndHandler = () => { keysRef.current.left = false; keysRef.current.right = false }
    canvas.addEventListener('touchstart', touchHandler, { passive: true })
    canvas.addEventListener('touchmove', touchHandler, { passive: true })
    canvas.addEventListener('touchend', touchEndHandler)

    gameRef.current = () => {
      running = false
      clearInterval(interval)
      window.removeEventListener('keydown', keyDown)
      window.removeEventListener('keyup', keyUp)
      canvas.removeEventListener('touchstart', touchHandler)
      canvas.removeEventListener('touchmove', touchHandler)
      canvas.removeEventListener('touchend', touchEndHandler)
    }
    return () => {
      running = false
      clearInterval(interval)
      window.removeEventListener('keydown', keyDown)
      window.removeEventListener('keyup', keyUp)
      canvas.removeEventListener('touchstart', touchHandler)
      canvas.removeEventListener('touchmove', touchHandler)
      canvas.removeEventListener('touchend', touchEndHandler)
    }
  }, [state, onScore])

  useEffect(() => {
    return () => { if (gameRef.current) gameRef.current() }
  }, [])

  return (
    <div className="flex flex-col items-center gap-[16px]">
      <div className="flex items-center gap-[24px] flex-wrap justify-center">
        <div className="text-[14px] text-[#888]">
          高度: <span className="text-[#c23531] font-bold text-[18px]">{Math.floor(score)}</span>
        </div>
        {state === 'idle' && (
          <button onClick={start} className="btn-primary" style={{ fontSize: '20px', padding: '20px 40px' }}>
            开始游戏
          </button>
        )}
        {state === 'over' && (
          <div className="flex items-center gap-[12px]">
            <span className="text-[#e94560] font-bold text-[18px]">掉下去了!</span>
            <button onClick={start} className="btn-primary" style={{ fontSize: '20px', padding: '20px 40px' }}>
              再来一局
            </button>
          </div>
        )}
        {state === 'playing' && (
          <span className="text-[12px] text-[#999] hidden sm:inline">← → 方向键移动</span>
        )}
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="rounded-2xl border-2 border-[#1a1a3e] shadow-lg max-w-full touch-none"
      />
      {state === 'playing' && (
        <div className="sm:hidden flex gap-[32px]">
          <button
            onPointerDown={pressLeft}
            onPointerUp={releaseLeft}
            onPointerLeave={releaseLeft}
            className="w-[80px] h-[48px] bg-white border-2 border-[#ddd] rounded-2xl font-bold text-[20px] active:bg-[#eee] touch-manipulation select-none"
          >
            ←
          </button>
          <button
            onPointerDown={pressRight}
            onPointerUp={releaseRight}
            onPointerLeave={releaseRight}
            className="w-[80px] h-[48px] bg-white border-2 border-[#ddd] rounded-2xl font-bold text-[20px] active:bg-[#eee] touch-manipulation select-none"
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}
