"use client"

import { useEffect, useRef } from "react"

export function LineChart({
  color = "#e91e63",
  fillColor = "rgba(233, 30, 99, 0.1)",
  height = 200,
}: {
  color?: string
  fillColor?: string
  height?: number
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

    // Draw grid lines
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1

    // Horizontal grid lines
    const gridStep = canvas.offsetHeight / 5
    for (let i = 1; i < 5; i++) {
      const y = i * gridStep
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.offsetWidth, y)
      ctx.stroke()
    }

    // Generate random data points
    const points = []
    const steps = 50
    const stepSize = canvas.offsetWidth / steps

    for (let i = 0; i <= steps; i++) {
      const x = i * stepSize
      const y = (Math.random() * 0.5 + 0.25) * canvas.offsetHeight
      points.push({ x, y })
    }

    // Draw the line
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y)
    }

    ctx.stroke()

    // Fill area under the line
    ctx.fillStyle = fillColor
    ctx.beginPath()
    ctx.moveTo(points[0].x, canvas.offsetHeight)
    ctx.lineTo(points[0].x, points[0].y)

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y)
    }

    ctx.lineTo(points[points.length - 1].x, canvas.offsetHeight)
    ctx.closePath()
    ctx.fill()
  }, [color, fillColor])

  return (
    <div className="w-full" style={{ height }}>
      <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }} />
    </div>
  )
}
