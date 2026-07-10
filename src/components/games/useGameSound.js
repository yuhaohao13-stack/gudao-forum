'use client'

import { createContext, useContext, useCallback, useState, useRef } from 'react'

// React Context — all components share the same state
const SoundContext = createContext(null)

export function SoundProvider({ children }) {
  const [enabled, setEnabled] = useState(false)
  const audioCtxRef = useRef(null)

  const getCtx = useCallback(() => {
    let ctx = audioCtxRef.current
    if (!ctx && typeof window !== 'undefined') {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)()
        audioCtxRef.current = ctx
      } catch { return null }
    }
    if (ctx?.state === 'suspended') ctx.resume()
    return ctx
  }, [])

  const toggleSound = useCallback(() => {
    setEnabled(prev => {
      const next = !prev
      if (next) {
        const ctx = getCtx()
        if (ctx) {
          try {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.type = 'sine'
            osc.frequency.value = 660
            gain.gain.setValueAtTime(0.08, ctx.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
            osc.start(ctx.currentTime)
            osc.stop(ctx.currentTime + 0.1)
          } catch {}
        }
      }
      return next
    })
  }, [getCtx])

  const play = useCallback((type) => {
    if (!enabled) return
    const ctx = getCtx()
    if (!ctx) return

    const beep = (freq, duration, vol = 0.1) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'square'; osc.frequency.value = freq
      gain.gain.setValueAtTime(vol, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + duration)
    }

    const sweep = (f1, f2, duration, vol = 0.1) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'square'
      osc.frequency.setValueAtTime(f1, ctx.currentTime)
      osc.frequency.linearRampToValueAtTime(f2, ctx.currentTime + duration)
      gain.gain.setValueAtTime(vol, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + duration)
    }

    switch (type) {
      case 'score':   beep(880, 0.12, 0.08); break
      case 'hit':     beep(440, 0.08, 0.12); break
      case 'bounce':  beep(660, 0.06, 0.06); break
      case 'shoot':   sweep(600, 200, 0.1, 0.06); break
      case 'explode': sweep(400, 80, 0.3, 0.12); break
      case 'jump':    sweep(300, 800, 0.12, 0.07); break
      case 'land':    beep(200, 0.06, 0.05); break
      case 'click':   beep(500, 0.04, 0.04); break
      case 'win':     sweep(400, 1200, 0.4, 0.1); break
      case 'gameover':sweep(400, 80, 0.5, 0.12); break
      case 'match':   beep(660, 0.15, 0.08); setTimeout(() => beep(880, 0.15, 0.08), 120); break
      case 'flip':    beep(300, 0.04, 0.04); break
      case 'move':    beep(350, 0.04, 0.04); break
      case 'alert':   beep(200, 0.2, 0.08); setTimeout(() => beep(200, 0.2, 0.08), 250); break
      default:        beep(500, 0.08, 0.06); break
    }
  }, [enabled, getCtx])

  return (
    <SoundContext.Provider value={{ play, toggleSound, enabled }}>
      {children}
    </SoundContext.Provider>
  )
}

// Hook remains the same API — components don't need changes
export default function useGameSound() {
  const ctx = useContext(SoundContext)
  if (!ctx) {
    // Fallback for components not wrapped in provider (will use local state)
    // This shouldn't happen since we wrap the games in SoundProvider
    return { play: () => {}, toggleSound: () => {}, enabled: false }
  }
  return ctx
}
