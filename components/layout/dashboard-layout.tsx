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

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [activeTimeRange, setActiveTimeRange] = useState("1D")
  const [activeHashtag, setActiveHashtag] = useState("#pakistan")
  const [customDateRange, setCustomDateRange] = useState<{ startDate: string; endDate: string } | null>(null)
  
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
    : "10/05/25 - 11/05/25"; 
  
  const handleTimeRangeChange = (range: string) => {
    setActiveTimeRange(range)
    if (range) {
      setCustomDateRange(null)
    }
  }

  return (
    <SidebarProvider>
      <TimeRangeContext.Provider value={{ activeTimeRange, setActiveTimeRange }}>
        <DateRangeContext.Provider value={{ customDateRange, setCustomDateRange, formattedDateRange }}>
          <HashtagContext.Provider value={{ activeHashtag, setActiveHashtag }}>
            <div className="flex flex-col h-screen w-full">
              <Header />
              <div className="flex flex-1 overflow-hidden">
                <Sidebar />
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
          </HashtagContext.Provider>
        </DateRangeContext.Provider>
      </TimeRangeContext.Provider>
    </SidebarProvider>
  )
}
