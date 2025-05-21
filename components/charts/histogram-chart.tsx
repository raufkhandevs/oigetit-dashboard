'use client';

import { useHistogramData } from "@/app/hooks/use-api-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { HistogramDataPoint } from "@/app/api/services";
import { useTimeRange } from "@/components/layout/dashboard-layout";

// Define chart data type
interface ProcessedChartDataPoint {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
  total: number;
  sentiment: number;
}

export function HistogramChart() {
  const { activeTimeRange } = useTimeRange();
  
  const { 
    data: apiHistogramData, 
    isLoading, 
    error
  } = useHistogramData(activeTimeRange);

  const [chartData, setChartData] = useState<HistogramDataPoint[]>([]);
  const [viewType, setViewType] = useState<"volume" | "sentiment">("volume");

  // Custom fill function for the sentiment bar
  const getSentimentColor = (entry: ProcessedChartDataPoint) => {
    return entry.sentiment >= 0 ? "#4CAF50" : "#F44336";
  };

  // Process the histogram data
  useEffect(() => {
    if (apiHistogramData) {
      let processedData: HistogramDataPoint[] = [];
      
      if (Array.isArray(apiHistogramData)) {
        processedData = apiHistogramData;
      } else if (typeof apiHistogramData === 'object') {
        // Check if the API returns data within a nested property
        const possibleArrays = Object.values(apiHistogramData).filter(Array.isArray);
        if (possibleArrays.length > 0) {
          processedData = possibleArrays[0];
        } else {
          console.error('Unexpected API response structure:', apiHistogramData);
        }
      }
      
      setChartData(processedData);
    }
  }, [apiHistogramData]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading data</div>;
  }

  // No data available
  if (!chartData || chartData.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Media Volume Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">No histogram data available</div>
        </CardContent>
      </Card>
    );
  }

  // Process data for the chart
  const processDataForChart = (data: HistogramDataPoint[]): ProcessedChartDataPoint[] => {
    return data.map((item) => ({
      date: new Date(item.pubdate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      positive: item.volume_pos,
      negative: item.volume_neg,
      neutral: item.volume_neu,
      total: item.volume,
      sentiment: item.sentiment * 100, // Convert to percentage
    }));
  };

  const processedChartData = processDataForChart(chartData);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Media {viewType === "volume" ? "Volume" : "Sentiment"} Over Time</CardTitle>
        <div className="text-sm text-gray-500">{activeTimeRange} view</div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="volume" onValueChange={(value) => setViewType(value as "volume" | "sentiment")}>
          <TabsList>
            <TabsTrigger value="volume">Volume</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          </TabsList>

          <TabsContent value="volume" className="pt-4">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={processedChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  angle={-45}
                  textAnchor="end"
                  tick={{ fontSize: 10 }}
                  height={60}
                  interval={Math.floor(processedChartData.length / 12)}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="positive" name="Positive" fill="#4CAF50" />
                <Bar dataKey="negative" name="Negative" fill="#F44336" />
                <Bar dataKey="neutral" name="Neutral" fill="#2196F3" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="sentiment" className="pt-4">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={processedChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  angle={-45} 
                  textAnchor="end" 
                  tick={{ fontSize: 10 }}
                  height={60}
                />
                <YAxis domain={[-100, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Sentiment']} />
                <Bar dataKey="sentiment" name="Sentiment" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 