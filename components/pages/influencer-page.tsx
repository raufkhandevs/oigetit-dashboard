"use client"

import { ChartCard } from "@/components/ui/chart-card"
import { PieChart } from "@/components/charts/pie-chart"
import { useInfluencers } from "@/app/hooks/use-api-data"
import { useTimeRange, useHashtag, useSentimentFilter } from "@/components/layout/dashboard-layout"
import { Maximize, MoreVertical, ChevronRight } from "lucide-react"
import { useState } from "react"

export function InfluencerPage() {
  const { activeTimeRange } = useTimeRange()
  const { activeHashtag } = useHashtag()
  const { activeSentimentFilter } = useSentimentFilter()
  const { data: influencers, isLoading } = useInfluencers(activeTimeRange)
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null)

  const mediaTypeData = [
    { name: "Twitter", value: 75, color: "#1DA1F2" },
    { name: "Blue Sky", value: 10, color: "#9c27b0" },
    { name: "Youtube", value: 8, color: "#FF0000" },
    { name: "Paper", value: 3, color: "#03a9f4" },
    { name: "Blog", value: 2, color: "#009688" },
    { name: "Other", value: 2, color: "#8bc34a" },
  ]

  const toggleExpandMobile = (id: string) => {
    if (expandedMobile === id) {
      setExpandedMobile(null)
    } else {
      setExpandedMobile(id)
    }
  }

  // Dynamic chart titles based on sentiment filter
  const getChartTitle = (baseTitle: string) => {
    if (activeSentimentFilter === 'all') return baseTitle;
    return `${baseTitle} (${activeSentimentFilter.charAt(0).toUpperCase() + activeSentimentFilter.slice(1)} Only)`;
  };

  return (
    <div className="space-y-4 p-6 bg-gray-100">
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

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Left sidebar with stats cards */}
        <div className="xl:col-span-1 space-y-4">
          <ChartCard title={getChartTitle("Unique Author")} className="relative">
            <div className="h-[200px] flex items-center justify-center">
              <span className="text-4xl lg:text-6xl font-bold text-gray-800">15.6K</span>
            </div>
          </ChartCard>
          
          <ChartCard title={getChartTitle("Share Of Media Type")} className="relative">
            <div className="h-[250px]">
              <PieChart data={mediaTypeData} />
            </div>
          </ChartCard>
        </div>

        <div className="xl:col-span-3">
          <ChartCard title={getChartTitle("Top Influencers")} className="relative h-full">
            <div className="hidden lg:block h-full">
              <div className="overflow-auto ">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-200 bg-gray-50 sticky top-0">
                    <tr>
                      <th className="h-12 px-4 text-left align-middle font-medium text-gray-600">
                        Influencer
                      </th>
                      <th className="h-12 px-4 text-center align-middle font-medium text-gray-600">
                        Network
                      </th>
                      <th className="h-12 px-4 text-center align-middle font-medium text-gray-600">
                        Network Value
                      </th>
                      <th className="h-12 px-4 text-center align-middle font-medium text-gray-600">
                        Reach
                      </th>
                      <th className="h-12 px-4 text-center align-middle font-medium text-gray-600">
                        Reach Per Mention
                      </th>
                      <th className="h-12 px-4 text-center align-middle font-medium text-gray-600">
                        Engagement
                      </th>
                      <th className="h-12 px-4 text-center align-middle font-medium text-gray-600">
                        Engagement Per Mention
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-gray-500">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                            Loading influencer data...
                          </div>
                        </td>
                      </tr>
                    ) : influencers && influencers.length > 0 ? (
                      influencers.map((influencer, index) => (
                        <tr key={influencer.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-[#8344AD] mr-3 flex items-center justify-center text-white text-sm font-medium overflow-hidden flex-shrink-0">
                                {influencer.avatar ? (
                                  <img src={influencer.avatar} alt={influencer.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span>{influencer.name.substring(0, 2).toUpperCase()}</span>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center">
                                  <span className="font-medium text-gray-900 truncate">{influencer.name}</span>
                                  {influencer.verified && (
                                    <div className="ml-2 flex-shrink-0">
                                      <svg width="16" height="16" viewBox="0 0 16 16" fill="#1D9BF0">
                                        <path d="M8 1.28a6.72 6.72 0 1 0 0 13.44A6.72 6.72 0 0 0 8 1.28zM7.45 11.1L4.28 8.5l1.1-.99 2.07 1.84 3.2-3.15 1.1.94-4.3 3.96z"/>
                                      </svg>
                                    </div>
                                  )}
                                </div>
                                <div className="text-sm text-gray-500 truncate">{influencer.handle}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <div className="flex justify-center">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                              </svg>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center font-medium text-gray-900">{influencer.networkValue}</td>
                          <td className="px-4 py-4 text-center font-medium text-gray-900">{influencer.reach}</td>
                          <td className="px-4 py-4 text-center font-medium text-gray-900">{influencer.reachPerMention}</td>
                          <td className="px-4 py-4 text-center font-medium text-gray-900">{influencer.engagement}</td>
                          <td className="px-4 py-4 text-center font-medium text-gray-900">{influencer.engagementPerMention}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-gray-500">
                          No influencer data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Mobile Cards */}
            <div className="lg:hidden">
              {isLoading ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                    Loading influencer data...
                  </div>
                </div>
              ) : influencers && influencers.length > 0 ? (
                <div className="space-y-3">
                  {influencers.map((influencer, index) => (
                    <div key={influencer.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                      <div 
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => toggleExpandMobile(influencer.id)}
                      >
                        <div className="flex items-center min-w-0 flex-1">
                          <div className="w-10 h-10 rounded-full bg-[#8344AD] mr-3 flex items-center justify-center text-white text-sm font-medium overflow-hidden flex-shrink-0">
                            {influencer.avatar ? (
                              <img src={influencer.avatar} alt={influencer.name} className="w-full h-full object-cover" />
                            ) : (
                              <span>{influencer.name.substring(0, 2).toUpperCase()}</span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center">
                              <span className="font-medium text-gray-900 truncate">{influencer.name}</span>
                              {influencer.verified && (
                                <span className="ml-2 flex-shrink-0">
                                  <svg width="16" height="16" viewBox="0 0 16 16" fill="#1D9BF0">
                                    <path d="M8 1.28a6.72 6.72 0 1 0 0 13.44A6.72 6.72 0 0 0 8 1.28zM7.45 11.1L4.28 8.5l1.1-.99 2.07 1.84 3.2-3.15 1.1.94-4.3 3.96z"/>
                                  </svg>
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="text-sm text-gray-500 truncate">{influencer.handle}</div>
                              <div className="flex-shrink-0">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="#000000">
                                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        <ChevronRight 
                          className={`h-5 w-5 text-gray-400 transition-transform flex-shrink-0 ml-2 ${
                            expandedMobile === influencer.id ? 'rotate-90' : ''
                          }`} 
                        />
                      </div>
                      
                      {expandedMobile === influencer.id && (
                        <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
                          <div className="grid grid-cols-2 gap-4 pt-3">
                            <div>
                              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Network Value</div>
                              <div className="text-sm font-medium text-gray-900 mt-1">{influencer.networkValue}</div>
                            </div>
                            <div>
                              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Reach</div>
                              <div className="text-sm font-medium text-gray-900 mt-1">{influencer.reach}</div>
                            </div>
                            <div>
                              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Reach Per Mention</div>
                              <div className="text-sm font-medium text-gray-900 mt-1">{influencer.reachPerMention}</div>
                            </div>
                            <div>
                              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</div>
                              <div className="text-sm font-medium text-gray-900 mt-1">{influencer.engagement}</div>
                            </div>
                            <div className="col-span-2">
                              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement Per Mention</div>
                              <div className="text-sm font-medium text-gray-900 mt-1">{influencer.engagementPerMention}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No influencer data available
                </div>
              )}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  )
}
