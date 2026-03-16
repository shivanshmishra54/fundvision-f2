import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const tools = [
  {
    id: 'stock-screen',
    label: 'Create a stock screen',
    desc: 'Run queries on 10 years of financial data',
    premium: false,
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="14" width="4" height="9" rx="1" fill="#4F46E5" />
        <rect x="10" y="9" width="4" height="14" rx="1" fill="#4F46E5" />
        <rect x="17" y="5" width="4" height="18" rx="1" fill="#4F46E5" opacity="0.5" />
        <circle cx="21" cy="8" r="4.5" stroke="#4F46E5" strokeWidth="1.5" fill="none" />
        <line x1="24.2" y1="11.2" x2="26.5" y2="13.5" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

const premiumTools = [
  {
    id: 'screener-ai',
    label: 'Screener AI',
    desc: 'Extract valuable insights from hundreds of company documents.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 4L16.5 10.5L23 13L16.5 15.5L14 22L11.5 15.5L5 13L11.5 10.5L14 4Z" fill="#4F46E5" />
        <circle cx="22" cy="6" r="2" fill="#4F46E5" opacity="0.5" />
        <circle cx="6" cy="22" r="1.5" fill="#4F46E5" opacity="0.4" />
      </svg>
    ),
  },
  {
    id: 'commodity-prices',
    label: 'Commodity Prices',
    desc: 'Analyze price trends for 10,000+ commodities over the past 10 years.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="14" width="18" height="9" rx="2" stroke="#4F46E5" strokeWidth="1.5" fill="none" />
        <path d="M20 18H24C25.1 18 26 17.1 26 16V15C26 13.9 25.1 13 24 13H20" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="7" cy="23" r="2" fill="#4F46E5" />
        <circle cx="15" cy="23" r="2" fill="#4F46E5" />
        <path d="M6 14V10C6 8.9 6.9 8 8 8H12L16 13" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
  },
  {
    id: 'search-shareholders',
    label: 'Search shareholders',
    desc: 'Find all companies where a person owns more than 1% of shares.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 22C5 18 8 15 14 15" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <circle cx="11" cy="10" r="4" stroke="#4F46E5" strokeWidth="1.5" fill="none" />
        <text x="16" y="23" fontSize="8" fill="#4F46E5" fontWeight="bold">%</text>
        <path d="M14 18C14 18 17 16 21 18C21 18 21 22 17.5 23.5C14 22 14 18 14 18Z" stroke="#4F46E5" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'company-announcements',
    label: 'Company Announcements',
    desc: 'Stay updated. Search, filter and set alerts for the newest disclosures and developments.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 11C6 7.13 9.13 4 13 4C16.87 4 20 7.13 20 11V18L22 20H4L6 18V11Z" stroke="#4F46E5" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
        <path d="M10.5 20C10.5 21.38 11.62 22.5 13 22.5C14.38 22.5 15.5 21.38 15.5 20" stroke="#4F46E5" strokeWidth="1.5" fill="none" />
        <circle cx="20" cy="6" r="3" fill="#DC2626" />
      </svg>
    ),
  },
];

export function ToolsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className={`text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-white transition-colors text-xs tracking-widest flex items-center gap-1 whitespace-nowrap ${open ? 'text-[#111827] dark:text-white' : ''}`}
      >
        TOOLS
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[340px] bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-2xl shadow-2xl z-50 overflow-hidden">
          {/* Free tool */}
          <div className="px-4 pt-4 pb-3">
            {tools.map((tool) => (
              <button
                key={tool.id}
                className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-[#F3F4FF] dark:hover:bg-[#374151] transition-colors text-left group"
              >
                <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center bg-[#EEF2FF] dark:bg-[#312E81] rounded-xl">
                  {tool.icon}
                </div>
                <div>
                  <p className="text-[#111827] dark:text-white text-sm group-hover:text-[#4F46E5] dark:group-hover:text-[#818CF8] transition-colors">
                    {tool.label}
                  </p>
                  <p className="text-[#6B7280] dark:text-[#9CA3AF] text-xs mt-0.5 leading-snug">
                    {tool.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Divider with Premium label */}
          <div className="px-4 flex items-center gap-3 mb-3">
            <span className="inline-flex items-center gap-1.5 bg-[#4F46E5] text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">
              <span>👑</span> Premium features
            </span>
            <div className="flex-1 h-px bg-[#E5E7EB] dark:bg-[#374151]" />
          </div>

          {/* Premium tools */}
          <div className="px-4 pb-4 flex flex-col gap-1">
            {premiumTools.map((tool) => (
              <button
                key={tool.id}
                className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-[#F3F4FF] dark:hover:bg-[#374151] transition-colors text-left group"
              >
                <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center bg-[#EEF2FF] dark:bg-[#312E81] rounded-xl">
                  {tool.icon}
                </div>
                <div>
                  <p className="text-[#111827] dark:text-white text-sm group-hover:text-[#4F46E5] dark:group-hover:text-[#818CF8] transition-colors">
                    {tool.label}
                  </p>
                  <p className="text-[#6B7280] dark:text-[#9CA3AF] text-xs mt-0.5 leading-snug">
                    {tool.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Upgrade CTA */}
          <div className="px-4 pb-4">
            <button className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white py-3 rounded-xl text-xs tracking-widest transition-colors">
              UPGRADE TO PREMIUM
            </button>
          </div>
        </div>
      )}
    </div>
  );
}