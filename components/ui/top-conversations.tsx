import { CheckCircle, BarChart2, MoreVertical, Maximize2, MessageCircle } from "lucide-react";
import Image from "next/image";
import { ChartCard } from "./chart-card";
import { useTimeRange, useHashtag, useSentimentFilter } from "@/components/layout/dashboard-layout"

const dummyConversations = [
  {
    id: 1,
    avatar: "/avatar1.png", // Replace with a real image or use a placeholder
    name: "Charlotte Austin",
    handle: "itscharlotty",
    verified: true,
    headline: "LADYBEE from THAILAND",
    link: "x.com/ewaraha/status...",
    content:
      "@EWaraha: YOU CAN CALL ME .... LADYBEE !! #ENGFAxRedSealIFF #\n\u0E2D\u0E07\u0E1F\u0E49\u0E32\u0E19\u0E2B\u0E27\u0E32\n#EngfaWaraha #RedSealFF #WomenInCinema #CannesFilmFestival #Cannes2025 @RedSeaFilm @Deadline https://t.co/uAj1e7WONK",
    published: "15/05/25 at 17:19",
    platform: "Twitter",
    country: "Thailand",
    source: "twitter.com",
    hashtag: "#CannesFilmFestival",
    matches: "Matches",
    metrics: {
      replies: "30.8K",
      followers: "672.4K",
      impressions: "N/A",
      details: [
        "7.4K Retweets, 195 Quote Tweets",
        "551 Twitter Replies, 22.1K Twitter Likes",
        "490 Twitter Bookmarks",
        "672.4K Twitter Followers",
        "303.9K Twitter Impressions",
      ],
    },
  },
  // Duplicate for demo
  {
    id: 2,
    avatar: "/avatar1.png",
    name: "Charlotte Austin",
    handle: "itscharlotty",
    verified: true,
    headline: "LADYBEE from THAILAND",
    link: "x.com/ewaraha/status...",
    content:
      "@EWaraha: YOU CAN CALL ME .... LADYBEE !! #ENGFAxRedSealIFF #\n\u0E2D\u0E07\u0E1F\u0E49\u0E32\u0E19\u0E2B\u0E27\u0E32\n#EngfaWaraha #RedSealFF #WomenInCinema #CannesFilmFestival #Cannes2025 @RedSeaFilm @Deadline https://t.co/uAj1e7WONK",
    published: "15/05/25 at 17:19",
    platform: "Twitter",
    country: "Thailand",
    source: "twitter.com",
    hashtag: "#CannesFilmFestival",
    matches: "Matches",
    metrics: {
      replies: "30.8K",
      followers: "672.4K",
      impressions: "N/A",
      details: [
        "7.4K Retweets, 195 Quote Tweets",
        "551 Twitter Replies, 22.1K Twitter Likes",
        "490 Twitter Bookmarks",
        "672.4K Twitter Followers",
        "303.9K Twitter Impressions",
      ],
    },
  },
];

// Helper to parse and render content with links
function renderContentWithLinks(content: string) {
  // Regex for @mentions, #hashtags, and URLs
  const regex = /(@[\w_]+)|(#[\w_]+)/g;
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // First, split by URLs
  const urlParts = content.split(urlRegex);
  return urlParts.map((part, i) => {
    if (urlRegex.test(part)) {
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          {part}
        </a>
      );
    }
    // Now split by mentions and hashtags
    const subParts = part.split(regex);
    return subParts.map((sub, j) => {
      if (!sub) return null;
      if (sub.startsWith('@')) {
        return (
          <a key={i + '-' + j} href={`https://twitter.com/${sub.slice(1)}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            {sub}
          </a>
        );
      }
      if (sub.startsWith('#')) {
        return (
          <a key={i + '-' + j} href={`https://twitter.com/hashtag/${sub.slice(1)}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            {sub}
          </a>
        );
      }
      return <span key={i + '-' + j} className="text-gray-800">{sub}</span>;
    });
  });
}

export function TopConversations({ onClose }: { onClose?: () => void }) {
  const { activeSentimentFilter } = useSentimentFilter()

  const getChartTitle = (baseTitle: string) => {
    if (activeSentimentFilter === 'all') return baseTitle;
    return `${baseTitle} (${activeSentimentFilter.charAt(0).toUpperCase() + activeSentimentFilter.slice(1)} Only)`;
  };

  return (
    <div className="bg-gray-100">
      <div className="bg-white rounded-md shadow-sm max-w-full mx-auto border border-gray-200">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-3 border-b border-gray-100 gap-2 md:gap-0">
          <h2 className="text-lg font-semibold text-gray-900">Top Conversations</h2>
          <div className="flex flex-row items-center gap-3">
            <span className="text-xs text-gray-500 font-medium">SORT BY</span>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-3">
              <div className="flex items-center bg-blue-50 rounded px-3 py-1 text-blue-700 text-xs font-semibold">
                <MessageCircle className="w-4 h-4 mr-1" /> Engagement (Most Engaging)
              </div>
              {/* ChartCard header icons */}
              <div className="flex flex-row gap-1">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <svg
                    width='18'
                    height='18'
                    viewBox='0 0 18 18'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M12 0.75C12 0.335786 12.3358 0 12.75 0L17.25 1.78814e-07C17.6642 2.23517e-07 18 0.335787 18 0.75V5.25C18 5.66421 17.6642 6 17.25 6C16.8358 6 16.5 5.66421 16.5 5.25V2.56066L12.5303 6.53033C12.2374 6.82322 11.7626 6.82322 11.4697 6.53033C11.1768 6.23744 11.1768 5.76256 11.4697 5.46967L15.4393 1.5H12.75C12.3358 1.5 12 1.16421 12 0.75ZM0 0.75C0 0.335787 0.335786 1.78814e-07 0.75 1.78814e-07H5.25C5.66421 1.78814e-07 6 0.335787 6 0.75C6 1.16421 5.66421 1.5 5.25 1.5H2.56066L6.53033 5.46967C6.82322 5.76256 6.82322 6.23744 6.53033 6.53033C6.23744 6.82322 5.76256 6.82322 5.46967 6.53033L1.5 2.56066V5.25C1.5 5.66421 1.16421 6 0.75 6C0.335786 6 0 5.66421 0 5.25V0.75ZM11.4697 12.5303C11.1768 12.2374 11.1768 11.7626 11.4697 11.4697C11.7626 11.1768 12.2374 11.1768 12.5303 11.4697L16.5 15.4393V12.75C16.5 12.3358 16.8358 12 17.25 12C17.6642 12 18 12.3358 18 12.75V17.25C18 17.6642 17.6642 18 17.25 18H12.75C12.3358 18 12 17.6642 12 17.25C12 16.8358 12.3358 16.5 12.75 16.5H15.4393L11.4697 12.5303ZM6.53033 11.4697C6.82322 11.7626 6.82322 12.2374 6.53033 12.5303L2.56066 16.5H5.25C5.66421 16.5 6 16.8358 6 17.25C6 17.6642 5.66421 18 5.25 18H0.75C0.335786 18 0 17.6642 0 17.25V12.75C0 12.3358 0.335786 12 0.75 12C1.16421 12 1.5 12.3358 1.5 12.75V15.4393L5.46967 11.4697C5.76256 11.1768 6.23744 11.1768 6.53033 11.4697Z'
                      fill='#606060'
                    />
                  </svg>
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
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
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreVertical className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {dummyConversations.map((conv) => (
            <div key={conv.id} className="flex flex-col md:flex-row bg-white px-3 md:px-8 py-4 md:py-6 gap-3 md:gap-0">
              {/* Left column */}
              <div className="flex flex-1 min-w-0 items-center gap-3 md:gap-6 px-0 md:px-6">
                <div className="relative flex-shrink-0 flex items-center justify-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#8344AD] flex items-center justify-center text-white text-base md:text-lg font-medium overflow-hidden">
                    {conv.avatar ? (
                      <Image src={conv.avatar} alt={conv.name} width={64} height={64} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <span>{conv.name.substring(0, 2).toUpperCase()}</span>
                    )}
                    {/* Ticket icon overlay */}
                    <span className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#5758bb" className="drop-shadow-md md:w-[22px] md:h-[22px]">
                        <circle cx="12" cy="12" r="11" fill="#5758bb" />
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#fff" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col min-w-0 gap-1 mb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-gray-900 text-base truncate font-semibold">{conv.name}</span>
                    {conv.verified && (
                      <span className="flex-shrink-0">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="#1D9BF0">
                          <path d="M8 1.28a6.72 6.72 0 1 0 0 13.44A6.72 6.72 0 0 0 8 1.28zM7.45 11.1L4.28 8.5l1.1-.99 2.07 1.84 3.2-3.15 1.1.94-4.3 3.96z"/>
                        </svg>
                      </span>
                    )}
                    <span className="text-blue-600 font-medium text-xs">{conv.handle}</span>
                    <span className="text-gray-700 text-xs ml-2 font-bold">Shared a link</span>
                  </div>
                  <div className="text-gray-800 text-sm mb-2">
                    {conv.headline}
                    <Image
                      src="/thailand.png"
                      alt="Thailand Flag"
                      width={16}
                      height={12}
                      className="inline-block mx-1 align-middle md:w-[20px] md:h-[14px]"
                    />
                    <span className="truncate font-medium">{conv.link}</span>
                  </div>
                  <div className="border-2 border-gray-400 rounded px-2 py-1 text-xs font-mono break-all mb-2 overflow-x-auto">
                    {renderContentWithLinks(conv.content)}
                  </div>
                  <div className="text-xs mt-2">
                    Published on {conv.published} | {conv.platform} | {conv.country} | {conv.source}
                  </div>
                </div>
              </div>
              {/* Right column */}
              <div className="border-t border-gray-200 md:border-t-0 md:border-l px-0 md:px-5 flex flex-col items-end min-w-0 w-full md:min-w-[350px] md:w-[350px] pt-2 mt-4 md:mt-0">
                <div className="flex flex-row items-center w-full gap-2 mb-1">
                  <span className="inline-block align-middle">
                    <Image
                      src="/positive-emoji.png"
                      alt="emoji"
                      width={22}
                      height={22}
                      className="inline-block align-middle md:w-[20px] md:h-[20px]"
                    />
                  </span>
                  <div className="flex gap-1 ml-auto">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <svg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path fillRule='evenodd' clipRule='evenodd' d='M12 0.75C12 0.335786 12.3358 0 12.75 0L17.25 1.78814e-07C17.6642 2.23517e-07 18 0.335787 18 0.75V5.25C18 5.66421 17.6642 6 17.25 6C16.8358 6 16.5 5.66421 16.5 5.25V2.56066L12.5303 6.53033C12.2374 6.82322 11.7626 6.82322 11.4697 6.53033C11.1768 6.23744 11.1768 5.76256 11.4697 5.46967L15.4393 1.5H12.75C12.3358 1.5 12 1.16421 12 0.75ZM0 0.75C0 0.335787 0.335786 1.78814e-07 0.75 1.78814e-07H5.25C5.66421 1.78814e-07 6 0.335787 6 0.75C6 1.16421 5.66421 1.5 5.25 1.5H2.56066L6.53033 5.46967C6.82322 5.76256 6.82322 6.23744 6.53033 6.53033C6.23744 6.82322 5.76256 6.82322 5.46967 6.53033L1.5 2.56066V5.25C1.5 5.66421 1.16421 6 0.75 6C0.335786 6 0 5.66421 0 5.25V0.75ZM11.4697 12.5303C11.1768 12.2374 11.1768 11.7626 11.4697 11.4697C11.7626 11.1768 12.2374 11.1768 12.5303 11.4697L16.5 15.4393V12.75C16.5 12.3358 16.8358 12 17.25 12C17.6642 12 18 12.3358 18 12.75V17.25C18 17.6642 17.6642 18 17.25 18H12.75C12.3358 18 12 17.6642 12 17.25C12 16.8358 12.3358 16.5 12.75 16.5H15.4393L11.4697 12.5303ZM6.53033 11.4697C6.82322 11.7626 6.82322 12.2374 6.53033 12.5303L2.56066 16.5H5.25C5.66421 16.5 6 16.8358 6 17.25C6 17.6642 5.66421 18 5.25 18H0.75C0.335786 18 0 17.6642 0 17.25V12.75C0 12.3358 0.335786 12 0.75 12C1.16421 12 1.5 12.3358 1.5 12.75V15.4393L5.46967 11.4697C5.76256 11.1768 6.23744 11.1768 6.53033 11.4697Z' fill='#606060' />
                      </svg>
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <svg width='19' height='18' viewBox='0 0 19 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path d='M2.24389 15.8156H17.2164C17.7677 15.8156 18.2146 16.2582 18.2146 16.8041C18.2146 17.35 17.7677 17.7926 17.2164 17.7926H1.24573C0.694453 17.7926 0.247559 17.35 0.247559 16.8041V0.988475C0.247559 0.442555 0.694453 0 1.24573 0C1.797 0 2.24389 0.442555 2.24389 0.988475V15.8156Z' fill='#606060' />
                        <path opacity='0.5' d='M5.9666 11.5486C5.58957 11.9469 4.95789 11.9671 4.55572 11.5937C4.15354 11.2203 4.13317 10.5948 4.5102 10.1965L8.25333 6.24263C8.61797 5.85746 9.2239 5.82405 9.62946 6.16677L12.5838 8.6633L16.433 3.835C16.7746 3.40651 17.4022 3.33339 17.8349 3.67166C18.2676 4.00994 18.3414 4.63152 17.9999 5.06L13.5081 10.6943C13.1573 11.1344 12.5074 11.1977 12.0767 10.8337L9.05822 8.28294L5.9666 11.5486Z' fill='#606060' />
                      </svg>
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 mb-1 w-full">
                  <span className="text-xs text-[#5c6bc0] font-medium">Matches</span>
                  <span className="text-xs font-semibold">{conv.hashtag}</span>
                </div>
                <div className="flex items-center gap-2 mb-1 w-full overflow-x-auto">
                  <span className="text-xs text-[#5c6bc0] font-medium">Metrics</span>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4 text-[#5c6bc0]" />
                    <span className="font-bold text-gray-900 text-lg">{conv.metrics.replies}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart2 className="w-4 h-4 text-[#5c6bc0]" />
                    <span className="font-bold text-gray-900 text-lg">{conv.metrics.followers}</span>
                  </div>
                  <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-[#5c6bc0] rounded">
                    <svg
                      width='19'
                      height='18'
                      viewBox='0 0 19 18'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M2.24389 15.8156H17.2164C17.7677 15.8156 18.2146 16.2582 18.2146 16.8041C18.2146 17.35 17.7677 17.7926 17.2164 17.7926H1.24573C0.694453 17.7926 0.247559 17.35 0.247559 16.8041V0.988475C0.247559 0.442555 0.694453 0 1.24573 0C1.797 0 2.24389 0.442555 2.24389 0.988475V15.8156Z'
                        fill='#5c6bc0'
                      />
                      <path
                        opacity='0.5'
                        d='M5.9666 11.5486C5.58957 11.9469 4.95789 11.9671 4.55572 11.5937C4.15354 11.2203 4.13317 10.5948 4.5102 10.1965L8.25333 6.24263C8.61797 5.85746 9.2239 5.82405 9.62946 6.16677L12.5838 8.6633L16.433 3.835C16.7746 3.40651 17.4022 3.33339 17.8349 3.67166C18.2676 4.00994 18.3414 4.63152 17.9999 5.06L13.5081 10.6943C13.1573 11.1344 12.5074 11.1977 12.0767 10.8337L9.05822 8.28294L5.9666 11.5486Z'
                        fill='#5c6bc0'
                      />
                    </svg>
                  </button>
                    <span className="font-bold text-gray-900 text-lg">{conv.metrics.impressions}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-2 space-y-0.5 w-full ml-2 md:ml-7">
                  {conv.metrics.details.map((d, i) => (
                    <div key={i}>{d}</div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
