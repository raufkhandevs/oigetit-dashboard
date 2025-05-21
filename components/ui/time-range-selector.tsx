export function TimeRangeSelector() {
  return (
    <div className="flex items-center bg-white rounded overflow-hidden border border-gray-200 shadow-sm">
      <TimeButton label="1D" active={false} />
      <TimeButton label="7D" active={true} />
      <TimeButton label="30D" active={false} />
      <TimeButton label="3M" active={false} />
      <TimeButton label="6M" active={false} />
      <TimeButton label="13M" active={false} />
    </div>
  )
}

function TimeButton({ label, active }: { label: string; active: boolean }) {
  return (
    <button
      className={`px-3 py-1 text-xs font-medium transition-colors
        ${active ? "bg-[#3f51b5] text-white" : "text-gray-700 hover:bg-gray-100"}`}
    >
      {label}
    </button>
  )
}
