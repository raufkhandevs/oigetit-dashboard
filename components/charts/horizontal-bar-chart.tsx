  import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
  import type { ChartDataPoint } from "@/app/types/dashboard"
  import { useEffect, useRef, useState } from "react"

  interface HorizontalBarChartProps {
    data: ChartDataPoint[]
    title: string
    maxValue?: number
  }

  export function HorizontalBarChart({ data, title, maxValue = 70 }: HorizontalBarChartProps) {
    const ticks = Array.from({ length: 6 }, (_, i) => Math.round(i * (maxValue / 5)))
    const containerRef = useRef<HTMLDivElement>(null)
    const [barHeight, setBarHeight] = useState(0)
    
    useEffect(() => {
      const updateBarHeight = () => {
        if (containerRef.current) {
          const containerHeight = containerRef.current.clientHeight
          const availableHeight = containerHeight - ((data.length - 1) * 10) // Account for gaps
          const height = Math.max(24, availableHeight / data.length) // Min height 24px
          setBarHeight(height)
        }
      }
      
      updateBarHeight()
      window.addEventListener('resize', updateBarHeight)
      return () => window.removeEventListener('resize', updateBarHeight)
    }, [data.length])

    // Calculate text size based on bar height
    const textSizeClass = barHeight > 40 ? 'text-lg' : barHeight > 30 ? 'text-base' : 'text-sm'
    
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="px-6 pt-2 pb-4 bg-white h-[252px] overflow-hidden">
            <div ref={containerRef} className="flex flex-col h-full justify-between gap-[5px]">
              {data.map((entry) => (
                <div 
                  key={entry.name} 
                  className="relative flex items-center"
                  style={{ height: `${barHeight}px` }}
                >
                  <div
                    className="flex items-center h-full rounded-l-md shadow-sm"
                    style={{
                      width: `${(entry.value / maxValue) * 100}%`,
                      background: entry.color,
                      minWidth: 60,
                      borderTopLeftRadius: 6,
                      borderBottomLeftRadius: 6,
                    }}
                  >
                    <span className={`pl-4 font-bold text-white ${textSizeClass} drop-shadow-md select-none truncate`}>
                      {entry.name}
                    </span>
                  </div>
                  <div
                    className="absolute right-0 flex items-center h-full pr-2"
                    style={{ minWidth: 70 }}
                  >
                    <div className={`bg-white rounded-full px-2 py-1 ${textSizeClass} font-semibold text-gray-800 shadow text-center border border-gray-200`}>
                      {entry.value}%
                    </div>
                  </div>
                  <div
                    className="absolute left-0 top-0 h-full w-full rounded-md"
                    style={{
                      background: '#f5f5f5',
                      zIndex: -1,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 px-6 pb-2 pt-1">
            {ticks.map((tick) => (
              <div key={tick}>{tick}%</div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  } 