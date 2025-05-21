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
  const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Use percentage from the data if available
  const percentValue = payload.percentage ? payload.percentage : (percent * 100).toFixed(1);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor="middle" 
      dominantBaseline="central"
      className="font-semibold text-[10px] drop-shadow-md"
    >
      {``}
    </text>
  );
};

export function PieChart({ data }: ChartProps) {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsChart>
          <Pie
            data={data}
            cx="50%"
            cy="40%"
            innerRadius={60}
            outerRadius={90}
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
      <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
            <span className="text-xs font-medium">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Keeping the original component for backward compatibility
export function PieChartLanguage({ data }: ChartProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <PieChart data={data} />
      </CardContent>
    </Card>
  )
}
