import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import type { ChartDataPoint } from "@/app/types/dashboard"

interface GenderChartProps {
  data: ChartDataPoint[]
}

export function GenderChart({ data }: GenderChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  const female = data?.find(d => d.name.toLowerCase() === "female") || { value: 0, color: "#8B7AE5" }
  const male = data?.find(d => d.name.toLowerCase() === "male") || { value: 0, color: "#5AC8E6" }

  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 w-full">
        {/* Female */}
        <div className="flex flex-col items-center text-center">
          <svg 
            className="w-12 h-16 sm:w-16 sm:h-20 lg:w-20 lg:h-24 mb-2" 
            viewBox="0 0 72 99" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <circle cx="36" cy="36" r="31" stroke="#606060" strokeOpacity="0.25" strokeWidth="10"/>
              <path d="M67 36C67 40.071 66.1982 44.1021 64.6403 47.8632C63.0824 51.6243 60.7989 55.0417 57.9203 57.9203C55.0417 60.7989 51.6243 63.0824 47.8632 64.6403C44.1021 66.1982 40.071 67 36 67C31.929 67 27.8979 66.1982 24.1368 64.6403C20.3757 63.0824 16.9583 60.7989 14.0797 57.9203C11.2011 55.0417 8.91763 51.6243 7.35973 47.8632C5.80184 44.1021 5 40.071 5 36" stroke="#8B7AE5" strokeWidth="10"/>
              <line x1="36" y1="67" x2="36" y2="99" stroke="#8B7AE5" strokeWidth="10"/>
              <line x1="52" y1="85" x2="20" y2="85" stroke="#8B7AE5" strokeWidth="10"/>
            </g>
          </svg>
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#8B7AE5] leading-none">
            {female.value}%
          </div>
          <div className="text-sm sm:text-base text-[#8B7AE5] mt-1 font-medium">
            Female
          </div>
        </div>

        {/* Male */}
        <div className="flex flex-col items-center text-center">
          <svg 
            className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mb-2" 
            viewBox="0 0 123 141" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="49.18" cy="91.4637" r="31" transform="rotate(-150 49.18 91.4637)" stroke="#606060" strokeOpacity="0.25" strokeWidth="10"/>
            <path d="M21.8333 76.8298C17.855 83.7203 16.8682 91.9617 19.0899 99.7408C21.3116 107.52 26.5599 114.2 33.6801 118.311C40.8003 122.421 49.2092 123.627 57.057 121.661C64.9048 119.696 71.5486 114.72 75.5269 107.83" stroke="#5AC8E6" strokeWidth="10"/>
            <path d="M97.9153 18.5441C97.4543 16.3836 95.3291 15.0059 93.1686 15.467L57.9614 22.9802C55.8009 23.4413 54.4232 25.5665 54.8842 27.727C55.3453 29.8875 57.4705 31.2651 59.631 30.8041L90.9263 24.1256L97.6048 55.421C98.0658 57.5815 100.191 58.9591 102.351 58.4981C104.512 58.037 105.89 55.9118 105.429 53.7514L97.9153 18.5441ZM64.6772 64.6172L68.0337 66.793L97.3599 21.5548L94.0034 19.3789L90.647 17.2031L61.3208 62.4413L64.6772 64.6172Z" fill="#5AC8E6"/>
          </svg>
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#5AC8E6] leading-none">
            {male.value}%
          </div>
          <div className="text-sm sm:text-base text-[#5AC8E6] mt-1 font-medium">
            Male
          </div>
        </div>
      </div>
    </div>
  )
}
