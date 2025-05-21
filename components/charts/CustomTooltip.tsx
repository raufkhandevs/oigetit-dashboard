import type { TooltipProps } from "@/app/types/dashboard"

export function CustomTooltip({ active, payload }: TooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    // Use percentage if available, otherwise use value
    const displayValue = data.percentage !== undefined 
      ? `${data.percentage}%` 
      : `${payload[0].value}%`;
      
    return (
      <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md text-xs">
        <p className="font-medium">{`${payload[0].name}: ${displayValue}`}</p>
      </div>
    )
  }
  return null
}
