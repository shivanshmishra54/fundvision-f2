import { useNavigate } from 'react-router';
import { SearchBar } from './SearchBar';

const companyTags = [
  { label: 'Reliance', symbol: 'RELIANCE' },
  { label: 'TCS', symbol: 'TCS' },
  { label: 'HDFC Bank', symbol: 'HDFCBANK' },
  { label: 'Infosys', symbol: 'INFY' },
  { label: 'SBI', symbol: 'SBIN' },
  { label: 'Coastal Corp', symbol: 'COASTALCORP' },
];

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-[#E5E7EB] to-[#F3F4F6] dark:from-[#1F2937] dark:to-[#111827] py-12 md:py-24">
      <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
        <h1 className="text-3xl md:text-5xl text-[#111827] dark:text-white mb-3 md:mb-4 tracking-tight flex items-center justify-center gap-3">
          <svg width="36" height="32" viewBox="0 0 22 20" fill="none">
            <rect x="0"  y="10" width="5" height="10" rx="1" fill="#16A34A" />
            <rect x="6"  y="5"  width="5" height="15" rx="1" fill="#16A34A" />
            <rect x="12" y="0"  width="5" height="20" rx="1" fill="#4ADE80" />
            <rect x="17" y="7"  width="5" height="13" rx="1" fill="#16A34A" opacity="0.7" />
          </svg>
          <span className="font-semibold">FundVision</span>
        </h1>
        <p className="text-[#6B7280] dark:text-[#9CA3AF] text-base md:text-lg mb-8 md:mb-12">
          Stock analysis and screening tool for investors in India
        </p>

        <div className="max-w-2xl mx-auto mb-6 md:mb-10">
          <SearchBar large />
        </div>

        <div className="text-center">
          <p className="text-[#9CA3AF] text-xs md:text-sm mb-3 md:mb-4">Or analyse:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {companyTags.map((tag) => (
              <button
                key={tag.symbol}
                onClick={() => navigate(`/company/${tag.symbol}`)}
                className="px-3 md:px-4 py-1.5 text-xs md:text-sm bg-white dark:bg-[#374151] border border-[#D1D5DB] dark:border-[#4B5563] rounded-lg text-[#6B7280] dark:text-[#9CA3AF] hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all shadow-sm hover:shadow"
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
