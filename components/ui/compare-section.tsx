import { Plus, Maximize } from "lucide-react"

export function CompareSection({ title }: { title: string }) {
  return (
    <div className="bg-white rounded-md shadow-sm mb-4 p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Plus className="w-5 h-5 text-[#3f51b5] mr-2" />
        <span className="text-gray-600 font-medium">Compare</span>
      </div>
      <button className="p-1 hover:bg-gray-100 rounded">
        <Maximize className="w-5 h-5 text-gray-500" />
      </button>
    </div>
  )
}
