'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

import { useGameSound } from '@/components/games/SoundProvider'
const COLS = 9, ROWS = 9, CELL = 34
const W = COLS * CELL + 40, H = ROWS * CELL + 80
const MINES = 10

export default function MinesweeperGame({ onScore }) {
  const { play } = useGameSound()
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

    // init board
    let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0))
    let revealed = Array.from({ length: ROWS }, () => Array(COLS).fill(false))
    let flagged = Array.from({ length: ROWS }, () => Array(COLS).fill(false))
    let gameOver = false, gameWon = false
    let minesPlaced = false
    let gameScore = 0
    let running = true

    const placeMines = (ex, ey) => {
      let placed = 0
      while (placed < MINES) {
        const x = Math.floor(Math.random() * COLS), y = Math.floor(Math.random() * ROWS)
        if (board[y][x] === 0 && !(Math.abs(x - ex) <= 1 && Math.abs(y - ey) <= 1)) {
          board[y][x] = -1; placed++
        }
      }
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        if (board[r][c] === -1) continue
        let count = 0
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc] === -1) count++
        }
        board[r][c] = count
      }
      minesPlaced = true
    }

    const floodFill = (x, y) => {
      if (x < 0 || x >= COLS || y < 0 || y >= ROWS || revealed[y][x]) return
      revealed[y][x] = true
        play('click'); gameScore++
      setScore(gameScore)
      if (board[y][x] === 0) {
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++)
          floodFill(x + dc, y + dr)
      }
    }

    const checkWin = () => {
      let safe = 0
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++)
        if (board[r][c] !== -1 && revealed[r][c]) safe++
      if (safe === COLS * ROWS - MINES) {
        gameWon = true; gameOver = true
        setState('over')
          play('win'); if (onScore) onScore(Math.max(gameScore, 100))
      }
    }

    const draw = () => {
      ctx.fillStyle = '#f5f5dc'; ctx.fillRect(0, 0, W, H)
      // header
      ctx.fillStyle = '#888'; ctx.font = '16px Inter, sans-serif'
      ctx.textAlign = 'left'; ctx.fillText(`💣 ${MINES}`, 15, 30)
      ctx.textAlign = 'right'; ctx.fillText(`🎯 ${gameScore}`, W - 15, 30)
      // cells
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        const x = 20 + c * CELL, y = 50 + r * CELL
        if (revealed[r][c]) {
          ctx.fillStyle = '#e0d8c8'; ctx.fillRect(x, y, CELL, CELL)
          ctx.strokeStyle = '#ccc'; ctx.strokeRect(x, y, CELL, CELL)
          if (board[r][c] > 0) {
            const colors = ['', '#0000ff', '#008000', '#ff0000', '#000080', '#800000', '#008080', '#000000', '#808080']
            ctx.fillStyle = colors[board[r][c]] || '#000'
            ctx.font = 'bold 16px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
            ctx.fillText(board[r][c], x + CELL / 2, y + CELL / 2)
          } else if (board[r][c] === -1) {
            ctx.font = '16px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
            ctx.fillText('💣', x + CELL / 2, y + CELL / 2)
          }
        } else {
          ctx.fillStyle = '#c0b8a8'; ctx.fillRect(x, y, CELL, CELL)
          ctx.strokeStyle = '#e0d8c8'; ctx.strokeRect(x, y, CELL, CELL)
          // 3D effect
          ctx.beginPath(); ctx.moveTo(x, y + CELL); ctx.lineTo(x, y); ctx.lineTo(x + CELL, y)
          ctx.strokeStyle = '#f0e8d8'; ctx.lineWidth = 2; ctx.stroke()
          ctx.beginPath(); ctx.moveTo(x + CELL, y); ctx.lineTo(x + CELL, y + CELL); ctx.lineTo(x, y + CELL)
          ctx.strokeStyle = '#a09888'; ctx.lineWidth = 2; ctx.stroke()
          ctx.lineWidth = 1
          if (flagged[r][c]) {
            ctx.font = '14px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
            ctx.fillText('🚩', x + CELL / 2, y + CELL / 2)
          }
        }
      }
    }

    draw()

    const clickHandler = (e) => {
      if (gameOver || !running) return
      const rect = canvas.getBoundingClientRect()
      const scaleX = W / rect.width, scaleY = H / rect.height
      const mx = (e.clientX - rect.left) * scaleX - 20
      const my = (e.clientY - rect.top) * scaleY - 50
      const c = Math.floor(mx / CELL), r = Math.floor(my / CELL)
      if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return

      if (!minesPlaced) placeMines(c, r)

      if (!revealed[r][c] && !flagged[r][c]) {
        if (board[r][c] === -1) {
          // boom
          revealed[r][c] = true; gameOver = true
            play('explode'); setState('over'); if (onScore) onScore(0)
          draw(); return
        }
        floodFill(c, r)
        checkWin()
        draw()
      }
    }

    const rightClick = (e) => {
      e.preventDefault()
      if (gameOver || !running) return
      const rect = canvas.getBoundingClientRect()
      const scaleX = W / rect.width, scaleY = H / rect.height
      const mx = (e.clientX - rect.left) * scaleX - 20
      const my = (e.clientY - rect.top) * scaleY - 50
      const c = Math.floor(mx / CELL), r = Math.floor(my / CELL)
      if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return
      if (!revealed[r][c]) { flagged[r][c] = !flagged[r][c]; draw() }
    }

    canvas.addEventListener('click', clickHandler)
    canvas.addEventListener('contextmenu', rightClick)

    // === Mobile: long press to flag ===
    let longPressTimer = null
    const touchStart = (e) => {
      if (gameOver || !running) return
      // Prevent copy/select on long press
      e.preventDefault()
      longPressTimer = setTimeout(() => {
        longPressTimer = null
        // Long press → toggle flag
        const touch = e.touches[0]
        const rect = canvas.getBoundingClientRect()
        const scaleX = W / rect.width, scaleY = H / rect.height
        const mx = (touch.clientX - rect.left) * scaleX - 20
        const my = (touch.clientY - rect.top) * scaleY - 50
        const c = Math.floor(mx / CELL), r = Math.floor(my / CELL)
        if (c >= 0 && c < COLS && r >= 0 && r < ROWS && !revealed[r][c]) {
          flagged[r][c] = !flagged[r][c]; draw()
        }
      }, 500)
    }
    const touchEnd = () => {
      if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null }
    }
    canvas.addEventListener('touchstart', touchStart, { passive: false })
    canvas.addEventListener('touchend', touchEnd)
    canvas.addEventListener('touchmove', touchEnd)
    canvas.addEventListener('contextmenu', (e) => e.preventDefault())

    gameRef.current = () => {
      running = false
      canvas.removeEventListener('click', clickHandler)
      canvas.removeEventListener('contextmenu', rightClick)
      canvas.removeEventListener('touchstart', touchStart)
      canvas.removeEventListener('touchend', touchEnd)
      canvas.removeEventListener('touchmove', touchEnd)
    }
    return () => {
      running = false
      canvas.removeEventListener('click', clickHandler)
      canvas.removeEventListener('contextmenu', rightClick)
      canvas.removeEventListener('touchstart', touchStart)
      canvas.removeEventListener('touchend', touchEnd)
      canvas.removeEventListener('touchmove', touchEnd)
    }
  }, [state, onScore])

  useEffect(() => { return () => gameRef.current?.() }, [])

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6 flex-wrap justify-center">
        <div className="text-sm text-[#888]">翻开: <span className="text-[#c23531] font-bold text-lg">{score}</span></div>
        {state === 'idle' && <button onClick={start} className="btn-primary">开始游戏</button>}
        {state === 'over' && (
          <div className="flex items-center gap-3">
            <span className="text-[#e94560] font-bold">游戏结束</span>
            <button onClick={start} className="btn-primary">再来一局</button>
          </div>
        )}
        {state === 'playing' && <span className="text-xs text-[#999]">左键翻开 右键插旗 🚩</span>}
      </div>
      <canvas ref={canvasRef} width={W} height={H}
        className="rounded-xl border-2 border-[#aaa] shadow-lg touch-none"
        style={{userSelect:'none',WebkitUserSelect:'none',WebkitTouchCallout:'none'}} />
      <div className="text-xs text-[#999] sm:hidden text-center">
        点击翻开格子 | 长按标记🚩
      </div>
    </div>
  )
}
