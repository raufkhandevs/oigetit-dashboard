import type React from 'react';
import { Maximize, BarChart2, MoreVertical } from 'lucide-react';

export function MetricCard({
  title,
  value,
  className = '',
  hasControls = true,
}: {
  title: string;
  value: string | React.ReactNode;
  className?: string;
  hasControls?: boolean;
}) {
  return (
    <div className={`bg-white rounded-md shadow-sm ${className} h-full`}>
      <div className='p-4 border-b flex justify-between items-center'>
        <h3 className='text-gray-700 font-medium'>{title}</h3>
        {hasControls && (
          <div className='flex space-x-1'>
            <button className='p-1 hover:bg-gray-100 rounded'>
              <svg
                width='18'
                height='18'
                viewBox='0 0 18 18'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fill-rule='evenodd'
                  clip-rule='evenodd'
                  d='M12 0.75C12 0.335786 12.3358 0 12.75 0L17.25 1.78814e-07C17.6642 2.23517e-07 18 0.335787 18 0.75V5.25C18 5.66421 17.6642 6 17.25 6C16.8358 6 16.5 5.66421 16.5 5.25V2.56066L12.5303 6.53033C12.2374 6.82322 11.7626 6.82322 11.4697 6.53033C11.1768 6.23744 11.1768 5.76256 11.4697 5.46967L15.4393 1.5H12.75C12.3358 1.5 12 1.16421 12 0.75ZM0 0.75C0 0.335787 0.335786 1.78814e-07 0.75 1.78814e-07H5.25C5.66421 1.78814e-07 6 0.335787 6 0.75C6 1.16421 5.66421 1.5 5.25 1.5H2.56066L6.53033 5.46967C6.82322 5.76256 6.82322 6.23744 6.53033 6.53033C6.23744 6.82322 5.76256 6.82322 5.46967 6.53033L1.5 2.56066V5.25C1.5 5.66421 1.16421 6 0.75 6C0.335786 6 0 5.66421 0 5.25V0.75ZM11.4697 12.5303C11.1768 12.2374 11.1768 11.7626 11.4697 11.4697C11.7626 11.1768 12.2374 11.1768 12.5303 11.4697L16.5 15.4393V12.75C16.5 12.3358 16.8358 12 17.25 12C17.6642 12 18 12.3358 18 12.75V17.25C18 17.6642 17.6642 18 17.25 18H12.75C12.3358 18 12 17.6642 12 17.25C12 16.8358 12.3358 16.5 12.75 16.5H15.4393L11.4697 12.5303ZM6.53033 11.4697C6.82322 11.7626 6.82322 12.2374 6.53033 12.5303L2.56066 16.5H5.25C5.66421 16.5 6 16.8358 6 17.25C6 17.6642 5.66421 18 5.25 18H0.75C0.335786 18 0 17.6642 0 17.25V12.75C0 12.3358 0.335786 12 0.75 12C1.16421 12 1.5 12.3358 1.5 12.75V15.4393L5.46967 11.4697C5.76256 11.1768 6.23744 11.1768 6.53033 11.4697Z'
                  fill='#606060'
                />
              </svg>
            </button>
            <button className='p-1 hover:bg-gray-100 rounded'>
              <svg
                width='19'
                height='18'
                viewBox='0 0 19 18'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M2.24389 15.8156H17.2164C17.7677 15.8156 18.2146 16.2582 18.2146 16.8041C18.2146 17.35 17.7677 17.7926 17.2164 17.7926H1.24573C0.694453 17.7926 0.247559 17.35 0.247559 16.8041V0.988475C0.247559 0.442555 0.694453 0 1.24573 0C1.797 0 2.24389 0.442555 2.24389 0.988475V15.8156Z'
                  fill='#606060'
                />
                <path
                  opacity='0.5'
                  d='M5.9666 11.5486C5.58957 11.9469 4.95789 11.9671 4.55572 11.5937C4.15354 11.2203 4.13317 10.5948 4.5102 10.1965L8.25333 6.24263C8.61797 5.85746 9.2239 5.82405 9.62946 6.16677L12.5838 8.6633L16.433 3.835C16.7746 3.40651 17.4022 3.33339 17.8349 3.67166C18.2676 4.00994 18.3414 4.63152 17.9999 5.06L13.5081 10.6943C13.1573 11.1344 12.5074 11.1977 12.0767 10.8337L9.05822 8.28294L5.9666 11.5486Z'
                  fill='#606060'
                />
              </svg>
            </button>
            <button className='p-1 hover:bg-gray-100 rounded'>
              <MoreVertical className='w-4 h-4 text-gray-500' />
            </button>
          </div>
        )}
      </div>
      <div className='p-8 flex items-center justify-center'>
        {typeof value === 'string' ? (
          <div className='text-5xl font-bold text-gray-800'>{value}</div>
        ) : (
          value
        )}
      </div>
    </div>
  );
}
