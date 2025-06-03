import { Cell, Pie, PieChart as RechartsChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import type { ChartDataPoint } from "@/app/types/dashboard"
import { CustomTooltip } from "./CustomTooltip"

interface ChartProps {
  data: ChartDataPoint[]
  title?: string
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload }: any) => {
  const radius = (innerRadius + outerRadius) / 2;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Use percentage from the data if available, only show if > 5%
  const percentValue = payload.percentage ? payload.percentage : (percent * 100);
  
  if (percentValue < 5) return null; // Don't show labels for small slices

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor="middle" 
      dominantBaseline="central"
      className="font-semibold text-[10px] drop-shadow-md"
    >
      {`${percentValue.toFixed(0)}%`}
    </text>
  );
};

export function PieChart({ data }: ChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      {/* Chart container with controlled height */}
      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="35%"
              outerRadius="65%"
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              labelLine={false}
              label={renderCustomizedLabel}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </RechartsChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend with controlled spacing */}
      <div className="flex-shrink-0 pt-2 pb-1">
        <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center text-xs">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-1 min-w-0">
              <div 
                className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="font-medium text-gray-700 truncate">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Keeping the original component for backward compatibility
export function PieChartLanguage({ data }: ChartProps) {
  return (
    <Card className="overflow-hidden h-full">
      <CardContent className="p-4 h-full">
        <PieChart data={data} />
      </CardContent>
    </Card>
  )
}
