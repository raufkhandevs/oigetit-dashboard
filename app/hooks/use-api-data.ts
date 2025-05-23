import { useQuery } from "@tanstack/react-query";
import {
  fetchHistogramData,
  fetchCountryBreakdown,
  fetchArticles,
  fetchInfluencers,
  fetchArticlesForDate,
  fetchArticlesForCountry,
  HistogramDataPoint,
  CountryDataPoint,
  Article,
  ArticlesResponse,
  Influencer,
} from "../api/services";
import { useHashtag, useDateRange, useSentimentFilter, SentimentFilter } from "@/components/layout/dashboard-layout";

// Utility function to filter data based on sentiment
const filterBySentiment = <T extends { sentiment?: number }>(
  data: T[], 
  sentimentFilter: SentimentFilter
): T[] => {
  if (sentimentFilter === 'all') return data;
  
  return data.filter(item => {
    if (typeof item.sentiment !== 'number') return false;
    
    switch (sentimentFilter) {
      case 'positive':
        return item.sentiment > 0.1; // More strict positive threshold
      case 'negative':
        return item.sentiment < -0.1; // More strict negative threshold
      case 'neutral':
        return item.sentiment >= -0.1 && item.sentiment <= 0.1;
      default:
        return true;
    }
  });
};

// Utility function to filter histogram data by sentiment
const filterHistogramBySentiment = (
  data: HistogramDataPoint[], 
  sentimentFilter: SentimentFilter
): HistogramDataPoint[] => {
  if (sentimentFilter === 'all') return data;
  
  return data.map(item => {
    const baseItem = { ...item };
    
    switch (sentimentFilter) {
      case 'positive':
        // Show only positive volume and reset others
        return {
          ...baseItem,
          volume: item.volume_pos || 0,
          volume_neg: 0,
          volume_neu: 0,
          volume_pos: item.volume_pos || 0,
          // Update sentiment to reflect only positive sentiment
          sentiment: item.volume_pos > 0 ? Math.abs(item.sentiment) : 0
        };
      case 'negative':
        // Show only negative volume and reset others
        return {
          ...baseItem,
          volume: item.volume_neg || 0,
          volume_neg: item.volume_neg || 0,
          volume_neu: 0,
          volume_pos: 0,
          // Update sentiment to reflect only negative sentiment
          sentiment: item.volume_neg > 0 ? -Math.abs(item.sentiment) : 0
        };
      case 'neutral':
        // Show only neutral volume and reset others
        return {
          ...baseItem,
          volume: item.volume_neu || 0,
          volume_neg: 0,
          volume_neu: item.volume_neu || 0,
          volume_pos: 0,
          // Update sentiment to neutral
          sentiment: item.volume_neu > 0 ? 0 : 0
        };
      default:
        return baseItem;
    }
  }).filter(item => {
    // Filter out data points with zero volume for better chart visualization
    return item.volume > 0;
  });
};

/**
 * Hook to fetch histogram data based on time range, hashtag, and custom date range
 * @param timeRange - Time range filter (1D, 7D, 30D, 3M, 6M, 13M)
 */
export const useHistogramData = (timeRange: string = "30D") => {
  const { activeHashtag } = useHashtag();
  const { customDateRange } = useDateRange();
  const { activeSentimentFilter } = useSentimentFilter();
  
  return useQuery<HistogramDataPoint[], Error>({
    queryKey: ["histogram", timeRange, activeHashtag, customDateRange, activeSentimentFilter],
    queryFn: async () => {
      const data = await fetchHistogramData(timeRange, activeHashtag, customDateRange);
      const filteredData = filterHistogramBySentiment(data, activeSentimentFilter);
      
      // Debug logging
      if (activeSentimentFilter !== 'all') {
        console.log(`Histogram filter: ${activeSentimentFilter}`);
        console.log(`Original data points: ${data.length}`);
        console.log(`Filtered data points: ${filteredData.length}`);
        console.log('Sample filtered data:', filteredData.slice(0, 2));
      }
      
      return filteredData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch country breakdown data based on time range, hashtag, and custom date range
 * @param timeRange - Time range filter (1D, 7D, 30D, 3M, 6M, 13M)
 */
export const useCountryBreakdown = (timeRange: string = "30D") => {
  const { activeHashtag } = useHashtag();
  const { customDateRange } = useDateRange();
  const { activeSentimentFilter } = useSentimentFilter();
  
  return useQuery<CountryDataPoint[], Error>({
    queryKey: ["countryBreakdown", timeRange, activeHashtag, customDateRange, activeSentimentFilter],
    queryFn: async () => {
      const data = await fetchCountryBreakdown(timeRange, activeHashtag, customDateRange);
      const filteredData = filterBySentiment(data, activeSentimentFilter);
      
      // Debug logging
      if (activeSentimentFilter !== 'all') {
        console.log(`Country filter: ${activeSentimentFilter}`);
        console.log(`Original countries: ${data.length}`);
        console.log(`Filtered countries: ${filteredData.length}`);
        console.log('Sample filtered countries:', filteredData.slice(0, 3));
      }
      
      return filteredData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to fetch articles data based on time range, hashtag, and custom date range
 * @param timeRange - Time range filter (1D, 7D, 30D, 3M, 6M, 13M)
 */
export const useArticles = (timeRange: string = "30D") => {
  const { activeHashtag } = useHashtag();
  const { customDateRange } = useDateRange();
  const { activeSentimentFilter } = useSentimentFilter();
  
  return useQuery<Article[], Error>({
    queryKey: ["articles", timeRange, activeHashtag, customDateRange, activeSentimentFilter],
    queryFn: async () => {
      const data = await fetchArticles(timeRange, activeHashtag, customDateRange);
      // Articles don't have sentiment field in the current interface, so we return as-is
      // If needed, you can extend the Article interface to include sentiment
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch influencer data based on time range, hashtag, and custom date range
 * @param timeRange - Time range filter (1D, 7D, 30D, 3M, 6M, 13M)
 */
export const useInfluencers = (timeRange: string = "30D") => {
  const { activeHashtag } = useHashtag();
  const { customDateRange } = useDateRange();
  const { activeSentimentFilter } = useSentimentFilter();
  
  return useQuery<Influencer[], Error>({
    queryKey: ["influencers", timeRange, activeHashtag, customDateRange, activeSentimentFilter],
    queryFn: async () => {
      const data = await fetchInfluencers(timeRange, activeHashtag, customDateRange);
      // Influencers don't have sentiment field in the current interface, so we return as-is
      // If needed, you can extend the Influencer interface to include sentiment
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch articles for a specific date (used when clicking chart points)
 * @param date - Specific date to fetch articles for
 * @param hashtag - Hashtag to search for
 * @param sentiment - Sentiment filter
 * @param enabled - Whether to enable the query
 */
export const useArticlesForDate = (
  date: string,
  hashtag: string,
  sentiment: string = 'all',
  enabled: boolean = false
) => {
  return useQuery<ArticlesResponse, Error>({
    queryKey: ["articlesForDate", date, hashtag, sentiment],
    queryFn: () => fetchArticlesForDate(date, hashtag, sentiment),
    enabled: enabled && !!date && !!hashtag,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch articles for a specific country and date range
 * @param startDate - Start date for the range
 * @param endDate - End date for the range
 * @param hashtag - Hashtag to search for
 * @param country - Country code to filter by
 * @param sentiment - Sentiment filter
 * @param enabled - Whether to enable the query
 */
export const useArticlesForCountry = (
  startDate: string,
  endDate: string,
  hashtag: string,
  country: string,
  sentiment: string = 'all',
  enabled: boolean = false
) => {
  return useQuery<ArticlesResponse, Error>({
    queryKey: ["articlesForCountry", startDate, endDate, hashtag, country, sentiment],
    queryFn: () => fetchArticlesForCountry(startDate, endDate, hashtag, country, sentiment),
    enabled: enabled && !!startDate && !!endDate && !!hashtag && !!country,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}; 