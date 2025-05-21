import { Plus, Maximize } from "lucide-react"

export function SearchBar() {
  return (
    <div className="flex items-center space-x-2">
      <button className="flex items-center bg-blue-100 text-blue-800 px-2.5 py-1.5 rounded-md text-xs font-medium hover:bg-blue-200 transition-colors">
        <Plus className="w-3.5 h-3.5 mr-1.5" />
        <span>Compare</span>
      </button>
      <button className="p-1.5 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
        <Maximize className="w-3.5 h-3.5 text-gray-600" />
      </button>
    </div>
  )
}
