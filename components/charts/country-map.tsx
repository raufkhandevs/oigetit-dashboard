'use client';

import { useCountryBreakdown } from "@/app/hooks/use-api-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useEffect, useState } from "react";
import { CountryDataPoint } from "@/app/api/services";

// Array of colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

export function CountryMap() {
  const { data: apiResponse, isLoading, error } = useCountryBreakdown();
  const [countryData, setCountryData] = useState<CountryDataPoint[]>([]);

  useEffect(() => {
    if (apiResponse) {
      let processedData: CountryDataPoint[] = [];
      
      if (Array.isArray(apiResponse)) {
        processedData = apiResponse;
      } else if (typeof apiResponse === 'object') {
        // Check if the API returns data within a nested property
        const possibleArrays = Object.values(apiResponse).filter(Array.isArray);
        if (possibleArrays.length > 0) {
          processedData = possibleArrays[0];
        } else {
          console.error('Unexpected API response structure:', apiResponse);
        }
      }
      
      setCountryData(processedData);
    }
  }, [apiResponse]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading country data</div>;
  }

  if (countryData.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Country Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">No country data available</div>
        </CardContent>
      </Card>
    );
  }

  // Process the data for the pie chart
  const processedData = countryData
    .sort((a, b) => b.count - a.count) // Sort by count in descending order
    .slice(0, 10) // Get top 10 countries
    .map((item, index) => ({
      name: item.country,
      value: item.count,
      color: COLORS[index % COLORS.length]
    }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Country Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={processedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {processedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}`, 'Count']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {processedData.map((entry, index) => (
            <div key={index} className="flex items-center gap-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-xs">{entry.name}: {entry.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 