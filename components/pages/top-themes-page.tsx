"use client"

import { ChartCard } from "@/components/ui/chart-card"
import { WordCloud } from "@/components/charts/word-cloud"
import { CompareSection } from "@/components/ui/compare-section"

export function TopThemesPage() {
  const tags = [
    { text: "#dance", value: 100, color: "#e91e63" },
    { text: "#photography", value: 80, color: "#3f51b5" },
    { text: "#travel", value: 70, color: "#2196f3" },
    { text: "#hot", value: 65, color: "#03a9f4" },
    { text: "#frocks", value: 60, color: "#00bcd4" },
    { text: "#fashion", value: 55, color: "#009688" },
    { text: "#design", value: 50, color: "#4caf50" },
    { text: "#USA", value: 45, color: "#8bc34a" },
    { text: "#makeup", value: 40, color: "#cddc39" },
    { text: "#model", value: 35, color: "#ffc107" },
    { text: "#girl", value: 30, color: "#ff9800" },
    { text: "#beautiful", value: 25, color: "#ff5722" },
    { text: "#brunette", value: 20, color: "#795548" },
    { text: "#shorthair", value: 15, color: "#9c27b0" },
    { text: "#short", value: 10, color: "#673ab7" },
  ]

  return (
    <div className="space-y-4">
      <ChartCard title="Top Hashtags">
        <div className="h-[400px] w-full">
          <WordCloud tags={tags} height={400} />
        </div>
      </ChartCard>
    </div>
  )
}
