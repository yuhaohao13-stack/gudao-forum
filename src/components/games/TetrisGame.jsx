'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const COLS = 10, ROWS = 20, CELL = 24
const BOARD_W = COLS * CELL, BOARD_H = ROWS * CELL

const PIECES = [
  { shape: [[1,1,1,1]], color: '#00f0f0' },
  { shape: [[1,1],[1,1]], color: '#f0f000' },
  { shape: [[0,1,0],[1,1,1]], color: '#a000f0' },
  { shape: [[1,0,0],[1,1,1]], color: '#f0a000' },
  { shape: [[0,0,1],[1,1,1]], color: '#0000f0' },
  { shape: [[0,1,1],[1,1,0]], color: '#00f000' },
  { shape: [[1,1,0],[0,1,1]], color: '#f00000' },
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
  const actRef = useRef(null) // { left, right, rotate, drop, hardDrop }

  const start = useCallback(() => { setState('playing'); setScore(0); setLines(0) }, [])

  useEffect(() => {
    if (state !== 'playing') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let board = Array.from({ length: ROWS }, () => Array(COLS).fill(null))
    let piece = { type: 0, shape: PIECES[0].shape, color: PIECES[0].color, x: 3, y: 0 }
    let gameScore = 0, gameLines = 0
    let running = true
    const dropInterval = 500

    const randomPiece = () => { const idx = Math.floor(Math.random() * PIECES.length); return { type: idx, shape: PIECES[idx].shape, color: PIECES[idx].color, x: 3, y: 0 } }
    const collision = (shape, px, py) => {
      for (let y = 0; y < shape.length; y++)
        for (let x = 0; x < shape[y].length; x++)
          if (shape[y][x]) { const bx = px + x, by = py + y; if (bx < 0 || bx >= COLS || by >= ROWS || (by >= 0 && board[by][bx])) return true }
      return false
    }
    const merge = () => { piece.shape.forEach((row, y) => { row.forEach((v, x) => { if (v) { const by = piece.y + y; if (by >= 0) board[by][piece.x + x] = piece.color } }) }) }
    const clearLines = () => {
      let cleared = 0
      for (let y = ROWS - 1; y >= 0; y--) {
        if (board[y].every(c => c !== null)) { board.splice(y, 1); board.unshift(Array(COLS).fill(null)); cleared++; y++ }
      }
      if (cleared) { const pts = [0, 100, 300, 500, 800][cleared] || cleared * 100; gameScore += pts; gameLines += cleared; setScore(gameScore); setLines(gameLines) }
    }

    const doMove = (dx, dy, rotate) => {
      if (!running) return
      if (rotate) {
        const rotated = rotateShape(piece.shape)
        if (!collision(rotated, piece.x, piece.y)) piece = { ...piece, shape: rotated }
        else if (!collision(rotated, piece.x - 1, piece.y)) piece = { ...piece, shape: rotated, x: piece.x - 1 }
        else if (!collision(rotated, piece.x + 1, piece.y)) piece = { ...piece, shape: rotated, x: piece.x + 1 }
      } else if (dx && !collision(piece.shape, piece.x + dx, piece.y)) {
        piece = { ...piece, x: piece.x + dx }
      } else if (dy && !collision(piece.shape, piece.x, piece.y + 1)) {
        piece = { ...piece, y: piece.y + 1 }
      }
      draw()
    }

    const hardDrop = () => {
      if (!running) return
      while (!collision(piece.shape, piece.x, piece.y + 1)) piece = { ...piece, y: piece.y + 1 }
      moveDown()
    }

    const moveDown = () => {
      if (!collision(piece.shape, piece.x, piece.y + 1)) { piece = { ...piece, y: piece.y + 1 } }
      else {
        merge(); clearLines()
        piece = randomPiece()
        if (collision(piece.shape, piece.x, piece.y)) { running = false; setState('over'); setScore(gameScore); if (onScore) onScore(gameScore) }
      }
      draw()
    }

    actRef.current = {
      left: () => doMove(-1, 0, false),
      right: () => doMove(1, 0, false),
      rotate: () => doMove(0, 0, true),
      drop: () => doMove(0, 1, false),
      hardDrop,
    }

    const draw = () => {
      ctx.fillStyle = '#0f0f23'; ctx.fillRect(0, 0, BOARD_W, BOARD_H)
      ctx.strokeStyle = '#1a1a3e'; ctx.lineWidth = 0.5
      for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, BOARD_H); ctx.stroke() }
      for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(BOARD_W, y * CELL); ctx.stroke() }
      board.forEach((row, y) => row.forEach((color, x) => {
        if (color) { ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 4; ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2); ctx.shadowBlur = 0 }
      }))
      piece.shape.forEach((row, y) => row.forEach((v, x) => {
        if (v) { ctx.fillStyle = piece.color; ctx.shadowColor = piece.color; ctx.shadowBlur = 6; ctx.fillRect((piece.x + x) * CELL + 1, (piece.y + y) * CELL + 1, CELL - 2, CELL - 2); ctx.shadowBlur = 0 }
      }))
    }

    piece = randomPiece(); draw()
    const keyHandler = (e) => {
      if (!running) return
      switch (e.key) {
        case 'ArrowLeft': e.preventDefault(); doMove(-1, 0, false); break
        case 'ArrowRight': e.preventDefault(); doMove(1, 0, false); break
        case 'ArrowDown': e.preventDefault(); doMove(0, 1, false); break
        case 'ArrowUp': e.preventDefault(); doMove(0, 0, true); break
        case ' ': e.preventDefault(); hardDrop(); break
      }
    }
    window.addEventListener('keydown', keyHandler)
    const interval = setInterval(() => { if (running) moveDown() }, dropInterval)

    gameRef.current = () => { running = false; clearInterval(interval); window.removeEventListener('keydown', keyHandler) }
    return () => { running = false; clearInterval(interval); window.removeEventListener('keydown', keyHandler) }
  }, [state, onScore])

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <div className="text-sm text-[#888]">得分: <span className="text-[#c23531] font-bold text-lg">{score}</span></div>
        <div className="text-sm text-[#888]">行数: <span className="text-[#f0a000] font-bold">{lines}</span></div>
        {state === 'idle' && <button onClick={start} className="btn-primary text-xl py-5 px-10">开始游戏</button>}
        {state === 'over' && (
          <div className="flex items-center gap-3">
            <span className="text-[#e94560] font-bold text-lg">游戏结束</span>
            <button onClick={start} className="btn-primary text-xl py-5 px-10">再来一局</button>
          </div>
        )}
        {state === 'playing' && <span className="text-xs text-[#999] hidden sm:inline">↑旋转 ↓加速 ←→移动 空格落底</span>}
      </div>
      <canvas ref={canvasRef} width={BOARD_W} height={BOARD_H}
        className="rounded-xl border-2 border-[#1a1a3e] shadow-lg touch-none" />

      {state === 'playing' && (
        <div className="w-full" style={{maxWidth:BOARD_W+"px"}}>
          <div className="flex gap-6">
            <button className="flex-1 h-72 text-3xl font-bold bg-white border-2 border-[#ddd] rounded-2xl active:bg-[#eee] shadow-lg touch-manipulation"
              onTouchStart={e => { e.preventDefault(); actRef.current?.left?.() }}
            >↩ 左</button>
            <button className="flex-1 h-72 text-3xl font-bold bg-white border-2 border-[#ddd] rounded-2xl active:bg-[#eee] shadow-lg touch-manipulation"
              onTouchStart={e => { e.preventDefault(); actRef.current?.rotate?.() }}
            >↻ 旋转</button>
            <button className="flex-1 h-72 text-3xl font-bold bg-white border-2 border-[#ddd] rounded-2xl active:bg-[#eee] shadow-lg touch-manipulation"
              onTouchStart={e => { e.preventDefault(); actRef.current?.right?.() }}
            >↪ 右</button>
          </div>
          <div className="flex gap-6 mt-4">
            <button className="flex-1 h-72 text-3xl font-bold bg-white border-2 border-[#ddd] rounded-2xl active:bg-[#eee] shadow-lg touch-manipulation"
              onTouchStart={e => { e.preventDefault(); actRef.current?.drop?.() }}
            >↓ 下</button>
            <button className="flex-1 h-72 text-3xl font-bold bg-orange-50 border-2 border-[#f0a000] rounded-2xl active:bg-[#ffe0b0] shadow-lg touch-manipulation"
              onTouchStart={e => { e.preventDefault(); actRef.current?.hardDrop?.() }}
            >⏬ 落底</button>
          </div>
        </div>
      )}
    </div>
  )
}
