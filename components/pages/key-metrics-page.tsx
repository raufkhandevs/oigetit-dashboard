"use client"

import { MetricCard } from "@/components/ui/metric-card"
import { ChartCard } from "@/components/ui/chart-card"
import { LineChart } from "@/components/charts/line-chart"
import { SentimentChart } from "@/components/charts/sentiment-chart"
import { SentimentDisplay } from "@/components/ui/sentiment-display"
import { useHistogramData } from "@/app/hooks/use-api-data"
import { useEffect, useState } from "react"
import { HistogramDataPoint } from "@/app/api/services"
import { useTimeRange } from "@/components/layout/dashboard-layout"

// Define types for chart data
interface ChartDataPoint {
  date: string
  value: number
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

  useEffect(() => {
    if (apiHistogramData && Array.isArray(apiHistogramData)) {
      // Transform API data for results over time chart
      const resultData: ChartDataPoint[] = apiHistogramData.map(point => ({
        date: new Date(point.pubdate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        value: point.volume
      }))
      
      // Transform API data for sentiment over time chart
      const sentimentData: ChartDataPoint[] = apiHistogramData.map(point => ({
        date: new Date(point.pubdate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        value: point.sentiment * 100 // Convert to percentage
      }))
      
      // Calculate aggregate metrics
      const totalResults = apiHistogramData.reduce((sum, point) => sum + point.volume, 0)
      const totalEngagement = apiHistogramData.reduce((sum, point) => sum + (point.volume * 5), 0) // Example calculation
      
      // Calculate sentiment percentages
      const totalPositive = apiHistogramData.reduce((sum, point) => sum + point.volume_pos, 0)
      const totalNegative = apiHistogramData.reduce((sum, point) => sum + point.volume_neg, 0)
      const totalVolume = apiHistogramData.reduce((sum, point) => sum + point.volume, 0)
      
      const positiveSentiment = totalVolume > 0 ? (totalPositive / totalVolume * 100) : 0
      const negativeSentiment = totalVolume > 0 ? (totalNegative / totalVolume * 100) : 0
      
      // Format numbers
      const formatNumber = (num: number): string => {
        if (num >= 1000000) {
          return (num / 1000000).toFixed(1) + 'M'
        } else if (num >= 1000) {
          return (num / 1000).toFixed(1) + 'K'
        }
        return num.toString()
      }
      
      // Update state
      setResultsOverTimeData(resultData)
      setSentimentOverTimeData(sentimentData)
      setMetrics({
        totalResults: formatNumber(totalResults),
        totalEngagement: formatNumber(totalEngagement),
        positiveSentiment,
        negativeSentiment,
        potentialReach: formatNumber(totalEngagement * 3) // Example calculation
      })
    }
  }, [apiHistogramData])

  if (isLoading) {
    return <div className="p-6">Loading key metrics...</div>
  }

  if (error) {
    return <div className="p-6 text-red-500">Error loading key metrics data</div>
  }

  return (
    <div className="space-y-4 p-6 bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
        <div className="flex flex-col gap-4 justify-between">
          <MetricCard title="Result" value={metrics.totalResults}  />
        <MetricCard title="Engagement" value={metrics.totalEngagement} />

        </div>

        <ChartCard title="Result Over Time" className="md:col-span-2">
          <LineChart 
            data={resultsOverTimeData} 
            color="#e91e63" 
            fillColor="rgba(233, 30, 99, 0.1)" 
            height={300} 
            yAxisDomain={[0, 'auto']} 
          />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="flex flex-col gap-4 justify-between">
          <MetricCard title="Potential Reach" value={metrics.potentialReach} className="md:col-span-2" />
          <MetricCard title="Sentiment" value={<SentimentDisplay positive={metrics.positiveSentiment} negative={metrics.negativeSentiment} />} />
        </div>
        <ChartCard title="Net Sentiment Over Time" className="md:col-span-2">
          <SentimentChart data={sentimentOverTimeData} height={300} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
      </div>
    </div>
  )
}
