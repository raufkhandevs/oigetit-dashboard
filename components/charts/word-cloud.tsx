"use client"

interface Tag {
  text: string
  value: number
  color: string
}

export function WordCloud({
  tags,
  height = 400,
}: {
  tags: Tag[]
  width?: number
  height?: number
}) {
  // Sort tags by value (largest first)
  const sortedTags = [...tags].sort((a, b) => b.value - a.value)

  // Calculate font sizes
  const maxValue = sortedTags[0].value
  const minValue = sortedTags[sortedTags.length - 1].value
  const fontSizeScale = (value: number) => {
    return ((value - minValue) / (maxValue - minValue)) * 36 + 14 // Scale from 14px to 50px
  }

  return (
    <div className="w-full h-full flex items-center justify-center" style={{ height }}>
      <div className="relative w-full h-full flex flex-wrap justify-center items-center p-4">
        {sortedTags.map((tag, index) => (
          <div
            key={index}
            className="m-2 inline-block"
            style={{
              fontSize: `${fontSizeScale(tag.value)}px`,
              fontWeight: "bold",
              color: tag.color,
              transform: `rotate(${Math.random() * 20 - 10}deg)`,
              zIndex: Math.floor(tag.value),
            }}
          >
            {tag.text}
          </div>
        ))}
      </div>
    </div>
  )
}
