'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  Search,
  MoreVertical,
  RefreshCw,
  Download,
  Plus,
  Maximize,
  Edit,
  Check,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHashtag } from '@/components/layout/dashboard-layout';
import Link from 'next/link';

export default function PageHeader() {
  const { activeHashtag, setActiveHashtag } = useHashtag();
  const [isEditingHashtag, setIsEditingHashtag] = useState(false);
  const [hashtagInput, setHashtagInput] = useState(activeHashtag);
  const [searchInput, setSearchInput] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [pageTitle, setPageTitle] = useState('Dashboard');

  useEffect(() => {
    const getPageTitle = () => {
      const path = pathname.slice(1) || 'key-metrics';

      if (path === '') return 'Key Metrics';

      if (path === 'world-map') return 'World Map';
      if (path === 'top-themes') return 'Top Themes';
      if (path === 'key-metrics') return 'Key Metrics';

      return path.charAt(0).toUpperCase() + path.slice(1);
    };

    setPageTitle(getPageTitle());
  }, [pathname]);

  const handleHashtagSubmit = () => {
    let formattedHashtag = hashtagInput.trim();
    if (!formattedHashtag.startsWith('#') && formattedHashtag.length > 0) {
      formattedHashtag = '#' + formattedHashtag;
    }

    setActiveHashtag(formattedHashtag);
    setIsEditingHashtag(false);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchInput.trim()) {
      let formattedHashtag = searchInput.trim();
      if (!formattedHashtag.startsWith('#') && formattedHashtag.length > 0) {
        formattedHashtag = '#' + formattedHashtag;
      }

      setActiveHashtag(formattedHashtag);
      setSearchInput('');
      setIsMobileMenuOpen(false);
    } else {
      console.log('Please enter a search term');
    }
  };

  const handleSavedSearchClick = () => {
    if (!searchInput.trim()) {
      alert('Please enter a search term first');
      return;
    }
    handleSearchSubmit();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleRefresh = () => {
    console.log('Refresh clicked');
  };

  return (
    <div className='w-full bg-[#f1f1f1] p-4 lg:p-6 space-y-8'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl md:text-2xl lg:text-[32px] font-medium text-[#1a1a1a]'>
          {pageTitle}
        </h1>

        <div className='lg:hidden'>
          <Button
            variant='ghost'
            size='sm'
            onClick={toggleMobileMenu}
            className='h-8 w-8 p-0'
          >
            <Menu className='h-5 w-5' />
          </Button>
        </div>

        <div className='hidden lg:flex items-center gap-2'>
          <form onSubmit={handleSearchSubmit} className='relative h-10'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#5758bb]' />
            <input
              type='text'
              placeholder='New Search'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className='h-full pl-9 pr-4 placeholder:text-[#345199] rounded-md border border-[#345199] focus:outline-none focus:ring-2 focus:ring-[#5758bb] focus:border-transparent w-[180px]'
            />
          </form>
          <Button
            className='h-10 bg-[#5758bb] hover:bg-[#4a4ba0] flex items-center gap-2 px-4'
            onClick={handleSavedSearchClick}
          >
            <Search className='h-4 w-4' />
            <span className='text-sm font-medium'>Saved Searches</span>
          </Button>
          <Link href={'#'}>
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M16.023 9.34841H21.0156V9.34663M2.98438 19.6444V14.6517M2.98438 14.6517L7.97702 14.6517M2.98438 14.6517L6.16527 17.8347C7.15579 18.8271 8.41285 19.58 9.8646 19.969C14.2657 21.1483 18.7895 18.5364 19.9687 14.1353M4.03097 9.86484C5.21024 5.46374 9.73402 2.85194 14.1351 4.03121C15.5869 4.4202 16.8439 5.17312 17.8345 6.1655L21.0156 9.34663M21.0156 4.3558V9.34663'
                stroke='#345199'
                stroke-width='1.5'
                stroke-linecap='round'
                stroke-linejoin='round'
              />
            </svg>
          </Link>
          |
          <Link href={'#'}>
            <svg
              width='18'
              height='24'
              viewBox='0 0 18 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M4.5 7.5H3.75C2.50736 7.5 1.5 8.50736 1.5 9.75V17.25C1.5 18.4926 2.50736 19.5 3.75 19.5H11.25C12.4926 19.5 13.5 18.4926 13.5 17.25V9.75C13.5 8.50736 12.4926 7.5 11.25 7.5H10.5M4.5 11.25L7.5 14.25M7.5 14.25L10.5 11.25M7.5 14.25L7.5 1.5M13.5 10.5H14.25C15.4926 10.5 16.5 11.5074 16.5 12.75V20.25C16.5 21.4926 15.4926 22.5 14.25 22.5H6.75C5.50736 22.5 4.5 21.4926 4.5 20.25V19.5'
                stroke='#345199'
                stroke-width='1.5'
                stroke-linecap='round'
                stroke-linejoin='round'
              />
            </svg>
          </Link>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className='lg:hidden bg-white rounded-md shadow-md p-4 space-y-4'>
          <form onSubmit={handleSearchSubmit} className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#5758bb]' />
            <input
              type='text'
              placeholder='New Search'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className='w-full h-10 pl-9 pr-4 border border-[#d1d5db] focus:outline-none focus:ring-2 focus:ring-[#5758bb] focus:border-transparent'
            />
          </form>

          <div className='flex space-x-2'>
            <Button
              className='flex-1 bg-[#5758bb] hover:bg-[#4a4ba0] flex items-center justify-center gap-2 py-2'
              onClick={handleSavedSearchClick}
            >
              <Search className='h-4 w-4' />
              <span className='text-sm font-medium'>Saved Searches</span>
            </Button>

            <Button
              variant='outline'
              size='icon'
              className='h-10 w-10 border-[#d1d5db]'
              onClick={handleRefresh}
            >
              <RefreshCw className='h-4 w-4 text-[#6b7280]' />
            </Button>

            <Button
              variant='outline'
              size='icon'
              className='h-10 w-10 border-[#d1d5db]'
            >
              <Download className='h-4 w-4 text-[#6b7280]' />
            </Button>
          </div>
        </div>
      )}

      <div className='flex flex-col md:flex-row gap-4'>
        <div className='flex-1 bg-white rounded-md border border-[#e5e7eb] p-4 relative shadow-md'>
          <div className='flex items-center'>
            <span className='text-[#e5007c] font-medium mr-1'>hashtag:</span>
            {isEditingHashtag ? (
              <div className='flex items-center flex-1 overflow-hidden'>
                <input
                  type='text'
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleHashtagSubmit()}
                  className='border border-[#5758bb] px-2 py-1 rounded-md text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#5758bb] w-full'
                  autoFocus
                />
                <button
                  onClick={() => {
                    handleHashtagSubmit();
                  }}
                  className='ml-2 p-1 rounded-full bg-[#5758bb] text-white shrink-0'
                >
                  <Check
                    size={18}
                    onClick={() => {
                      handleHashtagSubmit();
                      setIsEditingHashtag(false);
                    }}
                  />
                </button>
              </div>
            ) : (
              <span className='font-medium text-[#1a1a1a] truncate max-w-[calc(100%-5rem)]'>
                "{activeHashtag}"
              </span>
            )}
          </div>
          <button
            className='absolute right-4 top-1/2 transform -translate-y-1/2'
            aria-label={isEditingHashtag ? 'Save hashtag' : 'Edit hashtag'}
            onClick={() => {
              if (!isEditingHashtag) {
                setIsEditingHashtag(true);
                setHashtagInput(activeHashtag);
              }
            }}
          >
            {!isEditingHashtag && <Edit className='h-5 w-5 text-[#6b7280]' />}
          </button>
          <div className='absolute bottom-0 left-0 right-0 h-[2px] bg-[#e5007c]'></div>
        </div>

        <div className='w-full md:w-[50%] bg-white rounded-md border border-[#e5e7eb] p-4 flex items-center justify-between shadow-lg'>
          <div className='flex items-center'>
            <div className='w-6 h-6 rounded-full bg-[#5758bb] flex items-center justify-center text-white mr-2'>
              <Plus className='h-4 w-4' />
            </div>
            <span className='font-medium text-[#1a1a1a]'>Compare</span>
          </div>
          <button aria-label='Maximize'>
            <svg
              width='22'
              height='22'
              viewBox='0 0 22 22'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M8.8132 14.9038L8 17.75L7.1868 14.9038C6.75968 13.4089 5.59112 12.2403 4.09619 11.8132L1.25 11L4.09619 10.1868C5.59113 9.75968 6.75968 8.59112 7.1868 7.09619L8 4.25L8.8132 7.09619C9.24032 8.59113 10.4089 9.75968 11.9038 10.1868L14.75 11L11.9038 11.8132C10.4089 12.2403 9.24032 13.4089 8.8132 14.9038Z'
                stroke='#0F172A'
                stroke-width='1.5'
                stroke-linecap='round'
                stroke-linejoin='round'
              />
              <path
                d='M17.2589 7.71454L17 8.75L16.7411 7.71454C16.4388 6.50533 15.4947 5.56117 14.2855 5.25887L13.25 5L14.2855 4.74113C15.4947 4.43883 16.4388 3.49467 16.7411 2.28546L17 1.25L17.2589 2.28546C17.5612 3.49467 18.5053 4.43883 19.7145 4.74113L20.75 5L19.7145 5.25887C18.5053 5.56117 17.5612 6.50533 17.2589 7.71454Z'
                stroke='#0F172A'
                stroke-width='1.5'
                stroke-linecap='round'
                stroke-linejoin='round'
              />
              <path
                d='M15.8942 19.5673L15.5 20.75L15.1058 19.5673C14.8818 18.8954 14.3546 18.3682 13.6827 18.1442L12.5 17.75L13.6827 17.3558C14.3546 17.1318 14.8818 16.6046 15.1058 15.9327L15.5 14.75L15.8942 15.9327C16.1182 16.6046 16.6454 17.1318 17.3173 17.3558L18.5 17.75L17.3173 18.1442C16.6454 18.3682 16.1182 18.8954 15.8942 19.5673Z'
                stroke='#0F172A'
                stroke-width='1.5'
                stroke-linecap='round'
                stroke-linejoin='round'
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
