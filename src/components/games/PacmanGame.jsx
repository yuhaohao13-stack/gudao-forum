'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const CELL = 30, COLS = 15, ROWS = 13
const W = COLS * CELL, H = ROWS * CELL

// 0=wall, 1=dot, 2=empty, 3=power pellet, 4=ghost house
const MAP = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,0,1,1,1,1,1,1,0],
  [0,1,0,0,1,0,1,0,1,0,1,0,0,1,0],
  [0,3,0,0,1,0,1,0,1,0,1,0,0,3,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,0,0,1,0,0,0,0,0,1,0,0,1,0],
  [0,1,0,0,1,2,4,4,4,2,1,0,0,1,0],
  [0,1,1,1,1,2,0,0,0,2,1,1,1,1,0],
  [0,0,0,0,0,2,0,0,0,2,0,0,0,0,0],
  [0,1,1,1,1,2,0,0,0,2,1,1,1,1,0],
  [0,1,0,0,1,1,1,1,1,1,1,0,0,1,0],
  [0,1,1,1,1,1,1,0,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
]

const DIRS = { ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 } }

export default function PacmanGame({ onScore }) {
  const canvasRef = useRef(null)
  const gameRef = useRef(null)
  const dirRef = useRef(null) // setDirection for touch buttons
  const [state, setState] = useState('idle')
  const [score, setScore] = useState(0)

  const start = useCallback(() => { setState('playing'); setScore(0) }, [])

  useEffect(() => {
    if (state !== 'playing') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let pac = { x: 7, y: 9, dx: 0, dy: 0, nextDx: 0, nextDy: 0, mouth: 0 }
    let dots = 0
    let gameScore = 0
    let running = true
    let powerMode = 0

    // count dots + init map
    const grid = MAP.map(row => [...row])
    grid.forEach(row => row.forEach(c => { if (c === 1 || c === 3) dots++ }))

    // ghosts
    let ghosts = [
      { x: 7, y: 6, color: '#ff4444', scared: false, mode: 'chase', dir: { x: 1, y: 0 }, scatter: 0 },
      { x: 6, y: 6, color: '#ffb8ff', scared: false, mode: 'chase', dir: { x: -1, y: 0 }, scatter: 0 },
      { x: 8, y: 6, color: '#44ffff', scared: false, mode: 'chase', dir: { x: 1, y: 0 }, scatter: 0 },
      { x: 7, y: 7, color: '#ffb852', scared: false, mode: 'chase', dir: { x: 0, y: 1 }, scatter: 0 },
    ]

    const canMove = (x, y) => {
      // wrap around
      if (x < 0) x = COLS - 1; if (x >= COLS) x = 0
      return y >= 0 && y < ROWS && grid[y][x] !== 0
    }

    const draw = () => {
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H)
      // map
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        const val = grid[r][c]
        const cx = c * CELL + CELL / 2, cy = r * CELL + CELL / 2
        if (val === 0) {
          ctx.fillStyle = '#2121de'
          ctx.fillRect(c * CELL, r * CELL, CELL, CELL)
        } else if (val === 1) {
          ctx.fillStyle = '#ffb8ae'
          ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fill()
        } else if (val === 3) {
          ctx.fillStyle = '#ffb8ae'
          ctx.beginPath(); ctx.arc(cx, cy, 8, 0, Math.PI * 2); ctx.fill()
        }
      }
      // ghosts
      ghosts.forEach(g => {
        if (g.scared && powerMode > 0) {
          ctx.fillStyle = powerMode < 60 ? (Math.floor(powerMode / 6) % 2 ? '#fff' : '#2121de') : '#2121de'
        } else {
          ctx.fillStyle = g.color
        }
        const gx = g.x * CELL + CELL / 2, gy = g.y * CELL + CELL / 2
        ctx.beginPath(); ctx.arc(gx, gy - 2, 12, Math.PI, 0); ctx.fill()
        ctx.fillRect(gx - 12, gy - 2, 24, 8)
      })
      // pacman
      const px = pac.x * CELL + CELL / 2, py = pac.y * CELL + CELL / 2
      ctx.fillStyle = '#ffd700'
      pac.mouth = (pac.mouth + 0.1) % (Math.PI * 2)
      const mouthAngle = Math.abs(Math.sin(pac.mouth * 2)) * 0.4
      let angle = 0
      if (pac.dx === 1) angle = 0; else if (pac.dx === -1) angle = Math.PI
      else if (pac.dy === -1) angle = -Math.PI / 2; else if (pac.dy === 1) angle = Math.PI / 2
      ctx.beginPath()
      ctx.arc(px, py, 13, angle + mouthAngle, angle + Math.PI * 2 - mouthAngle)
      ctx.lineTo(px, py); ctx.fill()
    }

    const setPacDir = (dx, dy) => { pac.nextDx = dx; pac.nextDy = dy }
    dirRef.current = setPacDir

    const tick = () => {
      if (!running) return
      // try next direction
      if (canMove(pac.x + pac.nextDx, pac.y + pac.nextDy)) {
        pac.dx = pac.nextDx; pac.dy = pac.nextDy
      }
      // move
      const nx = pac.x + pac.dx, ny = pac.y + pac.dy
      if (canMove(nx, ny)) {
        pac.x = nx < 0 ? COLS - 1 : nx >= COLS ? 0 : nx
        pac.y = ny
        // eat
        if (grid[pac.y][pac.x] === 1) { gameScore += 10; setScore(gameScore); dots--; grid[pac.y][pac.x] = 2 }
        if (grid[pac.y][pac.x] === 3) { gameScore += 50; setScore(gameScore); dots--; grid[pac.y][pac.x] = 2; powerMode = 180; ghosts.forEach(g => g.scared = true) }
        if (dots <= 0) { running = false; setState('over'); setScore(gameScore); if (onScore) onScore(gameScore); return }
      }
      if (powerMode > 0) powerMode--
      if (powerMode === 0) ghosts.forEach(g => g.scared = false)

      // ghosts AI
      ghosts.forEach(g => {
        if (g.y === 6 && g.x >= 5 && g.x <= 9 && !g.scared) { g.dir = { x: 0, y: -1 }; return } // leave house
        const dirs = [DIRS.ArrowUp, DIRS.ArrowDown, DIRS.ArrowLeft, DIRS.ArrowRight].filter(d =>
          !(d.x === -g.dir.x && d.y === -g.dir.y) && canMove(g.x + d.x, g.y + d.y))
        if (dirs.length > 0) {
          if (g.scared) { g.dir = dirs[Math.floor(Math.random() * dirs.length)] }
          else { g.dir = dirs[Math.floor(Math.random() * dirs.length)] } // simple random chase
        }
        g.x += g.dir.x; g.y += g.dir.y
        if (g.x < 0) g.x = COLS - 1; if (g.x >= COLS) g.x = 0
      })

      // ghost collision
      ghosts.forEach(g => {
        if (Math.abs(g.x - pac.x) + Math.abs(g.y - pac.y) < 1) {
          if (g.scared && powerMode > 0) {
            gameScore += 200; setScore(gameScore)
            g.x = 7; g.y = 6; g.scared = false
          } else if (!g.scared) {
            running = false; setState('over'); setScore(gameScore); if (onScore) onScore(gameScore)
          }
        }
      })

      draw()
    }

    draw()
    const interval = setInterval(tick, 150)

    const keyHandler = (e) => {
      const d = DIRS[e.key]; if (!d) return; e.preventDefault()
      pac.nextDx = d.x; pac.nextDy = d.y
    }
    window.addEventListener('keydown', keyHandler)

    // touch: swipe
    let tx = 0, ty = 0
    const ts = (e) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY }
    const te = (e) => {
      const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty
      const ax = Math.abs(dx), ay = Math.abs(dy)
      if (Math.max(ax, ay) < 20) return
      if (ax > ay) { pac.nextDx = dx > 0 ? 1 : -1; pac.nextDy = 0 }
      else { pac.nextDx = 0; pac.nextDy = dy > 0 ? 1 : -1 }
    }
    canvas.addEventListener('touchstart', ts)
    canvas.addEventListener('touchend', te)

    gameRef.current = () => {
      running = false; clearInterval(interval)
      window.removeEventListener('keydown', keyHandler)
      canvas.removeEventListener('touchstart', ts); canvas.removeEventListener('touchend', te)
    }
    return () => {
      running = false; clearInterval(interval)
      window.removeEventListener('keydown', keyHandler)
      canvas.removeEventListener('touchstart', ts); canvas.removeEventListener('touchend', te)
    }
  }, [state, onScore])

  useEffect(() => { return () => gameRef.current?.() }, [])

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <div className="text-sm text-[#888]">得分: <span className="text-[#c23531] font-bold text-lg">{score}</span></div>
        {state === 'idle' && <button onClick={start} className="btn-primary" style={{fontSize:"20px",padding:"20px 40px"}}>开始游戏</button>}
        {state === 'over' && (
          <div className="flex items-center gap-3">
            <span className="text-[#e94560] font-bold text-[18px]">游戏结束</span>
            <button onClick={start} className="btn-primary" style={{fontSize:"20px",padding:"20px 40px"}}>再来一局</button>
          </div>
        )}
        {state === 'playing' && <span className="text-xs text-[#999] hidden sm:inline">方向键/滑动控制</span>}
      </div>
      <canvas ref={canvasRef} width={W} height={H}
        className="rounded-xl border-2 border-[#2121de] shadow-lg touch-none" />

      {state === 'playing' && (
        <div className="w-full sm:max-w-lg">
          <div className="flex justify-center mb-2">
            <button className="flex-1 max-w-[30%] h-[96px] text-[60px] font-bold bg-white border-2 border-[#ddd] rounded-2xl active:bg-[#eee] shadow-lg touch-manipulation"
              onTouchStart={e => { e.preventDefault(); dirRef.current?.(0, -1) }}
            >↑</button>
          </div>
          <div className="flex gap-5">
            <button className="flex-1 h-[96px] text-[60px] font-bold bg-white border-2 border-[#ddd] rounded-2xl active:bg-[#eee] shadow-lg touch-manipulation"
              onTouchStart={e => { e.preventDefault(); dirRef.current?.(-1, 0) }}
            >←</button>
            <button className="flex-1 h-[96px] text-[60px] font-bold bg-white border-2 border-[#ddd] rounded-2xl active:bg-[#eee] shadow-lg touch-manipulation"
              onTouchStart={e => { e.preventDefault(); dirRef.current?.(0, 1) }}
            >↓</button>
            <button className="flex-1 h-[96px] text-[60px] font-bold bg-white border-2 border-[#ddd] rounded-2xl active:bg-[#eee] shadow-lg touch-manipulation"
              onTouchStart={e => { e.preventDefault(); dirRef.current?.(1, 0) }}
            >→</button>
          </div>
        </div>
      )}
    </div>
  )
}
