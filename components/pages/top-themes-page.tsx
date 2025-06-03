"use client"

import { ChartCard } from "@/components/ui/chart-card"
import { WordCloud } from "@/components/charts/word-cloud"
import { useSentimentFilter } from "@/components/layout/dashboard-layout"

export function TopThemesPage() {
  const { activeSentimentFilter } = useSentimentFilter()

  const getChartTitle = (baseTitle: string) => {
    if (activeSentimentFilter === 'all') return baseTitle;
    return `${baseTitle} (${activeSentimentFilter.charAt(0).toUpperCase() + activeSentimentFilter.slice(1)} Only)`;
  };

  const tags = [
    { text: "#dance", value: 100, color: "#000000" },
    { text: "#photography", value: 80, color: "#3f51b5" },
    { text: "#travel", value: 70, color: "#2196f3" },
    { text: "#frocks", value: 60, color: "#00bcd4" },
    { text: "#fashion", value: 55, color: "#3f51b5" },
    { text: "#design", value: 50, color: "#81d4fa" },
    { text: "#Usa", value: 45, color: "#81d4fa" },
    { text: "#makeup", value: 40, color: "#81d4fa" },
    { text: "#model", value: 35, color: "#000000" },
    { text: "#girl", value: 30, color: "#e0f7fa" },
    { text: "#beautiful", value: 20, color: "#81d4fa" },
    { text: "#brunette", value: 25, color: "#81d4fa" },
    { text: "#hot", value: 18, color: "#03a9f4" },
    { text: "#shorthair", value: 15, color: "#e0f7fa" },
    { text: "#short", value: 10, color: "#e0f7fa" },
    { text: "#photography", value: 8, color: "#3f51b5" },
    { text: "#travel", value: 7, color: "#2196f3" },
    { text: "#design", value: 6, color: "#81d4fa" },
    { text: "#fashion", value: 5, color: "#3f51b5" },
    { text: "#makeup", value: 4, color: "#81d4fa" },
    { text: "#model", value: 3, color: "#000000" },
    { text: "#girl", value: 2, color: "#e0f7fa" },
    { text: "#beautiful", value: 2, color: "#81d4fa" },
    { text: "#brunette", value: 2, color: "#81d4fa" },
    { text: "#shorthair", value: 1, color: "#e0f7fa" },
    { text: "#short", value: 1, color: "#e0f7fa" },
    { text: "#life", value: 0.9, color: "#e0f7fa" },
    { text: "#style", value: 0.9, color: "#e0f7fa" },
    { text: "#nature", value: 0.8, color: "#e0f7fa" },
    { text: "#art", value: 0.8, color: "#e0f7fa" },
    { text: "#food", value: 0.7, color: "#e0f7fa" },
    { text: "#fitness", value: 0.7, color: "#e0f7fa" },
    { text: "#music", value: 0.6, color: "#e0f7fa" },
    { text: "#beach", value: 0.6, color: "#e0f7fa" },
    { text: "#city", value: 0.5, color: "#e0f7fa" },
    { text: "#sunset", value: 0.5, color: "#e0f7fa" },
  ]

  return (
    <div className="space-y-4 p-6 bg-gray-100">
      {activeSentimentFilter !== 'all' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Sentiment Filter Active:</span>{' '}
                Showing only{' '}
                <span className="font-semibold capitalize">{activeSentimentFilter}</span>{' '}
                sentiment data
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <ChartCard title={getChartTitle("Top Hashtags")} className="relative">
          <div className="h-[400px] sm:h-[500px] lg:h-[300px] w-full p-4">
            <WordCloud tags={tags} height={200} />
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
