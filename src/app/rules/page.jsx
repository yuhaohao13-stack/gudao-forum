'use client'
import Seo from '@/components/Seo'

import { useEffect } from 'react'
import Link from 'next/link'
import { Shield, FileText, Flag, AlertTriangle, Scale, Info } from 'lucide-react'

export default function CommunityRules() {
  useEffect(() => {
    document.title = '古道社区规则 — 古道论坛 | 国际中文社区'
    const meta = document.querySelector('meta[name="description"]') || (() => {
      const m = document.createElement('meta')
      m.name = 'description'
      document.head.appendChild(m)
      return m
    })()
    meta.content = '古道论坛社区规则、用户协议、隐私政策、举报与删除违法内容机制，以及禁止发布侵权诈骗违法信息的规定。'
  }, [])

  const sections = [
    {
      icon: <FileText size={20} />,
      title: '一、用户协议',
      content: [
        '1.1 古道论坛（以下简称"本论坛"）是一个面向全球华人的国际中文社区，由古道论坛管理团队（以下简称"管理团队"）运营。',
        '1.2 用户注册即表示同意本协议全部条款。若不同意，请停止注册或使用本论坛服务。',
        '1.3 用户须对注册时提供的个人信息真实性负责，包括但不限于用户名、电子邮箱等。如信息发生变更，应及时更新。',
        '1.4 用户不得恶意注册多个账号，不得使用冒充他人、含有攻击性、违法或侵犯他人权益的用户名。',
        '1.5 用户有权在遵守本规则的前提下浏览、发帖、评论、私信和使用本论坛提供的各项功能与服务。',
        '1.6 本论坛有权根据运营需要修改或中断服务，但会提前公告通知。',
        '1.7 如用户违反本规则，管理团队有权采取警告、删帖、禁言、封号等措施，直至追究法律责任。',
        '1.8 本协议条款的最终解释权归古道论坛管理团队所有。',
      ],
    },
    {
      icon: <Shield size={20} />,
      title: '二、隐私政策',
      content: [
        '2.1 本论坛重视用户隐私保护。我们收集的信息仅限于提供论坛服务所必需，包括：',
        '   · 注册时提交的用户名和电子邮箱',
        '   · 用户主动发布的帖子、评论、私信等内容',
        '   · 系统自动记录的IP地址、浏览器类型、访问时间等基础日志信息',
        '2.2 本论坛不会将用户的个人信息出售、出租或分享给第三方，但以下情况除外：',
        '   · 用户明确授权同意',
        '   · 法律法规或行政机关要求',
        '   · 为保护本论坛或其他用户的权利和财产安全',
        '2.3 用户的帖子、评论等内容在论坛内公开可见，请勿发布包含个人敏感信息的內容。',
        '2.4 本论坛采取合理的安全措施保护用户数据，但不对因不可抗力或第三方恶意攻击导致的数据泄露承担责任。',
        '2.5 用户有权要求删除自己的账号和相关信息，请联系管理团队处理。',
      ],
    },
    {
      icon: <AlertTriangle size={20} />,
      title: '三、禁止发布的内容',
      content: [
        '3.1 本论坛禁止发布任何违反法律法规的内容，包括但不限于：',
        '   · 危害国家安全、泄露国家秘密、颠覆国家政权、破坏国家统一的信息',
        '   · 煽动民族仇恨、民族歧视，破坏民族团结的信息',
        '   · 宣扬恐怖主义、极端主义的信息',
        '   · 散布谣言、扰乱社会秩序、破坏社会稳定的信息',
        '   · 含有淫秽、色情、赌博、暴力、凶杀、恐怖或教唆犯罪的信息',
        '3.2 禁止发布侵犯他人知识产权的內容，包括但不限于未经授权的转载、盗版资源链接等。',
        '3.3 禁止发布各类诈骗信息，包括但不限于虚假中奖、冒充官方、钓鱼链接、虚假交易等。',
        '3.4 禁止发布恶意广告、垃圾信息、刷屏行为、站外引流及各类形式的网络营销推广。',
        '3.5 禁止发布人肉搜索、泄露他人隐私信息（真实姓名、电话、住址、身份证号等）。',
        '3.6 禁止发布任何形式的网络暴力内容，包括人身攻击、侮辱谩骂、恶意抹黑等。',
      ],
    },
    {
      icon: <Flag size={20} />,
      title: '四、举报功能',
      content: [
        '4.1 用户在浏览论坛时如发现任何违规内容，欢迎通过以下方式举报：',
        '   · 在每个帖子、评论下方点击「举报」按钮（🚩图标），填写举报理由后提交',
        '   · 通过私信联系管理员或版主',
        '   · 发送邮件至举报专用邮箱：994730969@qq.com',
        '4.2 举报时请提供：',
        '   · 违规内容的链接或截图',
        '   · 违规的具体原因（违反哪一条规则）',
        '   · 举报人的联系方式（可选，便于反馈处理结果）',
        '4.3 管理团队在收到举报后将尽快核实处理，一般不超过24小时。',
        '4.4 本论坛对举报人信息严格保密，不会向被举报人透露举报人身份。',
        '4.5 恶意举报、虚假举报将被视为违规行为，举报人可能承担相应责任。',
      ],
    },
    {
      icon: <Scale size={20} />,
      title: '五、删除违法内容的机制',
      content: [
        '5.1 管理团队有权对以下内容立即删除，无需事先通知：',
        '   · 明确违反国家法律法规的信息',
        '   · 含有淫秽色情、暴力恐怖等不良信息',
        '   · 诈骗信息、钓鱼链接',
        '   · 侵犯他人隐私的信息',
        '5.2 对于一般违规内容，管理团队将采取以下处理流程：',
        '   · 收到举报或主动发现后，24小时内进行审核',
        '   · 确认违规后，删除相关内容并通知发布者',
        '   · 根据违规严重程度，予以警告、禁言（1-30天）或永久封号处理',
        '5.3 用户对处理结果有异议的，可通过私信或邮件向管理团队申诉。',
        '5.4 涉及严重违法犯罪的內容，本论坛将依法向有关部门报告，并配合调查。',
        '5.5 管理团队保留对违规内容进行处理的一切权利，包括但不限于删除、屏蔽、锁定、下沉等。',
      ],
    },
    {
      icon: <Info size={20} />,
      title: '六、免责声明',
      content: [
        '6.1 用户在论坛发布的内容仅代表其个人观点，不代表本论坛立场。',
        '6.2 用户因在论坛发布违规内容而引发的法律责任由用户自行承担。',
        '6.3 本论坛不对第三方链接、广告或外部网站的内容和质量负责。',
        '6.4 因不可抗力（包括但不限于自然灾害、政府行为、网络故障等）导致服务中断，本论坛不承担责任。',
        '6.5 用户应自行妥善保管账户密码，因账户被盗用导致的损失本论坛不承担责任。',
        '6.6 本规则所有条款的最终解释权归古道论坛管理团队所有。',
      ],
    },
  ]

  return (
      <Seo title="古道论坛社区规则 - 用户协议隐私政策免责声明" description="古道论坛社区规则，包含用户协议、隐私政策、举报功能、删除违法内容、禁止发布内容、免责声明等。" />
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* 标题区 */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1c1917] mb-2">📜 古道社区规则</h1>
        <p className="text-sm text-[#999]">最后更新：2026年7月25日</p>
        <p className="text-xs text-[#bbb] mt-1">加入古道论坛即视为同意以下全部条款</p>
      </div>

      {/* 规则章节 */}
      <div className="space-y-8">
        {sections.map((sec, i) => (
          <div key={i} className="bg-white border border-[#ece8e0] rounded-xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#f0f0f0]">
              <span className="text-[#b45309]">{sec.icon}</span>
              <h2 className="text-base font-bold text-[#1c1917]">{sec.title}</h2>
            </div>
            <div className="space-y-2">
              {sec.content.map((line, j) => (
                <p key={j} className={`text-sm leading-relaxed ${
                  line.startsWith('   ·') ? 'text-[#777] pl-4' : 'text-[#555]'
                }`}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 最终解释权声明 */}
      <div className="mt-8 bg-[#fefce8] border border-[#fde68a] rounded-xl p-5 text-center">
        <p className="text-sm font-semibold text-[#92400e]">
          ⚖️ 所有内容和网站运营，最终解释权归古道论坛管理团队所有
        </p>
        <p className="text-xs text-[#a16207] mt-2">
          古道论坛管理团队 · 联系邮箱：994730969@qq.com · 微信：crazy-repair
        </p>
      </div>

      {/* 导航 */}
      <div className="mt-8 text-center">
        <Link href="/" className="text-sm text-[#b45309] hover:underline">
          ← 返回首页
        </Link>
      </div>
    </div>
  )
}
