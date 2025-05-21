import Image from "next/image"

export function SentimentDisplay({
  positive,
  negative,
}: {
  positive: number
  negative: number
}) {
  return (
    <div className="flex justify-around w-full">
      <div className="text-center">
        <div className="text-4xl font-bold text-green-500">{positive.toFixed(1)}%</div>
        <div className="flex items-center justify-center mt-2 text-green-500">
          <Image 
            src="/positive-emoji.png" 
            alt="Positive" 
            width={24} 
            height={24} 
            className="mr-1" 
          />
          <span className="font-outfit font-normal text-[14px] leading-none">Positive</span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-4xl font-bold text-red-500">{negative.toFixed(1)}%</div>
        <div className="flex items-center justify-center mt-2 text-red-500">
          <Image 
            src="/nagetive-emoji.png" 
            alt="Negative" 
            width={24} 
            height={24} 
            className="mr-1" 
          />
          <span className="font-outfit font-normal text-[14px] leading-none">Negative</span>
        </div>
      </div>
    </div>
  )
}
