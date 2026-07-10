'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

import useGameSound from '@/components/games/useGameSound'
const W = 500, H = 400
const PADDLE_W = 10, PADDLE_H = 80
const BALL_R = 8
const BALL_SPEED = 5
const WIN_SCORE = 10
const AI_SPEED = 3

export default function PongGame({ onScore }) {
  const { play } = useGameSound()
  const canvasRef = useRef(null)
  const gameRef = useRef(null)
  const [state, setState] = useState('idle')
  const [playerScore, setPlayerScore] = useState(0)
  const [aiScore, setAiScore] = useState(0)

  const start = useCallback(() => {
    setState('playing')
    setPlayerScore(0)
    setAiScore(0)
  }, [])

  useEffect(() => {
    if (state !== 'playing') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const PADDLE_MARGIN = 20

    let playerPaddle = { y: H / 2 - PADDLE_H / 2 }
    let aiPaddle = { y: H / 2 - PADDLE_H / 2 }
    let ball = {
      x: W / 2,
      y: H / 2,
      dx: BALL_SPEED * (Math.random() < 0.5 ? 1 : -1),
      dy: (Math.random() * 2 - 1) * 2,
    }
    let pScore = 0
    let aScore = 0
    let running = true
    let targetY = H / 2
    let mouseY = H / 2

    const draw = () => {
      // background
      ctx.fillStyle = '#0f0f23'
      ctx.fillRect(0, 0, W, H)

      // center line (dashed)
      ctx.strokeStyle = 'rgba(255,255,255,0.15)'
      ctx.lineWidth = 2
      ctx.setLineDash([8, 8])
      ctx.beginPath()
      ctx.moveTo(W / 2, 0)
      ctx.lineTo(W / 2, H)
      ctx.stroke()
      ctx.setLineDash([])

      // player paddle (left)
      ctx.fillStyle = '#00e5ff'
      ctx.shadowColor = '#00e5ff'
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.roundRect(PADDLE_MARGIN, playerPaddle.y, PADDLE_W, PADDLE_H, 4)
      ctx.fill()
      ctx.shadowBlur = 0

      // ai paddle (right)
      ctx.fillStyle = '#e94560'
      ctx.shadowColor = '#e94560'
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.roundRect(W - PADDLE_MARGIN - PADDLE_W, aiPaddle.y, PADDLE_W, PADDLE_H, 4)
      ctx.fill()
      ctx.shadowBlur = 0

      // ball
      ctx.fillStyle = '#fff'
      ctx.shadowColor = '#fff'
      ctx.shadowBlur = 15
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      // score
      ctx.font = 'bold 40px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = 'rgba(255,255,255,0.3)'
      ctx.fillText(pScore, W / 2 - 60, 50)
      ctx.fillText(aScore, W / 2 + 60, 50)
    }

    const resetBall = (scorer) => {
      ball.x = W / 2
      ball.y = H / 2
      ball.dx = (scorer === 'player' ? 1 : -1) * BALL_SPEED
      ball.dy = (Math.random() * 2 - 1) * 2
    }

    const tick = () => {
      if (!running) return

      // smooth player paddle follow
      const smoothTarget = targetY - PADDLE_H / 2
      playerPaddle.y += (smoothTarget - playerPaddle.y) * 0.2
      playerPaddle.y = Math.max(0, Math.min(H - PADDLE_H, playerPaddle.y))

      // AI follows ball with delay
      const aiCenter = aiPaddle.y + PADDLE_H / 2
      const diff = ball.y - aiCenter
      if (Math.abs(diff) > 10) {
        aiPaddle.y += Math.sign(diff) * AI_SPEED
      }
      aiPaddle.y = Math.max(0, Math.min(H - PADDLE_H, aiPaddle.y))

      // ball movement
      ball.x += ball.dx
      ball.y += ball.dy

      // top/bottom bounce
      if (ball.y - BALL_R <= 0 || ball.y + BALL_R >= H) {
        ball.dy = -ball.dy
      }

      // player paddle collision (left)
      if (
        ball.dx < 0 &&
        ball.x - BALL_R <= PADDLE_MARGIN + PADDLE_W &&
        ball.x - BALL_R >= PADDLE_MARGIN &&
        ball.y >= playerPaddle.y &&
        ball.y <= playerPaddle.y + PADDLE_H
      ) {
          play('bounce');   play('bounce'); ball.dx = -ball.dx
        ball.x = PADDLE_MARGIN + PADDLE_W + BALL_R
        // angle based on where ball hits paddle
        const hitPos = (ball.y - (playerPaddle.y + PADDLE_H / 2)) / (PADDLE_H / 2)
        ball.dy = hitPos * 4
      }

      // ai paddle collision (right)
      if (
        ball.dx > 0 &&
        ball.x + BALL_R >= W - PADDLE_MARGIN - PADDLE_W &&
        ball.x + BALL_R <= W - PADDLE_MARGIN &&
        ball.y >= aiPaddle.y &&
        ball.y <= aiPaddle.y + PADDLE_H
      ) {
        ball.dx = -ball.dx
        ball.x = W - PADDLE_MARGIN - PADDLE_W - BALL_R
        const hitPos = (ball.y - (aiPaddle.y + PADDLE_H / 2)) / (PADDLE_H / 2)
        ball.dy = hitPos * 4
      }

      // scoring
      if (ball.x - BALL_R < 0) {
        aScore++
        setAiScore(aScore)
        if (aScore >= WIN_SCORE) {
          running = false
            play('win');   play('win'); setState('over')
          if (onScore) onScore({ player: pScore, ai: aScore })
          return
        }
        resetBall('ai')
      }
      if (ball.x + BALL_R > W) {
        pScore++
        setPlayerScore(pScore)
        if (pScore >= WIN_SCORE) {
          running = false
          setState('over')
          if (onScore) onScore({ player: pScore, ai: aScore })
          return
        }
        resetBall('player')
      }

      draw()
    }

    draw()
    const interval = setInterval(tick, 16)

    const mouseHandler = (e) => {
      const rect = canvas.getBoundingClientRect()
      targetY = (e.clientY - rect.top) * (H / rect.height)
    }
    const touchHandler = (e) => {
      e.preventDefault()
      const rect = canvas.getBoundingClientRect()
      targetY = (e.touches[0].clientY - rect.top) * (H / rect.height)
    }
    canvas.addEventListener('mousemove', mouseHandler)
    canvas.addEventListener('touchmove', touchHandler, { passive: false })
    canvas.addEventListener('touchstart', touchHandler, { passive: false })

    gameRef.current = () => {
      running = false
      clearInterval(interval)
      canvas.removeEventListener('mousemove', mouseHandler)
      canvas.removeEventListener('touchmove', touchHandler)
      canvas.removeEventListener('touchstart', touchHandler)
    }
    return () => {
      running = false
      clearInterval(interval)
      canvas.removeEventListener('mousemove', mouseHandler)
      canvas.removeEventListener('touchmove', touchHandler)
      canvas.removeEventListener('touchstart', touchHandler)
    }
  }, [state, onScore])

  useEffect(() => {
    return () => { if (gameRef.current) gameRef.current() }
  }, [])

  return (
    <div className="flex flex-col items-center gap-[16px]">
      <div className="flex items-center gap-[24px] flex-wrap justify-center">
        <div className="text-[14px] text-[#888]">
          玩家: <span className="text-[#00e5ff] font-bold text-[18px]">{playerScore}</span>
          {' | '}
          AI: <span className="text-[#e94560] font-bold text-[18px]">{aiScore}</span>
        </div>
        {state === 'idle' && (
          <button onClick={start} className="btn-primary" style={{ fontSize: '20px', padding: '20px 40px' }}>
            开始游戏
          </button>
        )}
        {state === 'over' && (
          <div className="flex items-center gap-[12px]">
            <span className="text-[#e94560] font-bold text-[18px]">
              {playerScore > aiScore ? '🎉 你赢了!' : '😢 AI 获胜'}
            </span>
            <button onClick={start} className="btn-primary" style={{ fontSize: '20px', padding: '20px 40px' }}>
              再来一局
            </button>
          </div>
        )}
        {state === 'playing' && (
          <span className="text-[12px] text-[#999] hidden sm:inline">鼠标上下移动控制挡板</span>
        )}
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="rounded-2xl border-2 border-[#1a1a3e] shadow-lg max-w-full touch-none"
      />
      {state === 'playing' && (
        <div className="sm:hidden text-[12px] text-[#999]">手指在画布上滑动控制挡板</div>
      )}
    </div>
  )
}
