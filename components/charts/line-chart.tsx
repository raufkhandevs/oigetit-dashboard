"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function LineChart({
  data,
  color = "#e91e63",
  fillColor = "rgba(233, 30, 99, 0.1)",
  height = 300,
  xAxisDataKey = "date",
  lineDataKey = "value",
  yAxisDomain,
  hasGrid = true
}: {
  data: any[]
  color?: string
  fillColor?: string
  height?: number
  xAxisDataKey?: string
  lineDataKey?: string
  yAxisDomain?: [number | 'auto', number | 'auto']
  hasGrid?: boolean
}) {
  // Ensure we have data to render
  if (!data || data.length === 0) {
    return (
      <div style={{ width: "100%", height }} className="flex items-center justify-center text-gray-500">
        No data available
      </div>
    )
  }

  return (
    <div style={{ width: "100%", height }} className="relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
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
          <Tooltip />
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
