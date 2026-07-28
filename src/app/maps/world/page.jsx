'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import * as echarts from 'echarts'
import { ArrowLeft, Search } from 'lucide-react'

export default function WorldMapPage() {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const [mounted, setMounted] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [countryNames, setCountryNames] = useState([])
  const [currentCountry, setCurrentCountry] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    setLoading(true)

    // 加载世界地图 GeoJSON
    fetch('/data/world.json')
      .then(r => r.json())
      .then(geoJSON => {
        echarts.registerMap('world', geoJSON)

        // 提取所有国家名称（中文名优先）
        const names = geoJSON.features.map(f =>
          f.properties.name || f.properties.NAME || ''
        ).filter(Boolean)
        setCountryNames(names)

        // 初始化图表
        if (!chartInstance.current && chartRef.current) {
          const chart = echarts.init(chartRef.current)
          chartInstance.current = chart

          const option = {
            tooltip: {
              trigger: 'item',
              formatter: (params) => {
                if (!params.name) return ''
                const feat = geoJSON.features.find(f =>
                  f.properties.name === params.name ||
                  f.properties.NAME === params.name
                )
                // 尝试显示中文名
                const cn = feat?.properties?.name_cn || feat?.properties?.name || params.name
                return `<strong>${cn}</strong>`
              }
            },
            series: [{
              type: 'map',
              map: 'world',
              roam: true,
              selectedMode: false,
              label: {
                show: false,
                fontSize: 8
              },
              itemStyle: {
                areaColor: '#dbeafe',
                borderColor: '#60a5fa',
                borderWidth: 0.5
              },
              emphasis: {
                label: {
                  show: true,
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 'bold'
                },
                itemStyle: {
                  areaColor: '#2563eb'
                }
              }
            }]
          }

          chart.setOption(option)

          // 点击事件
          chart.on('click', (params) => {
            if (params.name) {
              const feat = geoJSON.features.find(f =>
                f.properties.name === params.name ||
                f.properties.NAME === params.name
              )
              const cn = feat?.properties?.name_cn || params.name
              setCurrentCountry(cn)
            }
          })
        }

        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load world map data:', err)
        setLoading(false)
      })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose()
        chartInstance.current = null
      }
    }
  }, [])

  // 搜索定位
  const handleSearch = () => {
    const name = searchText.trim()
    if (!name || !chartInstance.current) return

    // 模糊匹配（支持中英文）
    const match = countryNames.find(n =>
      n.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(n.toLowerCase())
    )

    if (match) {
      setCurrentCountry(match)
      chartInstance.current.dispatchAction({
        type: 'mapSelect',
        seriesIndex: 0,
        name: match
      })
      setTimeout(() => {
        chartInstance.current?.dispatchAction({
          type: 'mapUnSelect',
          seriesIndex: 0,
          name: match
        })
      }, 3000)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  // 窗口自适应
  useEffect(() => {
    if (!mounted) return
    const handleResize = () => chartInstance.current?.resize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mounted])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* 返回 */}
        <Link href="/maps" className="inline-flex items-center gap-1 text-xs text-[#888] hover:text-[#2563eb] mb-4 transition-colors">
          <ArrowLeft size={14} /> 返回地图列表
        </Link>

        <h1 className="text-lg font-bold text-[#1c1917] mb-1">🌍 世界地图</h1>
        <p className="text-xs text-[#888] mb-4">200+国家和地区，搜索定位，双指缩放</p>

        {/* 搜索框 */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入国家名称（中英文均可），如：China、日本、Singapore…"
              className="w-full pl-3 pr-3 py-2.5 rounded-xl border border-[#e5ddd5] bg-white text-sm text-[#1c1917] placeholder:text-[#bbb] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/30 transition-colors"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-medium rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Search size={15} />
            搜索
          </button>
        </div>

        {/* 当前选中 */}
        {currentCountry && (
          <div className="mb-3 text-xs text-[#2563eb] font-medium bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5 inline-block">
            📍 当前定位：{currentCountry}
          </div>
        )}

        {/* 地图容器 */}
        <div className="bg-white rounded-xl border border-[#e5ddd5] overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center" style={{ height: '60vh' }}>
              <div className="text-sm text-[#888]">加载地图数据…</div>
            </div>
          ) : (
            <div
              ref={chartRef}
              style={{ width: '100%', height: '65vh' }}
              className="touch-action-manipulation"
            />
          )}
        </div>

        {/* 常用国家快捷入口 */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {['中国', 'Japan', 'Singapore', 'United States', 'United Kingdom', 'Australia', 'France', 'Germany', 'Canada', 'Korea'].map(name => (
            <button
              key={name}
              onClick={() => {
                setSearchText(name)
                setTimeout(() => {
                  const match = countryNames.find(n =>
                    n.toLowerCase().includes(name.toLowerCase()) ||
                    name.toLowerCase().includes(n.toLowerCase())
                  )
                  if (match && chartInstance.current) {
                    setCurrentCountry(match)
                    chartInstance.current.dispatchAction({
                      type: 'mapSelect',
                      seriesIndex: 0,
                      name: match
                    })
                    setTimeout(() => {
                      chartInstance.current?.dispatchAction({
                        type: 'mapUnSelect',
                        seriesIndex: 0,
                        name: match
                      })
                    }, 3000)
                  }
                }, 100)
              }}
              className="text-[10px] px-2.5 py-1 rounded-full border border-[#e5ddd5] bg-white hover:bg-blue-50 hover:border-[#2563eb] text-[#666] hover:text-[#2563eb] transition-colors"
            >
              {name}
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}
