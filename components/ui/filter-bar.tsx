import { Calendar, Filter, X, ChevronDown, Menu } from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { useState, useRef, useEffect } from "react"
import { useDateRange } from "@/components/layout/dashboard-layout"

interface ToolbarProps {
  dateRange?: string
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export function FilterBar({ 
  dateRange = "10/05/25 - 11/05/25", 
  activeTab: externalActiveTab,
  onTabChange
}: ToolbarProps) {
  const [internalActiveTab, setInternalActiveTab] = useState("1D")
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const datePickerRef = useRef<HTMLDivElement>(null)
  const filterMenuRef = useRef<HTMLDivElement>(null)
  
  const { customDateRange, setCustomDateRange } = useDateRange()
  
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  
  const activeTab = externalActiveTab || internalActiveTab
  
  const tabs = ["1D", "7D", "30D", "3M", "6M", "13M"]
  
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: '2-digit' 
    });
  }

  const displayedDateRange = customDateRange 
    ? `${formatDateForDisplay(customDateRange.startDate)} - ${formatDateForDisplay(customDateRange.endDate)}`
    : dateRange;
  
  const handleTabClick = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab)
    } else {
      setInternalActiveTab(tab)
    }
  }
  
  const handleDatePickerToggle = () => {
    setIsDatePickerOpen(!isDatePickerOpen)
    
    if (!isDatePickerOpen) {
      if (customDateRange) {
        setStartDate(customDateRange.startDate)
        setEndDate(customDateRange.endDate)
      } else {
        const today = new Date()
        const lastMonth = new Date()
        lastMonth.setMonth(today.getMonth() - 1)
        
        setStartDate(lastMonth.toISOString().split('T')[0])
        setEndDate(today.toISOString().split('T')[0])
      }
    }
  }
  
  const handleDateRangeApply = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (start > end) {
        alert("Start date cannot be later than end date");
        return;
      }
      
      setCustomDateRange({ startDate, endDate });
      
      if (onTabChange) {
        onTabChange("");
      }
      
      setIsDatePickerOpen(false);
    }
  }
  
  useEffect(() => {
    if (customDateRange) {
      setStartDate(customDateRange.startDate);
      setEndDate(customDateRange.endDate);
    }
  }, [customDateRange]);  
  
  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen)
  }
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false)
      }
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setIsFilterMenuOpen(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])
  
  return (
    <div className="bg-[#5c6bc0] text-white">
      {/* Main layout container - switch to column on mobile */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        {/* Filter section - hidden on mobile, shown through menu */}
        <div className="hidden lg:flex lg:items-center lg:gap-2 p-2">
          <Button variant="ghost" size="sm" className="text-white h-8 px-3 hover:bg-white/10">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <div className="flex items-center gap-1 bg-white rounded-full px-2 py-1">
            <img 
              src="/positive-emoji.png" 
              alt="Positive" 
              width={24} 
              height={24} 
              className="mr-1" 
            />
            <img 
              src="/moderate-emoji.png" 
              alt="Positive" 
              width={24} 
              height={24} 
              className="mr-1" 
            />
            <img 
              src="/nagetive-emoji.png" 
              alt="Negative" 
              width={24} 
              height={24} 
              className="mr-1" 
            />
            
  <svg width="3" height="16" viewBox="0 0 3 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M0.86 10.6L0.6 0.719999H2.52L2.26 10.6H0.86ZM1.54 15.2C1.16667 15.2 0.86 15.0733 0.62 14.82C0.38 14.5667 0.26 14.2533 0.26 13.88C0.26 13.5067 0.38 13.2 0.62 12.96C0.86 12.7067 1.16667 12.58 1.54 12.58C1.92667 12.58 2.24 12.7067 2.48 12.96C2.72 13.2 2.84 13.5067 2.84 13.88C2.84 14.2533 2.72 14.5667 2.48 14.82C2.24 15.0733 1.92667 15.2 1.54 15.2Z" fill="#FD9644"/>
  </svg>

          </div>

          <Badge
            variant="outline"
            className="bg-white text-white border-none rounded-full flex items-center gap-1 px-3 py-1"
          >
            <span className="bg-[#6989DD] text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium">
              0
            </span>
            <span className="ml-1 text-black">Media types</span>
          </Badge>

          <Badge
            variant="outline"
            className="bg-white text-white border-none rounded-full flex items-center gap-1 px-3 py-1"
          >
            <span className="bg-[#6989DD] text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium">
              0
            </span>
            <span className="ml-1 text-black">Countries/Regions</span>
          </Badge>

          <Badge
            variant="outline"
            className="bg-white text-white border-none rounded-full flex items-center gap-1 px-3 py-1"
          >
            <span className="bg-[#6989DD] text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium">
              0
            </span>
            <span className="ml-1 text-black">Languages</span>
          </Badge>

          <Badge
            variant="outline"
            className="bg-white text-white border-none rounded-full flex items-center gap-1 px-3 py-1"
          >
            <span className="bg-[#6989DD] text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium">
              0
            </span>
            <span className="ml-1 text-black">Demographics</span>
          </Badge>
        </div>

        {/* Mobile filter button */}
        <div className="flex lg:hidden p-2 justify-between items-center">
          <div className="relative">
            <Button variant="ghost" size="sm" onClick={toggleFilterMenu} className="text-white h-8 px-3 hover:bg-white/10">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            
            {isFilterMenuOpen && (
              <div 
                ref={filterMenuRef}
                className="absolute left-0 top-full mt-1 bg-white rounded-md shadow-lg z-50 p-3 w-[300px]"
              >
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-700">Filters</h3>
                  
                  <div className="flex items-center gap-1 bg-white rounded-full px-2 py-1 border border-gray-200">
                    <img src="/positive-emoji.png" alt="Positive" width={24} height={24} className="mr-1" />
                    <img src="/moderate-emoji.png" alt="Positive" width={24} height={24} className="mr-1" />
                    <img src="/nagetive-emoji.png" alt="Negative" width={24} height={24} className="mr-1" />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Badge
                      variant="outline"
                      className="bg-white text-white border-none rounded-full flex items-center gap-1 px-3 py-1"
                    >
                      <span className="bg-[#6989DD] text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium">
                        0
                      </span>
                      <span className="ml-1 text-black">Media types</span>
                    </Badge>

                    <Badge
                      variant="outline"
                      className="bg-white text-white border-none rounded-full flex items-center gap-1 px-3 py-1"
                    >
                      <span className="bg-[#6989DD] text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium">
                        0
                      </span>
                      <span className="ml-1 text-black">Countries/Regions</span>
                    </Badge>

                    <Badge
                      variant="outline"
                      className="bg-white text-white border-none rounded-full flex items-center gap-1 px-3 py-1"
                    >
                      <span className="bg-[#6989DD] text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium">
                        0
                      </span>
                      <span className="ml-1 text-black">Languages</span>
                    </Badge>

                    <Badge
                      variant="outline"
                      className="bg-white text-white border-none rounded-full flex items-center gap-1 px-3 py-1"
                    >
                      <span className="bg-[#6989DD] text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium">
                        0
                      </span>
                      <span className="ml-1 text-black">Demographics</span>
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile time control toggle button */}
          <div className="px-2 py-1">
            <button 
              onClick={handleDatePickerToggle}
              className="flex items-center bg-white rounded px-2 py-1"
            >
              <Calendar className="h-4 w-4 mr-1 text-black" />
              <span className="text-black text-sm font-medium truncate max-w-[120px]">{displayedDateRange}</span>
              <ChevronDown className="h-3 w-3 ml-1 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Time range controls */}
        <div className="w-full lg:w-auto flex flex-col lg:flex-row lg:items-center overflow-x-auto">
          {/* Controls for expand/collapse */}
          <div className="hidden lg:flex p-4 mr-4">
            <button className="flex items-center justify-center h-10 w-10 text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="flex items-center justify-center h-10 w-10 text-white">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M15 3.75C15 3.33579 15.3358 3 15.75 3L20.25 3C20.6642 3 21 3.33579 21 3.75V8.25C21 8.66421 20.6642 9 20.25 9C19.8358 9 19.5 8.66421 19.5 8.25V5.56066L15.5303 9.53033C15.2374 9.82322 14.7626 9.82322 14.4697 9.53033C14.1768 9.23744 14.1768 8.76256 14.4697 8.46967L18.4393 4.5H15.75C15.3358 4.5 15 4.16421 15 3.75ZM3 3.75C3 3.33579 3.33579 3 3.75 3H8.25C8.66421 3 9 3.33579 9 3.75C9 4.16421 8.66421 4.5 8.25 4.5H5.56066L9.53033 8.46967C9.82322 8.76256 9.82322 9.23744 9.53033 9.53033C9.23744 9.82322 8.76256 9.82322 8.46967 9.53033L4.5 5.56066V8.25C4.5 8.66421 4.16421 9 3.75 9C3.33579 9 3 8.66421 3 8.25V3.75ZM14.4697 15.5303C14.1768 15.2374 14.1768 14.7626 14.4697 14.4697C14.7626 14.1768 15.2374 14.1768 15.5303 14.4697L19.5 18.4393V15.75C19.5 15.3358 19.8358 15 20.25 15C20.6642 15 21 15.3358 21 15.75V20.25C21 20.6642 20.6642 21 20.25 21H15.75C15.3358 21 15 20.6642 15 20.25C15 19.8358 15.3358 19.5 15.75 19.5H18.4393L14.4697 15.5303ZM9.53033 14.4697C9.82322 14.7626 9.82322 15.2374 9.53033 15.5303L5.56066 19.5H8.25C8.66421 19.5 9 19.8358 9 20.25C9 20.6642 8.66421 21 8.25 21H3.75C3.33579 21 3 20.6642 3 20.25V15.75C3 15.3358 3.33579 15 3.75 15C4.16421 15 4.5 15.3358 4.5 15.75V18.4393L8.46967 14.4697C8.76256 14.1768 9.23744 14.1768 9.53033 14.4697Z" fill="white"/>
              </svg>
            </button>
          </div>

          <div className="w-full flex lg:w-auto bg-white px-2 py-2 lg:px-4 lg:py-2 lg:h-20 overflow-x-auto">
            <div className="flex items-center">
              <div className="flex space-x-1 lg:space-x-0">
                {tabs.map(tab => (
                  <button
                    key={tab}
                    className={`h-10 w-10 lg:h-12 lg:w-12 flex items-center justify-center font-medium transition-colors rounded-sm ${
                      activeTab === tab 
                        ? "bg-[#5c6bc0] text-white" 
                        : "bg-gray-100 text-[#606060] lg:bg-transparent hover:bg-gray-100"
                    }`}
                    onClick={() => handleTabClick(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="hidden lg:block relative">
                <button 
                  onClick={handleDatePickerToggle}
                  className="flex border-l border-[#6989DD] items-center bg-white px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  <Calendar className="h-5 w-5 mr-2 text-black" />
                  <span className="text-black font-medium text-nowrap">{displayedDateRange}</span>
                  <ChevronDown className="h-4 w-4 ml-2 text-gray-500" />
                </button>
              </div>
            </div>
            
            {isDatePickerOpen && (
              <div 
                ref={datePickerRef}
                className="absolute right-2 lg:right-0 mt-2 bg-white rounded-md shadow-lg z-50 p-4 w-[calc(100%-1rem)] lg:w-80 max-w-[400px]"
              >
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700">Custom Date Range</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-2 text-black">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsDatePickerOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="default"
                      size="sm"
                      onClick={handleDateRangeApply}
                      className="bg-[#5c6bc0] hover:bg-[#4a5aa0]"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


