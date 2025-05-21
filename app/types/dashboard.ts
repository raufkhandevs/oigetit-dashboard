import type React from "react"
import { ReactNode } from "react"
// Common types used across dashboard components

export interface SidebarItem {
  id: string
  icon: ReactNode
  label: string
  isActive: boolean
}

export interface ChartDataPoint {
  name: string
  value: number
  color: string
  percentage?: number
}

export interface TooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: {
      name: string
      value: number
      color: string
      percentage?: number
      [key: string]: any
    }
  }>
  label?: string
}

// API data types
export interface HistogramDataPoint {
  pubdate: string
  volume: number
  volume_neg: number
  volume_pos: number
  volume_neu: number
  sentiment: number
  political_bias: number
  trusted: number
}
