"use client"

import type React from "react"
import { useState, createContext, useContext, useCallback, useEffect } from "react"
import { Header } from "@/components/ui/header"
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar"
import { FilterBar } from "@/components/ui/filter-bar"
import PageHeader from "../ui/page-header"

export interface TimeRangeContextType {
  activeTimeRange: string
  setActiveTimeRange: (range: string) => void
}

export const TimeRangeContext = createContext<TimeRangeContextType | undefined>(undefined)

export const useTimeRange = () => {
  const context = useContext(TimeRangeContext)
  if (!context) {
    throw new Error("useTimeRange must be used within a TimeRangeProvider")
  }
  return context
}

export interface DateRangeContextType {
  customDateRange: { startDate: string; endDate: string } | null
  setCustomDateRange: (range: { startDate: string; endDate: string } | null) => void
  formattedDateRange: string
}

export const DateRangeContext = createContext<DateRangeContextType | undefined>(undefined)

export const useDateRange = () => {
  const context = useContext(DateRangeContext)
  if (!context) {
    throw new Error("useDateRange must be used within a DateRangeProvider")
  }
  return context
}

export interface HashtagContextType {
  activeHashtag: string
  setActiveHashtag: (hashtag: string) => void
}

export const HashtagContext = createContext<HashtagContextType | undefined>(undefined)

export const useHashtag = () => {
  const context = useContext(HashtagContext)
  if (!context) {
    throw new Error("useHashtag must be used within a HashtagProvider")
  }
  return context
}

export type SentimentFilter = 'all' | 'positive' | 'neutral' | 'negative'

export interface SentimentFilterContextType {
  activeSentimentFilter: SentimentFilter
  setActiveSentimentFilter: (filter: SentimentFilter) => void
}

export const SentimentFilterContext = createContext<SentimentFilterContextType | undefined>(undefined)

export const useSentimentFilter = () => {
  const context = useContext(SentimentFilterContext)
  if (!context) {
    throw new Error("useSentimentFilter must be used within a SentimentFilterProvider")
  }
  return context
}

export interface MobileMenuContextType {
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
}

export const MobileMenuContext = createContext<MobileMenuContextType | undefined>(undefined)

export const useMobileMenu = () => {
  const context = useContext(MobileMenuContext)
  if (!context) {
    throw new Error("useMobileMenu must be used within a MobileMenuProvider")
  }
  return context
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [activeTimeRange, setActiveTimeRange] = useState("1D")
  const [activeHashtag, setActiveHashtag] = useState("#pakistan")
  const [customDateRange, setCustomDateRange] = useState<{ startDate: string; endDate: string } | null>(null)
  const [activeSentimentFilter, setActiveSentimentFilter] = useState<SentimentFilter>('all')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  useEffect(() => {
    try {
      const savedDateRange = localStorage.getItem('customDateRange');
      if (savedDateRange) {
        setCustomDateRange(JSON.parse(savedDateRange));
        setActiveTimeRange("");
      }
      
      const savedHashtag = localStorage.getItem('activeHashtag');
      if (savedHashtag) {
        setActiveHashtag(savedHashtag);
      }

      const savedSentimentFilter = localStorage.getItem('activeSentimentFilter');
      if (savedSentimentFilter && ['all', 'positive', 'neutral', 'negative'].includes(savedSentimentFilter)) {
        setActiveSentimentFilter(savedSentimentFilter as SentimentFilter);
      }
    } catch (error) {
      console.error("Error loading saved settings:", error);
    }
  }, []);
  
  useEffect(() => {
    try {
      if (customDateRange) {
        localStorage.setItem('customDateRange', JSON.stringify(customDateRange));
      } else {
        localStorage.removeItem('customDateRange');
      }
    } catch (error) {
      console.error("Error saving date range:", error);
    }
  }, [customDateRange]);
  
  useEffect(() => {
    try {
      localStorage.setItem('activeHashtag', activeHashtag);
    } catch (error) {
      console.error("Error saving hashtag:", error);
    }
  }, [activeHashtag]);

  useEffect(() => {
    try {
      localStorage.setItem('activeSentimentFilter', activeSentimentFilter);
    } catch (error) {
      console.error("Error saving sentiment filter:", error);
    }
  }, [activeSentimentFilter]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  const formatDate = useCallback((dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: '2-digit' 
    });
  }, []);
  
  const formattedDateRange = customDateRange 
    ? `${formatDate(customDateRange.startDate)} - ${formatDate(customDateRange.endDate)}`
    : "October 5, 2025 - November 5, 2025"; 
  
  const handleTimeRangeChange = (range: string) => {
    setActiveTimeRange(range)
    if (range) {
      setCustomDateRange(null)
    }
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <SidebarProvider>
      <TimeRangeContext.Provider value={{ activeTimeRange, setActiveTimeRange }}>
        <DateRangeContext.Provider value={{ customDateRange, setCustomDateRange, formattedDateRange }}>
          <HashtagContext.Provider value={{ activeHashtag, setActiveHashtag }}>
            <SentimentFilterContext.Provider value={{ activeSentimentFilter, setActiveSentimentFilter }}>
              <MobileMenuContext.Provider value={{ isMobileMenuOpen, setIsMobileMenuOpen }}>
                <div className="flex flex-col h-screen w-full">
                  <Header />
                  <div className="flex flex-1 overflow-hidden">
                    <Sidebar 
                      className="hidden lg:flex" 
                      isMobileOpen={isMobileMenuOpen}
                      onMobileOpenChange={setIsMobileMenuOpen}
                      onNavigate={closeMobileMenu}
                    />
                    
                    <div className="flex-1 flex flex-col overflow-auto bg-[#F5F5F6]">
                      <div className="sticky top-0 z-10">
                        <FilterBar 
                          dateRange={formattedDateRange} 
                          onTabChange={handleTimeRangeChange}
                          activeTab={activeTimeRange}
                        />
                      </div>
                      <PageHeader />

                      <div className="flex-1 p-4 bg-[#F5F5F6]">
                        {children}
                      </div>
                    </div>
                  </div>
                </div>
              </MobileMenuContext.Provider>
            </SentimentFilterContext.Provider>
          </HashtagContext.Provider>
        </DateRangeContext.Provider>
      </TimeRangeContext.Provider>
    </SidebarProvider>
  )
}
