import { useQuery } from "@tanstack/react-query";
import {
  fetchHistogramData,
  fetchCountryBreakdown,
  fetchArticles,
  fetchInfluencers,
  HistogramDataPoint,
  CountryDataPoint,
  Article,
  Influencer,
} from "../api/services";
import { useHashtag, useDateRange } from "@/components/layout/dashboard-layout";

/**
 * Hook to fetch histogram data based on time range, hashtag, and custom date range
 * @param timeRange - Time range filter (1D, 7D, 30D, 3M, 6M, 13M)
 */
export const useHistogramData = (timeRange: string = "30D") => {
  const { activeHashtag } = useHashtag();
  const { customDateRange } = useDateRange();
  
  return useQuery<HistogramDataPoint[], Error>({
    queryKey: ["histogram", timeRange, activeHashtag, customDateRange],
    queryFn: () => {
      return fetchHistogramData(timeRange, activeHashtag, customDateRange);
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
  
  return useQuery<CountryDataPoint[], Error>({
    queryKey: ["countryBreakdown", timeRange, activeHashtag, customDateRange],
    queryFn: () => fetchCountryBreakdown(timeRange, activeHashtag, customDateRange),
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
  
  return useQuery<Article[], Error>({
    queryKey: ["articles", timeRange, activeHashtag, customDateRange],
    queryFn: () => fetchArticles(timeRange, activeHashtag, customDateRange),
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
  
  return useQuery<Influencer[], Error>({
    queryKey: ["influencers", timeRange, activeHashtag, customDateRange],
    queryFn: () => fetchInfluencers(timeRange, activeHashtag, customDateRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}; 