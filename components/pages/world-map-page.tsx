"use client"

import { ChartCard } from "@/components/ui/chart-card"
import { PieChart } from "@/components/charts/pie-chart"
import { useTimeRange } from "@/components/layout/dashboard-layout"
import { useCountryBreakdown } from "@/app/hooks/use-api-data"
import { useState, useEffect } from "react"
import { 
  ComposableMap, 
  Geographies, 
  Geography,
  ZoomableGroup
} from "react-simple-maps"
import geoUrl from "@/public/world-countries.json"

const countryCodeMapping: Record<string, string> = {
  "US": "United States of America",
  "GB": "United Kingdom",
  "AE": "United Arab Emirates",
  "CA": "Canada",
  "DE": "Germany",
  "FR": "France",
  "CN": "China",
  "AU": "Australia",
  "TH": "Thailand",
  "TR": "Turkey",
  "IN": "India",
  "BR": "Brazil",
  "ZA": "South Africa",
  "RU": "Russian Federation",
  "JP": "Japan",
  "IT": "Italy",
  "ES": "Spain",
  "MX": "Mexico",
  "UA": "Ukraine",
  "IL": "Israel",
  "IR": "Iran",
  "SA": "Saudi Arabia",
  "PS": "Palestine",
  "VE": "Venezuela",
  "SV": "El Salvador",
  "GL": "Greenland",
  "QA": "Qatar",
  "PA": "Panama",
  "YE": "Yemen",
  "TW": "Taiwan"
}

const colorScheme = {
  noResult: "#e0e0e0",  
  veryLow: "#b3e0f2",   
  low: "#81d4fa",      
  medium: "#4fc3f7",    
  high: "#0288d1",      
  veryHigh: "#01579b",  
  other: "#e0e0e0"  
}

const colorSchemeArray = [
  colorScheme.veryHigh,
  colorScheme.high,
  colorScheme.medium,
  colorScheme.low,
  colorScheme.veryLow
]

interface CountryData {
  name: string
  value: number
  color: string
  percentage: number
}

interface ApiCountryData {
  country: string
  volume: number
  political_bias: number
  sentiment: number
}

interface GeoFeature {
  rsmKey: string;
  properties: {
    name: string;
    [key: string]: any;
  };
  geometry: any;
  id: string;
}

export function WorldMapPage() {
  const { activeTimeRange } = useTimeRange()
  
  const { data: apiResponse, isLoading, error, refetch } = useCountryBreakdown(activeTimeRange)
  
  const [processedCountries, setProcessedCountries] = useState<CountryData[]>([])
  const [countryPercentages, setCountryPercentages] = useState<Record<string, number>>({})
  const [topCountries, setTopCountries] = useState<CountryData[]>([])
  
  useEffect(() => {
    refetch()
  }, [activeTimeRange, refetch])
  
  useEffect(() => {
    if (!apiResponse || !Array.isArray(apiResponse) || apiResponse.length === 0) {
      return;
    }
    
    const isValidCountryData = (data: any[]): data is ApiCountryData[] => {
      return data.every(item => 
        typeof item === 'object' && 
        item !== null && 
        'country' in item && 
        'volume' in item && 
        typeof item.volume === 'number'
      );
    };
    
    if (!isValidCountryData(apiResponse)) {
      console.error("Invalid country data format received from API");
      return;
    }
    
    const totalVolume = apiResponse.reduce((sum, country) => sum + country.volume, 0);
    
    const withPercentages = apiResponse.map((country) => {
      const percentage = totalVolume > 0 ? (country.volume / totalVolume) * 100 : 0;
      return {
        name: country.country,
        value: country.volume,
        percentage: parseFloat(percentage.toFixed(1))
      };
    });
    
    withPercentages.sort((a, b) => b.value - a.value);
    
    const formattedCountries: CountryData[] = withPercentages.map((country, index) => {
      let color = colorScheme.noResult;
      
      if (index < 5) {
        color = colorSchemeArray[index];
      } else {
        if (country.percentage >= 10) color = colorScheme.veryHigh;
        else if (country.percentage >= 2) color = colorScheme.high;
        else if (country.percentage >= 1) color = colorScheme.medium;
        else if (country.percentage >= 0.1) color = colorScheme.low;
        else color = colorScheme.veryLow;
      }
      
      return {
        ...country,
        color
      };
    });
    
    const top5 = formattedCountries.slice(0, 5);
    
    const otherCountries = formattedCountries.slice(5);
    const otherCount = otherCountries.reduce((sum, country) => sum + country.value, 0);
    const otherPercentage = totalVolume > 0 ? (otherCount / totalVolume) * 100 : 0;
    
    const topWithOther: CountryData[] = [...top5];
    
    if (otherCountries.length > 0) {
      topWithOther.push({
        name: "Other",
        value: otherCount,
        percentage: parseFloat(otherPercentage.toFixed(1)),
        color: colorScheme.other
      });
    }
    
    const percentageMap: Record<string, number> = {};
    formattedCountries.forEach(country => {
      percentageMap[country.name] = country.percentage;
      
      const mappedName = countryCodeMapping[country.name];
      if (mappedName) {
        percentageMap[mappedName] = country.percentage;
      }
    });
    
    setProcessedCountries(formattedCountries);
    setCountryPercentages(percentageMap);
    setTopCountries(topWithOther);
  }, [apiResponse]);
  
  const getCountryColor = (countryName: string): string => {
    const percentage = countryPercentages[countryName];
    
    for (let i = 0; i < processedCountries.length && i < 5; i++) {
      const country = processedCountries[i];
      const mappedName = countryCodeMapping[country.name];
      
      if (country.name === countryName || mappedName === countryName) {
        return colorSchemeArray[i];
      }
    }
    
    if (percentage === undefined) return colorScheme.noResult;
    if (percentage < 0.1) return colorScheme.veryLow;
    if (percentage < 1) return colorScheme.low;
    if (percentage < 2) return colorScheme.medium;
    if (percentage < 10) return colorScheme.high;
    return colorScheme.veryHigh;
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Loading world map data...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1">
          <ChartCard title="Share Of Countries/Region" className="relative h-[490px]">
            <div className="h-full lg:h-[300px]">
              {topCountries.length > 0 ? (
                <PieChart data={topCountries} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No country data available
                </div>
              )}
            </div>
          </ChartCard>
        </div>

        <div className="col-span-3">
          <ChartCard title="World Map" className="relative h-[490px]">
            <div className="relative bg-white rounded-md overflow-hidden h-full lg:h-[400px]">
              <ComposableMap projection="geoMercator" className="w-full h-full">
                <ZoomableGroup zoom={2.0} center={[0, 0]}>
                  <Geographies geography={geoUrl}>
                    {({ geographies }: { geographies: GeoFeature[] }) =>
                      geographies.map((geo: GeoFeature) => {
                        const countryName = geo.properties.name;
                        const color = getCountryColor(countryName);
                        
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={color}
                            stroke="#FFFFFF"
                            strokeWidth={0.5}
                            style={{
                              default: { outline: "none" },
                              hover: { outline: "none", fill: color, opacity: 0.8 },
                              pressed: { outline: "none" }
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>
                </ZoomableGroup>
              </ComposableMap>
              <div className="absolute bottom-2 left-2 text-xs text-gray-600">
                <div className="flex items-center mt-2 flex-wrap gap-2">
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: colorScheme.noResult }}></span>
                    <span>No Result</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: colorScheme.veryLow }}></span>
                    <span>0%-0.1%</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: colorScheme.low }}></span>
                    <span>0.1%-1%</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: colorScheme.medium }}></span>
                    <span>1%-2%</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: colorScheme.high }}></span>
                    <span>2%-10%</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: colorScheme.veryHigh }}></span>
                    <span>10%+</span>
                  </div>
                </div>
              </div>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
