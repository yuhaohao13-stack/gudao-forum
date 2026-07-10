'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

import { useGameSound } from '@/components/games/SoundProvider'
const W = 400, H = 400
const SIZE = 4
const TILE_W = W / SIZE // 100
const TILE_H = H / SIZE // 100

const COLORS = [
  '#ff6b6b','#ffa94d','#ffd43b','#69db7c',
  '#38d9a9','#4dabf7','#748ffc','#9775fa',
  '#f06595','#f783ac','#63e6be','#a9e34b',
  '#ff922b','#845ef7','#339af0',
]

export default function SlidingPuzzle({ onScore }) {
  const { play } = useGameSound()
  const canvasRef = useRef(null)
  const [state, setState] = useState('idle')
  const [moves, setMoves] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [best, setBest] = useState(null)

  const start = useCallback(() => {
    setState('playing')
    setMoves(0)
    setElapsed(0)
  }, [])

  useEffect(() => {
    if (state !== 'playing') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let tiles = []
    let emptyIdx = 15
    let currentMoves = 0
    let seconds = 0
    let running = true
    let timerInterval = null

    const isSolved = () => {
      for (let i = 0; i < 15; i++) if (tiles[i] !== i + 1) return false
      return tiles[15] === 0
    }

    const shuffle = () => {
      tiles = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0]
      emptyIdx = 15
      let lastMove = -1
      for (let step = 0; step < 200; step++) {
        const neighbors = []
        if (emptyIdx % SIZE !== 0 && emptyIdx - 1 !== lastMove) neighbors.push(emptyIdx - 1)
        if (emptyIdx % SIZE !== SIZE - 1 && emptyIdx + 1 !== lastMove) neighbors.push(emptyIdx + 1)
        if (emptyIdx >= SIZE && emptyIdx - SIZE !== lastMove) neighbors.push(emptyIdx - SIZE)
        if (emptyIdx < W - SIZE && emptyIdx + SIZE !== lastMove) neighbors.push(emptyIdx + SIZE)
        if (neighbors.length === 0) continue
        const pick = neighbors[Math.floor(Math.random() * neighbors.length)]
        tiles[emptyIdx] = tiles[pick]
        tiles[pick] = 0
        lastMove = emptyIdx
        emptyIdx = pick
      }
      // edge case: if randomly solved after shuffle, swap two non-empty tiles
      if (isSolved()) {
        let a = Math.floor(Math.random() * 15)
        let b = Math.floor(Math.random() * 15)
        while (b === a) b = Math.floor(Math.random() * 15)
        if (tiles[a] === 0) { const t = a; a = b; b = t }
        if (tiles[b] === 0) { b = Math.floor(Math.random() * 15); while (b === a || tiles[b] === 0) b = Math.floor(Math.random() * 15) }
        ;[tiles[a], tiles[b]] = [tiles[b], tiles[a]]
        if (tiles[a] === 0) emptyIdx = a
        if (tiles[b] === 0) emptyIdx = b
      }
    }

    const draw = () => {
      ctx.fillStyle = '#0a0a1a'
      ctx.fillRect(0, 0, W, H)

      for (let i = 0; i < 16; i++) {
        const val = tiles[i]
        if (val === 0) continue
        const col = i % SIZE
        const row = Math.floor(i / SIZE)
        const x = col * TILE_W
        const y = row * TILE_H

        // tile background
        ctx.fillStyle = COLORS[(val - 1) % COLORS.length]
        ctx.shadowColor = COLORS[(val - 1) % COLORS.length]
        ctx.shadowBlur = 6
        ctx.fillRect(x + 2, y + 2, TILE_W - 4, TILE_H - 4)
        ctx.shadowBlur = 0

        // highlight
        ctx.fillStyle = 'rgba(255,255,255,0.15)'
        ctx.fillRect(x + 4, y + 4, TILE_W - 12, 4)
        ctx.fillRect(x + 4, y + 4, 4, TILE_H - 12)

        // number
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 32px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(String(val), x + TILE_W / 2, y + TILE_H / 2)
      }
    }

    shuffle()
    draw()

    // timer
    timerInterval = setInterval(() => {
      if (!running) return
      seconds++
      setElapsed(seconds)
    }, 1000)

    const tryMove = (clickIdx) => {
      if (!running || clickIdx === emptyIdx) return

      // check if adjacent
      const eCol = emptyIdx % SIZE, eRow = Math.floor(emptyIdx / SIZE)
      const cCol = clickIdx % SIZE, cRow = Math.floor(clickIdx / SIZE)
      const dist = Math.abs(eCol - cCol) + Math.abs(eRow - cRow)
      if (dist !== 1) return

      // swap
      tiles[emptyIdx] = tiles[clickIdx]
      tiles[clickIdx] = 0
      emptyIdx = clickIdx
      currentMoves++
      setMoves(currentMoves)
      draw()

      if (isSolved()) {
        running = false
        clearInterval(timerInterval)
        setElapsed(seconds)
          play('win'); setState('over')
        if (onScore) onScore(currentMoves)
        // best score tracking
        setBest(prev => prev === null ? currentMoves : Math.min(prev, currentMoves))
      }
    }

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = (e.clientX - rect.left) * (W / rect.width)
      const y = (e.clientY - rect.top) * (H / rect.height)
      const col = Math.floor(x / TILE_W)
      const row = Math.floor(y / TILE_H)
      if (col >= 0 && col < SIZE && row >= 0 && row < SIZE) {
        tryMove(row * SIZE + col)
      }
    }

    canvas.addEventListener('click', handleClick)

    return () => {
      running = false
      clearInterval(timerInterval)
      canvas.removeEventListener('click', handleClick)
    }
  }, [state, onScore])

  return (
    <div className="flex flex-col items-center gap-[20px]">
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <div className="text-sm text-[#888]">
          步数: <span className="text-[#c23531] font-bold text-[18px]">{moves}</span>
          {' | '}
          时间: <span className="text-[#c23531] font-bold text-[18px]">{elapsed}s</span>
          {best !== null && (
            <> | 最佳: <span className="text-[#c23531] font-bold text-[18px]">{best}</span></>
          )}
        </div>
        {state === 'idle' && (
          <button onClick={start} className="btn-primary" style={{fontSize:"10px",padding:"10px 20px"}}>开始游戏</button>
        )}
        {state === 'over' && (
          <div className="flex items-center gap-3">
            <span className="text-[#e94560] font-bold text-[18px]">恭喜完成!</span>
            <button onClick={start} className="btn-primary" style={{fontSize:"10px",padding:"10px 20px"}}>再来一局</button>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} width={W} height={H}
        className="rounded-2xl border-2 border-[#1a1a3e] shadow-lg touch-manipulation" />
    </div>
  )
}
