import { Search } from 'lucide-react';
import { MarketOverview } from './MarketOverview';

const trendingTags = [
  'RELIANCE',
  'TCS',
  'HDFC Bank',
  'SBI Small Cap',
  'HDFC Flexi Cap',
  'Infosys',
  'Parag Parikh Flexi Cap',
];

export function SearchSection() {
  return (
    <div className="max-w-[1440px] mx-auto px-8 py-12">
      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <div>
          <h1 className="text-[#111827] mb-6">Search Stocks or Mutual Funds</h1>
          
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, symbol, AMC, or category…"
              className="w-full pl-12 pr-4 py-4 border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {trendingTags.map((tag) => (
              <button
                key={tag}
                className="px-4 py-2 text-sm bg-white border border-[#E5E7EB] rounded-lg text-[#111827] hover:bg-[#F9FAFB] transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        
        <div className="lg:block hidden">
          <MarketOverview />
        </div>
      </div>
      
      <div className="lg:hidden mt-8">
        <MarketOverview />
      </div>
    </div>
  );
}
