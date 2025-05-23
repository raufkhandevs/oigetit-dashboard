"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
}

interface LineChartProps {
  data: any[]
  color?: string
  fillColor?: string
  height?: number
  xAxisDataKey?: string
  lineDataKey?: string
  yAxisDomain?: [number | 'auto', number | 'auto']
  hasGrid?: boolean
  onPointClick?: (data: any, date: string) => void
  tooltipFormatter?: (value: any, name: string, props: any) => [string, string]
}

const CustomTooltip = ({ active, payload, label, tooltipFormatter }: CustomTooltipProps & { tooltipFormatter?: (value: any, name: string, props: any) => [string, string] }) => {
  if (active && payload && payload.length) {
    const data = payload[0]
    const value = data.value
    const name = data.name || 'Value'
    const originalData = data.payload?.originalData
    
    const [formattedValue, formattedName] = tooltipFormatter 
      ? tooltipFormatter(value, name, data)
      : [typeof value === 'number' ? value.toLocaleString() : value, name]

    let displayDate = label
    if (originalData?.pubdate) {
      displayDate = new Date(originalData.pubdate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    }

    let sentimentInfo = null
    if (originalData) {
      const positive = originalData.volume_pos || 0
      const negative = originalData.volume_neg || 0
      const total = originalData.volume || 0
      const neutral = total - positive - negative
      const sentimentScore = originalData.sentiment || 0
      const sentimentCategory = sentimentScore > 0 ? 'Positive' : sentimentScore < 0 ? 'Negative' : 'Neutral'
      
      sentimentInfo = {
        positive,
        negative,
        neutral,
        sentimentCategory
      }
    }

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[200px]">
        <p className="text-sm font-semibold text-gray-900 mb-2">{displayDate}</p>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Volume:</span>
            <span className="text-sm font-medium text-gray-900">{formattedValue}</span>
          </div>
          
          {sentimentInfo && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600">Positive:</span>
                <span className="text-sm font-medium text-green-700">{sentimentInfo.positive.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Neutral:</span>
                <span className="text-sm font-medium text-gray-700">{sentimentInfo.neutral.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-red-600">Negative:</span>
                <span className="text-sm font-medium text-red-700">{sentimentInfo.negative.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-200 mt-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sentiment:</span>
                  <span className={`text-sm font-medium ${
                    sentimentInfo.sentimentCategory === 'Positive' ? 'text-green-700' :
                    sentimentInfo.sentimentCategory === 'Negative' ? 'text-red-700' : 'text-gray-700'
                  }`}>
                    {sentimentInfo.sentimentCategory}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }
  return null
}

export function LineChart({
  data,
  color = "#e91e63",
  fillColor = "rgba(233, 30, 99, 0.1)",
  height = 300,
  xAxisDataKey = "date",
  lineDataKey = "value",
  yAxisDomain,
  hasGrid = true,
  onPointClick,
  tooltipFormatter
}: LineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div style={{ width: "100%", height }} className="flex items-center justify-center text-gray-500">
        No data available
      </div>
    )
  }

  const handlePointClick = (data: any) => {
    if (onPointClick && data && data.activePayload && data.activePayload.length > 0) {
      const clickedData = data.activePayload[0].payload
      const date = clickedData[xAxisDataKey]
      onPointClick(clickedData, date)
    }
  }

  return (
    <div style={{ width: "100%", height }} className="relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          data={data} 
          margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
          onClick={handlePointClick}
        >
          {hasGrid && <CartesianGrid strokeDasharray="5 5" stroke="#e5e7eb" vertical={false} />}
          <XAxis 
            dataKey={xAxisDataKey} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            domain={yAxisDomain || ['auto', 'auto']}
          />
          <Tooltip 
            content={<CustomTooltip tooltipFormatter={tooltipFormatter} />}
            cursor={{ strokeDasharray: '5 5', stroke: '#6b7280' }}
          />
          <Area 
            type="monotone" 
            dataKey={lineDataKey} 
            stroke={color} 
            fill={fillColor} 
            strokeWidth={2}
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
