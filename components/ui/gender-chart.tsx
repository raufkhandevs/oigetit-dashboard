"use client"

import { useEffect, useRef } from "react"

export function GenderChart({
  female = 42.3,
  male = 57.7,
}: {
  female?: number
  male?: number
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

    // Draw female arc
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2 * (female / 100), false)
    ctx.strokeStyle = "#9575cd"
    ctx.lineWidth = radius * 0.3
    ctx.stroke()

    // Draw male arc
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, Math.PI * 2 * (female / 100), Math.PI * 2, false)
    ctx.strokeStyle = "#4fc3f7"
    ctx.lineWidth = radius * 0.3
    ctx.stroke()

    // Draw female icon
    const femaleIcon = new Path2D()
    const iconSize = radius * 0.3
    const femaleX = centerX - iconSize * 0.5
    const femaleY = centerY + radius * 0.2

    // Circle
    femaleIcon.arc(femaleX, femaleY - iconSize * 0.6, iconSize * 0.4, 0, Math.PI * 2)
    // Vertical line
    femaleIcon.moveTo(femaleX, femaleY - iconSize * 0.2)
    femaleIcon.lineTo(femaleX, femaleY + iconSize * 0.4)
    // Cross bottom
    femaleIcon.moveTo(femaleX - iconSize * 0.4, femaleY)
    femaleIcon.lineTo(femaleX + iconSize * 0.4, femaleY)

    ctx.fillStyle = "#9575cd"
    ctx.fill(femaleIcon)
    ctx.strokeStyle = "#9575cd"
    ctx.lineWidth = 2
    ctx.stroke(femaleIcon)

    // Draw male icon
    const maleIcon = new Path2D()
    const maleX = centerX + iconSize * 1.5
    const maleY = centerY - radius * 0.2

    // Circle
    maleIcon.arc(maleX, maleY + iconSize * 0.6, iconSize * 0.4, 0, Math.PI * 2)
    // Arrow
    maleIcon.moveTo(maleX, maleY - iconSize * 0.4)
    maleIcon.lineTo(maleX + iconSize * 0.4, maleY)
    maleIcon.lineTo(maleX, maleY + iconSize * 0.4)
    maleIcon.moveTo(maleX, maleY - iconSize * 0.4)
    maleIcon.lineTo(maleX - iconSize * 0.4, maleY)

    ctx.fillStyle = "#4fc3f7"
    ctx.fill(maleIcon)
    ctx.strokeStyle = "#4fc3f7"
    ctx.lineWidth = 2
    ctx.stroke(maleIcon)

    // Add percentages
    ctx.font = "bold 16px Arial"
    ctx.textAlign = "center"
    ctx.fillStyle = "#9575cd"
    ctx.fillText(`${female}%`, femaleX - iconSize, femaleY - iconSize * 1.5)
    ctx.fillStyle = "#4fc3f7"
    ctx.fillText(`${male}%`, maleX + iconSize, maleY + iconSize * 1.5)

    // Add labels
    ctx.font = "12px Arial"
    ctx.fillStyle = "#666"
    ctx.fillText("Female", femaleX - iconSize, femaleY + iconSize * 1.2)
    ctx.fillText("Male", maleX + iconSize, maleY - iconSize * 0.8)
  }, [female, male])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }} />
    </div>
  )
}
