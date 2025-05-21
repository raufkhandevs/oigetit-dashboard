import type React from "react"
import { Maximize, BarChart2, MoreVertical } from "lucide-react"

export function MetricCard({
  title,
  value,
  className = "",
  hasControls = true,
}: {
  title: string
  value: string | React.ReactNode
  className?: string
  hasControls?: boolean
}) {
  return (
    <div className={`bg-white rounded-md shadow-sm ${className} h-full`}>
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-gray-700 font-medium">{title}</h3>
        {hasControls && (
          <div className="flex space-x-1">
            <button className="p-1 hover:bg-gray-100 rounded">
              <Maximize className="w-4 h-4 text-gray-500" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <BarChart2 className="w-4 h-4 text-gray-500" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        )}
      </div>
      <div className="p-8 flex items-center justify-center">
        {typeof value === "string" ? <div className="text-5xl font-bold text-gray-800">{value}</div> : value}
      </div>
    </div>
  )
}
