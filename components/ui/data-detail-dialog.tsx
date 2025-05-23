"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface DataDetailDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  data: Record<string, any>
  date?: string
}

export function DataDetailDialog({ isOpen, onClose, title, data, date }: DataDetailDialogProps) {
  if (!isOpen) return null

  // Format values for display
  const formatValue = (key: string, value: any): string => {
    if (typeof value === 'number') {
      if (key.toLowerCase().includes('sentiment')) {
        return `${value.toFixed(2)}%`
      }
      if (key.toLowerCase().includes('volume') || key.toLowerCase().includes('count')) {
        return value.toLocaleString()
      }
      return value.toFixed(2)
    }
    return String(value)
  }

  // Format key names for display
  const formatKey = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (str) => str.toUpperCase())
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Dialog Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            {date && (
              <p className="text-sm text-gray-500 mt-1">Date: {date}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Dialog Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 bg-gray-50">
                      Metric
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 bg-gray-50">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(data).map(([key, value], index) => (
                    <tr key={key} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="py-3 px-4 text-gray-700 font-medium">
                        {formatKey(key)}
                      </td>
                      <td className="py-3 px-4 text-gray-900">
                        {formatValue(key, value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Dialog Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
} 