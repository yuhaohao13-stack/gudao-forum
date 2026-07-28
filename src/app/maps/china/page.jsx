'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import * as echarts from 'echarts'
import { ArrowLeft, Search } from 'lucide-react'

export default function ChinaMapPage() {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const [mounted, setMounted] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [regionNames, setRegionNames] = useState([])
  const [currentRegion, setCurrentRegion] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    setLoading(true)

    // 加载中国地图 GeoJSON
    fetch('/data/china.json')
      .then(r => r.json())
      .then(geoJSON => {
        echarts.registerMap('china', geoJSON)

        // 提取所有省市区名称
        const names = geoJSON.features.map(f => f.properties.name)
        setRegionNames(names)

        // 初始化图表
        if (!chartInstance.current && chartRef.current) {
          const chart = echarts.init(chartRef.current)
          chartInstance.current = chart

          const option = {
            tooltip: {
              trigger: 'item',
              formatter: '{b}'
            },
            series: [{
              type: 'map',
              map: 'china',
              roam: true,
              selectedMode: false,
              label: {
                show: true,
                fontSize: 10,
                color: '#333'
              },
              itemStyle: {
                areaColor: '#fef3c7',
                borderColor: '#d97706',
                borderWidth: 1
              },
              emphasis: {
                label: {
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 'bold'
                },
                itemStyle: {
                  areaColor: '#ea580c'
                }
              }
            }]
          }

          chart.setOption(option)

          // 点击事件 — 显示区域名称
          chart.on('click', (params) => {
            if (params.name) {
              setCurrentRegion(params.name)
            }
          })
        }

        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load China map data:', err)
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

    // 模糊匹配
    const match = regionNames.find(n =>
      n.includes(name) || name.includes(n)
    )

    if (match) {
      setCurrentRegion(match)
      chartInstance.current.dispatchAction({
        type: 'mapSelect',
        seriesIndex: 0,
        name: match
      })
      // 3秒后取消高亮
      setTimeout(() => {
        chartInstance.current?.dispatchAction({
          type: 'mapUnSelect',
          seriesIndex: 0,
          name: match
        })
      }, 3000)
    }
  }

  // 回车搜索
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  // 窗口大小自适应
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
        <Link href="/maps" className="inline-flex items-center gap-1 text-xs text-[#888] hover:text-[#c23531] mb-4 transition-colors">
          <ArrowLeft size={14} /> 返回地图列表
        </Link>

        <h1 className="text-lg font-bold text-[#1c1917] mb-1">🌏 中国地图</h1>
        <p className="text-xs text-[#888] mb-4">34个省市区行政区划，搜索定位，双指缩放</p>

        {/* 搜索框 */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入省份名称，如：山东省、广东、威海…"
              className="w-full pl-3 pr-3 py-2.5 rounded-xl border border-[#e5ddd5] bg-white text-sm text-[#1c1917] placeholder:text-[#bbb] focus:outline-none focus:border-[#d97706] focus:ring-1 focus:ring-[#d97706]/30 transition-colors"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2.5 bg-[#d97706] hover:bg-[#b45309] text-white text-sm font-medium rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Search size={15} />
            搜索
          </button>
        </div>

        {/* 当前选中区域 */}
        {currentRegion && (
          <div className="mb-3 text-xs text-[#d97706] font-medium bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 inline-block">
            📍 当前定位：{currentRegion}
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

        {/* 常用省份快捷入口 */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {['北京', '上海', '广东', '山东', '浙江', '江苏', '四川', '云南', '西藏', '新疆'].map(name => (
            <button
              key={name}
              onClick={() => {
                setSearchText(name)
                setTimeout(() => {
                  const match = regionNames.find(n => n.includes(name))
                  if (match && chartInstance.current) {
                    setCurrentRegion(match)
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
              className="text-[10px] px-2.5 py-1 rounded-full border border-[#e5ddd5] bg-white hover:bg-[#fef3c7] hover:border-[#d97706] text-[#666] hover:text-[#d97706] transition-colors"
            >
              {name}
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}
