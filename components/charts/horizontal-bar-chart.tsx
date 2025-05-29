import type { ChartDataPoint } from '@/app/types/dashboard';

interface HorizontalBarChartProps {
  data: ChartDataPoint[];
  title: string;
  maxValue?: number;
}

export function HorizontalBarChart({
  data,
  title,
  maxValue = 70,
}: HorizontalBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className='h-full w-full flex items-center justify-center text-gray-500'>
        No data available
      </div>
    );
  }

  const ticks = Array.from({ length: 6 }, (_, i) =>
    Math.round(i * (maxValue / 5))
  );

  const getBarHeight = () => {
    if (data.length <= 5) return 32;
    if (data.length <= 7) return 24;
    return 18;
  };

  const barHeight = getBarHeight();
  const gap = Math.max(4, Math.min(8, 60 / data.length));

  return (
    <div className='h-full w-full flex flex-col'>
      <div className='flex-1 min-h-0 overflow-hidden'>
        <div className='h-full flex flex-col justify-between p-2'>
          {data.map((entry, index) => (
            <div
              key={entry.name}
              className='relative flex items-center w-full'
              style={{
                height: `${barHeight}px`,
                marginBottom: index < data.length - 1 ? `${gap}px` : '0',
              }}
            >
              <div className='absolute left-0 top-0 w-full h-full bg-gray-100 rounded-md' />

              <div
                className='relative flex items-center h-full shadow-sm'
                style={{
                  width: `${Math.max(15, (entry.value / maxValue) * 100)}%`,
                  background: entry.color,
                  minWidth: '60px',
                }}
              >
                <span
                  className={`pl-2 pr-1 font-semibold text-white drop-shadow-md truncate ${
                    barHeight > 28 ? 'text-sm' : 'text-xs'
                  }`}
                >
                  {entry.name}
                </span>
              </div>

              <div className='absolute right-2 flex items-center h-full'>
                <div
                  className={`bg-white rounded-lg px-2 py-1 font-semibold text-gray-800 shadow border border-gray-200 ${
                    barHeight > 28 ? 'text-sm' : 'text-xs'
                  }`}
                >
                  {entry.value}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='flex-shrink-0 px-2 pb-1 pt-2 border-t border-gray-100'>
        <div className='flex justify-between text-xs text-gray-500'>
          {ticks.map((tick) => (
            <div key={tick}>{tick}%</div>
          ))}
        </div>
      </div>
    </div>
  );
}
