import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { ChartDataPoint } from "@/app/types/dashboard"
import { Card, CardContent } from "../ui/card"
import { CustomTooltip } from "./CustomTooltip"

interface AgeChartProps {
  data: ChartDataPoint[]
}

export function AgeChart({ data }: AgeChartProps) {

  return (
    <Card className="overflow-hidden h-full">
      <CardContent className="p-0 h-full">
        <div className="h-full w-full px-4 pt-6 pb-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 10 }} barSize={30} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} interval={0} />
              <YAxis hide={true} domain={[0, 50]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={(value: number) => `${value}%`}
                  fill="#666"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
