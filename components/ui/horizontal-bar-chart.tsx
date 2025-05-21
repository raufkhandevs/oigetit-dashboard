export function HorizontalBarChart({
  data,
}: {
  data: { label: string; value: number; color: string }[]
}) {
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between text-sm">
            <div className="text-gray-700">{item.label}</div>
            <div className="font-medium">{item.value}%</div>
          </div>
          <div className="h-8 bg-gray-100 rounded-md overflow-hidden">
            <div
              className="h-full rounded-md"
              style={{
                width: `${item.value}%`,
                backgroundColor: item.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
