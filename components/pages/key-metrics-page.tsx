"use client"

import { MetricCard } from "@/components/ui/metric-card"
import { ChartCard } from "@/components/ui/chart-card"
import { LineChart } from "@/components/charts/line-chart"
import { SentimentChart } from "@/components/charts/sentiment-chart"
import { SentimentDisplay } from "@/components/ui/sentiment-display"
import { DataDetailDialog } from "@/components/ui/data-detail-dialog"
import { ArticlesDialog } from "@/components/ui/articles-dialog"
import { useHistogramData, useArticlesForDate } from "@/app/hooks/use-api-data"
import { useEffect, useState } from "react"
import { HistogramDataPoint } from "@/app/api/services"
import { useTimeRange, useSentimentFilter, useHashtag } from "@/components/layout/dashboard-layout"

// Define types for chart data
interface ChartDataPoint {
  date: string
  value: number
  // Add all original data for dialog
  originalData?: HistogramDataPoint
}

// Define type for metrics
interface Metrics {
  totalResults: string
  totalEngagement: string
  positiveSentiment: number
  negativeSentiment: number
  potentialReach: string
}

export function KeyMetricsPage() {
  // Get the active time range from context
  const { activeTimeRange } = useTimeRange()
  const { activeSentimentFilter } = useSentimentFilter()
  const { activeHashtag } = useHashtag()
  
  // Fetch histogram data based on active time range
  const { data: apiHistogramData, isLoading, error } = useHistogramData(activeTimeRange)
  
  const [resultsOverTimeData, setResultsOverTimeData] = useState<ChartDataPoint[]>([])
  const [sentimentOverTimeData, setSentimentOverTimeData] = useState<ChartDataPoint[]>([])
  const [metrics, setMetrics] = useState<Metrics>({
    totalResults: "0",
    totalEngagement: "0",
    positiveSentiment: 0,
    negativeSentiment: 0,
    potentialReach: "0"
  })

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedData, setSelectedData] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [dialogTitle, setDialogTitle] = useState<string>("")

  // Articles dialog state
  const [articlesDialogOpen, setArticlesDialogOpen] = useState(false)
  const [selectedArticleDate, setSelectedArticleDate] = useState<string>("")
  const [articlesFetchEnabled, setArticlesFetchEnabled] = useState(false)

  // Fetch articles for the selected date
  const { 
    data: articlesResponse, 
    isLoading: articlesLoading, 
    error: articlesError 
  } = useArticlesForDate(
    selectedArticleDate,
    activeHashtag,
    activeSentimentFilter,
    articlesFetchEnabled
  )

  useEffect(() => {
    if (apiHistogramData && Array.isArray(apiHistogramData)) {
      // Transform API data for results over time chart
      const resultData: ChartDataPoint[] = apiHistogramData.map(point => ({
        date: new Date(point.pubdate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        value: point.volume,
        originalData: point
      }))
      
      const sentimentData: ChartDataPoint[] = apiHistogramData.map(point => ({
        date: new Date(point.pubdate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        value: point.sentiment * 100, 
        originalData: point
      }))
      
      const totalResults = apiHistogramData.reduce((sum, point) => sum + point.volume, 0)
      const totalEngagement = apiHistogramData.reduce((sum, point) => sum + (point.volume * 5), 0) // Example calculation
      
      const totalPositive = apiHistogramData.reduce((sum, point) => sum + point.volume_pos, 0)
      const totalNegative = apiHistogramData.reduce((sum, point) => sum + point.volume_neg, 0)
      const totalVolume = apiHistogramData.reduce((sum, point) => sum + point.volume, 0)
      
      const positiveSentiment = totalVolume > 0 ? (totalPositive / totalVolume * 100) : 0
      const negativeSentiment = totalVolume > 0 ? (totalNegative / totalVolume * 100) : 0
      
      const formatNumber = (num: number): string => {
        if (num >= 1000000) {
          return (num / 1000000).toFixed(1) + 'M'
        } else if (num >= 1000) {
          return (num / 1000).toFixed(1) + 'K'
        }
        return num.toString()
      }
      
      setResultsOverTimeData(resultData)
      setSentimentOverTimeData(sentimentData)
      setMetrics({
        totalResults: formatNumber(totalResults),
        totalEngagement: formatNumber(totalEngagement),
        positiveSentiment,
        negativeSentiment,
        potentialReach: formatNumber(totalEngagement * 3) 
      })
    }
  }, [apiHistogramData])

  const handleResultsChartClick = (data: any, date: string) => {
    
    const actualDate = data.originalData.pubdate.split('T')[0] 
    
    setSelectedArticleDate(actualDate)
    setArticlesFetchEnabled(true)
    setArticlesDialogOpen(true)
  }

  const handleSentimentChartClick = (data: any, date: string) => {
    
    const actualDate = data.originalData.pubdate.split('T')[0] 
    
    setSelectedArticleDate(actualDate)
    setArticlesFetchEnabled(true)
    setArticlesDialogOpen(true)
  }

  const handleCloseArticlesDialog = () => {
    setArticlesDialogOpen(false)
    setArticlesFetchEnabled(false)
    setSelectedArticleDate("")
  }

  const resultsTooltipFormatter = (value: any, name: string): [string, string] => {
    return [value.toLocaleString(), 'Results']
  }

  const getChartTitle = (baseTitle: string) => {
    if (activeSentimentFilter === 'all') return baseTitle;
    return `${baseTitle} (${activeSentimentFilter.charAt(0).toUpperCase() + activeSentimentFilter.slice(1)} Only)`;
  };

  if (isLoading) {
    return <div className="p-6">Loading key metrics...</div>
  }

  if (error) {
    return <div className="p-6 text-red-500">Error loading key metrics data</div>
  }

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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
        <div className="flex flex-col gap-4 justify-between">
          <MetricCard title="Result" value={metrics.totalResults}  />
        <MetricCard title="Engagement" value={metrics.totalEngagement} />

        </div>

        <ChartCard title={getChartTitle("Result Over Time")} className="md:col-span-2">
          <LineChart 
            data={resultsOverTimeData} 
            color="#e91e63" 
            fillColor="rgba(233, 30, 99, 0.1)" 
            height={300} 
            yAxisDomain={[0, 'auto']}
            onPointClick={handleResultsChartClick}
            tooltipFormatter={resultsTooltipFormatter}
          />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="flex flex-col gap-4 justify-between">
          <MetricCard title="Potential Reach" value={metrics.potentialReach} className="md:col-span-2" />
          <MetricCard title="Sentiment" value={<SentimentDisplay positive={metrics.positiveSentiment} negative={metrics.negativeSentiment} />} />
        </div>
        <ChartCard title={getChartTitle("Net Sentiment Over Time")} className="md:col-span-2">
          <SentimentChart 
            data={sentimentOverTimeData} 
            height={300}
            onPointClick={handleSentimentChartClick}
          />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
      </div>

      <DataDetailDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={dialogTitle}
        data={selectedData || {}}
        date={selectedDate}
      />

      <ArticlesDialog
        isOpen={articlesDialogOpen}
        onClose={handleCloseArticlesDialog}
        articles={articlesResponse?.result || []}
        isLoading={articlesLoading}
        error={articlesError}
        date={new Date(selectedArticleDate).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
        hashtag={activeHashtag}
        totalCount={articlesResponse?.total_count || 0}
      />
    </div>
  )
}
