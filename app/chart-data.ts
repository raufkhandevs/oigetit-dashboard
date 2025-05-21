import type { ChartDataPoint } from "@/app/types/dashboard"

// Gender data
export const genderData: ChartDataPoint[] = [
  { name: "Female", value: 42.3, color: "#8e7cc3" },
  { name: "Male", value: 57.7, color: "#76c7c0" },
]

// Non-binary gender data
export const nonBinaryData: ChartDataPoint[] = [
  { name: "she/her", value: 63, color: "#8e7cc3" },
  { name: "he/him", value: 18, color: "#76c7c0" },
  { name: "they/them", value: 13.1, color: "#e6937c" },
  { name: "they/he", value: 4.5, color: "#f6b26b" },
  { name: "they/she", value: 1.4, color: "#b6d7a8" },
]

// Age data
export const ageData: ChartDataPoint[] = [
  { name: "18-24", value: 34.8, color: "#ea4335" },
  { name: "25-34", value: 46.3, color: "#d979d4" },
  { name: "35-44", value: 14.4, color: "#6a5acd" },
  { name: "45-54", value: 3.4, color: "#45b6fe" },
  { name: "55-64", value: 1.1, color: "#00c2a0" },
  { name: "65+", value: 0, color: "#b8e986" },
]

// Language data
export const languageData: ChartDataPoint[] = [
  { name: "English", value: 74.9, color: "#ff5722" },
  { name: "Turkish", value: 16.1, color: "#9c27b0" },
  { name: "Spanish", value: 3, color: "#009688" },
  { name: "German", value: 2, color: "#03a9f4" },
  { name: "Other", value: 4, color: "#607d8b" },
]

// Top interests data
export const interestsData: ChartDataPoint[] = [
  { name: "Family and Parenting", value: 20.7, color: "#3f51b5" },
  { name: "Sports", value: 7, color: "#e57373" },
  { name: "Music & Audio", value: 6.6, color: "#5c6bc0" },
  { name: "Literature/Books", value: 6.5, color: "#7986cb" },
  { name: "Animals", value: 5.9, color: "#26a69a" },
  { name: "Celebrities & Entertainment News", value: 5.5, color: "#5c6bc0" },
  { name: "Art", value: 3.4, color: "#7e57c2" },
  { name: "General Education", value: 3.3, color: "#9575cd" },
  { name: "Food & Drinks", value: 3.2, color: "#4db6ac" },
  { name: "Other", value: 37.9, color: "#757575" },
]

// Top occupations data
export const occupationsData: ChartDataPoint[] = [
  { name: "Author/Writer", value: 13.2, color: "#00bcd4" },
  { name: "Artist/Art", value: 11.8, color: "#ec407a" },
  { name: "Executive manager", value: 6.9, color: "#7986cb" },
  { name: "Health worker", value: 6.7, color: "#5c6bc0" },
  { name: "Entrepreneur", value: 5.5, color: "#ff9800" },
  { name: "Teacher", value: 5.5, color: "#ffa726" },
  { name: "Engineer", value: 5.5, color: "#ef5350" },
  { name: "Musician", value: 5.1, color: "#ab47bc" },
  { name: "Designer", value: 3.2, color: "#ec407a" },
  { name: "Other", value: 36.6, color: "#757575" },
]
