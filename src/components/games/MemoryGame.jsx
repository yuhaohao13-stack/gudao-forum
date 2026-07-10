'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

import { useGameSound } from '@/components/games/SoundProvider'
const W = 400, H = 400
const ROWS = 4, COLS = 4
const MARGIN = 16
const GAP = 8
const CELL_SIZE = (W - MARGIN * 2 - GAP * (COLS - 1)) / COLS // 86px
const PAIRS = 8

const EMOJIS = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍑', '🍒', '🥝']

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildCards() {
  const pairs = shuffle(EMOJIS).slice(0, PAIRS)
  const deck = pairs.flatMap((emoji, id) => [
    { id: id * 2, pairId: id, emoji, flipped: false, matched: false },
    { id: id * 2 + 1, pairId: id, emoji, flipped: false, matched: false },
  ])
  return shuffle(deck)
}

export default function MemoryGame({ onScore }) {
  const { play } = useGameSound()
  const canvasRef = useRef(null)
  const [state, setState] = useState('idle')
  const [score, setScore] = useState(0)
  const [matches, setMatches] = useState(0)
  const gameRef = useRef(null)

  const start = useCallback(() => {
    setState('playing')
    setScore(0)
    setMatches(0)
  }, [])

  useEffect(() => {
    if (state !== 'playing') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let cards = buildCards()
    let firstFlipped = null // {index, card}
    let secondFlipped = null
    let locked = false // lock during mismatch delay
    let running = true
    let gameScore = 0
    let gameMatches = 0
    let animFrame = null

    const drawCard = (card, index) => {
      const row = Math.floor(index / COLS)
      const col = index % COLS
      const x = MARGIN + col * (CELL_SIZE + GAP)
      const y = MARGIN + row * (CELL_SIZE + GAP)

      // shadow
      ctx.shadowColor = 'rgba(0,0,0,0.15)'
      ctx.shadowBlur = 6
      ctx.shadowOffsetY = 3

      // card background
      const isFlipped = card.flipped || card.matched
      const rx = x, ry = y, rw = CELL_SIZE, rh = CELL_SIZE, radius = 10

      ctx.beginPath()
      ctx.moveTo(rx + radius, ry)
      ctx.lineTo(rx + rw - radius, ry)
      ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + radius)
      ctx.lineTo(rx + rw, ry + rh - radius)
      ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - radius, ry + rh)
      ctx.lineTo(rx + radius, ry + rh)
      ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - radius)
      ctx.lineTo(rx, ry + radius)
      ctx.quadraticCurveTo(rx, ry, rx + radius, ry)
      ctx.closePath()

      if (isFlipped) {
        if (card.matched) {
          ctx.fillStyle = '#c8f7c5'
          ctx.strokeStyle = '#4caf50'
        } else {
          ctx.fillStyle = '#fff'
          ctx.strokeStyle = '#1a1a3e'
        }
        ctx.lineWidth = 2
        ctx.fill()
        ctx.stroke()
      } else {
        // card back - blue/gray gradient
        const grad = ctx.createLinearGradient(x, y, x + CELL_SIZE, y + CELL_SIZE)
        grad.addColorStop(0, '#4a6fa5')
        grad.addColorStop(1, '#2d4373')
        ctx.fillStyle = grad
        ctx.fill()
        ctx.strokeStyle = '#1a1a3e'
        ctx.lineWidth = 2
        ctx.stroke()

        // decorative pattern on back
        ctx.fillStyle = 'rgba(255,255,255,0.12)'
        ctx.beginPath()
        ctx.arc(x + CELL_SIZE / 2, y + CELL_SIZE / 2, CELL_SIZE * 0.22, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = 'rgba(255,255,255,0.06)'
        ctx.beginPath()
        ctx.arc(x + CELL_SIZE / 2, y + CELL_SIZE / 2, CELL_SIZE * 0.14, 0, Math.PI * 2)
        ctx.fill()
        // question mark
        ctx.fillStyle = 'rgba(255,255,255,0.25)'
        ctx.font = `${CELL_SIZE * 0.35}px Inter, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('?', x + CELL_SIZE / 2, y + CELL_SIZE / 2)
      }

      ctx.shadowBlur = 0
      ctx.shadowOffsetY = 0

      // if flipped or matched, show emoji
      if (isFlipped) {
        ctx.font = `${CELL_SIZE * 0.55}px Inter, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(card.emoji, x + CELL_SIZE / 2, y + CELL_SIZE / 2 + 2)
      }
    }

    const draw = () => {
      if (!running) return
      ctx.clearRect(0, 0, W, H)

      // background
      ctx.fillStyle = '#f0ebe3'
      ctx.fillRect(0, 0, W, H)

      // draw grid
      for (let i = 0; i < cards.length; i++) {
        drawCard(cards[i], i)
      }

      // HUD
      ctx.fillStyle = '#666'
      ctx.font = 'bold 14px Inter, sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(`✓ ${gameMatches}/8  🏆 ${gameScore}`, W - 10, H - 8)

      animFrame = requestAnimationFrame(draw)
    }

    const getCardIndex = (mx, my) => {
      for (let i = 0; i < cards.length; i++) {
        const row = Math.floor(i / COLS)
        const col = i % COLS
        const x = MARGIN + col * (CELL_SIZE + GAP)
        const y = MARGIN + row * (CELL_SIZE + GAP)
        if (mx >= x && mx <= x + CELL_SIZE && my >= y && my <= y + CELL_SIZE) {
          return i
        }
      }
      return -1
    }

    const clickHandler = (e) => {
      if (!running || locked) return
      const rect = canvas.getBoundingClientRect()
      const scaleX = W / rect.width
      const scaleY = H / rect.height
      const mx = (e.clientX - rect.left) * scaleX
      const my = (e.clientY - rect.top) * scaleY

      const index = getCardIndex(mx, my)
      if (index === -1) return
      const card = cards[index]
      if (card.flipped || card.matched) return

      // flip the card
      card.flipped = true

      if (firstFlipped === null) {
        firstFlipped = { index, card }
      } else if (secondFlipped === null) {
        secondFlipped = { index, card }
        locked = true

        // check match
        if (firstFlipped.card.pairId === secondFlipped.card.pairId) {
          // match!
          firstFlipped.card.matched = true
          secondFlipped.card.matched = true
          firstFlipped.card.flipped = true
          secondFlipped.card.flipped = true
          gameMatches++
          gameScore += 25
          setScore(gameScore)
          setMatches(gameMatches)
          firstFlipped = null
          secondFlipped = null
          locked = false

          // check win
          if (gameMatches === PAIRS) {
            running = false
            if (animFrame) cancelAnimationFrame(animFrame)
              play('win'); setState('over')
            if (onScore) onScore(gameScore)
          }
        } else {
          // no match - flip back after 1 second
          const f1 = firstFlipped
          const f2 = secondFlipped
          setTimeout(() => {
            if (!running) return
            f1.card.flipped = false
            f2.card.flipped = false
            firstFlipped = null
            secondFlipped = null
            locked = false
          }, 1000)
        }
      }
    }

    animFrame = requestAnimationFrame(draw)
    canvas.addEventListener('click', clickHandler)

    gameRef.current = () => {
      running = false
      if (animFrame) cancelAnimationFrame(animFrame)
      canvas.removeEventListener('click', clickHandler)
    }
    return () => {
      running = false
      if (animFrame) cancelAnimationFrame(animFrame)
      canvas.removeEventListener('click', clickHandler)
    }
  }, [state, onScore])

  useEffect(() => { return () => gameRef.current?.() }, [])

  return (
    <div className="flex flex-col items-center gap-[16px]">
      <div className="flex items-center gap-[24px] flex-wrap justify-center">
        <div className="text-[14px] text-[#888]">配对: <span className="text-[#c23531] font-bold text-[18px]">{matches}</span>/8</div>
        <div className="text-[14px] text-[#888]">得分: <span className="text-[#c23531] font-bold text-[18px]">{score}</span></div>
        {state === 'idle' && (
          <button onClick={start} className="btn-primary" style={{fontSize:"10px",padding:"10px 20px"}}>
            🧠 开始记忆
          </button>
        )}
        {state === 'over' && (
          <div className="flex items-center gap-[12px]">
            <span className="text-[#e94560] font-bold text-[18px]">🎉 全部配对!</span>
            <button onClick={start} className="btn-primary" style={{fontSize:"10px",padding:"10px 20px"}}>
              再来一局
            </button>
          </div>
        )}
        {state === 'playing' && <span className="text-[12px] text-[#999]">翻开两张相同的卡片即可配对</span>}
      </div>
      <canvas ref={canvasRef} width={W} height={H}
        className="rounded-2xl border-2 border-[#1a1a3e] shadow-lg touch-none cursor-pointer" />
    </div>
  )
}
