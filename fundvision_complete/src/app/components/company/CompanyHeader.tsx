import { TrendingUp, ExternalLink, Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

export function CompanyHeader() {
  const navigate = useNavigate();

  return (
    <div className="py-6 border-b border-[#E5E7EB] dark:border-[#374151]">
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-white transition-colors mb-4 text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </button>
      
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#111827] dark:text-white mb-3">
            Coastal Corporation Ltd
          </h1>
          
          <div className="flex items-center gap-4 text-sm text-[#6B7280] dark:text-[#9CA3AF]">
            <a
              href="https://coastalcorp.co.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#4F46E5] dark:text-[#818CF8] hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              coastalcorp.co.in
            </a>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              BSE: 501831
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              NSE: COASTCORP
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-bold text-[#111827] dark:text-white">₹ 43.6</span>
            <span className="flex items-center gap-1 text-[#16A34A] text-sm">
              <TrendingUp className="w-4 h-4" />
              1.92%
            </span>
          </div>
          <div className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
            13 Mar · close price
          </div>
          <div className="hidden md:flex items-center gap-2">{/* Hide on mobile for space */}
            <button className="px-4 py-1.5 border border-[#D1D5DB] dark:border-[#4B5563] text-[#111827] dark:text-white text-sm rounded hover:bg-[#F3F4F6] dark:hover:bg-[#374151] transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              EXPORT TO EXCEL
            </button>
            <button className="px-4 py-1.5 bg-[#4F46E5] dark:bg-[#818CF8] text-white text-sm rounded hover:bg-[#4338CA] dark:hover:bg-[#6366F1] transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              FOLLOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}