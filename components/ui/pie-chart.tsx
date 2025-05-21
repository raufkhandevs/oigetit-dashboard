"use client"

import { useEffect, useRef } from "react"

export function PieChart({
  data,
}: {
  data: { label: string; value: number; color: string }[]
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1
    canvas.width = canvas.offsetWidth * dpr
    canvas.height = canvas.offsetHeight * dpr
    ctx.scale(dpr, dpr)

    const centerX = canvas.offsetWidth / 2
    const centerY = canvas.offsetHeight / 2
    const radius = Math.min(centerX, centerY) * 0.8
    const innerRadius = radius * 0.6

    // Calculate total for percentages
    const total = data.reduce((sum, item) => sum + item.value, 0)

    // Draw donut chart
    let startAngle = 0

    data.forEach((item) => {
      const sliceAngle = (item.value / total) * Math.PI * 2

      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true)
      ctx.closePath()

      ctx.fillStyle = item.color
      ctx.fill()

      startAngle += sliceAngle
    })

    // Draw white circle in the middle
    ctx.beginPath()
    ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2)
    ctx.fillStyle = "white"
    ctx.fill()

    // Add largest percentage in the middle
    const largestItem = [...data].sort((a, b) => b.value - a.value)[0]
    if (largestItem) {
      const percentage = ((largestItem.value / total) * 100).toFixed(1)

      ctx.font = "bold 20px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillStyle = "#333"
      ctx.fillText(`${percentage}%`, centerX, centerY)
    }
  }, [data])

  return (
    <div className="w-full h-64">
      <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }} />
      <div className="flex flex-wrap justify-center mt-4 gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: item.color }} />
            <span className="text-sm">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
