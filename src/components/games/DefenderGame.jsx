'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

import useGameSound from '@/components/games/useGameSound'
const W = 400, H = 500
const PLAYER_W = 40, PLAYER_H = 24
const AST_W = 24, AST_H = 20
const BULLET_R = 3

export default function DefenderGame({ onScore }) {
  const { play } = useGameSound()
  const { play } = useGameSound()
  const canvasRef = useRef(null)
  const [state, setState] = useState('idle')
  const [score, setScore] = useState(0)

  const start = useCallback(() => { setState('playing'); setScore(0) }, [])

  useEffect(() => {
    if (state !== 'playing') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let player = { x: W / 2 - PLAYER_W / 2, y: H - 60 }
    let asteroids = []
    let bullets = []
    let gameScore = 0, running = true
    let keys = { left: false, right: false, space: false }
    let lastShot = 0
    let spawnCounter = 0

    const draw = () => {
      // background - space
      ctx.fillStyle = '#0a0a1a'
      ctx.fillRect(0, 0, W, H)

      // stars
      for (let i = 0; i < 40; i++) {
        ctx.fillStyle = `rgba(255,255,255,${0.2 + Math.random() * 0.5})`
        ctx.fillRect(Math.random() * W, Math.random() * H, 1.5, 1.5)
      }

      // planet at bottom (trapezoid-like city/planet base)
      ctx.fillStyle = '#2d5a27'
      ctx.shadowColor = '#2d5a27'
      ctx.shadowBlur = 12
      ctx.beginPath()
      ctx.moveTo(0, H)
      ctx.lineTo(40, H - 40)
      ctx.lineTo(W - 40, H - 40)
      ctx.lineTo(W, H)
      ctx.closePath()
      ctx.fill()

      // buildings on planet
      ctx.shadowBlur = 0
      ctx.fillStyle = '#3a7b33'
      ctx.fillRect(60, H - 56, 20, 16)
      ctx.fillRect(110, H - 64, 24, 24)
      ctx.fillRect(170, H - 48, 16, 8)
      ctx.fillRect(220, H - 60, 20, 20)
      ctx.fillRect(280, H - 52, 24, 12)
      ctx.fillRect(330, H - 58, 16, 18)

      // building windows
      ctx.fillStyle = '#ffd700'
      ctx.shadowColor = '#ffd700'
      ctx.shadowBlur = 4
      ctx.fillRect(64, H - 52, 4, 4)
      ctx.fillRect(72, H - 52, 4, 4)
      ctx.fillRect(114, H - 60, 4, 4)
      ctx.fillRect(122, H - 60, 4, 4)
      ctx.fillRect(224, H - 56, 4, 4)
      ctx.fillRect(232, H - 56, 4, 4)
      ctx.fillRect(284, H - 48, 4, 4)
      ctx.fillRect(334, H - 54, 4, 4)
      ctx.shadowBlur = 0

      // player (defender - triangle/ship)
      ctx.fillStyle = '#00f0ff'
      ctx.shadowColor = '#00f0ff'
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.moveTo(player.x + PLAYER_W / 2, player.y - 4)
      ctx.lineTo(player.x, player.y + PLAYER_H)
      ctx.lineTo(player.x + PLAYER_W, player.y + PLAYER_H)
      ctx.closePath()
      ctx.fill()

      // gun barrel
      ctx.fillStyle = '#66f0ff'
      ctx.fillRect(player.x + PLAYER_W / 2 - 3, player.y - 8, 6, 8)
      ctx.shadowBlur = 0

      // asteroids
      asteroids.forEach(a => {
        if (!a.alive) return
        ctx.fillStyle = '#ff8844'
        ctx.shadowColor = '#ff8844'
        ctx.shadowBlur = 8
        ctx.beginPath()
        // irregular rock shape
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(a.x + AST_W / 2, a.y + 4)
        ctx.lineTo(a.x + AST_W, a.y)
        ctx.lineTo(a.x + AST_W + 2, a.y + AST_H / 2)
        ctx.lineTo(a.x + AST_W - 2, a.y + AST_H)
        ctx.lineTo(a.x + AST_W / 2, a.y + AST_H + 2)
        ctx.lineTo(a.x + 2, a.y + AST_H)
        ctx.lineTo(a.x - 2, a.y + AST_H / 2)
        ctx.closePath()
        ctx.fill()
        ctx.shadowBlur = 0

        // crater detail
        ctx.fillStyle = '#cc6633'
        ctx.beginPath()
        ctx.arc(a.x + AST_W / 3, a.y + AST_H / 3, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(a.x + AST_W * 0.7, a.y + AST_H * 0.6, 3, 0, Math.PI * 2)
        ctx.fill()
      })

      // bullets
      bullets.forEach(b => {
        ctx.fillStyle = '#00ff88'
        ctx.shadowColor = '#00ff88'
        ctx.shadowBlur = 10
        ctx.beginPath()
        ctx.arc(b.x, b.y, BULLET_R, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })
    }

    const tick = () => {
      if (!running) return

      // player move
      if (keys.left) player.x = Math.max(0, player.x - 5)
      if (keys.right) player.x = Math.min(W - PLAYER_W, player.x + 5)

      // spawn asteroids
      spawnCounter++
      if (spawnCounter >= 40) {
        spawnCounter = 0
        asteroids.push({
          x: Math.random() * (W - AST_W),
          y: 0,
          speed: 1.5 + Math.random() * 2,
          alive: true,
        })
      }

      // move asteroids
      asteroids.forEach(a => {
        if (!a.alive) return
        a.y += a.speed
      })

      // player shoot
      const now = Date.now()
      if (keys.space && now - lastShot > 250) {
          play('shoot');   play('shoot'); bullets.push({ x: player.x + PLAYER_W / 2, y: player.y - 10, dy: -6 })
        lastShot = now
      }

      // move bullets
      bullets = bullets.filter(b => {
        b.y += b.dy
        // hit asteroids
        for (const a of asteroids) {
          if (!a.alive) continue
          if (b.x > a.x - 4 && b.x < a.x + AST_W + 4 &&
              b.y > a.y - 4 && b.y < a.y + AST_H + 4) {
            a.alive = false
              play('explode');   play('explode'); gameScore += 10
            setScore(gameScore)
            return false
          }
        }
        return b.y > 0
      })

      // game over check - asteroid hit bottom
      for (const a of asteroids) {
        if (a.alive && a.y + AST_H >= H - 40) {
          running = false
            play('gameover');   play('gameover'); setState('over')
          setScore(gameScore)
          if (onScore) onScore(gameScore)
          return
        }
      }

      draw()
    }

    draw()
    const interval = setInterval(tick, 16)

    // keyboard
    const keyDown = (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); keys.left = true }
      if (e.key === 'ArrowRight') { e.preventDefault(); keys.right = true }
      if (e.key === ' ') { e.preventDefault(); keys.space = true }
    }
    const keyUp = (e) => {
      if (e.key === 'ArrowLeft') keys.left = false
      if (e.key === 'ArrowRight') keys.right = false
      if (e.key === ' ') keys.space = false
    }
    window.addEventListener('keydown', keyDown)
    window.addEventListener('keyup', keyUp)

    return () => {
      running = false
      clearInterval(interval)
      window.removeEventListener('keydown', keyDown)
      window.removeEventListener('keyup', keyUp)
    }
  }, [state, onScore])

  return (
    <div className="flex flex-col items-center gap-[20px]">
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <div className="text-sm text-[#888]">
          得分: <span className="text-[#c23531] font-bold text-[18px]">{score}</span>
        </div>
        {state === 'idle' && (
          <button onClick={start} className="btn-primary" style={{fontSize:"10px",padding:"10px 20px"}}>开始游戏</button>
        )}
        {state === 'over' && (
          <div className="flex items-center gap-3">
            <span className="text-[#e94560] font-bold text-[18px]">行星已被摧毁!</span>
            <button onClick={start} className="btn-primary" style={{fontSize:"10px",padding:"10px 20px"}}>重新防御</button>
          </div>
        )}
        {state === 'playing' && (
          <span className="text-xs text-[#999] hidden sm:inline">←→移动 空格射击</span>
        )}
      </div>
      <canvas ref={canvasRef} width={W} height={H}
        className="rounded-2xl border-2 border-[#1a1a3e] shadow-lg touch-manipulation" />

      {state === 'playing' && (
        <div className="w-full sm:max-w-lg">
          <div className="flex gap-[32px]">
            <button
              className="flex-1 h-[48px] text-[36px] font-bold bg-white border-2 border-[#ddd] rounded-2xl active:bg-[#eee] shadow-lg touch-manipulation"
              onPointerDown={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' })) }}
              onPointerUp={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' })) }}
              onPointerLeave={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' })) }}
            >◀ 左</button>
            <button
              className="flex-1 h-[48px] text-[36px] font-bold bg-red-50 border-2 border-[#f00] rounded-2xl active:bg-[#ffe0e0] shadow-lg touch-manipulation"
              onPointerDown={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })) }}
              onPointerUp={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keyup', { key: ' ' })) }}
              onPointerLeave={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keyup', { key: ' ' })) }}
            >🔫 射击</button>
            <button
              className="flex-1 h-[48px] text-[36px] font-bold bg-white border-2 border-[#ddd] rounded-2xl active:bg-[#eee] shadow-lg touch-manipulation"
              onPointerDown={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' })) }}
              onPointerUp={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' })) }}
              onPointerLeave={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' })) }}
            >▶ 右</button>
          </div>
        </div>
      )}
    </div>
  )
}
