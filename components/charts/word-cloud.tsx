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
  if (!tags || tags.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500" style={{ height }}>
        No tags available
      </div>
    );
  }

  const sortedTags = [...tags].sort((a, b) => b.value - a.value)

  const maxValue = Math.max(...sortedTags.map(tag => tag.value))
  const minValue = Math.min(...sortedTags.map(tag => tag.value))

  const getFontSizeClass = (value: number) => {
    const normalizedValue = (value - minValue) / (maxValue - minValue)
    
    if (normalizedValue > 0.8) return "text-xl sm:text-3xl lg:text-5xl"
    if (normalizedValue > 0.6) return "text-lg sm:text-2xl lg:text-4xl"
    if (normalizedValue > 0.4) return "text-base sm:text-xl lg:text-3xl"
    if (normalizedValue > 0.2) return "text-sm sm:text-lg lg:text-2xl"
    return "text-xs sm:text-base lg:text-xl"
  }

  const getRotationClass = () => {
    return "rotate-0"
  }

  const getSpacingClass = (value: number) => {
    const normalizedValue = (value - minValue) / (maxValue - minValue)
    if (normalizedValue > 0.6) return "m-2 sm:m-3 lg:m-4"
    if (normalizedValue > 0.3) return "m-1 sm:m-2 lg:m-3"
    return "m-1 sm:m-1.5 lg:m-2"
  }

  return (
    <div className="w-full h-full overflow-hidden" style={{ height }}>
      <div className="relative w-full h-full flex flex-wrap justify-center items-center content-center p-2 sm:p-4 lg:p-6">
        {sortedTags.map((tag, index) => {
          const fontSizeClass = getFontSizeClass(tag.value)
          const rotationClass = getRotationClass()
          const spacingClass = getSpacingClass(tag.value)
          
          return (
            <div
              key={index}
              className={`inline-block font-semibold cursor-pointer transition-all duration-200 hover:scale-110 ${fontSizeClass} ${rotationClass} ${spacingClass}`}
              style={{
                color: tag.color,
                zIndex: Math.floor(tag.value / 10),
                lineHeight: "1.2",
                textShadow: "0 1px 2px rgba(0,0,0,0.1)"
              }}
            >
              {tag.text}
            </div>
          )
        })}
      </div>
    </div>
  )
}
