'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const W = 400, H = 500
const PLAYER_W = 36, PLAYER_H = 20
const ENEMY_W = 28, ENEMY_H = 20
const BULLET_R = 3

export default function InvadersGame({ onScore }) {
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

    let player = { x: W / 2 - PLAYER_W / 2, y: H - 40 }
    let enemies = []
    let bullets = []
    let enemyDir = 1, enemySpeed = 0.5
    let gameScore = 0, running = true
    let keys = { left: false, right: false }
    let lastShot = 0

    // 初始化敌人
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 8; c++)
        enemies.push({ x: 30 + c * 42, y: 30 + r * 32, alive: true })

    const draw = () => {
      ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, W, H)
      // 星星
      for (let i = 0; i < 50; i++) {
        ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.random() * 0.7})`
        ctx.fillRect(Math.random() * W, Math.random() * H, 1.5, 1.5)
      }
      // player
      ctx.fillStyle = '#00f0ff'
      ctx.shadowColor = '#00f0ff'; ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.moveTo(player.x + PLAYER_W / 2, player.y)
      ctx.lineTo(player.x, player.y + PLAYER_H)
      ctx.lineTo(player.x + PLAYER_W, player.y + PLAYER_H)
      ctx.closePath(); ctx.fill()
      ctx.shadowBlur = 0
      // enemies
      enemies.forEach(e => {
        if (!e.alive) return
        ctx.fillStyle = '#ff4444'
        ctx.shadowColor = '#ff4444'; ctx.shadowBlur = 6
        ctx.fillRect(e.x, e.y, ENEMY_W, ENEMY_H)
        ctx.fillStyle = '#ff8888'
        ctx.fillRect(e.x + 4, e.y + 4, 4, 4)
        ctx.fillRect(e.x + ENEMY_W - 8, e.y + 4, 4, 4)
        ctx.shadowBlur = 0
      })
      // bullets
      bullets.forEach(b => {
        ctx.fillStyle = '#ffd700'
        ctx.shadowColor = '#ffd700'; ctx.shadowBlur = 8
        ctx.beginPath(); ctx.arc(b.x, b.y, BULLET_R, 0, Math.PI * 2); ctx.fill()
        ctx.shadowBlur = 0
      })
    }

    const tick = () => {
      if (!running) return
      // player move
      if (keys.left) player.x = Math.max(0, player.x - 4)
      if (keys.right) player.x = Math.min(W - PLAYER_W, player.x + 4)

      // enemy movement
      let edgeHit = false
      enemies.forEach(e => {
        if (!e.alive) return
        e.x += enemySpeed * enemyDir
        if (e.x <= 0 || e.x >= W - ENEMY_W) edgeHit = true
      })
      if (edgeHit) {
        enemyDir *= -1
        enemies.forEach(e => { if (e.alive) e.y += 8 })
      }

      // player shoot
      const now = Date.now()
      if (keys.space && now - lastShot > 300) {
        bullets.push({ x: player.x + PLAYER_W / 2, y: player.y, dy: -5 })
        lastShot = now
      }

      // bullets move
      bullets = bullets.filter(b => {
        b.y += b.dy
        // hit enemies
        for (const e of enemies) {
          if (e.alive && b.x > e.x && b.x < e.x + ENEMY_W && b.y > e.y && b.y < e.y + ENEMY_H) {
            e.alive = false
            gameScore += 10
            setScore(gameScore)
            return false
          }
        }
        return b.y > 0
      })

      // check win
      if (enemies.every(e => !e.alive)) {
        running = false; setState('over'); setScore(gameScore); if (onScore) onScore(gameScore)
      }

      // check loss - enemies reached bottom
      for (const e of enemies) {
        if (e.alive && e.y + ENEMY_H >= player.y) {
          running = false; setState('over'); setScore(gameScore); if (onScore) onScore(gameScore)
        }
      }

      draw()
    }

    draw()
    const interval = setInterval(tick, 16)

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

    // touch controls
    const ts = (e) => {
      const rect = canvas.getBoundingClientRect()
      const mx = (e.touches[0].clientX - rect.left) * (W / rect.width)
      if (mx < player.x) keys.left = true
      else keys.right = true
      keys.space = true
    }
    const te = () => { keys.left = false; keys.right = false; keys.space = false }
    canvas.addEventListener('touchstart', ts)
    canvas.addEventListener('touchend', te)

    gameRef.current = () => {
      running = false; clearInterval(interval)
      window.removeEventListener('keydown', keyDown); window.removeEventListener('keyup', keyUp)
      canvas.removeEventListener('touchstart', ts); canvas.removeEventListener('touchend', te)
    }
    return () => {
      running = false; clearInterval(interval)
      window.removeEventListener('keydown', keyDown); window.removeEventListener('keyup', keyUp)
      canvas.removeEventListener('touchstart', ts); canvas.removeEventListener('touchend', te)
    }
  }, [state, onScore])

  useEffect(() => { return () => gameRef.current?.() }, [])

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <div className="text-sm text-[#888]">得分: <span className="text-[#c23531] font-bold text-lg">{score}</span></div>
        {state === 'idle' && <button onClick={start} className="btn-primary">开始游戏</button>}
        {state === 'over' && (
          <div className="flex items-center gap-3">
            <span className="text-[#e94560] font-bold">游戏结束</span>
            <button onClick={start} className="btn-primary">再来一局</button>
          </div>
        )}
        {state === 'playing' && <span className="text-xs text-[#999] hidden sm:inline">←→移动 空格射击</span>}
      </div>
      <canvas ref={canvasRef} width={W} height={H}
        className="rounded-xl border-2 border-[#0a0a1a] shadow-lg touch-none" />

      {state === 'playing' && (
        <div className="w-full" style={{maxWidth:W+"px"}}>
          <div className="flex gap-5">
            <button className="flex-1 h-20 text-2xl font-bold bg-white border-2 border-[#ddd] rounded-2xl active:bg-[#eee] shadow-lg touch-manipulation"
              onTouchStart={e => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' })) }}
              onTouchEnd={e => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' })) }}
            >◀ 左</button>
            <button className="flex-1 h-20 text-2xl font-bold bg-red-50 border-2 border-[#f00] rounded-2xl active:bg-[#ffe0e0] shadow-lg touch-manipulation"
              onTouchStart={e => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })) }}
              onTouchEnd={e => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keyup', { key: ' ' })) }}
            >🔫 射击</button>
            <button className="flex-1 h-20 text-2xl font-bold bg-white border-2 border-[#ddd] rounded-2xl active:bg-[#eee] shadow-lg touch-manipulation"
              onTouchStart={e => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' })) }}
              onTouchEnd={e => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' })) }}
            >▶ 右</button>
          </div>
        </div>
      )}
    </div>
  )
}
