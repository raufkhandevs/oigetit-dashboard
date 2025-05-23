import axios from 'axios';

// Define types for the API responses
export interface HistogramDataPoint {
  pubdate: string;
  volume: number;
  volume_neg: number;
  volume_pos: number;
  volume_neu: number;
  sentiment: number;
  political_bias: number;
  trusted: number;
}

export interface CountryDataPoint {
  country: string;
  count?: number;
  volume?: number;
  political_bias?: number;
  sentiment?: number;
}

export interface Article {
  id: number;
  title: string;
  description: string;
  pubdate: string;
  urllink: string;
  rssfeed: number;
  imagelink: string;
  videolink: string;
  feed: string;
  trusted: number;
  happiness: number;
  politicalbias: number;
}

export interface ArticlesResponse {
  result: Article[];
  total_count: number;
  page_count: number;
}

export interface Influencer {
  id: string;
  name: string;
  handle: string;
  avatar?: string;
  verified: boolean;
  network: string;
  networkValue: number;
  reach: string;
  reachPerMention: string;
  engagement: string;
  engagementPerMention: string;
}

// API base URL - TODO: in production this should from from .env
const API_BASE_URL = "https://ai.oigetit.com/AI71";

// Helper function to get date range based on time range filter
export function getDateRange(timeRange: string): { startDate: string; endDate: string } {
  const endDate = new Date();
  const startDate = new Date();
  
  switch (timeRange) {
    case "1D":
      startDate.setDate(endDate.getDate() - 1);
      break;
    case "7D":
      startDate.setDate(endDate.getDate() - 7);
      break;
    case "30D":
      startDate.setDate(endDate.getDate() - 30);
      break;
    case "3M":
      startDate.setMonth(endDate.getMonth() - 3);
      break;
    case "6M":
      startDate.setMonth(endDate.getMonth() - 6);
      break;
    case "13M":
      startDate.setMonth(endDate.getMonth() - 13);
      break;
    case "": // Empty string means custom date range is active, but default to 30 days
    default:
      startDate.setDate(endDate.getDate() - 30); // Default to 30 days
  }
  
  return {
    startDate: startDate.toISOString().split('T')[0], // Format: YYYY-MM-DD
    endDate: endDate.toISOString().split('T')[0],
  };
}

// Helper function to build query parameters
function buildQueryParams(startDate: string, endDate: string, query: string) {
  return {
    json: JSON.stringify({
      StartDate: startDate,
      EndDate: endDate,
      Query: query
    })
  };
}

// Service functions with date range parameters
export const fetchHistogramData = async (
  timeRange: string, 
  hashtag: string, 
  customDateRange: { startDate: string; endDate: string } | null = null
): Promise<HistogramDataPoint[]> => {
  try {
    const { startDate, endDate } = customDateRange || getDateRange(timeRange);
    const params = buildQueryParams(startDate, endDate, hashtag);
    
    const response = await axios.get(`${API_BASE_URL}/Histogram`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching histogram data:`, error);
    throw error;
  }
};

export const fetchCountryBreakdown = async (
  timeRange: string, 
  hashtag: string, 
  customDateRange: { startDate: string; endDate: string } | null = null
): Promise<CountryDataPoint[]> => {
  try {
    const { startDate, endDate } = customDateRange || getDateRange(timeRange);
    const params = buildQueryParams(startDate, endDate, hashtag);
    
    const response = await axios.get(`${API_BASE_URL}/Country`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching country breakdown:`, error);
    throw error;
  }
};

export const fetchArticles = async (
  timeRange: string, 
  hashtag: string, 
  customDateRange: { startDate: string; endDate: string } | null = null
): Promise<Article[]> => {
  try {
    const { startDate, endDate } = customDateRange || getDateRange(timeRange);
    const params = buildQueryParams(startDate, endDate, hashtag);
    
    const response = await axios.get(`${API_BASE_URL}/Articles`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching articles:`, error);
    throw error;
  }
};

export const fetchInfluencers = async (
  timeRange: string, 
  hashtag: string, 
  customDateRange: { startDate: string; endDate: string } | null = null
): Promise<Influencer[]> => {
  try {
    const { startDate, endDate } = customDateRange || getDateRange(timeRange);
    const params = buildQueryParams(startDate, endDate, hashtag);
  
    
    // For now, we'll return mock data that matches the screenshot
    return Array(13).fill(null).map((_, i) => ({
      id: `inf-${i + 1}`,
      name: "Charlotte Austin",
      handle: "@itscharlotte",
      verified: true,
      network: "X",
      networkValue: 100,
      reach: "11.1M",
      reachPerMention: "11.1M",
      engagement: "11.1M",
      engagementPerMention: "11.1M"
    }));
  } catch (error) {
    console.error(`Error fetching influencers:`, error);
    throw error;
  }
};

export const fetchArticlesForDate = async (
  date: string,
  hashtag: string,
  sentiment: string = 'all'
): Promise<ArticlesResponse> => {
  try {
    const queryParams = {
      StartDate: date,
      EndDate: date,
      Query: hashtag,
      Country: null,
      Sort: 1,
      Sentiment: sentiment,
      Size: 250
    };
    
    const params = {
      json: JSON.stringify(queryParams)
    };
    
    console.log('Fetching articles with params:', queryParams);
    
    const response = await axios.get(`${API_BASE_URL}/Articles`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching articles for date:`, error);
    throw error;
  }
};

export const fetchArticlesForCountry = async (
  startDate: string,
  endDate: string,
  hashtag: string,
  country: string,
  sentiment: string = 'all'
): Promise<ArticlesResponse> => {
  try {
    const queryParams = {
      StartDate: startDate,
      EndDate: endDate,
      Query: hashtag,
      Country: country,
      Sort: 1,
      Sentiment: sentiment,
      Size: 250
    };
    
    const params = {
      json: JSON.stringify(queryParams)
    };
    
    console.log('Fetching articles for country with params:', queryParams);
    
    const response = await axios.get(`${API_BASE_URL}/Articles`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching articles for country:`, error);
    throw error;
  }
}; 