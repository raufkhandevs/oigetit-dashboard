"use client"

import { ChartCard } from "@/components/ui/chart-card"
import { MetricCard } from "@/components/ui/metric-card"
import { PieChart } from "@/components/charts/pie-chart"
import { useInfluencers } from "@/app/hooks/use-api-data"
import { useTimeRange, useHashtag } from "@/components/layout/dashboard-layout"
import { Maximize, MoreVertical, ChevronRight } from "lucide-react"
import { useState } from "react"

export function InfluencerPage() {
  const { activeTimeRange } = useTimeRange()
  const { activeHashtag } = useHashtag()
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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-col">
        <div className="col-span-1 flex-col flex gap-4">
            <div><ChartCard title="Unique Author" className="relative">
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="text-gray-500 hover:text-gray-700">
                  <Maximize size={18} />
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <MoreVertical size={18} />
                </button>
              </div>
              <div className="h-[200px] md:h-[300px] flex items-center justify-center">
                <span className="text-5xl md:text-8xl font-bold text-gray-800">15.6K</span>
              </div>
            </ChartCard>
            </div>
            {/* Media Type Chart */}
        <div className="col-span-1">
          <ChartCard title="Share Of Media Type" className="relative">
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="text-gray-500 hover:text-gray-700">
                <Maximize size={18} />
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <MoreVertical size={18} />
              </button>
            </div>
            <PieChart data={mediaTypeData} />
          </ChartCard>
        </div>
        </div>

      {/* Influencer Table - Desktop Version (Hidden on Mobile) */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden col-span-3">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b border-gray-200">
              <tr className="border-b">
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-600">
                  Influencer
                </th>
                <th className="h-12 px-4 text-center align-middle font-medium text-gray-600">
                  Network
                </th>
                <th className="h-12 px-4 text-center align-middle font-medium text-gray-600">
                  Network
                </th>
                <th className="h-12 px-4 text-center align-middle font-medium text-gray-600">
                  Reach
                </th>
                <th className="h-12 px-4 text-center align-middle font-medium text-gray-600">
                  Reach Per<br />Mention
                </th>
                <th className="h-12 px-4 text-center align-middle font-medium text-gray-600">
                  Engagement
                </th>
                <th className="h-12 px-4 text-center align-middle font-medium text-gray-600">
                  Engagement<br />Per Mention
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {isLoading ? (
                <tr className="border-b border-gray-200">
                  <td colSpan={7} className="p-4 text-center">Loading influencer data...</td>
                </tr>
              ) : (
                influencers?.map((influencer) => (
                  <tr key={influencer.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-[#8344AD] mr-3 flex items-center justify-center text-white overflow-hidden">
                          {influencer.avatar ? (
                            <img src={influencer.avatar} alt={influencer.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>CA</span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium">{influencer.name}</span>
                            {influencer.verified && (
                              <span className="ml-1">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="#1D9BF0">
                                  <path d="M8 1.28a6.72 6.72 0 1 0 0 13.44A6.72 6.72 0 0 0 8 1.28zM7.45 11.1L4.28 8.5l1.1-.99 2.07 1.84 3.2-3.15 1.1.94-4.3 3.96z"/>
                                </svg>
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{influencer.handle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#000000">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">{influencer.networkValue}</td>
                    <td className="px-4 py-3 text-center">{influencer.reach}</td>
                    <td className="px-4 py-3 text-center">{influencer.reachPerMention}</td>
                    <td className="px-4 py-3 text-center">{influencer.engagement}</td>
                    <td className="px-4 py-3 text-center">{influencer.engagementPerMention}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Mobile Influencer Cards (Hidden on Desktop) */}
      <div className="md:hidden space-y-4 col-span-3">
        <h3 className="font-medium text-lg text-gray-700 px-1">Top Influencers for {activeHashtag}</h3>
        
        {isLoading ? (
          <div className="p-8 text-center bg-white rounded-lg shadow">Loading influencer data...</div>
        ) : (
          <div className="space-y-3">
            {influencers?.map((influencer) => (
              <div key={influencer.id} className="bg-white rounded-lg shadow overflow-hidden">
                {/* Card Header with influencer info */}
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => toggleExpandMobile(influencer.id)}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#8344AD] mr-3 flex items-center justify-center text-white overflow-hidden">
                      {influencer.avatar ? (
                        <img src={influencer.avatar} alt={influencer.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>CA</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium">{influencer.name}</span>
                        {influencer.verified && (
                          <span className="ml-1">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="#1D9BF0">
                              <path d="M8 1.28a6.72 6.72 0 1 0 0 13.44A6.72 6.72 0 0 0 8 1.28zM7.45 11.1L4.28 8.5l1.1-.99 2.07 1.84 3.2-3.15 1.1.94-4.3 3.96z"/>
                            </svg>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm text-gray-500">{influencer.handle}</div>
                        <div className="flex justify-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="#000000">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ChevronRight 
                    className={`h-5 w-5 text-gray-500 transition-transform ${expandedMobile === influencer.id ? 'rotate-90' : ''}`} 
                  />
                </div>
                
                {/* Expandable content */}
                {expandedMobile === influencer.id && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-500">Network Value</div>
                        <div className="font-medium">{influencer.networkValue}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Reach</div>
                        <div className="font-medium">{influencer.reach}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Reach Per Mention</div>
                        <div className="font-medium">{influencer.reachPerMention}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Engagement</div>
                        <div className="font-medium">{influencer.engagement}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-xs text-gray-500">Engagement Per Mention</div>
                        <div className="font-medium">{influencer.engagementPerMention}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      </div>
    </div>
  )
}
