'use client'

import { useParams } from 'next/navigation'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play, Pause, SkipBack, Forward, Music, Volume2, List, Lock } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'
import musicData from '@/data/music'
import { useAuth } from '@/components/AuthProvider'

// Sleep music descriptions
const sleepLyrics = {
  's01': '🌙 夜深了，星星挂上枝头。\n让这首温柔的钢琴曲，\n带你回到最安心的角落。\n闭上眼，深呼吸——\n世界很大，此刻只需属于自己。',
  's02': '🌊 月光洒在河面上，波光粼粼。\n想象你坐在溪边，\n水流轻抚过脚踝，\n带走一天的疲惫。\n一切都会好的，慢慢来。',
  's03': '🌧️ 林间下起了小雨，\n雨滴打在树叶上，滴滴答答。\n空气里有泥土和青草的味道，\n世界变得安静而温柔。\n让这场雨，洗去你心中的嘈杂。',
  's04': '🌊 潜入深海，万物俱静。\n只有水流的低语，\n和遥远的海浪声。\n像回到了最初的摇篮，\n安全，温暖，无所畏惧。',
  's05': '☁️ 漂浮在云朵之上，\n软绵绵的，轻飘飘的。\n阳光透过云层洒在脸上，\n暖洋洋的，刚刚好。\n做一个甜甜的梦吧。',
  's06': '🍂 秋风起，落叶舞。\n踩在金色的地毯上，\n发出沙沙的声音。\n天空很高，云很淡，\n日子很慢，一切都恰到好处。',
  's07': '🔥 壁炉里的柴火噼啪作响，\n暖橘色的光映在墙上。\n一杯热茶，一条毛毯，\n窗外风雪交加，\n屋内安然如春。',
  's08': '🏔️ 山间溪流，清冽见底。\n水声潺潺，穿过石头，\n绕过青苔，不急不缓。\n像时间本身，从容流淌。\n放下所有的计划，只是存在。',
  's09': '⭐ 繁星满天，银河横贯。\n每一颗星星都是一个愿望，\n每一束星光都是一句晚安。\n数着星星，渐渐入眠。\n晚安，好梦。',
  's10': '🌿 雨后的清晨，一切如新。\n露珠在叶尖闪烁，\n鸟儿开始第一声啼鸣。\n空气清新得像刚从水里捞出来，\n新的一天，新的希望。',
  's11': '❄️ 大雪无声，棉絮般飘落。\n世界被白色覆盖，\n所有的喧嚣都被掩埋。\n万籁俱寂，只有雪花落地的声音。\n在白色的寂静中，安然入睡。',
  's12': '🎋 竹林深处，风过叶动。\n沙沙——沙沙——\n像大自然的呼吸，\n一下，又一下。\n跟着这个节奏，慢慢放松。',
  's13': '🌅 湖边日出，水天一色。\n晨雾如纱，笼罩着远山。\n湖面平静如镜，\n偶尔有鱼跃出水面，\n泛起一圈涟漪，又归于平静。',
  's14': '🦗 夏日夜晚，蝉鸣蛙叫。\n这是夏天最熟悉的声音，\n像一首永远不会结束的歌。\n躺在凉席上，摇着蒲扇，\n整个童年都在这个声音里。',
  's15': '🍵 茶室里飘着淡淡的香。\n木质的地板，纸糊的窗。\n热水注入杯中，茶叶舒展。\n一口茶，一个呼吸，\n一切都慢了下来。',
  's16': '🏔️ 山谷里传来回音，\n一声又一声，渐渐远去。\n空旷，辽远，自由。\n在这里，所有的心事\n都可以大声说出来，然后随风散去。',
  's17': '🌊 星辰与大海之间，\n有无尽的宁静。\n海浪轻拍沙滩，\n星光洒满海面。\n在这天地之间，\n你是自由的。',
  's18': '🌧️ 雨打芭蕉，声声入耳。\n不急不缓，不紧不慢。\n像一首古老的催眠曲，\n千百年来，\n就这样伴着人们入睡。',
  's19': '🌆 夜幕缓缓降临，\n万家灯火次第亮起。\n城市的喧嚣渐渐远去，\n只剩归家的脚步。\n一天的奔波，到此为止。\n晚安。',
  's20': '🤍 白噪音——最纯粹的声音。\n像母体内的律动，\n像远古的风声。\n不需要任何旋律，\n只需要这样，静静地，\n和自己待在一起。',
}

// Simple sample lyrics for a few classic songs (逐句带时间戳)
const songLyrics = {
  'c01': [
    [0, '今天我 寒夜里看雪飘过'],
    [8, '怀着冷却了的心窝漂远方'],
    [16, '风雨里追赶 雾里分不清影踪'],
    [24, '天空海阔你与我 可会变'],
    [33, '多少次 迎着冷眼与嘲笑'],
    [41, '从没有放弃过心中的理想'],
    [49, '一刹那恍惚 若有所失的感觉'],
    [57, '不知不觉已变淡 心里爱'],
    [66, '原谅我这一生不羁放纵爱自由'],
    [74, '也会怕有一天会跌倒'],
    [81, '背弃了理想 谁人都可以'],
    [88, '哪会怕有一天只你共我'],
    [96, '仍然自由自我 永远高唱我歌'],
    [103, '走遍千里'],
    [108, '原谅我这一生不羁放纵爱自由'],
    [116, '也会怕有一天会跌倒'],
    [123, '背弃了理想 谁人都可以'],
    [130, '哪会怕有一天只你共我'],
  ],
  'z01': [
    [0, '素胚勾勒出青花笔锋浓转淡'],
    [8, '瓶身描绘的牡丹一如你初妆'],
    [16, '冉冉檀香透过窗心事我了然'],
    [24, '宣纸上走笔至此搁一半'],
    [32, '釉色渲染仕女图韵味被私藏'],
    [39, '而你嫣然的一笑如含苞待放'],
    [47, '你的美一缕飘散 去到我去不了的地方'],
    [57, '天青色等烟雨 而我在等你'],
    [65, '炊烟袅袅升起 隔江千万里'],
    [72, '在瓶底书汉隶仿前朝的飘逸'],
    [79, '就当我为遇见你伏笔'],
    [86, '天青色等烟雨 而我在等你'],
    [93, '月色被打捞起 晕开了结局'],
    [100, '如传世的青花瓷自顾自美丽'],
    [107, '你眼带笑意'],
  ],
  'e08': [
    [0, 'I heard that you\'re settled down'],
    [7, 'That you found a girl and you\'re married now'],
    [14, 'I heard that your dreams came true'],
    [21, 'Guess she gave you things I didn\'t give to you'],
    [28, 'Old friend, why are you so shy?'],
    [35, 'It ain\'t like you to hold back or hide from the light'],
    [43, 'Never mind, I\'ll find someone like you'],
    [50, 'I wish nothing but the best for you too'],
    [57, 'Don\'t forget me, I beg'],
    [63, 'I\'ll remember you said'],
    [68, 'Sometimes it lasts in love'],
    [74, 'But sometimes it hurts instead'],
    [80, 'Sometimes it lasts in love'],
    [86, 'But sometimes it hurts instead'],
  ],
  'c02': [
    [0, '钟声响起归家的讯号'],
    [6, '在他生命里 仿佛带点唏嘘'],
    [14, '黑色肌肤给他的意义'],
    [22, '是一生奉献 肤色斗争中'],
    [30, '年月把拥有变做失去'],
    [38, '疲倦的双眼带着期望'],
    [46, '今天只有残留的躯壳'],
    [54, '迎接光辉岁月'],
    [62, '风雨中抱紧自由'],
    [70, '一生经过彷徨的挣扎'],
    [78, '自信可改变未来'],
    [86, '问谁又能做到'],
  ],
  'c03': [
    [0, '前奏'],
    [12, '前尘往事成云烟 消散在彼此眼前'],
    [20, '就连说过了再见 也看不见你有些哀怨'],
    [28, '给我的一切 你不过是在敷衍'],
    [36, '你笑得越无邪 我就会爱你爱得更狂野'],
    [46, '总在刹那间 有一些了解'],
    [54, '说过的话不可能曾实现'],
    [62, '就在一转眼 发现你的脸'],
    [70, '已经陌生不会再像从前'],
    [78, '我的世界开始下雪'],
    [86, '冷得让我无法多爱一天'],
    [94, '冷得连隐藏的遗憾 都那么的明显'],
    [104, '我和你吻别 在无人的街'],
    [112, '让风痴笑我不能拒绝'],
    [120, '我和你吻别 在狂乱的夜'],
    [128, '我的心 等着迎接伤悲'],
  ],
  'c04': [
    [0, '你问我爱你有多深'],
    [8, '我爱你有几分'],
    [16, '我的情也真 我的爱也真'],
    [24, '月亮代表我的心'],
    [32, '你问我爱你有多深'],
    [40, '我爱你有几分'],
    [48, '我的情不移 我的爱不变'],
    [56, '月亮代表我的心'],
    [64, '轻轻的一个吻'],
    [72, '已经打动我的心'],
    [80, '深深的一段情'],
    [88, '教我思念到如今'],
  ],
  'z02': [
    [0, '窗外的麻雀 在电线杆上多嘴'],
    [7, '你说这一句 很有夏天的感觉'],
    [14, '手中的铅笔 在纸上来来回回'],
    [21, '我用几行字形容你是我的谁'],
    [28, '秋刀鱼的滋味 猫跟你都想了解'],
    [35, '初恋的香味 就这样被我们寻回'],
    [42, '那温暖的阳光 像刚摘的鲜艳草莓'],
    [49, '你说你舍不得吃掉这一种感觉'],
    [57, '雨下整夜 我的爱溢出就像雨水'],
    [64, '院子落叶 跟我的思念厚厚一叠'],
    [71, '几句是非 也无法将我的热情冷却'],
    [78, '你出现在我诗的每一页'],
    [85, '雨下整夜 我的爱溢出就像雨水'],
    [92, '窗台蝴蝶 像诗里纷飞的美丽章节'],
    [99, '我接着写 把永远爱你写进诗的结尾'],
    [106, '你是我唯一想要的了解'],
  ],
  'z03': [
    [0, '如果那两个字没有颤抖'],
    [7, '我不会发现 我难受'],
    [14, '怎么说出口 也不过是分手'],
    [22, '如果对于明天没有要求'],
    [29, '牵牵手就像旅游'],
    [36, '成千上万个门口 总有一个人要先走'],
    [44, '怀抱既然不能逗留'],
    [51, '何不在离开的时候'],
    [58, '一边享受 一边泪流'],
    [65, '十年之前 我不认识你 你不属于我'],
    [72, '我们还是一样 陪在一个陌生人左右'],
    [80, '走过渐渐熟悉的街头'],
    [87, '十年之后 我们是朋友 还可以问候'],
    [94, '只是那种温柔 再也找不到拥抱的理由'],
    [102, '情人最后难免沦为朋友'],
  ],
}

export default function SongPlayerPage() {
  const params = useParams()
  const { user, loading: authLoading } = useAuth()
  const ids = params?.id || []
  const catId = ids[0] || ''
  const songId = ids[1] || ''

  let category, song, songIndex
  for (const cat of musicData) {
    const idx = cat.songs.findIndex(s => s.id === songId)
    if (idx >= 0) {
      category = cat
      song = cat.songs[idx]
      songIndex = idx
      break
    }
  }

  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [showLyrics, setShowLyrics] = useState(true)
  const isSleep = category?.id === 'sleep-music'

  // Get lyrics for current song
  const lyrics = isSleep ? null : (songLyrics[songId] || null)
  // Get all songs in category for prev/next
  const categorySongs = category?.songs || []
  const prevSong = songIndex > 0 ? categorySongs[songIndex - 1] : null
  const nextSong = songIndex < categorySongs.length - 1 ? categorySongs[songIndex + 1] : null

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onDuration = () => setDuration(audio.duration)
    const onEnded = () => setPlaying(false)
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onDuration)
    audio.addEventListener('ended', onEnded)
    audio.volume = volume
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onDuration)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  // Display all lyric text without time sync (timestamps vary by audio version)

  const mp3Url = `https://rsndnhdimruisysacujg.supabase.co/storage/v1/object/public/music/${category?.id}/${songId}.mp3`

  const togglePlay = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => setPlaying(false))
    }
    setPlaying(!playing)
  }

  const skipBack = () => {
    if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 15)
  }

  const skipForward = () => {
    if (audioRef.current) audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 15)
  }

  const formatTime = (s) => {
    if (!s || isNaN(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    if (audioRef.current && duration) {
      audioRef.current.currentTime = x * duration
    }
  }

  if (!category || !song) {
    return (
      <div className="text-center py-20 anim-fade-in">
        <div className="mb-3"><Music size={40} className="inline-block text-[#ccc]" /></div>
        <p className="text-[#999]">歌曲不存在</p>
        <Link href="/music" className="text-[#b45309] hover:underline mt-2 inline-block">返回音乐频道</Link>
      </div>
    )
  }

  const catName = category.name.replace(/^.\s+/, '')

  return (
    <div className="anim-fade-in max-w-2xl mx-auto">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '音乐频道', href: '/music' },
        { label: catName, href: `/music/${category.id}` },
        { label: song.title },
      ]} className="mb-4" />

      {!authLoading && !user ? (
        <div className="bg-white border border-[#ece8e0] rounded-xl py-12 text-center">
          <Lock size={32} className="mx-auto text-[#ccc] mb-3" />
          <p className="text-sm text-[#888] mb-3">登录后即可播放音乐</p>
          <Link href="/login"
            className="inline-flex items-center gap-1.5 text-xs text-white bg-[#b45309] hover:bg-[#92400e] rounded-lg px-4 py-2 transition-colors">
            <Lock size={12} /> 立即登录
          </Link>
        </div>
      ) : (
        <>
      {/* Player Card */}
      <div className="bg-white border border-[#ece8e0] rounded-xl overflow-hidden">
        {/* Top bar: album art + info */}
        <div className="flex items-center gap-4 px-5 py-4 bg-gradient-to-r from-[#b45309]/8 to-[#d97706]/3">
          <div className={`w-14 h-14 rounded-full bg-[#b45309]/10 flex items-center justify-center shrink-0 ${playing ? 'animate-spin' : ''}`}
               style={{ animationDuration: '8s', animationTimingFunction: 'linear' }}>
            <Music size={24} className={`${playing ? 'text-[#b45309]' : 'text-[#b45309]/40'} transition-colors`} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold text-[#1a1a1a] truncate">{song.title}</h2>
            <p className="text-xs text-[#888]">{song.artist}</p>
          </div>
          <button onClick={() => setShowLyrics(!showLyrics)}
            className={`text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
              showLyrics ? 'bg-[#b45309] text-white' : 'bg-[#f0ede8] text-[#888] hover:text-[#666]'
            }`}>
            <List size={14} />
          </button>
        </div>

        <audio ref={audioRef} src={mp3Url} preload="metadata" />

        {/* Progress Bar */}
        <div className="px-5 pt-3">
          <div className="h-2 bg-[#f0ede8] rounded-full cursor-pointer relative group" onClick={handleSeek}>
            <div className="h-full bg-[#b45309] rounded-full transition-all duration-150" style={{ width: `${progress}%` }} />
            <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#b45309] shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                 style={{ left: `calc(${progress}% - 7px)` }} />
          </div>
          <div className="flex justify-between text-[10px] text-[#b0a898] mt-1.5 px-0.5">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-5 px-5 py-3">
          {/* Prev song */}
          {prevSong ? (
            <Link href={`/music/song/${category.id}/${prevSong.id}`}
              className="text-[#b0a898] hover:text-[#666] transition-colors p-1" title="上一首">
              <SkipBack size={18} />
            </Link>
          ) : (
            <span className="text-[#e0ddd8] p-1"><SkipBack size={18} /></span>
          )}

          {/* Rewind 15s */}
          <button onClick={skipBack}
            className="text-[#b0a898] hover:text-[#666] transition-colors p-1 relative" title="后退15秒">
            <SkipBack size={16} />
            <span className="absolute -top-0.5 -right-1 text-[7px] font-bold">15</span>
          </button>

          {/* Play/Pause */}
          <button onClick={togglePlay}
            className="w-11 h-11 rounded-full bg-[#b45309] text-white hover:bg-[#92400e] transition-colors flex items-center justify-center shadow-md active:scale-95">
            {playing ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
          </button>

          {/* Forward 15s */}
          <button onClick={skipForward}
            className="text-[#b0a898] hover:text-[#666] transition-colors p-1 relative" title="快进15秒">
            <Forward size={16} />
            <span className="absolute -top-0.5 -right-1 text-[7px] font-bold">15</span>
          </button>

          {/* Next song */}
          {nextSong ? (
            <Link href={`/music/song/${category.id}/${nextSong.id}`}
              className="text-[#b0a898] hover:text-[#666] transition-colors p-1" title="下一首">
              <Forward size={18} />
            </Link>
          ) : (
            <span className="text-[#e0ddd8] p-1"><Forward size={18} /></span>
          )}
        </div>

        {/* Volume */}
        <div className="px-5 pb-3 flex items-center gap-2 justify-center">
          <Volume2 size={12} className="text-[#b0a898]" />
          <input type="range" min="0" max="1" step="0.05" value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            className="w-28 h-1 accent-[#b45309]" />
        </div>
      </div>

      {/* Lyrics / Description */}
      <div className="mt-4 bg-white border border-[#ece8e0] rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[#f0ede8] flex items-center justify-between">
          <h3 className="text-xs font-semibold text-[#b0a898] uppercase tracking-wider">
            {isSleep ? '🌙 助眠寄语' : '🎵 歌词'}
          </h3>
          {lyrics && (
            <span className="text-[9px] text-[#ccc]">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          )}
        </div>

        <div className="px-5 py-4" style={{ minHeight: '200px', maxHeight: '400px', overflowY: 'auto' }}>
          {isSleep ? (
            <pre className="text-sm text-[#666] leading-relaxed whitespace-pre-wrap font-sans">
              {sleepLyrics[songId] || '闭上眼，深呼吸。\n让音乐带你进入梦乡。\n晚安。'}
            </pre>
          ) : lyrics ? (
            <div className="space-y-2 py-2">
              {lyrics.map((line, i) => (
                <p key={i}
                  className="text-sm leading-relaxed text-[#666]">
                  {line[1]}
                </p>
              ))}
            </div>
          ) : (
            <div className="text-sm text-[#888] leading-relaxed text-center py-8">
              🎵 {song.title} - {song.artist}
              <br />
              <span className="text-[#ccc] text-xs mt-2 block">歌词陆续补充中</span>
            </div>
          )}
        </div>
      </div>

        </>
      )}

      {/* Nav: Back to list + Prev/Next song */}
      <div className="mt-4 flex items-center justify-between">
        <Link href={`/music/${category.id}`} className="text-xs text-[#b45309] hover:underline inline-flex items-center gap-1">
          <ArrowLeft size={12} /> 返回{catName}
        </Link>
        <div className="flex items-center gap-3">
          {prevSong && (
            <Link href={`/music/song/${category.id}/${prevSong.id}`}
              className="text-xs text-[#b0a898] hover:text-[#666]">
              ← {prevSong.title}
            </Link>
          )}
          {nextSong && (
            <Link href={`/music/song/${category.id}/${nextSong.id}`}
              className="text-xs text-[#b0a898] hover:text-[#666]">
              {nextSong.title} →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
