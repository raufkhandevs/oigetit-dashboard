"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Search, MoreVertical, RefreshCw, Download, Plus, Maximize, Edit, Check, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useHashtag } from "@/components/layout/dashboard-layout"

export default function PageHeader() {
  const { activeHashtag, setActiveHashtag } = useHashtag()
  const [isEditingHashtag, setIsEditingHashtag] = useState(false)
  const [hashtagInput, setHashtagInput] = useState(activeHashtag)
  const [searchInput, setSearchInput] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const [pageTitle, setPageTitle] = useState("Dashboard")
  
  // Map pathname to page title
  useEffect(() => {
    const getPageTitle = () => {
      // Remove leading slash and capitalize first letter
      const path = pathname.slice(1) || 'key-metrics'
      
      if (path === '') return 'Key Metrics'
      
      // Handle special cases
      if (path === 'world-map') return 'World Map'
      if (path === 'top-themes') return 'Top Themes'
      if (path === 'key-metrics') return 'Key Metrics'
      
      // Default: capitalize the pathname
      return path.charAt(0).toUpperCase() + path.slice(1)
    }
    
    setPageTitle(getPageTitle())
  }, [pathname])

  const handleHashtagSubmit = () => {
    // Ensure the hashtag starts with #
    let formattedHashtag = hashtagInput.trim()
    if (!formattedHashtag.startsWith('#') && formattedHashtag.length > 0) {
      formattedHashtag = '#' + formattedHashtag
    }
    
    setActiveHashtag(formattedHashtag)
    setIsEditingHashtag(false)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      // Format the search input as a hashtag
      let formattedHashtag = searchInput.trim()
      if (!formattedHashtag.startsWith('#') && formattedHashtag.length > 0) {
        formattedHashtag = '#' + formattedHashtag
      }
      
      setActiveHashtag(formattedHashtag)
      setSearchInput("")
      setIsMobileMenuOpen(false) // Close mobile menu after search on mobile
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="w-full bg-[#f1f1f1] p-4 lg:p-6 space-y-4">
      {/* Header with title and action buttons */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl lg:text-[32px] font-medium text-[#1a1a1a]">{pageTitle}</h1>
        
        {/* Mobile menu button */}
        <div className="lg:hidden">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleMobileMenu} 
            className="h-8 w-8 p-0"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-2">
          {/* New Search button */}
          <form onSubmit={handleSearchSubmit} className="relative h-10">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#5758bb]" />
            <input
              type="text"
              placeholder="New Search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-full pl-9 pr-4 border border-[#d1d5db] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5758bb] focus:border-transparent w-[180px]"
            />
          </form>

          {/* Saved Searches button */}
          <Button className="h-10 bg-[#5758bb] hover:bg-[#4a4ba0] rounded-md flex items-center gap-2 px-4">
            <Search className="h-4 w-4" />
            <span className="text-sm font-medium">Saved Searches</span>
          </Button>

          {/* Refresh button */}
          <Button variant="outline" size="icon" className="h-10 w-10 border-[#d1d5db]">
            <RefreshCw className="h-4 w-4 text-[#6b7280]" />
          </Button>

          {/* Download button */}
          <Button variant="outline" size="icon" className="h-10 w-10 border-[#d1d5db]">
            <Download className="h-4 w-4 text-[#6b7280]" />
          </Button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white rounded-md shadow-md p-4 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#5758bb]" />
            <input
              type="text"
              placeholder="New Search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full h-10 pl-9 pr-4 border border-[#d1d5db] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5758bb] focus:border-transparent"
            />
          </form>
          
          <div className="flex space-x-2">
            <Button className="flex-1 bg-[#5758bb] hover:bg-[#4a4ba0] rounded-md flex items-center justify-center gap-2 py-2">
              <Search className="h-4 w-4" />
              <span className="text-sm font-medium">Saved Searches</span>
            </Button>
            
            <Button variant="outline" size="icon" className="h-10 w-10 border-[#d1d5db]">
              <RefreshCw className="h-4 w-4 text-[#6b7280]" />
            </Button>
            
            <Button variant="outline" size="icon" className="h-10 w-10 border-[#d1d5db]">
              <Download className="h-4 w-4 text-[#6b7280]" />
            </Button>
          </div>
        </div>
      )}

      {/* Hashtag and Compare panels */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Hashtag panel */}
        <div className="flex-1 bg-white rounded-md border border-[#e5e7eb] p-4 relative">
          <div className="flex items-center">
            <span className="text-[#e5007c] font-medium mr-1">hashtag:</span>
            {isEditingHashtag ? (
              <div className="flex items-center flex-1 overflow-hidden">
                <input
                  type="text"
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleHashtagSubmit()}
                  className="border border-[#5758bb] px-2 py-1 rounded-md text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#5758bb] w-full"
                  autoFocus
                />
                <button 
                  onClick={handleHashtagSubmit}
                  className="ml-2 p-1 rounded-full bg-[#5758bb] text-white shrink-0"
                >
                  <Check size={18} />
                </button>
              </div>
            ) : (
              <span className="font-medium text-[#1a1a1a] truncate max-w-[calc(100%-5rem)]">"{activeHashtag}"</span>
            )}
          </div>
          <button 
            className="absolute right-4 top-1/2 transform -translate-y-1/2" 
            aria-label={isEditingHashtag ? "Save hashtag" : "Edit hashtag"}
            onClick={() => {
              if (!isEditingHashtag) {
                setIsEditingHashtag(true);
                setHashtagInput(activeHashtag);
              }
            }}
          >
            {isEditingHashtag ? (
              <MoreVertical className="h-5 w-5 text-[#6b7280]" />
            ) : (
              <Edit className="h-5 w-5 text-[#6b7280]" />
            )}
          </button>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#e5007c]"></div>
        </div>

        {/* Compare panel */}
        <div className="w-full md:w-[50%] bg-white rounded-md border border-[#e5e7eb] p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-[#5758bb] flex items-center justify-center text-white mr-2">
              <Plus className="h-4 w-4" />
            </div>
            <span className="font-medium text-[#1a1a1a]">Compare</span>
          </div>
          <button aria-label="Maximize">
            <Maximize className="h-5 w-5 text-[#6b7280]" />
          </button>
        </div>
      </div>
    </div>
  )
}
