"use client"

import { ChartCard } from "@/components/ui/chart-card"
import { GenderChart } from "@/components/charts/gender-chart"
import { HorizontalBarChart } from "@/components/charts/horizontal-bar-chart"
import { PieChartLanguage } from "@/components/charts/pie-chart"
import { AgeChart } from "@/components/charts/bar-chart"
import { ageData, genderData, interestsData, languageData, nonBinaryData, occupationsData } from "@/app/chart-data"

export function DemographicsPage() {

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ChartCard title="Gender">
          <GenderChart data={genderData} />
        </ChartCard>

        <ChartCard title="Non Binary Gender">
          <HorizontalBarChart data={nonBinaryData} title="Non Binary Gender" />
        </ChartCard>

        <ChartCard title="Age">
          <AgeChart data={ageData} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ChartCard title="Top Languages">
          <PieChartLanguage data={languageData} />
        </ChartCard>

        <ChartCard title="Top Interest">
          <HorizontalBarChart data={interestsData} title="Top Interest" />
        </ChartCard>

        <ChartCard title="Top Occupations">
          <HorizontalBarChart data={occupationsData} title="Top Occupations" />
        </ChartCard>
      </div>
    </div>
  )
}
