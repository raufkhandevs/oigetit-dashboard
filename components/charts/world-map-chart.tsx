"use client"

import type React from "react"

import { useRef } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

export function WorldMapChart({
  data,
  height = 400,
}: {
  data: { name: string; value: number; color: string }[]
  height?: number
}) {
  const mapRef = useRef<HTMLDivElement>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="relative bg-white rounded-md overflow-hidden" style={{ height }}>
        <div className="absolute top-2 right-2 z-10 flex flex-col space-y-1">
          <MapButton icon={<MaximizeIcon />} />
          <MapButton icon={<TargetIcon />} />
          <MapButton icon={<PlusIcon />} />
          <MapButton icon={<MinusIcon />} />
        </div>
        <div className="absolute bottom-2 right-2 z-10">
          <MapButton icon={<InfoIcon />} />
        </div>
        <div ref={mapRef} className="w-full h-full">
          <img src="/world-map-blue-regions.png" alt="World Map" className="w-full h-full object-cover" />
        </div>
        <div className="absolute bottom-2 left-2 text-xs text-gray-600">
          <div className="flex items-center mt-2 flex-wrap">
            <MapLegendItem color="#e0e0e0" label="No Result" />
            <MapLegendItem color="#b3e0f2" label="~0%" />
            <MapLegendItem color="#81d4fa" label="0%-0.7%" />
            <MapLegendItem color="#4fc3f7" label="0.9%-1.7%" />
            <MapLegendItem color="#0288d1" label="2.4%-3.8%" />
            <MapLegendItem color="#01579b" label="75.4%" />
          </div>
        </div>
      </div>

      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function MapButton({ icon }: { icon: React.ReactNode }) {
  return <button className="w-8 h-8 bg-gray-700 text-white flex items-center justify-center rounded-md">{icon}</button>
}

function MapLegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center mr-3">
      <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: color }}></span>
      <span>{label}</span>
    </div>
  )
}

function MaximizeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  )
}

function TargetIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function MinusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}
