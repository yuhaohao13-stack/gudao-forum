'use client'

import { useParams } from 'next/navigation'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Music, ListMusic } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'
import musicData from '@/data/music'

// Emoji lookup
const categoryEmoji = {
  'classic-8090': '📼',
  'viral-hits': '🌊',
  'folk': '🎸',
  'chinese-classics': '🎤',
  'english-songs': '🌍',
  'sleep-music': '🌙',
}

export default function MusicCategoryPage() {
  const { slug } = useParams()
  const category = musicData.find(c => c.id === slug)
  const audioRef = useRef(null)

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const songs = category?.songs || []
  const currentSong = songs[selectedIndex]
  const emoji = categoryEmoji[category?.id] || '🎵'

  const mp3Url = currentSong
    ? `https://rsndnhdimruisysacujg.supabase.co/storage/v1/object/public/music/${category.id}/${currentSong.id}.mp3`
    : ''

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTime = () => setCurrentTime(audio.currentTime)
    const onMeta = () => {
      setDuration(audio.duration)
      setLoading(false)
    }
    const onEnd = () => {
      // Auto-play next
      if (selectedIndex < songs.length - 1) {
        setSelectedIndex(selectedIndex + 1)
      } else {
        setIsPlaying(false)
        setSelectedIndex(0)
      }
    }
    const onError = () => {
      setError('无法加载音频，请稍后重试')
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
  }, [selectedIndex, songs.length])

  // When selectedIndex changes, load and auto-play if was playing
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentSong) return

    setError('')
    setCurrentTime(0)
    setDuration(0)
    audio.src = mp3Url
    audio.load()

    // If user clicked a new song while playback was on, auto-play
    if (isPlaying) {
      setLoading(true)
      const playIt = () => {
        audio.play().then(() => {
          setIsPlaying(true)
          setLoading(false)
        }).catch((e) => {
          console.warn('Play failed:', e)
          setIsPlaying(false)
          setLoading(false)
          setError('播放失败，请尝试点击播放按钮')
        })
      }
      // Wait a bit for metadata
      audio.addEventListener('canplay', playIt, { once: true })
      // Fallback timeout
      const timeout = setTimeout(() => {
        audio.removeEventListener('canplay', playIt)
        playIt()
      }, 1500)
      return () => {
        audio.removeEventListener('canplay', playIt)
        clearTimeout(timeout)
      }
    }
  }, [selectedIndex])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio || !currentSong) return

    setError('')

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      setLoading(true)
      // If no src loaded yet, set it
      if (!audio.src || audio.src === '') {
        audio.src = mp3Url
        audio.load()
      }
      audio.play().then(() => {
        setIsPlaying(true)
        setLoading(false)
      }).catch((e) => {
        console.warn('Play toggle failed:', e)
        setIsPlaying(false)
        setLoading(false)
        setError('无法播放，请检查网络或重试')
      })
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

  const selectSong = (idx) => {
    if (idx === selectedIndex) {
      // Same song: toggle play/pause
      togglePlay()
    } else {
      // Different song: switch, will auto-play if currently playing
      setSelectedIndex(idx)
    }
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

  if (!category) {
    return (
      <div className="text-center py-20 anim-fade-in">
        <div className="mb-3"><Music size={40} className="inline-block text-[#ccc]" /></div>
        <p className="text-[#999]">该分类不存在</p>
        <Link href="/music" className="text-[#b45309] hover:underline mt-2 inline-block">返回音乐频道</Link>
      </div>
    )
  }

  const catName = category.name.replace(/^.\s+/, '')

  return (
    <div className="anim-fade-in pb-20">
      <audio ref={audioRef} preload="none" crossOrigin="anonymous" />

      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '音乐频道', href: '/music' },
        { label: catName },
      ]} className="mb-3" />

      {/* Category header with unified play button */}
      <div className="flex items-center gap-3 mb-4">
        <Link href="/music" className="text-[#b45309]/60 hover:text-[#b45309] transition-colors shrink-0">
          <ArrowLeft size={16} />
        </Link>
        <span className="text-xl">{emoji}</span>
        <div className="min-w-0 flex-1">
          <h1 className="text-sm font-bold text-[#1a1a1a]">{catName}</h1>
          <p className="text-[10px] text-[#aaa]">{category.description}</p>
        </div>
        {/* Unified play/pause button */}
        {currentSong && (
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
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-3 px-3.5 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
          {error}
        </div>
      )}

      {/* Progress bar (only when a song is active) */}
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
          {/* Now playing label */}
          <p className="text-[9px] text-[#b45309] mt-1 text-center">
            {currentSong.title} — {currentSong.artist}
          </p>
        </div>
      )}

      {/* Song list */}
      <div className="space-y-1">
        {songs.map((song, i) => {
          const isSelected = i === selectedIndex
          return (
            <div key={song.id}
              onClick={() => selectSong(i)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg border transition-all duration-150 cursor-pointer group ${
                isSelected
                  ? 'bg-[#b45309]/8 border-[#b45309]/40'
                  : 'bg-white border-[#ece8e0] hover:border-[#b45309]/30 hover:bg-[#fcfaf7]'
              }`}>
              <span className={`text-[10px] w-4 text-right shrink-0 font-mono ${
                isSelected ? 'text-[#b45309] font-bold' : 'text-[#b0a898]'
              }`}>{i + 1}</span>

              {/* Song info */}
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium truncate ${
                  isSelected ? 'text-[#b45309]' : 'text-[#1a1a1a]'
                }`}>{song.title}</p>
                <p className="text-[10px] text-[#999]">{song.artist}</p>
              </div>

              {/* Playing indicator */}
              {isSelected && isPlaying && (
                <span className="flex items-center gap-0.5 shrink-0 mr-1">
                  <span className="w-0.5 h-2.5 bg-[#b45309] rounded-full animate-pulse" style={{animationDelay:'0ms'}} />
                  <span className="w-0.5 h-1.5 bg-[#b45309]/70 rounded-full animate-pulse" style={{animationDelay:'200ms'}} />
                  <span className="w-0.5 h-2.5 bg-[#b45309] rounded-full animate-pulse" style={{animationDelay:'400ms'}} />
                </span>
              )}

              {/* Detail link */}
              <Link href={`/music/song/${category.id}/${song.id}`}
                onClick={e => e.stopPropagation()}
                className="text-[9px] text-[#b0a898] hover:text-[#b45309] transition-colors shrink-0 opacity-0 group-hover:opacity-100">
                详情
              </Link>
            </div>
          )
        })}
      </div>

      {/* Mini Player Bar (fixed bottom) */}
      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#ece8e0] shadow-lg animate-slide-up">
          <div className="max-w-3xl mx-auto px-4 py-2">
            {/* Progress mini bar */}
            <div className="h-1 bg-[#f0ede8] rounded-full cursor-pointer mb-2" onClick={handleSeek}>
              <div className="h-full bg-[#b45309] rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>

            <div className="flex items-center gap-3">
              {/* Now playing */}
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-7 h-7 rounded-full bg-[#b45309]/10 flex items-center justify-center shrink-0">
                  <Music size={12} className={`${isPlaying ? 'text-[#b45309]' : 'text-[#b45309]/40'}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-[#1a1a1a] truncate">{currentSong.title}</p>
                  <p className="text-[9px] text-[#888]">{currentSong.artist}</p>
                </div>
              </div>

              {/* Controls */}
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

              {/* Time */}
              <span className="text-[8px] text-[#b0a898] shrink-0 w-12 text-right">{formatTime(currentTime)} / {formatTime(duration)}</span>

              {/* Detail link */}
              <Link href={`/music/song/${category.id}/${currentSong.id}`}
                onClick={e => e.stopPropagation()}
                className="text-[8px] text-[#b45309] hover:underline shrink-0">
                详情 <ListMusic size={10} className="inline-block" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
