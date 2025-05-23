import Image from "next/image"

export function SentimentDisplay({
  positive,
  negative,
}: {
  positive: number
  negative: number
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-around w-full md:gap-2 lg:gap-4 sm:gap-0">
      <div className="text-center">
        <div className="text-2xl sm:text-3xl md:text-2xl lg:text-4xl font-bold text-green-500">{positive.toFixed(1)}%</div>
        <div className="flex items-center justify-center mt-2 text-green-500">
          <Image 
            src="/positive-emoji.png" 
            alt="Positive" 
            width={20} 
            height={20}
            className="mr-1 sm:w-[24px] sm:h-[24px]" 
          />
          <span className="font-outfit font-normal text-xs sm:text-[14px] leading-none">Positive</span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-2xl sm:text-3xl md:text-2xl lg:text-4xl font-bold text-red-500">{negative.toFixed(1)}%</div>
        <div className="flex items-center justify-center mt-2 text-red-500">
          <Image 
            src="/nagetive-emoji.png" 
            alt="Negative" 
            width={20}
            height={20}
            className="mr-1 sm:w-[24px] sm:h-[24px]" 
          />
          <span className="font-outfit font-normal text-xs sm:text-[14px] leading-none">Negative</span>
        </div>
      </div>
    </div>
  )
}
