'use client';

import Link from 'next/link';
import { ChevronRight, ExternalLink } from 'lucide-react';

export default function CrazyRepairPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="max-w-4xl mx-auto px-4 py-6">
        
        {/* 面包屑导航 */}
        <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-amber-700 transition-colors">首页</Link>
          <ChevronRight size={14} />
          <span className="text-gray-800 font-medium">Crazy维修</span>
        </nav>

        {/* 标题区域 - 居中 */}
        <div className="mb-6 text-center">
          <a 
            href="https://www.crazy-repair.com" 
            target="_blank" 
            rel="noopener"
            className="inline-flex items-center gap-2 text-2xl sm:text-3xl font-bold text-gray-900 hover:text-amber-700 transition-colors group"
          >
            🔧 Crazy维修
            <ExternalLink size={20} className="opacity-40 group-hover:opacity-100 transition-opacity" />
          </a>
          <a href="https://www.crazy-repair.com" target="_blank" rel="noopener"
            className="block text-gray-500 mt-1 text-sm hover:text-amber-700 transition-colors leading-relaxed">
            2007年至今 · 威海 · 手机电脑维修
          </a>
        </div>

        {/* 视频播放器 - 限制宽度不超出 */}
        <div className="bg-black rounded-xl overflow-hidden shadow-lg mb-8" style={{maxWidth:'580px', margin:'0 auto'}}>
          <video 
            controls 
            playsInline
            className="w-full aspect-video"
            preload="metadata"
          >
            <source src="/videos/crazy-repair.mp4" type="video/mp4" />
            您的浏览器不支持视频播放
          </video>
        </div>

        {/* Crazy维修介绍 */}
        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">关于Crazy维修</h2>
          <div className="space-y-3 text-gray-700 leading-relaxed">
            <p>
              Crazy维修（Crazy-repair）成立于威海环翠区，是一家专注于手机、电脑、平板及各类数码产品维修的专业工作室。2007年至今奋斗在维修一线，累计服务超过10万+位客户。
            </p>
            <p>
              我们修的设备覆盖你能想到的大部分品牌——Apple、Samsung、华为、小米、OPPO、vivo、OnePlus、荣耀、Google Pixel、Realme……不管你是iPhone屏幕碎了、三星电池不耐用了、还是MacBook进水了，拿来给我们看看。
            </p>
            <p>
              <strong>我们的理念：</strong>先查问题，告诉客户真实情况，给出合理报价，修不修客户决定。绝不诱导消费，绝不隐瞒问题。不做那种"小病大修"的套路。
            </p>
            <p>
              所有维修当面完成（特殊主板问题除外），修之前跟你说清楚问题在哪、怎么修、多少钱，你觉得合适再修。修完之后当面测试，确保功能正常再拿走。简单直接，不整虚的。
            </p>
          </div>

          {/* 联系信息 */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">联系方式</h3>
            <div className="flex flex-wrap gap-4 text-sm">
              <a href="https://www.crazy-repair.com" target="_blank" rel="noopener"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 text-amber-800 rounded-lg hover:bg-amber-100 transition-colors">
                访问官网 <ExternalLink size={14} />
              </a>
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg">
                📧 yuhaohao13@gmail.com
              </span>
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg">
                📞 +86 13573735550
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
