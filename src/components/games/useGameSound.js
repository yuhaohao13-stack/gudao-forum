'use client'

import { useCallback, useState, useEffect } from 'react'

// Module-level singleton — all instances share the same state
let globalEnabled = false
let globalAudioCtx = null
const listeners = new Set()

function notifyListeners() {
  for (const fn of listeners) fn(globalEnabled)
}

export default function useGameSound() {
  const [enabled, setEnabled] = useState(globalEnabled)

  useEffect(() => {
    const handler = (val) => setEnabled(val)
    listeners.add(handler)
    return () => listeners.delete(handler)
  }, [])

  const toggleSound = useCallback(() => {
    globalEnabled = !globalEnabled
    if (globalEnabled && !globalAudioCtx && typeof window !== 'undefined') {
      try {
        globalAudioCtx = new (window.AudioContext || window.webkitAudioContext)()
      } catch {}
    }
    notifyListeners()
    return globalEnabled
  }, [])

  const play = useCallback((type) => {
    if (!globalEnabled) return
    if (!globalAudioCtx && typeof window !== 'undefined') {
      try {
        globalAudioCtx = new (window.AudioContext || window.webkitAudioContext)()
      } catch { return }
    }
    if (!globalAudioCtx) return
    const ctx = globalAudioCtx

    const beep = (freq, duration, vol = 0.1) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'square'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(vol, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + duration)
    }

    const sweep = (f1, f2, duration, vol = 0.1) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'square'
      osc.frequency.setValueAtTime(f1, ctx.currentTime)
      osc.frequency.linearRampToValueAtTime(f2, ctx.currentTime + duration)
      gain.gain.setValueAtTime(vol, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + duration)
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
  }, [])

  return { play, toggleSound, enabled }
}
