"use client"

import { ChartCard } from "@/components/ui/chart-card"
import { PieChart } from "@/components/charts/pie-chart"
import { DataDetailDialog } from "@/components/ui/data-detail-dialog"
import { ArticlesDialog } from "@/components/ui/articles-dialog"
import { useTimeRange, useSentimentFilter, useHashtag, useDateRange } from "@/components/layout/dashboard-layout"
import { useCountryBreakdown, useArticlesForCountry } from "@/app/hooks/use-api-data"
import { getDateRange } from "@/app/api/services"
import { useState, useEffect } from "react"
import { 
  ComposableMap, 
  Geographies, 
  Geography,
  ZoomableGroup
} from "react-simple-maps"

const geoUrl = "/world-countries.json"

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

const sentimentColorScheme = {
  noResult: "#e0e0e0",    
  veryPositive: "#1B5E20",  
  positive: "#2E7D32",      
  slightlyPositive: "#43A047", 
  lightPositive: "#66BB6A",   
  veryLightPositive: "#A5D6A7", 
  veryNegative: "#B71C1C",   
  negative: "#C62828",         
  slightlyNegative: "#E53935",
  lightNegative: "#EF5350",    
  veryLightNegative: "#FFCDD2", 
  neutral: "#9E9E9E"         
}

const pieChartColors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

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

interface MapTooltipProps {
  show: boolean
  x: number
  y: number
  content: any
}

const MapTooltip = ({ show, x, y, content }: MapTooltipProps) => {
  if (!show || !content) return null

  return (
    <div 
      className="fixed bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[200px] z-50 pointer-events-none"
      style={{ 
        left: x + 10, 
        top: y - 10,
        transform: 'translateY(-100%)'
      }}
    >
      <div className="space-y-1">
        <p className="text-sm font-semibold text-gray-900">{content.countryName}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Volume:</span>
          <span className="text-sm font-medium text-gray-900">{content.volume?.toLocaleString() || 'N/A'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Sentiment:</span>
          <span className={`text-sm font-medium ${
            content.sentimentCategory === 'Positive' ? 'text-green-700' :
            content.sentimentCategory === 'Negative' ? 'text-red-700' : 'text-gray-700'
          }`}>
            {content.sentimentCategory || 'N/A'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Score:</span>
          <span className="text-sm font-medium text-gray-900">{content.sentimentScore || 'N/A'}</span>
        </div>
      </div>
    </div>
  )
}

export function WorldMapPage() {
  const { activeTimeRange } = useTimeRange()
  const { activeSentimentFilter } = useSentimentFilter()
  const { activeHashtag } = useHashtag()
  const { customDateRange } = useDateRange()
  
  const { data: apiResponse, isLoading, error, refetch } = useCountryBreakdown(activeTimeRange)
  
  const [processedCountries, setProcessedCountries] = useState<CountryData[]>([])
  const [countrySentiments, setCountrySentiments] = useState<Record<string, number>>({})
  const [topCountries, setTopCountries] = useState<CountryData[]>([])
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCountryData, setSelectedCountryData] = useState<any>(null)
  const [selectedCountryName, setSelectedCountryName] = useState<string>("")
  
  // Articles dialog state
  const [articlesDialogOpen, setArticlesDialogOpen] = useState(false)
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("")
  const [articlesFetchEnabled, setArticlesFetchEnabled] = useState(false)
  
  // Get date range for articles API
  const dateRange = customDateRange || getDateRange(activeTimeRange)
  
  // Fetch articles for the selected country
  const { 
    data: articlesResponse, 
    isLoading: articlesLoading, 
    error: articlesError 
  } = useArticlesForCountry(
    dateRange.startDate,
    dateRange.endDate,
    activeHashtag,
    selectedCountryCode,
    activeSentimentFilter,
    articlesFetchEnabled
  )
  
  const [tooltip, setTooltip] = useState<MapTooltipProps>({
    show: false,
    x: 0,
    y: 0,
    content: null
  })
  
  const [originalApiData, setOriginalApiData] = useState<ApiCountryData[]>([])
  
  // Dynamic chart titles based on sentiment filter
  const getChartTitle = (baseTitle: string) => {
    if (activeSentimentFilter === 'all') return baseTitle;
    return `${baseTitle} (${activeSentimentFilter.charAt(0).toUpperCase() + activeSentimentFilter.slice(1)} Only)`;
  };
  
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
    
    setOriginalApiData(apiResponse)
    
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
      const color = index < pieChartColors.length ? pieChartColors[index] : "#82ca9d";
      
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
        color: "#82ca9d"
      });
    }
    
    const sentimentMap: Record<string, number> = {};
    apiResponse.forEach(country => {
      sentimentMap[country.country] = country.sentiment;
      
      const mappedName = countryCodeMapping[country.country];
      if (mappedName) {
        sentimentMap[mappedName] = country.sentiment;
      }
    });
    
    setProcessedCountries(formattedCountries);
    setCountrySentiments(sentimentMap);
    setTopCountries(topWithOther);
  }, [apiResponse]);
  
  const getCountryColor = (countryName: string): string => {
    const sentiment = countrySentiments[countryName];
    
    if (sentiment === undefined) return sentimentColorScheme.noResult;
    
    if (sentiment >= 2) return sentimentColorScheme.veryPositive;
    if (sentiment >= 1) return sentimentColorScheme.positive;
    if (sentiment >= 0.5) return sentimentColorScheme.slightlyPositive;
    if (sentiment > 0) return sentimentColorScheme.lightPositive;
    if (sentiment > -0.1) return sentimentColorScheme.neutral;
    if (sentiment >= -0.5) return sentimentColorScheme.veryLightNegative;
    if (sentiment >= -1) return sentimentColorScheme.lightNegative;
    if (sentiment >= -2) return sentimentColorScheme.slightlyNegative;
    if (sentiment >= -3) return sentimentColorScheme.negative;
    return sentimentColorScheme.veryNegative;
  };

  const handleCountryHover = (geo: GeoFeature, event: React.MouseEvent) => {
    const countryName = geo.properties.name;
    
    let countryData = originalApiData.find(country => {
      const mappedName = countryCodeMapping[country.country];
      return country.country === countryName || mappedName === countryName;
    });

    if (!countryData) {
      const reverseMapping = Object.entries(countryCodeMapping).find(([code, name]) => name === countryName);
      if (reverseMapping) {
        countryData = originalApiData.find(country => country.country === reverseMapping[0]);
      }
    }

    if (countryData) {
      const sentimentCategory = countryData.sentiment > 0 ? 'Positive' : 
                              countryData.sentiment < 0 ? 'Negative' : 'Neutral';
      
      setTooltip({
        show: true,
        x: event.clientX,
        y: event.clientY,
        content: {
          countryName,
          volume: countryData.volume,
          sentimentCategory,
          sentimentScore: countryData.sentiment.toFixed(3)
        }
      });
    } else {
      setTooltip(prev => ({ ...prev, show: false }));
    }
  };

  const handleCountryLeave = () => {
    setTooltip(prev => ({ ...prev, show: false }));
  };

  const handleCountryClick = (geo: GeoFeature) => {
    const countryName = geo.properties.name;
    
    let countryData = originalApiData.find(country => {
      const mappedName = countryCodeMapping[country.country];
      return country.country === countryName || mappedName === countryName;
    });

    if (!countryData) {
      const reverseMapping = Object.entries(countryCodeMapping).find(([code, name]) => name === countryName);
      if (reverseMapping) {
        countryData = originalApiData.find(country => country.country === reverseMapping[0]);
      }
    }

    if (countryData) {
      console.log('Country clicked:', countryName);
      console.log('Country code:', countryData.country);
      console.log('Using hashtag:', activeHashtag);
      console.log('Date range:', dateRange);
      console.log('Using sentiment filter:', activeSentimentFilter);
      
      setSelectedCountryCode(countryData.country);
      setSelectedCountryName(countryName);
      setArticlesFetchEnabled(true);
      setArticlesDialogOpen(true);
    }
  };

  const handleCloseArticlesDialog = () => {
    setArticlesDialogOpen(false);
    setArticlesFetchEnabled(false);
    setSelectedCountryCode("");
    setSelectedCountryName("");
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Loading world map data...</div>;
  }

  return (
    <div className="space-y-4">
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
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1">
          <ChartCard title={getChartTitle("Share Of Countries/Region")} className="relative h-[490px]">
            <div className="h-full lg:h-[400px]">
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
          <ChartCard title={getChartTitle("World Map - Sentiment Analysis")} className="relative h-[490px]">
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
                              default: { outline: "none", cursor: "pointer" },
                              hover: { outline: "none", fill: color, opacity: 0.8, cursor: "pointer" },
                              pressed: { outline: "none" }
                            }}
                            onMouseEnter={(event) => handleCountryHover(geo, event)}
                            onMouseLeave={handleCountryLeave}
                            onClick={() => handleCountryClick(geo)}
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
                    <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: sentimentColorScheme.noResult }}></span>
                    <span>No Data</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: sentimentColorScheme.veryNegative }}></span>
                    <span>Very Negative</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: sentimentColorScheme.negative }}></span>
                    <span>Negative</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: sentimentColorScheme.neutral }}></span>
                    <span>Neutral</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: sentimentColorScheme.positive }}></span>
                    <span>Positive</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: sentimentColorScheme.veryPositive }}></span>
                    <span>Very Positive</span>
                  </div>
                </div>
              </div>
            </div>
          </ChartCard>
        </div>
      </div>

      <MapTooltip {...tooltip} />

      <DataDetailDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={`Country Details: ${selectedCountryName}`}
        data={selectedCountryData || {}}
      />

      <ArticlesDialog
        isOpen={articlesDialogOpen}
        onClose={handleCloseArticlesDialog}
        articles={articlesResponse?.result || []}
        isLoading={articlesLoading}
        error={articlesError}
        date={`${selectedCountryName} (${dateRange.startDate} to ${dateRange.endDate})`}
        hashtag={activeHashtag}
        totalCount={articlesResponse?.total_count || 0}
      />
    </div>
  );
}
