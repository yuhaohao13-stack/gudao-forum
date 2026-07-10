'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

import useGameSound from '@/components/games/useGameSound'
const SIZE = 4
const CELL = 100, GAP = 8
const BOARD = SIZE * CELL + (SIZE + 1) * GAP

const TILE_COLORS = {
  2: '#eee4da', 4: '#ede0c8', 8: '#f2b179', 16: '#f59563',
  32: '#f67c5f', 64: '#f65e3b', 128: '#edcf72', 256: '#edcc61',
  512: '#edc850', 1024: '#edc53f', 2048: '#edc22e', 4096: '#3c3a32',
}

const TILE_TEXT = {
  2: '#776e65', 4: '#776e65', 8: '#f9f6f2', 16: '#f9f6f2',
  32: '#f9f6f2', 64: '#f9f6f2', 128: '#f9f6f2', 256: '#f9f6f2',
  512: '#f9f6f2', 1024: '#f9f6f2', 2048: '#f9f6f2',
}

function addRandomTile(grid) {
  const empty = []
  for (let i = 0; i < SIZE; i++)
    for (let j = 0; j < SIZE; j++)
      if (!grid[i][j]) empty.push({ i, j })
  if (!empty.length) return false
  const { i, j } = empty[Math.floor(Math.random() * empty.length)]
  grid[i][j] = Math.random() < 0.9 ? 2 : 4
  return true
}

function slideLine(line) {
  let arr = line.filter(v => v)
  let score = 0
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2
      score += arr[i]
      arr.splice(i + 1, 1)
    }
  }
  while (arr.length < SIZE) arr.push(0)
  return { arr, score }
}

function move(grid, dir) {
  // dir: 0=left, 1=up, 2=right, 3=down
  let newGrid = grid.map(r => [...r])
  let totalScore = 0
  let changed = false

  const process = (lines) => {
    lines.forEach(line => {
      if (dir === 2 || dir === 3) line.reverse()
      const { arr, score } = slideLine(line)
      if (dir === 2 || dir === 3) arr.reverse()
        play('score'); totalScore += score
      for (let i = 0; i < SIZE; i++) {
        if (line[i] !== arr[i]) changed = true
        line[i] = arr[i]
      }
    })
  }

  if (dir === 0 || dir === 2) {
    process(newGrid)
  } else {
    const cols = Array.from({ length: SIZE }, (_, j) => newGrid.map(r => r[j]))
    process(cols)
    for (let j = 0; j < SIZE; j++)
      for (let i = 0; i < SIZE; i++)
        newGrid[i][j] = cols[j][i]
  }

  if (changed) addRandomTile(newGrid)
  return { grid: newGrid, score: totalScore, changed }
}

function canMove(grid) {
  for (let d = 0; d < 4; d++) {
    if (move(grid.map(r => [...r]), d).changed) return true
  }
  return false
}

export default function Game2048({ onScore }) {
  const { play } = useGameSound()
  const canvasRef = useRef(null)
  const [state, setState] = useState('idle')
  const [score, setScore] = useState(0)
  const gameRef = useRef(null)

  const start = useCallback(() => {
    setState('playing')
    setScore(0)
  }, [])

  useEffect(() => {
    if (state !== 'playing') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(0))
    addRandomTile(grid)
    addRandomTile(grid)
    let gameScore = 0
    let running = true

    const draw = () => {
      ctx.fillStyle = '#bbada0'
      ctx.fillRect(0, 0, BOARD, BOARD)

      for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          const x = GAP + j * (CELL + GAP)
          const y = GAP + i * (CELL + GAP)
          const val = grid[i][j]
          ctx.fillStyle = TILE_COLORS[val] || '#3c3a32'
          ctx.beginPath()
          ctx.roundRect(x, y, CELL, CELL, 6)
          ctx.fill()

          if (val) {
            ctx.fillStyle = TILE_TEXT[val] || '#f9f6f2'
            ctx.font = `bold ${val < 100 ? 36 : val < 1000 ? 28 : 22}px Inter, sans-serif`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(val, x + CELL / 2, y + CELL / 2)
          }
        }
      }
    }

    draw()

    const keyHandler = (e) => {
      if (!running) return
      let dir
      switch (e.key) {
        case 'ArrowLeft': dir = 0; break
        case 'ArrowUp': dir = 1; break
        case 'ArrowRight': dir = 2; break
        case 'ArrowDown': dir = 3; break
        default: return
      }
      e.preventDefault()
      const result = move(grid, dir)
      if (!result.changed) return
      grid = result.grid
      gameScore += result.score
      setScore(gameScore)
      draw()
      if (!canMove(grid)) {
        running = false
        setState('over')
        if (onScore) onScore(gameScore)
      }
    }
    window.addEventListener('keydown', keyHandler)

    // Touch swipe support
    let touchStart = null
    const touchStartHandler = (e) => {
      touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
    const touchEndHandler = (e) => {
      if (!touchStart) return
      const dx = e.changedTouches[0].clientX - touchStart.x
      const dy = e.changedTouches[0].clientY - touchStart.y
      const absDx = Math.abs(dx), absDy = Math.abs(dy)
      let dir
      if (Math.max(absDx, absDy) < 30) return
      if (absDx > absDy) dir = dx > 0 ? 2 : 0
      else dir = dy > 0 ? 3 : 1
      const event = new KeyboardEvent('keydown', { key: ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'][dir] })
      window.dispatchEvent(event)
      touchStart = null
    }
    canvas.addEventListener('touchstart', touchStartHandler)
    canvas.addEventListener('touchend', touchEndHandler)

    gameRef.current = () => {
      running = false
      window.removeEventListener('keydown', keyHandler)
      canvas.removeEventListener('touchstart', touchStartHandler)
      canvas.removeEventListener('touchend', touchEndHandler)
    }
    return () => {
      running = false
      window.removeEventListener('keydown', keyHandler)
      canvas.removeEventListener('touchstart', touchStartHandler)
      canvas.removeEventListener('touchend', touchEndHandler)
    }
  }, [state, onScore])

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6 flex-wrap justify-center">
        <div className="text-sm text-[#888]">得分: <span className="text-[#c23531] font-bold text-lg">{score}</span></div>
        {state === 'idle' && <button onClick={start} className="btn-primary">开始游戏</button>}
        {state === 'over' && (
          <div className="flex items-center gap-3">
            <span className="text-[#e94560] font-bold">游戏结束</span>
            <button onClick={start} className="btn-primary">再来一局</button>
          </div>
        )}
        {state === 'playing' && <span className="text-xs text-[#999]">方向键/滑动操作</span>}
      </div>
      <canvas ref={canvasRef} width={BOARD} height={BOARD}
        className="rounded-xl border-2 border-[#bbada0] shadow-lg max-w-full touch-none" />
    </div>
  )
}
