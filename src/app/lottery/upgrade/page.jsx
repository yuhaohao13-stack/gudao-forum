'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { Crown, Shield, Sparkles, Heart, Check, X as XIcon } from 'lucide-react'

const FEATURES = [
  {
    name: '🎰 彩票模拟器摇奖',
    free: <XIcon size={14} className="text-red-400" />,
    gold: '500次',
    diamond: '♾️ 无限次',
  },
  {
    name: '🔒 技术帖查看',
    free: '仅看标题',
    gold: '10次',
    diamond: '♾️ 无限次',
  },
  {
    name: '🎵 音乐下载',
    free: <XIcon size={14} className="text-red-400" />,
    gold: '10首',
    diamond: '♾️ 无限次',
  },
  {
    name: '🎨 高清壁纸下载',
    free: '预览',
    gold: '✅ 可下载',
    diamond: '✅ 可下载',
  },
  {
    name: '📌 帖子置顶',
    free: <XIcon size={14} className="text-red-400" />,
    gold: '10次',
    diamond: '♾️ 无限次',
  },
  {
    name: '💎 聊天室会员标识',
    free: <XIcon size={14} className="text-red-400" />,
    gold: '🏆 黄金标识',
    diamond: '💎 钻石标识',
  },
  {
    name: '🎨 选号/机选功能',
    free: <XIcon size={14} className="text-red-400" />,
    gold: '✅',
    diamond: '✅',
  },
  {
    name: '📜 查看历史记录',
    free: <XIcon size={14} className="text-red-400" />,
    gold: '✅',
    diamond: '✅',
  },
]

export default function MemberRulesPage() {
  const { user, profile } = useAuth()
  const currentLevel = profile?.membership_level || 'regular'

  const openDonate = () => {
    window.dispatchEvent(new CustomEvent('open-donate'))
  }

  return (
    <div className="anim-fade-in max-w-3xl mx-auto pb-12">
      {/* 页面标题 */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#1c1917] mb-2">📜 古道论坛会员规则等级介绍</h1>
        <p className="text-sm text-[#888]">了解各等级权益，升级解锁更多功能</p>
      </div>

      {/* 当前等级 */}
      <div className="bg-[#fefaf5] border border-[#eee8dc] rounded-xl p-4 mb-6">
        <div className="text-sm text-[#888] mb-1">当前等级</div>
        <div className="flex items-center gap-3">
          {currentLevel === 'diamond' && <><Shield size={20} className="text-[#00BFFF]" /><span className="font-semibold text-[#1c1917]">钻石会员 💎</span><span className="text-xs text-[#00BFFF]">全功能无限使用</span></>}
          {currentLevel === 'gold' && <><Crown size={20} className="text-[#FFD700]" /><span className="font-semibold text-[#1c1917]">黄金会员 🏆</span><span className="text-xs text-[#888]">各功能有剩余次数</span></>}
          {currentLevel === 'regular' && <><span className="text-[#999]">普通会员</span><span className="text-xs text-[#b45309]">升级解锁更多功能</span></>}
        </div>
      </div>

      {/* 等级权益对比表 */}
      <div className="bg-white border border-[#ece8e0] rounded-xl overflow-hidden mb-6">
        {/* 表头 */}
        <div className="grid grid-cols-4 gap-px bg-[#f5f0e8]">
          <div className="bg-white p-3 font-bold text-sm text-[#1c1917]">功能</div>
          <div className="bg-white p-3 font-bold text-sm text-center text-[#888]">普通会员</div>
          <div className="bg-white p-3 font-bold text-sm text-center text-amber-700 bg-amber-50">🥇 黄金 ¥9.9</div>
          <div className="bg-white p-3 font-bold text-sm text-center text-purple-700 bg-purple-50">💎 钻石 ¥99</div>
        </div>

        {/* 功能行 */}
        {FEATURES.map((f, i) => (
          <div key={i} className="grid grid-cols-4 gap-px bg-[#f5f0e8]">
            <div className="bg-white p-3 text-sm text-[#1c1917]">{f.name}</div>
            <div className="bg-white p-3 text-sm text-center text-[#bbb] flex items-center justify-center">{f.free}</div>
            <div className="bg-white p-3 text-sm text-center text-amber-700 flex items-center justify-center">{f.gold}</div>
            <div className="bg-white p-3 text-sm text-center text-purple-700 flex items-center justify-center">{f.diamond}</div>
          </div>
        ))}
      </div>

      {/* 黄金会员 */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Crown size={24} className="text-[#FFD700]" />
          <div>
            <span className="font-bold text-lg text-[#1c1917]">黄金会员</span>
            <span className="text-[#b45309] font-bold text-lg ml-2">¥9.9</span>
          </div>
        </div>
        <ul className="space-y-1.5">
          <li className="flex items-start gap-1.5 text-xs text-[#666]"><Check size={12} className="text-green-500 mt-0.5 shrink-0" />彩票模拟器摇奖 500次</li>
          <li className="flex items-start gap-1.5 text-xs text-[#666]"><Check size={12} className="text-green-500 mt-0.5 shrink-0" />技术板块帖子查看 10次（总次数，非每日）</li>
          <li className="flex items-start gap-1.5 text-xs text-[#666]"><Check size={12} className="text-green-500 mt-0.5 shrink-0" />音乐下载 10首</li>
          <li className="flex items-start gap-1.5 text-xs text-[#666]"><Check size={12} className="text-green-500 mt-0.5 shrink-0" />高清壁纸下载（10个分类50套）</li>
          <li className="flex items-start gap-1.5 text-xs text-[#666]"><Check size={12} className="text-green-500 mt-0.5 shrink-0" />帖子置顶 10次</li>
          <li className="flex items-start gap-1.5 text-xs text-[#666]"><Check size={12} className="text-green-500 mt-0.5 shrink-0" />聊天室黄金 🏆 标识</li>
          <li className="flex items-start gap-1.5 text-xs text-[#666]"><Check size={12} className="text-green-500 mt-0.5 shrink-0" />选号/机选 + 历史记录</li>
        </ul>
      </div>

      {/* 钻石会员 */}
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Shield size={24} className="text-[#00BFFF]" />
          <div>
            <span className="font-bold text-lg text-[#1c1917]">钻石会员</span>
            <span className="text-purple-600 font-bold text-lg ml-2">¥99</span>
          </div>
        </div>
        <ul className="space-y-1.5">
          <li className="flex items-start gap-1.5 text-xs text-[#666]"><Check size={12} className="text-green-500 mt-0.5 shrink-0" />彩票模拟器摇奖 无限次 ♾️</li>
          <li className="flex items-start gap-1.5 text-xs text-[#666]"><Check size={12} className="text-green-500 mt-0.5 shrink-0" />技术板块帖子查看 无限制</li>
          <li className="flex items-start gap-1.5 text-xs text-[#666]"><Check size={12} className="text-green-500 mt-0.5 shrink-0" />音乐下载 无限制</li>
          <li className="flex items-start gap-1.5 text-xs text-[#666]"><Check size={12} className="text-green-500 mt-0.5 shrink-0" />高清壁纸下载（10个分类50套）无限制</li>
          <li className="flex items-start gap-1.5 text-xs text-[#666]"><Check size={12} className="text-green-500 mt-0.5 shrink-0" />帖子置顶 无限制</li>
          <li className="flex items-start gap-1.5 text-xs text-[#666]"><Check size={12} className="text-green-500 mt-0.5 shrink-0" />聊天室钻石 💎 标识</li>
          <li className="flex items-start gap-1.5 text-xs text-[#666]"><Check size={12} className="text-green-500 mt-0.5 shrink-0" />选号/机选 + 历史记录</li>
          <li className="flex items-start gap-1.5 text-xs text-[#666]"><Check size={12} className="text-green-500 mt-0.5 shrink-0" />次数用完可联系管理员续费</li>
        </ul>
      </div>

      {/* 如何升级 */}
      <div className="bg-gradient-to-r from-[#fefaf5] to-[#fdf8f4] border border-[#eee8dc] rounded-xl p-6 mb-6 text-center">
        <div className="text-lg mb-2">💝</div>
        <h2 className="font-bold text-[#1c1917] text-base mb-1">🎯 如何升级？</h2>
        <p className="text-xs text-[#888] mb-4">点击下方打赏按钮，支付后联系管理员即可升级</p>
        <button
          onClick={openDonate}
          className="inline-flex items-center gap-2 bg-[#b45309] hover:bg-[#92400e] text-white font-bold px-6 py-3 rounded-xl transition-colors"
        >
          <Heart size={18} />
          打赏支持
        </button>
        <div className="mt-3 p-3 bg-[#FFD700] bg-opacity-10 border border-[#FFD700] border-opacity-20 rounded-lg">
          <p className="text-xs text-[#666] flex items-center gap-1 justify-center">
            <Sparkles size={14} className="text-[#FFD700]" />
            打赏后联系管理员（微信: crazy-repair / QQ邮箱: 994730969@qq.com）立即升级
          </p>
        </div>
      </div>

      {/* 常见问题 */}
      <div className="bg-white border border-[#e0d8cc] rounded-xl p-5">
        <h2 className="font-bold text-[#1c1917] text-base mb-4">❓ 常见问题</h2>
        <div className="space-y-4 text-sm text-[#444]">
          <div className="bg-[#fefaf5] p-3.5 rounded-lg border border-[#f0e8dc]">
            <div className="font-bold text-[#1c1917] mb-1">如何升级黄金/钻石会员？</div>
            <div className="text-[#555] leading-relaxed">点击上方「打赏支持」按钮，打赏对应金额后联系管理员（微信: crazy-repair / QQ邮箱: 994730969@qq.com），核实后立即升级。</div>
          </div>
          <div className="bg-[#fefaf5] p-3.5 rounded-lg border border-[#f0e8dc]">
            <div className="font-bold text-[#1c1917] mb-1">升级后立即生效吗？</div>
            <div className="text-[#555] leading-relaxed">管理员确认打赏后立即手动升级，升级后所有功能即时可用。</div>
          </div>
          <div className="bg-[#fefaf5] p-3.5 rounded-lg border border-[#f0e8dc]">
            <div className="font-bold text-[#1c1917] mb-1">黄金会员次数用完了怎么办？</div>
            <div className="text-[#555] leading-relaxed">联系管理员续费即可补充次数，或升级钻石会员享无限次使用。</div>
          </div>
          <div className="bg-[#fefaf5] p-3.5 rounded-lg border border-[#f0e8dc]">
            <div className="font-bold text-[#1c1917] mb-1">所有次数是每天重置吗？</div>
            <div className="text-[#555] leading-relaxed">不，所有次数是总次数，用完即止。可续费补充或升级钻石会员享无限次。</div>
          </div>
        </div>
      </div>

      {/* 面包屑导航 */}
      <div className="flex items-center gap-2 text-xs text-[#999] mt-6 justify-center">
        <Link href="/lottery" className="hover:text-[#b45309]">← 返回彩票模拟器</Link>
        <span className="text-[#ddd6c8] mx-1">·</span>
        <Link href="/" className="hover:text-[#b45309]">返回首页</Link>
      </div>
    </div>
  )
}
