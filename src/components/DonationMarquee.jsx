'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Sparkles } from 'lucide-react'

const FAKE_DONATIONS = [
  { username: '老王', amount: 99, plan: 'diamond', time: '2分钟前' },
  { username: '小李', amount: 9.9, plan: 'gold', time: '5分钟前' },
  { username: '陈哥', amount: 9.9, plan: 'gold', time: '12分钟前' },
  { username: '阿强', amount: 99, plan: 'diamond', time: '18分钟前' },
  { username: '张三', amount: 9.9, plan: 'gold', time: '25分钟前' },
  { username: '王总', amount: 99, plan: 'diamond', time: '30分钟前' },
  { username: '赵四', amount: 9.9, plan: 'gold', time: '45分钟前' },
  { username: '刘哥', amount: 9.9, plan: 'gold', time: '1小时前' },
  { username: 'Tony', amount: 99, plan: 'diamond', time: '1小时前' },
  { username: 'Michael', amount: 9.9, plan: 'gold', time: '2小时前' },
]

export default function DonationMarquee() {
  const [donations, setDonations] = useState(FAKE_DONATIONS)

  useEffect(() => {
    const fetchReal = async () => {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('donations')
          .select('username, amount, plan, created_at')
          .eq('status', 'completed')
          .order('created_at', { ascending: false })
          .limit(20)
        if (data && data.length > 0) {
          const real = data.map(d => ({
            username: d.username,
            amount: d.amount,
            plan: d.plan,
            time: new Date(d.created_at).toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit' })
          }))
          setDonations([...real, ...FAKE_DONATIONS].slice(0, 20))
        }
      } catch (e) {}
    }
    fetchReal()
  }, [])

  return (
    <div className="bg-gradient-to-r from-[#fefaf5] to-[#fdf8f4] border border-[#eee8dc] rounded-xl px-4 py-2.5 overflow-hidden">
      <div className="flex items-center gap-2 text-xs text-[#b45309] mb-1">
        <Sparkles size={12} />
        <span className="font-semibold">🎉 会员升级动态</span>
      </div>
      <div className="overflow-hidden relative h-6">
        <div className="animate-marquee whitespace-nowrap flex gap-8" style={{ animation: 'marquee 30s linear infinite' }}>
          {donations.concat(donations).map((d, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 text-xs text-[#666]">
              <span className="font-medium text-[#1a1a1a]">{d.username}</span>
              <span>打赏</span>
              <span className={d.plan === 'diamond' ? 'text-[#00BFFF] font-semibold' : 'text-[#FFD700] font-semibold'}>
                ¥{d.amount}
              </span>
              <span className="text-[#aaa]">{d.time}</span>
              {d.plan === 'diamond' ? '💎' : '🏆'}
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
