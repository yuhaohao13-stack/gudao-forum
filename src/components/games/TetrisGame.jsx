'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const COLS = 10, ROWS = 20, CELL = 24
const BOARD_W = COLS * CELL, BOARD_H = ROWS * CELL

const PIECES = [
  { shape: [[1,1,1,1]], color: '#00f0f0' },           // I
  { shape: [[1,1],[1,1]], color: '#f0f000' },          // O
  { shape: [[0,1,0],[1,1,1]], color: '#a000f0' },      // T
  { shape: [[1,0,0],[1,1,1]], color: '#f0a000' },      // L
  { shape: [[0,0,1],[1,1,1]], color: '#0000f0' },      // J
  { shape: [[0,1,1],[1,1,0]], color: '#00f000' },      // S
  { shape: [[1,1,0],[0,1,1]], color: '#f00000' },      // Z
]

function rotateShape(shape) {
  return shape[0].map((_, i) => shape.map(row => row[i]).reverse())
}

export default function TetrisGame({ onScore }) {
  const canvasRef = useRef(null)
  const [state, setState] = useState('idle')
  const [score, setScore] = useState(0)
  const [lines, setLines] = useState(0)
  const gameRef = useRef(null)

  const start = useCallback(() => {
    setState('playing')
    setScore(0)
    setLines(0)
  }, [])

  useEffect(() => {
    if (state !== 'playing') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // Board: 0 = empty, otherwise color string
    let board = Array.from({ length: ROWS }, () => Array(COLS).fill(null))
    let piece = { type: 0, shape: PIECES[0].shape, color: PIECES[0].color, x: 3, y: 0 }
    let gameScore = 0, gameLines = 0
    let running = true
    let dropCounter = 0
    const dropInterval = 500

    const randomPiece = () => {
      const idx = Math.floor(Math.random() * PIECES.length)
      return { type: idx, shape: PIECES[idx].shape, color: PIECES[idx].color, x: 3, y: 0 }
    }

    const collision = (shape, px, py) => {
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x]) {
            const bx = px + x, by = py + y
            if (bx < 0 || bx >= COLS || by >= ROWS || (by >= 0 && board[by][bx])) return true
          }
        }
      }
      return false
    }

    const merge = () => {
      piece.shape.forEach((row, y) => {
        row.forEach((v, x) => {
          if (v) {
            const by = piece.y + y
            if (by >= 0) board[by][piece.x + x] = piece.color
          }
        })
      })
    }

    const clearLines = () => {
      let cleared = 0
      for (let y = ROWS - 1; y >= 0; y--) {
        if (board[y].every(c => c !== null)) {
          board.splice(y, 1)
          board.unshift(Array(COLS).fill(null))
          cleared++
          y++ // re-check same row
        }
      }
      if (cleared) {
        const pts = [0, 100, 300, 500, 800][cleared] || cleared * 100
        gameScore += pts
        gameLines += cleared
        setScore(gameScore)
        setLines(gameLines)
      }
    }

    const draw = () => {
      ctx.fillStyle = '#0f0f23'
      ctx.fillRect(0, 0, BOARD_W, BOARD_H)

      // grid
      ctx.strokeStyle = '#1a1a3e'
      ctx.lineWidth = 0.5
      for (let x = 0; x <= COLS; x++) {
        ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, BOARD_H); ctx.stroke()
      }
      for (let y = 0; y <= ROWS; y++) {
        ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(BOARD_W, y * CELL); ctx.stroke()
      }

      // board
      board.forEach((row, y) => {
        row.forEach((color, x) => {
          if (color) {
            ctx.fillStyle = color
            ctx.shadowColor = color
            ctx.shadowBlur = 4
            ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2)
            ctx.shadowBlur = 0
          }
        })
      })

      // active piece
      piece.shape.forEach((row, y) => {
        row.forEach((v, x) => {
          if (v) {
            ctx.fillStyle = piece.color
            ctx.shadowColor = piece.color
            ctx.shadowBlur = 6
            ctx.fillRect((piece.x + x) * CELL + 1, (piece.y + y) * CELL + 1, CELL - 2, CELL - 2)
            ctx.shadowBlur = 0
          }
        })
      })
    }

    // Initial piece
    let currentPiece = randomPiece()
    piece = { ...currentPiece }

    const moveDown = () => {
      if (!collision(piece.shape, piece.x, piece.y + 1)) {
        piece = { ...piece, y: piece.y + 1 }
      } else {
        merge()
        clearLines()
        currentPiece = randomPiece()
        piece = { ...currentPiece }
        if (collision(piece.shape, piece.x, piece.y)) {
          running = false
          setState('over')
          setScore(gameScore)
          if (onScore) onScore(gameScore)
        }
      }
      draw()
    }

    const lastTime = performance.now()
    draw()

    const keyHandler = (e) => {
      if (!running) return
      let dx = 0, dy = 0, rotate = false
      switch (e.key) {
        case 'ArrowLeft': dx = -1; break
        case 'ArrowRight': dx = 1; break
        case 'ArrowDown': dy = 1; break
        case 'ArrowUp': rotate = true; break
        case ' ': e.preventDefault(); while (!collision(piece.shape, piece.x, piece.y + 1)) { piece = { ...piece, y: piece.y + 1 } }; moveDown(); return
        default: return
      }
      e.preventDefault()
      if (rotate) {
        const rotated = rotateShape(piece.shape)
        if (!collision(rotated, piece.x, piece.y)) {
          piece = { ...piece, shape: rotated }
        } else if (!collision(rotated, piece.x - 1, piece.y)) {
          piece = { ...piece, shape: rotated, x: piece.x - 1 }
        } else if (!collision(rotated, piece.x + 1, piece.y)) {
          piece = { ...piece, shape: rotated, x: piece.x + 1 }
        }
      }
      if (dx && !collision(piece.shape, piece.x + dx, piece.y)) {
        piece = { ...piece, x: piece.x + dx }
      }
      if (dy && !collision(piece.shape, piece.x, piece.y + 1)) {
        piece = { ...piece, y: piece.y + 1 }
      }
      draw()
    }
    window.addEventListener('keydown', keyHandler)

    const interval = setInterval(() => {
      if (running) moveDown()
    }, dropInterval)

    gameRef.current = () => { running = false; clearInterval(interval); window.removeEventListener('keydown', keyHandler) }
    return () => {
      running = false; clearInterval(interval); window.removeEventListener('keydown', keyHandler)
    }
  }, [state, onScore])

  useEffect(() => {
    return () => { if (gameRef.current) gameRef.current() }
  }, [])

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6 flex-wrap justify-center">
        <div className="text-sm text-[#888]">得分: <span className="text-[#c23531] font-bold text-lg">{score}</span></div>
        <div className="text-sm text-[#888]">行数: <span className="text-[#f0a000] font-bold">{lines}</span></div>
        {state === 'idle' && <button onClick={start} className="btn-primary">开始游戏</button>}
        {state === 'over' && (
          <div className="flex items-center gap-3">
            <span className="text-[#e94560] font-bold">游戏结束</span>
            <button onClick={start} className="btn-primary">再来一局</button>
          </div>
        )}
        {state === 'playing' && <span className="text-xs text-[#999]">↑旋转 ↓加速 ←→移动 空格落底</span>}
      </div>
      <canvas ref={canvasRef} width={BOARD_W} height={BOARD_H}
        className="rounded-xl border-2 border-[#1a1a3e] shadow-lg" />
    </div>
  )
}
