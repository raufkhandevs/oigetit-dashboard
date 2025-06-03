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

// Layer options for the map
const mapLayers = [
  { id: 'sentiment', name: 'Sentiment Analysis', description: 'Shows sentiment data by country' },
  { id: 'volume', name: 'Volume Data', description: 'Shows article volume by country' },
  { id: 'political', name: 'Political Bias', description: 'Shows political bias by country' },
  { id: 'default', name: 'Default View', description: 'Standard world map view' }
];

// Map Control Component
const MapControls = ({ zoom, onZoomIn, onZoomOut, onReset, onLayerChange, onLocationRequest }: {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onLayerChange?: (layerId: string) => void;
  onLocationRequest?: () => void;
}) => {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState('sentiment');
  const [isLocating, setIsLocating] = useState(false);

  const handleButtonClick = (buttonId: string, callback?: () => void) => {
    if (buttonId === 'map') {
      setShowLayerMenu(!showLayerMenu);
      setActiveButton(showLayerMenu ? null : buttonId);
    } else if (buttonId === 'location') {
      setIsLocating(true);
      setActiveButton('location');
      if (onLocationRequest) {
        onLocationRequest();
      }
      setTimeout(() => {
        setIsLocating(false);
        setActiveButton(null);
      }, 2000);
    } else {
      setActiveButton(activeButton === buttonId ? null : buttonId);
      setShowLayerMenu(false);
    }
    if (callback) callback();
  };

  const handleLayerSelect = (layerId: string) => {
    setSelectedLayer(layerId);
    setShowLayerMenu(false);
    setActiveButton(null);
    if (onLayerChange) {
      onLayerChange(layerId);
    }
  };

  const getButtonStyles = (buttonId: string, isBlueButton: boolean = false) => {
    const isActive = activeButton === buttonId || (buttonId === 'location' && isLocating);
    
    if (isBlueButton) {
      return isActive
        ? "bg-white border-2 border-[#5758bb] rounded-xl p-3 shadow-lg transition-colors"
        : "bg-[#5758bb] hover:bg-blue-700 rounded-xl p-3 shadow-lg transition-colors";
    } else {
      return isActive
        ? "bg-white border-2 border-[#5758bb] rounded-xl p-3 shadow-lg transition-colors"
        : "bg-white hover:bg-gray-50 rounded-xl p-3 shadow-lg transition-colors border border-gray-200";
    }
  };

  const getIconColor = (buttonId: string, isBlueButton: boolean = false) => {
    const isActive = activeButton === buttonId || (buttonId === 'location' && isLocating);
    
    if (isBlueButton) {
      return isActive ? "#5758bb" : "white";
    } else {
      return isActive ? "#5758bb" : "#6B7280";
    }
  };

  return (
    <div className="absolute top-4 right-4 z-40 flex flex-col space-y-2">
      {/* Buildings/City Icon - Blue */}
      <button 
        className={getButtonStyles("buildings", true)}
        onClick={() => handleButtonClick("buildings")}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={getIconColor("buildings", true)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="10" width="8" height="11"></rect>
          <rect x="13" y="6" width="8" height="15"></rect>
          <line x1="7" y1="16" x2="7" y2="16"></line>
          <line x1="7" y1="13" x2="7" y2="13"></line>
          <line x1="7" y1="19" x2="7" y2="19"></line>
          <line x1="17" y1="16" x2="17" y2="16"></line>
          <line x1="17" y1="13" x2="17" y2="13"></line>
          <line x1="17" y1="19" x2="17" y2="19"></line>
        </svg>
      </button>

      {/* User Icon - Blue */}
      <button 
        className={getButtonStyles("user", true)}
        onClick={() => handleButtonClick("user")}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill={getIconColor("user", true)} className="text-white">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </button>

      {/* Location/Target Icon */}
      <button 
        className={getButtonStyles("location")}
        onClick={() => handleButtonClick("location")}
        disabled={isLocating}
        title={isLocating ? "Getting your location..." : "Get current location"}
      >
        {isLocating ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={getIconColor("location")} strokeWidth="2" className="animate-spin">
            <path d="M21 12a9 9 0 11-6.219-8.56"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={getIconColor("location")} strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        )}
      </button>

      {/* Map Icon with Layer Menu */}
      <div className="relative">
        <button 
          className={getButtonStyles("map")}
          onClick={() => handleButtonClick("map")}
          title="Select map layer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={getIconColor("map")} strokeWidth="2">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
            <line x1="8" y1="2" x2="8" y2="18"/>
            <line x1="16" y1="6" x2="16" y2="22"/>
          </svg>
        </button>

        {/* Layer Selection Menu */}
        {showLayerMenu && (
          <div className="absolute right-full top-0 mr-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[200px] z-50">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
              Map Layers
            </div>
            {mapLayers.map((layer) => (
              <button
                key={layer.id}
                onClick={() => handleLayerSelect(layer.id)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  selectedLayer === layer.id ? 'bg-blue-50 text-[#5758bb] font-medium' : 'text-gray-700'
                }`}
              >
                <div className="font-medium">{layer.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{layer.description}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zoom In */}
      <button 
        className={getButtonStyles("zoomIn")}
        onClick={() => handleButtonClick("zoomIn", onZoomIn)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={getIconColor("zoomIn")} strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>

      {/* Zoom Out */}
      <button 
        className={getButtonStyles("zoomOut")}
        onClick={() => handleButtonClick("zoomOut", onZoomOut)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={getIconColor("zoomOut")} strokeWidth="2">
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>

      {/* Circle with Dot Icon */}
      <button 
        className={getButtonStyles("reset")}
        onClick={() => handleButtonClick("reset", onReset)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={getIconColor("reset")} strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="2" fill={getIconColor("reset")}/>
        </svg>
      </button>
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
  
  // Map zoom controls state
  const [zoom, setZoom] = useState(2.0)
  const [center, setCenter] = useState<[number, number]>([0, 0])
  const [activeLayer, setActiveLayer] = useState('sentiment')
  
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
  
  // Map control handlers
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.5, 8))
  }
  
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.5, 1))
  }
  
  const handleReset = () => {
    setZoom(2.0)
    setCenter([0, 0])
  }
  
  // Dynamic chart titles based on sentiment filter
  const getChartTitle = (baseTitle: string) => {
    if (activeSentimentFilter === 'all') return baseTitle;
    return `${baseTitle} (${activeSentimentFilter.charAt(0).toUpperCase() + activeSentimentFilter.slice(1)} Only)`;
  };
  
  const handleLocationRequest = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCenter([longitude, latitude]);
        setZoom(4); // Zoom in to show the region
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = 'Unable to get your location';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
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
  
  const handleLayerChange = (layerId: string) => {
    setActiveLayer(layerId);
  };

  const getCountryColor = (countryName: string): string => {
    const sentiment = countrySentiments[countryName];
    
    if (sentiment === undefined) return sentimentColorScheme.noResult;
    
    if (activeLayer === 'volume') {
      // Use volume-based coloring
      const countryData = originalApiData.find(country => {
        const mappedName = countryCodeMapping[country.country];
        return country.country === countryName || mappedName === countryName;
      });
      
      if (!countryData) return sentimentColorScheme.noResult;
      
      // Normalize volume to a color scale
      const maxVolume = Math.max(...originalApiData.map(d => d.volume));
      const normalizedVolume = countryData.volume / maxVolume;
      
      if (normalizedVolume > 0.8) return sentimentColorScheme.veryPositive;
      if (normalizedVolume > 0.6) return sentimentColorScheme.positive;
      if (normalizedVolume > 0.4) return sentimentColorScheme.slightlyPositive;
      if (normalizedVolume > 0.2) return sentimentColorScheme.lightPositive;
      return sentimentColorScheme.neutral;
    }
    
    if (activeLayer === 'political') {
      // Use political bias coloring
      const countryData = originalApiData.find(country => {
        const mappedName = countryCodeMapping[country.country];
        return country.country === countryName || mappedName === countryName;
      });
      
      if (!countryData) return sentimentColorScheme.noResult;
      
      const bias = countryData.political_bias;
      if (bias > 0.8) return sentimentColorScheme.veryPositive;
      if (bias > 0.6) return sentimentColorScheme.positive;
      if (bias > 0.4) return sentimentColorScheme.slightlyPositive;
      if (bias > 0.2) return sentimentColorScheme.lightPositive;
      if (bias > -0.2) return sentimentColorScheme.neutral;
      if (bias > -0.4) return sentimentColorScheme.lightNegative;
      if (bias > -0.6) return sentimentColorScheme.slightlyNegative;
      if (bias > -0.8) return sentimentColorScheme.negative;
      return sentimentColorScheme.veryNegative;
    }
    
    // Default sentiment coloring
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
          <ChartCard hasControls={true} showControls={true} title={getChartTitle("Share Of Countries/Region")} className="relative h-[490px]">
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
          <ChartCard hasControls={true} showControls={true} title={getChartTitle(`World Map - ${mapLayers.find(l => l.id === activeLayer)?.name || 'Sentiment Analysis'}`)} className="relative h-[490px]">
            <div className="relative bg-white rounded-md overflow-hidden h-full lg:h-[400px]">
              <ComposableMap projection="geoMercator" className="w-full h-full">
                <ZoomableGroup zoom={zoom} center={center}>
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
              
              {/* Map Controls */}
              <MapControls 
                zoom={zoom}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onReset={handleReset}
                onLayerChange={handleLayerChange}
                onLocationRequest={handleLocationRequest}
              />
              
              <div className="absolute bottom-2 left-2 text-xs text-gray-600">
                <div className="flex items-center mt-2 flex-wrap gap-2">
                  {activeLayer === 'sentiment' && (
                    <>
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
                    </>
                  )}
                  {activeLayer === 'volume' && (
                    <>
                      <div className="flex items-center">
                        <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: sentimentColorScheme.noResult }}></span>
                        <span>No Data</span>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: sentimentColorScheme.neutral }}></span>
                        <span>Low Volume</span>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: sentimentColorScheme.lightPositive }}></span>
                        <span>Medium Volume</span>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: sentimentColorScheme.positive }}></span>
                        <span>High Volume</span>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: sentimentColorScheme.veryPositive }}></span>
                        <span>Very High Volume</span>
                      </div>
                    </>
                  )}
                  {activeLayer === 'political' && (
                    <>
                      <div className="flex items-center">
                        <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: sentimentColorScheme.noResult }}></span>
                        <span>No Data</span>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: sentimentColorScheme.veryNegative }}></span>
                        <span>Very Conservative</span>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: sentimentColorScheme.negative }}></span>
                        <span>Conservative</span>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: sentimentColorScheme.neutral }}></span>
                        <span>Neutral</span>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: sentimentColorScheme.positive }}></span>
                        <span>Liberal</span>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: sentimentColorScheme.veryPositive }}></span>
                        <span>Very Liberal</span>
                      </div>
                    </>
                  )}
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
