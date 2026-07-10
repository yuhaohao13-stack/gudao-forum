'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

import useGameSound from '@/components/games/useGameSound'
const W = 600, H = 300
const PLAYER_W = 24, PLAYER_H = 32
const PLAYER_X = 80
const GROUND_H = 24
const GROUND_Y = H - GROUND_H

export default function MarioGame({ onScore }) {
  const { play } = useGameSound()
  const canvasRef = useRef(null)
  const gameRef = useRef(null)
  const jumpRef = useRef(false)
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

    let player = { x: PLAYER_X, y: GROUND_Y - PLAYER_H, vy: 0, onGround: false }
    let obstacles = [] // stationary enemies/blocks
    let platforms = [] // ground segments and floating platforms
    let gameScore = 0
    let running = true
    let frame = 0
    let speed = 3
    let jumpPressed = false
    let scrollX = 0 // world scroll offset

    const isSolidAt = (x, y, w, h) => {
      // check platforms (ground segments + floating)
      for (const p of platforms) {
        if (x + w > p.x && x < p.x + p.w &&
            y + h > p.y && y < p.y + p.h) {
          return { solid: true, platform: p }
        }
      }
      return { solid: false }
    }

    const generateWorld = (minX) => {
      // generate ground segments ahead of the player
      let lastX = platforms.length > 0 ? platforms[platforms.length - 1].x + platforms[platforms.length - 1].w : -scrollX
      while (lastX < minX + W + 100) {
        const segW = 80 + Math.floor(Math.random() * 120)
        platforms.push({ x: lastX, y: GROUND_Y, w: segW, h: GROUND_H, type: 'ground' })
        lastX += segW
        // gap
        const gap = 30 + Math.floor(Math.random() * 50)
        lastX += gap
        // sometimes add a floating platform over the gap
        if (Math.random() > 0.5) {
          const fpX = lastX - gap + Math.random() * (gap - 60)
          const fpY = GROUND_Y - 60 - Math.floor(Math.random() * 50)
          platforms.push({ x: fpX, y: fpY, w: 60 + Math.floor(Math.random() * 40), h: 12, type: 'float' })
        }
      }
    }

    const generateObstacles = (minX) => {
      let lastOX = obstacles.length > 0 ? obstacles[obstacles.length - 1].x : -scrollX
      while (lastOX < minX + W + 200) {
        lastOX += 200 + Math.floor(Math.random() * 300)
        // only place obstacles on ground segments
        for (const p of platforms) {
          if (p.type === 'ground' && lastOX > p.x + 20 && lastOX < p.x + p.w - 30) {
            obstacles.push({
              x: lastOX,
              y: GROUND_Y - 20,
              w: 20,
              h: 20,
              color: '#e94560',
            })
            break
          }
        }
      }
    }

    // initial world generation
    generateWorld(0)
    generateObstacles(0)

    const draw = () => {
      // sky
      const grad = ctx.createLinearGradient(0, 0, 0, H)
      grad.addColorStop(0, '#87ceeb')
      grad.addColorStop(1, '#d4efff')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)

      // clouds (parallax-ish)
      ctx.fillStyle = 'rgba(255,255,255,0.6)'
      for (let i = 0; i < 4; i++) {
        const cx = (frame * 0.2 + i * 170) % (W + 80) - 40
        const cy = 20 + i * 25
        ctx.beginPath()
        ctx.arc(cx, cy, 20, 0, Math.PI * 2)
        ctx.arc(cx + 18, cy - 5, 16, 0, Math.PI * 2)
        ctx.arc(cx + 32, cy, 18, 0, Math.PI * 2)
        ctx.fill()
      }

      // hills (background)
      ctx.fillStyle = '#7ec850'
      for (let i = 0; i < 5; i++) {
        const hx = (i * 200 - scrollX * 0.3) % (W + 200) - 100
        const hy = GROUND_Y
        ctx.beginPath()
        ctx.arc(hx + 50, hy, 60, Math.PI, 0)
        ctx.fill()
      }

      // draw platforms/ground
      for (const p of platforms) {
        const px = p.x + scrollX
        if (px + p.w < -10 || px > W + 10) continue
        if (p.type === 'ground') {
          ctx.fillStyle = '#8B5E3C'
          ctx.fillRect(px, p.y, p.w, p.h)
          // grass top
          ctx.fillStyle = '#4CAF50'
          ctx.fillRect(px, p.y, p.w, 4)
          // dirt pattern
          ctx.fillStyle = '#6B4226'
          for (let dx = 0; dx < p.w; dx += 18) {
            ctx.fillRect(px + dx + 5, p.y + 8, 8, 4)
            ctx.fillRect(px + dx + 12, p.y + 14, 6, 4)
          }
        } else {
          // floating platform
          ctx.fillStyle = '#8B5E3C'
          ctx.beginPath()
          ctx.roundRect(px, p.y, p.w, p.h, 4)
          ctx.fill()
          ctx.fillStyle = '#4CAF50'
          ctx.fillRect(px, p.y, p.w, 3)
        }
      }

      // draw obstacles
      for (const o of obstacles) {
        const ox = o.x + scrollX
        if (ox + o.w < -10 || ox > W + 10) continue
        ctx.fillStyle = o.color
        ctx.fillRect(ox, o.y, o.w, o.h)
        // face
        ctx.fillStyle = '#fff'
        ctx.fillRect(ox + 3, o.y + 4, 5, 4)
        ctx.fillRect(ox + o.w - 8, o.y + 4, 5, 4)
        ctx.fillStyle = '#000'
        ctx.fillRect(ox + 4, o.y + 5, 3, 3)
        ctx.fillRect(ox + o.w - 7, o.y + 5, 3, 3)
        // angry mouth
        ctx.fillRect(ox + 6, o.y + 14, o.w - 12, 2)
      }

      // draw player (Mario)
      const px = player.x
      const py = player.y
      // body
      ctx.fillStyle = '#e94560'
      ctx.fillRect(px, py, PLAYER_W, PLAYER_H)
      // hat
      ctx.fillStyle = '#c23531'
      ctx.fillRect(px - 2, py - 4, PLAYER_W + 4, 6)
      // face
      ctx.fillStyle = '#ffd'
      ctx.fillRect(px + 4, py + 6, PLAYER_W - 8, 10)
      // eyes
      ctx.fillStyle = '#000'
      ctx.fillRect(px + 7, py + 8, 3, 3)
      ctx.fillRect(px + PLAYER_W - 10, py + 8, 3, 3)
      // mustache
      ctx.fillRect(px + 4, py + 13, PLAYER_W - 8, 2)
      // overalls
      ctx.fillStyle = '#4488ff'
      ctx.fillRect(px + 2, py + 18, PLAYER_W - 4, 10)
      ctx.fillStyle = '#ffd700'
      ctx.fillRect(px + 6, py + 20, 4, 4)
      ctx.fillRect(px + PLAYER_W - 10, py + 20, 4, 4)
      // legs (animated)
      ctx.fillStyle = '#8B5E3C'
      if (player.onGround) {
        const legOff = Math.floor(frame / 6) % 2 === 0 ? 2 : -2
        ctx.fillRect(px + 4, py + PLAYER_H, 7, 5)
        ctx.fillRect(px + PLAYER_W - 11 + legOff, py + PLAYER_H, 7, 5)
      } else {
        // tuck legs in
        ctx.fillRect(px + 4, py + PLAYER_H - 2, 7, 5)
        ctx.fillRect(px + PLAYER_W - 11, py + PLAYER_H - 2, 7, 5)
      }

      // score
      ctx.fillStyle = '#333'
      ctx.font = 'bold 16px Inter, sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(`🍄 ${Math.floor(gameScore)}`, W - 15, 25)

      // progress bar
      const barW = 100, barH = 8
      ctx.fillStyle = '#ccc'
      ctx.beginPath()
      ctx.roundRect(W / 2 - barW / 2, 8, barW, barH, 4)
      ctx.fill()
      ctx.fillStyle = '#4CAF50'
      ctx.beginPath()
      ctx.roundRect(W / 2 - barW / 2, 8, Math.min(barW, (gameScore % 500) / 500 * barW), barH, 4)
      ctx.fill()
    }

    const tick = () => {
      if (!running) return
      frame++

      // handle jump
      if ((jumpPressed || jumpRef.current) && player.onGround) { play('jump');
        player.vy = -9
        player.onGround = false
        jumpPressed = false
        jumpRef.current = false
      }

      // gravity
      player.vy += 0.55
      player.y += player.vy

      // platform collision
      player.onGround = false
      for (const p of platforms) {
        const px = p.x + scrollX
        if (px + p.w < player.x || px > player.x + PLAYER_W) continue
        // landing on top
        if (player.vy > 0 &&
            player.y + PLAYER_H > p.y &&
            player.y + PLAYER_H < p.y + p.h + player.vy + 2) {
          player.y = p.y - PLAYER_H
          player.vy = 0
          player.onGround = true
        }
        // hitting bottom of platform
        if (player.vy < 0 &&
            player.y < p.y + p.h &&
            player.y > p.y &&
            player.y + PLAYER_H > p.y + p.h) {
          player.y = p.y + p.h
          player.vy = 0
        }
      }

      // obstacle collision
      for (const o of obstacles) {
        const ox = o.x + scrollX
        if (player.x + PLAYER_W > ox + 2 && player.x < ox + o.w - 2 &&
            player.y + PLAYER_H > o.y + 2 && player.y < o.y + o.h - 2) {
          running = false
          setState('over')
          setScore(Math.floor(gameScore))
          if (onScore) onScore(Math.floor(gameScore))
          return
        }
      }

      // fall off bottom
      if (player.y > H + 50) {
        running = false
        setState('over')
        setScore(Math.floor(gameScore))
        if (onScore) onScore(Math.floor(gameScore))
        return
      }

      // scroll world
      scrollX -= speed
      gameScore += speed / 5
      setScore(Math.floor(gameScore))

      // speed up
      speed = 3 + Math.floor(gameScore / 300)

      // generate more world
      generateWorld(-scrollX)
      generateObstacles(-scrollX)

      // clean up far behind
      platforms = platforms.filter(p => p.x + scrollX > -300)
      obstacles = obstacles.filter(o => o.x + scrollX > -100)

      draw()
    }

    draw()
    const interval = setInterval(tick, 16)

    const jumpHandler = (e) => {
      if ((e.key === ' ' || e.key === 'ArrowUp') && running) { e.preventDefault(); jumpPressed = true }
    }
    window.addEventListener('keydown', jumpHandler)

    const tapHandler = (e) => { e.preventDefault(); jumpPressed = true }
    canvas.addEventListener('touchstart', tapHandler, { passive: false })

    gameRef.current = () => {
      running = false
      clearInterval(interval)
      window.removeEventListener('keydown', jumpHandler)
    }
    return () => {
      running = false
      clearInterval(interval)
      window.removeEventListener('keydown', jumpHandler)
    }
  }, [state, onScore])

  useEffect(() => { return () => gameRef.current?.() }, [])

  return (
    <div className="flex flex-col items-center gap-[16px]">
      <div className="flex items-center gap-6 flex-wrap justify-center">
        <div className="text-sm text-[#888]">距离: <span className="text-[#c23531] font-bold text-lg">{score}</span></div>
        {state === 'idle' && <button onClick={start} className="btn-primary" style={{fontSize:"10px",padding:"10px 20px"}}>🍄 开始冒险</button>}
        {state === 'over' && (
          <div className="flex items-center gap-3">
            <span className="text-[#e94560] font-bold text-[18px]">💀 游戏结束</span>
            <button onClick={start} className="btn-primary" style={{fontSize:"10px",padding:"10px 20px"}}>再来一局</button>
          </div>
        )}
        {state === 'playing' && <span className="text-xs text-[#999] hidden sm:inline">空格/↑ 跳跃</span>}
      </div>
      <canvas ref={canvasRef} width={W} height={H}
        className="rounded-xl border-2 border-[#4CAF50] shadow-lg touch-none" />

      {state === 'playing' && (
        <div className="sm:hidden flex justify-center w-full">
          <button className="flex-1 max-w-[50%] h-[48px] text-[24px] font-bold bg-orange-50 border-2 border-[#f0a000] rounded-2xl active:bg-[#ffe0b0] shadow-lg touch-manipulation"
            onPointerDown={e => { e.preventDefault(); jumpRef.current = true }}
            style={{padding:"0 20px"}}
          >⬆ 跳跃</button>
        </div>
      )}
    </div>
  )
}
