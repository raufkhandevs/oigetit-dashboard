"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts"

interface SentimentChartProps {
  data: Array<{
    date: string;
    value: number;
  }>;
  height?: number;
  onPointClick?: (data: any, date: string) => void;
}

interface CustomSentimentTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
}

const CustomSentimentTooltip = ({ active, payload, label }: CustomSentimentTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0]
    const value = data.value
    const originalData = data.payload?.originalData
    const isPositive = value >= 0
    const color = isPositive ? '#4CAF50' : '#F44336'
    const sentiment = isPositive ? 'Positive' : 'Negative'
    
    let displayDate = label
    if (originalData?.pubdate) {
      displayDate = new Date(originalData.pubdate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    }

    let sentimentDetails = null
    if (originalData) {
      const positive = originalData.volume_pos || 0
      const negative = originalData.volume_neg || 0
      const total = originalData.volume || 0
      const neutral = total - positive - negative
      const sentimentScore = originalData.sentiment || 0
      const sentimentCategory = sentimentScore > 0 ? 'Positive' : sentimentScore < 0 ? 'Negative' : 'Neutral'
      
      sentimentDetails = {
        positive,
        negative,
        neutral,
        total,
        sentimentCategory,
        sentimentPercentage: Math.abs(value).toFixed(1)
      }
    }
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[200px]">
        <p className="text-sm font-semibold text-gray-900 mb-2">{displayDate}</p>
        
        <div className="space-y-1">
          {sentimentDetails && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Volume:</span>
                <span className="text-sm font-medium text-gray-900">{sentimentDetails.total.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600">Positive:</span>
                <span className="text-sm font-medium text-green-700">{sentimentDetails.positive.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Neutral:</span>
                <span className="text-sm font-medium text-gray-700">{sentimentDetails.neutral.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-red-600">Negative:</span>
                <span className="text-sm font-medium text-red-700">{sentimentDetails.negative.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-200 mt-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sentiment:</span>
                  <span className={`text-sm font-medium ${
                    sentimentDetails.sentimentCategory === 'Positive' ? 'text-green-700' :
                    sentimentDetails.sentimentCategory === 'Negative' ? 'text-red-700' : 'text-gray-700'
                  }`}>
                    {sentimentDetails.sentimentCategory}
                  </span>
                </div>
              </div>
            </>
          )}
          
          {!sentimentDetails && (
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-gray-600">Sentiment:</span>
              <span className="text-sm font-semibold" style={{ color }}>
                {Math.abs(value).toFixed(1)}% {sentiment}
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }
  return null
}

export function SentimentChart({ data, height = 300, onPointClick }: SentimentChartProps) {
  const handlePointClick = (clickData: any) => {
    if (onPointClick && clickData && clickData.activePayload && clickData.activePayload.length > 0) {
      const clickedData = clickData.activePayload[0].payload
      const date = clickedData.date
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
          <CartesianGrid strokeDasharray="5 5" stroke="#e5e7eb" vertical={false} />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            domain={[-100, 100]}
            tickFormatter={(value) => `${value.toFixed(1)}%`}
          />
          <Tooltip 
            content={<CustomSentimentTooltip />}
            cursor={{ strokeDasharray: '5 5', stroke: '#6b7280' }}
          />
          
          <ReferenceLine y={0} stroke="#9ca3af" strokeWidth={1} />
          
          <Area 
            type="monotone" 
            dataKey="value"
            stroke="#4CAF50"
            fill="rgba(76, 175, 80, 0.2)"
            strokeWidth={2}
            fillOpacity={1}
            isAnimationActive={true}
            animationDuration={1000}
            baseValue={0}
            connectNulls
          />
          
          <Area 
            type="monotone" 
            dataKey={(entry) => entry.value < 0 ? entry.value : 0}
            stroke="#F44336"
            fill="rgba(244, 67, 54, 0.2)"
            strokeWidth={2}
            fillOpacity={1}
            animationDuration={1000}
            connectNulls
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
