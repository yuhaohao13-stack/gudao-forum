import sharp from 'sharp'
import { writeFileSync } from 'fs'

const sizes = [192, 512]

async function generateIcon(size) {
  // 创建蓝黑色背景圆角方块
  const svgRect = Buffer.from(`
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#1e293b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#bg)"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.35}" fill="none" stroke="#d97706" stroke-width="${size * 0.02}" opacity="0.3"/>
      <text x="${size / 2}" y="${size * 0.65}" font-size="${size * 0.5}" text-anchor="middle" fill="#d97706" font-family="sans-serif" font-weight="bold">古</text>
    </svg>
  `)

  const pngBuf = await sharp(svgRect)
    .resize(size, size)
    .png()
    .toBuffer()

  writeFileSync(`public/icons/icon-${size}.png`, pngBuf)
  console.log(`✅ icon-${size}.png generated`)
}

async function main() {
  for (const size of sizes) {
    await generateIcon(size)
  }
  console.log('🎉 All icons generated!')
}

main().catch(console.error)
