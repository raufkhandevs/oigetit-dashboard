'use client';

import { ChartCard } from '@/components/ui/chart-card';
import { GenderChart } from '@/components/charts/gender-chart';
import { HorizontalBarChart } from '@/components/charts/horizontal-bar-chart';
import { PieChart } from '@/components/charts/pie-chart';
import { AgeChart } from '@/components/charts/bar-chart';
import { useSentimentFilter } from '@/components/layout/dashboard-layout';
import {
  ageData,
  genderData,
  interestsData,
  languageData,
  nonBinaryData,
  occupationsData,
} from '@/app/chart-data';

export function DemographicsPage() {
  const { activeSentimentFilter } = useSentimentFilter();

  // Dynamic chart titles based on sentiment filter
  const getChartTitle = (baseTitle: string) => {
    if (activeSentimentFilter === 'all') return baseTitle;
    return `${baseTitle} (${
      activeSentimentFilter.charAt(0).toUpperCase() +
      activeSentimentFilter.slice(1)
    } Only)`;
  };

  return (
    <div className='space-y-4 p-6 bg-gray-100'>
      {activeSentimentFilter !== 'all' && (
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <svg
                className='h-5 w-5 text-blue-400'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div className='ml-3'>
              <p className='text-sm text-blue-800'>
                <span className='font-medium'>Sentiment Filter Active:</span>{' '}
                Showing only{' '}
                <span className='font-semibold capitalize'>
                  {activeSentimentFilter}
                </span>{' '}
                sentiment data
              </p>
            </div>
          </div>
        </div>
      )}

      {/* First row - Gender, Non Binary, Age */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <ChartCard
          showControls={true}
          title={getChartTitle('Gender')}
          className='relative'
        >
          <div className='h-[280px] p-3'>
            <GenderChart data={genderData} />
          </div>
        </ChartCard>

        <ChartCard
          title={getChartTitle('Non Binary Gender')}
          className='relative'
        >
          <div className='h-[280px] p-3'>
            <HorizontalBarChart
              data={nonBinaryData}
              title='Non Binary Gender'
            />
          </div>
        </ChartCard>

        <ChartCard title={getChartTitle('Age')} className='relative'>
          <div className='h-[280px] p-3'>
            <AgeChart data={ageData} />
          </div>
        </ChartCard>
      </div>

      {/* Second row - Languages, Interests, Occupations */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <ChartCard title={getChartTitle('Top Languages')} className='relative'>
          <div className='h-[280px] p-3'>
            <PieChart data={languageData} />
          </div>
        </ChartCard>

        <ChartCard title={getChartTitle('Top Interest')} className='relative'>
          <div className='h-[280px] p-3'>
            <HorizontalBarChart data={interestsData} title='Top Interest' />
          </div>
        </ChartCard>

        <ChartCard
          title={getChartTitle('Top Occupations')}
          className='relative'
        >
          <div className='h-[280px] p-3'>
            <HorizontalBarChart
              data={occupationsData}
              title='Top Occupations'
            />
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
