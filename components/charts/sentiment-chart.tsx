"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts"

interface SentimentChartProps {
  data: Array<{
    date: string;
    value: number;
  }>;
  height?: number;
}

export function SentimentChart({ data, height = 300 }: SentimentChartProps) {
  return (
    <div style={{ width: "100%", height }} className="relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
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
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            formatter={(value: number) => [`${value}%`, 'Sentiment']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          
          {/* Add a zero reference line */}
          <ReferenceLine y={0} stroke="#9ca3af" strokeWidth={1} />
          
          {/* Positive area (above zero) */}
          <Area 
            type="monotone" 
            dataKey="value"
            stroke="#4CAF50"
            fill="rgba(76, 175, 80, 0.2)"
            strokeWidth={2}
            fillOpacity={1}
            activeDot={{ r: 6 }}
            isAnimationActive={true}
            animationDuration={1000}
            // Only show positive values
            baseValue={0}
            connectNulls
          />
          
          {/* Negative area (below zero) */}
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
