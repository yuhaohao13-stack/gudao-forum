'use client'

import { useParams } from 'next/navigation'
import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Music, Volume2, ListMusic } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'
import musicData from '@/data/music'

export default function MusicCategoryPage() {
  const { slug } = useParams()
  const category = musicData.find(c => c.id === slug)
  const audioRef = useRef(null)

  const [playingIndex, setPlayingIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const songs = category?.songs || []
  const currentSong = playingIndex >= 0 ? songs[playingIndex] : null

  const mp3Url = currentSong
    ? `https://rsndnhdimruisysacujg.supabase.co/storage/v1/object/public/music/${category.id}/${currentSong.id}.mp3`
    : ''

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setCurrentTime(audio.currentTime)
    const onMeta = () => setDuration(audio.duration)
    const onEnd = () => {
      // Auto-play next song
      if (playingIndex >= 0 && playingIndex < songs.length - 1) {
        setPlayingIndex(playingIndex + 1)
      } else if (playingIndex === songs.length - 1) {
        // Loop back to first
        setPlayingIndex(0)
      } else {
        setIsPlaying(false)
      }
    }
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('ended', onEnd)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('ended', onEnd)
    }
  }, [playingIndex, songs.length])

  // Auto-play when current song changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentSong) return
    audio.src = mp3Url
    audio.load()
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
  }, [playingIndex])

  const togglePlay = (idx) => {
    if (idx === playingIndex) {
      // Toggle current song
      if (isPlaying) {
        audioRef.current?.pause()
        setIsPlaying(false)
      } else {
        audioRef.current?.play().catch(() => {})
        setIsPlaying(true)
      }
    } else {
      // Switch to new song
      setPlayingIndex(idx)
    }
  }

  const playPrev = () => {
    if (playingIndex > 0) setPlayingIndex(playingIndex - 1)
  }
  const playNext = () => {
    if (playingIndex < songs.length - 1) setPlayingIndex(playingIndex + 1)
    else setPlayingIndex(0) // loop
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
    <div className="anim-fade-in pb-24">
      <audio ref={audioRef} preload="metadata" />

      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '音乐频道', href: '/music' },
        { label: catName },
      ]} className="mb-4" />

      <div className="flex items-center gap-3 mb-6">
        <Link href="/music" className="text-[#b45309]/60 hover:text-[#b45309] transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <span className="text-2xl">{category.name.split(' ')[0]}</span>
        <div>
          <h1 className="text-lg font-bold text-[#1a1a1a]">{catName}</h1>
          <p className="text-xs text-[#aaa]">{category.description}</p>
        </div>
      </div>

      {/* Song list */}
      <div className="space-y-1">
        {songs.map((song, i) => {
          const isThisPlaying = i === playingIndex
          return (
            <div key={song.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-150 group ${
                isThisPlaying
                  ? 'bg-[#b45309]/8 border-[#b45309]/40'
                  : 'bg-white border-[#ece8e0] hover:border-[#b45309]/30 hover:bg-[#fcfaf7]'
              }`}>
              <span className={`text-xs w-5 text-right shrink-0 font-mono ${
                isThisPlaying ? 'text-[#b45309] font-bold' : 'text-[#b0a898]'
              }`}>{i + 1}</span>

              {/* Play/Pause Button */}
              <button onClick={() => togglePlay(i)}
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  isThisPlaying
                    ? 'bg-[#b45309] text-white shadow-sm'
                    : 'bg-[#f5f0e8] text-[#888] group-hover:bg-[#b45309] group-hover:text-white'
                }`}>
                {isThisPlaying && isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
              </button>

              {/* Song Info - click goes to detail */}
              <Link href={`/music/song/${category.id}/${song.id}`} className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${
                  isThisPlaying ? 'text-[#b45309]' : 'text-[#1a1a1a]'
                }`}>{song.title}</p>
                <p className="text-[11px] text-[#999]">{song.artist}</p>
              </Link>

              {/* Playing indicator */}
              {isThisPlaying && (
                <span className="text-[9px] text-[#b45309] font-medium shrink-0">
                  {isPlaying ? (
                    <span className="flex items-center gap-1">
                      <span className="w-1 h-3 bg-[#b45309] rounded-full animate-pulse" style={{animationDelay:'0ms'}} />
                      <span className="w-1 h-2 bg-[#b45309]/70 rounded-full animate-pulse" style={{animationDelay:'200ms'}} />
                      <span className="w-1 h-3 bg-[#b45309] rounded-full animate-pulse" style={{animationDelay:'400ms'}} />
                    </span>
                  ) : '暂停'}
                </span>
              )}

              <span className="text-[10px] text-[#b0a898]">MP3</span>
            </div>
          )
        })}
      </div>

      {/* Mini Player Bar (fixed bottom) */}
      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#ece8e0] shadow-lg animate-slide-up">
          <div className="max-w-5xl mx-auto px-4 py-2">
            {/* Progress mini bar */}
            <div className="h-1 bg-[#f0ede8] rounded-full cursor-pointer mb-2" onClick={handleSeek}>
              <div className="h-full bg-[#b45309] rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>

            <div className="flex items-center gap-3">
              {/* Now playing */}
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-full bg-[#b45309]/10 flex items-center justify-center shrink-0">
                  <Music size={14} className={`${isPlaying ? 'text-[#b45309]' : 'text-[#b45309]/40'}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#1a1a1a] truncate">{currentSong.title}</p>
                  <p className="text-[9px] text-[#888]">{currentSong.artist}</p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={playPrev} className="text-[#b0a898] hover:text-[#666] transition-colors p-1">
                  <SkipBack size={16} />
                </button>
                <button onClick={() => togglePlay(playingIndex)}
                  className="w-9 h-9 rounded-full bg-[#b45309] text-white hover:bg-[#92400e] transition-colors flex items-center justify-center shadow-sm">
                  {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                </button>
                <button onClick={playNext} className="text-[#b0a898] hover:text-[#666] transition-colors p-1">
                  <SkipForward size={16} />
                </button>
              </div>

              {/* Time */}
              <span className="text-[9px] text-[#b0a898] shrink-0 w-14 text-right">{formatTime(currentTime)} / {formatTime(duration)}</span>

              {/* Link to detail */}
              <Link href={`/music/song/${category.id}/${currentSong.id}`}
                className="text-[9px] text-[#b45309] hover:underline shrink-0">
                详情 <ListMusic size={12} className="inline-block" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
