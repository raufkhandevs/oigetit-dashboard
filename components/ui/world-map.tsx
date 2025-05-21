"use client"

import { useRef } from "react"
import { Maximize, Target, Plus, Minus, Info } from "lucide-react"

export function WorldMap() {
  const mapRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative w-full h-[400px] bg-white rounded-md overflow-hidden">
      <div className="absolute top-2 right-2 z-10 flex flex-col space-y-1">
        <button className="w-8 h-8 bg-gray-700 text-white flex items-center justify-center rounded-md">
          <Maximize className="w-5 h-5" />
        </button>
        <button className="w-8 h-8 bg-gray-700 text-white flex items-center justify-center rounded-md">
          <Target className="w-5 h-5" />
        </button>
        <button className="w-8 h-8 bg-gray-700 text-white flex items-center justify-center rounded-md">
          <Plus className="w-5 h-5" />
        </button>
        <button className="w-8 h-8 bg-gray-700 text-white flex items-center justify-center rounded-md">
          <Minus className="w-5 h-5" />
        </button>
      </div>
      <div className="absolute bottom-2 right-2 z-10">
        <button className="w-8 h-8 bg-gray-700 text-white flex items-center justify-center rounded-md">
          <Info className="w-5 h-5" />
        </button>
      </div>
      <div ref={mapRef} className="w-full h-full">
        <img src="/placeholder-lvimg.png" alt="World Map" className="w-full h-full object-cover" />
      </div>
      <div className="absolute bottom-2 left-2 text-xs text-gray-600">
        <div>5000 km</div>
        <div>5000 mi</div>
        <div className="flex items-center mt-2">
          <div className="flex items-center mr-3">
            <span className="inline-block w-3 h-3 rounded-full bg-gray-300 mr-1"></span>
            <span>No results</span>
          </div>
          <div className="flex items-center mr-3">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-200 mr-1"></span>
            <span>~0%</span>
          </div>
          <div className="flex items-center mr-3">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-300 mr-1"></span>
            <span>0% - 0.7%</span>
          </div>
          <div className="flex items-center mr-3">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-400 mr-1"></span>
            <span>0.9% - 1.7%</span>
          </div>
          <div className="flex items-center mr-3">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-800 mr-1"></span>
            <span>2.4% - 3.8%</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-900 mr-1"></span>
            <span>75.4%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
