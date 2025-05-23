"use client"

import { useState, useEffect } from "react"
import { X, ExternalLink, Calendar, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Article } from "@/app/api/services"

interface ArticlesDialogProps {
  isOpen: boolean
  onClose: () => void
  articles: Article[]
  isLoading: boolean
  error: any
  date: string
  hashtag?: string
  totalCount: number
}

export function ArticlesDialog({ 
  isOpen, 
  onClose, 
  articles, 
  isLoading, 
  error, 
  date, 
  hashtag,
  totalCount 
}: ArticlesDialogProps) {
  const [sortField, setSortField] = useState<keyof Article>('pubdate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      
      return () => {
        // Restore scroll position
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSort = (field: keyof Article) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const sortedArticles = [...(articles || [])].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }
    
    return 0
  })

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return dateString
    }
  }

  const getSentimentIcon = (happiness: number) => {
    if (happiness > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (happiness < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-gray-500" />
  }

  const getSentimentColor = (happiness: number) => {
    if (happiness > 0) return 'text-green-600'
    if (happiness < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" style={{ marginTop: 'unset' }}
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg w-full max-w-7xl h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Articles for {hashtag?.replace('#', '') || date}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {isLoading ? 'Loading...' : `${totalCount} articles found`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading articles...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-red-600 mb-2">Error loading articles</p>
                <p className="text-sm text-gray-500">{error.message || 'Unknown error'}</p>
              </div>
            </div>
          ) : articles && articles.length > 0 ? (
            <div className="h-full overflow-auto rounded-b-lg">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('title')}
                    >
                      Title {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('feed')}
                    >
                      Source {sortField === 'feed' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('pubdate')}
                    >
                      Date {sortField === 'pubdate' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('happiness')}
                    >
                      Sentiment {sortField === 'happiness' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('trusted')}
                    >
                      Trust {sortField === 'trusted' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Link
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedArticles.map((article, index) => (
                    <tr key={article.id || index} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm">
                        <div className="max-w-xs">
                          <p className="font-medium text-gray-900 line-clamp-2">{article.title}</p>
                          {article.description && (
                            <p className="text-gray-500 text-xs mt-1 line-clamp-2">{article.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        <div className="max-w-24 truncate">{article.feed}</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-xs">{formatDate(article.pubdate)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <div className="flex items-center">
                          {getSentimentIcon(article.happiness)}
                          <span className={`ml-1 ${getSentimentColor(article.happiness)}`}>
                            {article.happiness > 0 ? '+' : ''}{article.happiness}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.min(article.trusted * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {(article.trusted * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {article.urllink && article.urllink !== '-' && (
                          <a 
                            href={article.urllink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-600">No articles found</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 