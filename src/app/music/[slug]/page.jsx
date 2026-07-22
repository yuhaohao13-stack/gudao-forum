'use client'

import { useParams, useRouter } from 'next/navigation'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Music, ListMusic, Lock, Download } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'
import musicData from '@/data/music'
import { useAuth } from '@/components/AuthProvider'
import { canDownloadMusic, getUpgradeInfo, TechLockOverlay } from '@/lib/member'
import { createClient } from '@/lib/supabase/client'

export default function MusicCategoryPage() {
  const { slug } = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const category = musicData.find(c => c.id === slug)
  const audioRef = useRef(null)
  // Track if user has ever pressed play to avoid showing errors on initial mount
  const hasAttemptedPlay = useRef(false)

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [downloadOverlay, setDownloadOverlay] = useState({ show: false, reason: '' })
  const supabase = createClient()

  const songs = category?.songs || []
  const currentSong = songs[selectedIndex]

  const mp3Url = currentSong
    ? `https://rsndnhdimruisysacujg.supabase.co/storage/v1/object/public/music/${category.id}/${currentSong.id}.mp3`
    : ''

  // Set up audio event listeners once
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTime = () => setCurrentTime(audio.currentTime)
    const onMeta = () => {
      setDuration(audio.duration)
      setLoading(false)
    }
    const onEnd = () => {
      if (selectedIndex < songs.length - 1) {
        setSelectedIndex(selectedIndex + 1)
      } else {
        setIsPlaying(false)
        setSelectedIndex(0)
      }
    }
    const onError = () => {
      // Only show error if user has actually tried to play
      if (hasAttemptedPlay.current) {
        setError('无法加载音频，请稍后重试')
      }
      setIsPlaying(false)
      setLoading(false)
    }
    const onWaiting = () => setLoading(true)
    const onCanPlay = () => setLoading(false)

    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('ended', onEnd)
    audio.addEventListener('error', onError)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('canplay', onCanPlay)

    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('ended', onEnd)
      audio.removeEventListener('error', onError)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('canplay', onCanPlay)
    }
  }, [])

  // Load new song when selectedIndex changes (only when user actively switched)
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentSong) return

    setCurrentTime(0)
    setDuration(0)
    audio.src = mp3Url
    audio.load()

    // If we were playing, auto-play the new song
    if (isPlaying) {
      setLoading(true)
      hasAttemptedPlay.current = true
      const tryPlay = () => {
        audio.play().then(() => {
          setLoading(false)
        }).catch(() => {
          setLoading(false)
          setError('播放失败，请点击播放按钮重试')
        })
      }
      audio.addEventListener('canplay', tryPlay, { once: true })
      const fallback = setTimeout(tryPlay, 2000)
      return () => {
        audio.removeEventListener('canplay', tryPlay)
        clearTimeout(fallback)
      }
    }
  }, [selectedIndex])

  const playSong = () => {
    const audio = audioRef.current
    if (!audio || !currentSong) return

    hasAttemptedPlay.current = true
    setError('')
    setLoading(true)

    // Always set src and load fresh when user clicks play
    audio.src = mp3Url
    audio.load()

    const tryPlay = () => {
      audio.play().then(() => {
        setIsPlaying(true)
        setLoading(false)
      }).catch((e) => {
        // Retry once after a short delay
        setTimeout(() => {
          audio.play().then(() => {
            setIsPlaying(true)
            setLoading(false)
          }).catch(() => {
            setIsPlaying(false)
            setLoading(false)
            setError('暂时无法播放此歌曲，请稍后重试')
          })
        }, 500)
      })
    }

    // Try to play once metadata is loaded, or fallback after timeout
    audio.addEventListener('canplay', tryPlay, { once: true })
    const fallback = setTimeout(tryPlay, 2000)
    audio.addEventListener('error', function cleanup() {
      clearTimeout(fallback)
      audio.removeEventListener('canplay', tryPlay)
      audio.removeEventListener('error', cleanup)
    }, { once: true })
  }

  const pauseSong = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    setIsPlaying(false)
  }

  const togglePlay = () => {
    if (isPlaying) {
      pauseSong()
    } else {
      playSong()
    }
  }

  const playPrev = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1)
    } else {
      setSelectedIndex(songs.length - 1)
    }
  }

  const playNext = () => {
    if (selectedIndex < songs.length - 1) {
      setSelectedIndex(selectedIndex + 1)
    } else {
      setSelectedIndex(0)
    }
  }

  const goToSong = (song) => {
    router.push(`/music/song/${category.id}/${song.id}`)
  }

  const formatTime = (s) => {
    if (!s || isNaN(s)) return '0:00'
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    if (audioRef.current && duration) audioRef.current.currentTime = x * duration
  }

  const handleDownload = async (song) => {
    const check = canDownloadMusic(user, profile)
    if (!check.allowed) {
      // 普通会员：尝试积分扣除500
      if (check.reason === 'upgrade') {
        const res = await fetch('/api/points/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'download' }) })
        const data = await res.json()
        if (!data.success) {
          setDownloadOverlay({ show: true, reason: check.reason })
          return
        }
        window.dispatchEvent(new CustomEvent('points-updated'))
      } else {
        setDownloadOverlay({ show: true, reason: check.reason })
        return
      }
    }

    // 开始下载
    const url = `https://rsndnhdimruisysacujg.supabase.co/storage/v1/object/public/music/${category.id}/${song.id}.mp3`
    try {
      const resp = await fetch(url)
      const blob = await resp.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `${song.title} - ${song.artist}.mp3`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(a.href)

      // 黄金会员：下载后+1
      if (!check.unlimited && profile?.id) {
        const currentUsed = profile.music_downloads_used || 0
        await supabase.from('profiles').update({ music_downloads_used: currentUsed + 1 }).eq('id', profile.id)
      }
    } catch (e) {
      setError('下载失败，请稍后重试')
    }
  }

  if (!category) {
    return (
      <div className="text-center py-20 anim-fade-in">
        <div className="mb-3"><Music size={40} className="inline-block text-[#ccc]" /></div>
        <p className="text-[#999]">该分类不存在</p>
        <Link href="/music" className="text-[#b45309] hover:underline mt-2 inline-block">返回音乐频道</Link>
      </div>
    )
  }

  return (
    <div className="anim-fade-in pb-20">
      {/* Audio element - no crossOrigin, no src set initially */}
      <audio ref={audioRef} preload="none" />

      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '音乐频道', href: '/music' },
        { label: category.name },
      ]} className="mb-3" />

      {/* Category header with unified play button */}
      <div className="flex items-center gap-3 mb-4">
        <Link href="/music" className="text-[#b45309]/60 hover:text-[#b45309] transition-colors shrink-0">
          <ArrowLeft size={16} />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-sm font-bold text-[#1a1a1a]">{category.name}</h1>
          <p className="text-[10px] text-[#aaa]">{category.description}</p>
        </div>
        {currentSong && !authLoading && (
          user ? (
            <button onClick={togglePlay}
              disabled={loading}
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all shadow-sm ${
                isPlaying
                  ? 'bg-[#b45309] text-white hover:bg-[#92400e]'
                  : 'bg-[#f5f0e8] text-[#888] hover:bg-[#b45309] hover:text-white'
              } ${loading ? 'opacity-50 cursor-wait' : ''}`}>
              {loading ? (
                <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause size={15} />
              ) : (
                <Play size={15} className="ml-0.5" />
              )}
            </button>
          ) : (
            <Link href="/login"
              className="flex items-center gap-1.5 text-[10px] text-white bg-[#b45309] hover:bg-[#92400e] rounded-full px-3.5 py-1.5 transition-colors shrink-0">
              <Lock size={11} /> 登录播放
            </Link>
          )
        )}
      </div>

      {/* Error message - only shown after user attempts playback */}
      {error && (
        <div className="mb-3 px-3.5 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
          {error}
        </div>
      )}

      {/* Progress bar (only when a song is selected AND user has played) */}
      {currentSong && (
        <div className="mb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-[9px] text-[#b0a898] w-8 text-right shrink-0">{formatTime(currentTime)}</span>
            <div className="flex-1 h-1.5 bg-[#f0ede8] rounded-full cursor-pointer relative group" onClick={handleSeek}>
              <div className="h-full bg-[#b45309] rounded-full transition-all" style={{ width: `${progress}%` }} />
              <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#b45309] shadow opacity-0 group-hover:opacity-100 transition-opacity"
                   style={{ left: `calc(${progress}% - 5px)` }} />
            </div>
            <span className="text-[9px] text-[#b0a898] w-8 shrink-0">{formatTime(duration)}</span>
          </div>
          {currentSong && (
            <p className="text-[9px] text-[#b45309] mt-1 text-center">
              {currentSong.title} — {currentSong.artist}
            </p>
          )}
        </div>
      )}

      {/* Song list */}
      <div className="space-y-1">
        {songs.map((song, i) => {
          const isSelected = i === selectedIndex
          return (
            <div key={song.id}
              onClick={() => goToSong(song)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg border transition-all duration-150 cursor-pointer group bg-white border-[#ece8e0] hover:border-[#b45309]/30 hover:bg-[#fcfaf7]">
              <span className="text-[10px] w-4 text-right shrink-0 font-mono text-[#b0a898]">{i + 1}</span>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate text-[#1a1a1a]">{song.title}</p>
                <p className="text-[10px] text-[#999]">{song.artist}</p>
              </div>

              <span className="text-[9px] text-[#b45309] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); handleDownload(song) }}
                  className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-[#b45309] text-white hover:bg-[#92400e] transition-colors" title="下载歌曲">
                  <Download size={13} /> 下载
                </button>
                进入 →
              </span>
            </div>
          )
        })}
      </div>

      {/* Mini Player Bar */}
      {currentSong && user && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#ece8e0] shadow-lg animate-slide-up">
          <div className="max-w-3xl mx-auto px-4 py-2">
            <div className="h-1 bg-[#f0ede8] rounded-full cursor-pointer mb-2" onClick={handleSeek}>
              <div className="h-full bg-[#b45309] rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-7 h-7 rounded-full bg-[#b45309]/10 flex items-center justify-center shrink-0">
                  <Music size={12} className={`${isPlaying ? 'text-[#b45309]' : 'text-[#b45309]/40'}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-[#1a1a1a] truncate">{currentSong.title}</p>
                  <p className="text-[9px] text-[#888]">{currentSong.artist}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button onClick={playPrev} className="text-[#b0a898] hover:text-[#666] transition-colors p-0.5">
                  <SkipBack size={14} />
                </button>
                <button onClick={togglePlay}
                  className="w-8 h-8 rounded-full bg-[#b45309] text-white hover:bg-[#92400e] transition-colors flex items-center justify-center shadow-sm">
                  {loading ? (
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <Pause size={14} />
                  ) : (
                    <Play size={14} className="ml-0.5" />
                  )}
                </button>
                <button onClick={playNext} className="text-[#b0a898] hover:text-[#666] transition-colors p-0.5">
                  <SkipForward size={14} />
                </button>
              </div>

              <span className="text-[8px] text-[#b0a898] shrink-0 w-12 text-right">{formatTime(currentTime)} / {formatTime(duration)}</span>

              <Link href={`/music/song/${category.id}/${currentSong.id}`}
                onClick={e => e.stopPropagation()}
                className="text-[8px] text-[#b45309] hover:underline shrink-0">
                详情 <ListMusic size={10} className="inline-block" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 下载限制弹窗 */}
      <TechLockOverlay
        show={downloadOverlay.show}
        reason={downloadOverlay.reason}
        onClose={() => setDownloadOverlay({ show: false, reason: '' })}
      />
    </div>
  )
}
