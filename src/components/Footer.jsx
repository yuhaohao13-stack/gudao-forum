'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()
  return (
    <footer className="mt-auto py-10 bg-white border-t border-[#f0f0f0]">
      <div className="max-w-4xl mx-auto px-4">
        <div className="pb-6 border-b border-[#f5f5f0]" style={{display:'flex',flexDirection:'row',gap:'2rem',alignItems:'flex-start',flexWrap:'wrap'}}>

          {/* 第一列：关于古道论坛  - 品牌+介绍+导航+版权 */}
          <div style={{flex:1,minWidth:200}}>
            <div style={{fontSize:'13px',fontWeight:700,color:'#555',marginBottom:'4px'}}>古道论坛</div>
            <div style={{fontSize:'11px',color:'#aaa',fontStyle:'italic',marginBottom:'8px'}}>以文会友，以友辅仁</div>
            <div style={{fontSize:'11px',color:'#bbb',lineHeight:1.6,marginBottom:'10px'}}>
              面向全球华人的国际中文社区。传承中华传统文化，自由交流技术生活，共建温暖精神家园。
            </div>

            <div style={{fontSize:'10px',color:'#ccc',lineHeight:1.5}}>
              <div>&copy; {year} 古道论坛 · 最终解释权归古道论坛管理团队所有</div>
              <div style={{color:'#ddd'}}>文章仅代表作者观点 · 如有侵权请联系删除</div>
            </div>
          </div>

          {/* 第二列：快速链接 */}
          <div style={{flex:1,minWidth:140}}>
            <div style={{fontSize:'12px',fontWeight:600,color:'#888',marginBottom:'8px'}}>快速链接</div>
            <div style={{display:'flex',flexDirection:'column',gap:'5px',fontSize:'11px'}}>
              <Link href="/rules" style={{color:'#aaa',textDecoration:'none'}}>古道社区规则</Link>
              <Link href="/lottery/upgrade" style={{color:'#aaa',textDecoration:'none'}}>会员积分规则</Link>
              <Link href="/board" style={{color:'#aaa',textDecoration:'none'}}>论坛板块</Link>
              <Link href="/chat" style={{color:'#aaa',textDecoration:'none'}}>在线聊天</Link>
              <Link href="/search" style={{color:'#aaa',textDecoration:'none'}}>搜索</Link>
              <Link href="/register" style={{color:'#aaa',textDecoration:'none'}}>免费注册</Link>
              <Link href="/crazy-repair" style={{color:'#aaa',textDecoration:'none'}}>Crazy维修</Link>
            </div>
          </div>

          {/* 第三列：联系方式 */}
          <div style={{flex:1,minWidth:160}}>
            <div style={{fontSize:'12px',fontWeight:600,color:'#888',marginBottom:'8px'}}>联系方式</div>
            <div style={{display:'flex',flexDirection:'column',gap:'5px',fontSize:'11px',color:'#aaa'}}>
              <div>994730969@qq.com</div>
              <div>微信：crazy-repair</div>
              <div>yuhaohao13@gmail.com</div>
              <div style={{color:'#ccc',marginTop:'6px',paddingTop:'6px',borderTop:'1px solid #f0f0f0'}}>客服时间：周一至周日 8:00-22:00</div>
            </div>
            <div style={{marginTop:'8px'}}>
              <Link href="/register" style={{display:'inline-block',fontSize:'11px',fontWeight:500,padding:'4px 10px',borderRadius:'6px',backgroundColor:'#b45309',color:'#fff',textDecoration:'none'}}>
                免费注册
              </Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  )
}
