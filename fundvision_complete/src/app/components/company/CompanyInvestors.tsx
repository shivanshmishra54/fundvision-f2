import { useState } from 'react';

export function CompanyInvestors() {
  const [viewType, setViewType] = useState('quarterly');

  const quarters = [
    'Mar 2023', 'Jun 2023', 'Sep 2023', 'Dec 2023', 'Mar 2024', 'Jun 2024',
    'Sep 2024', 'Dec 2024', 'Mar 2025', 'Jun 2025', 'Sep 2025', 'Dec 2025'
  ];

  const shareholdingData = [
    { category: 'Promoters', values: [41.63, 41.64, 41.64, 41.86, 41.86, 41.86, 41.94, 42.22, 42.22, 42.22, 42.23, 42.23], link: true },
    { category: 'FIIs', values: [2.06, 1.93, 1.93, 2.00, 1.87, 1.87, 1.40, 0.94, 0.94, 0.98, 1.01, 1.03], link: true },
    { category: 'DIIs', values: [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00], link: true },
    { category: 'Public', values: [56.32, 56.44, 56.41, 56.13, 56.27, 56.26, 56.66, 56.85, 56.85, 56.80, 56.76, 56.73], link: true },
    { category: 'No. of Shareholders', values: [13279, 14163, 12021, 12646, 12686, 12933, 13135, 13123, 13930, 13631, 14630, 14314] },
  ];

  return (
    <div className="bg-white dark:bg-[#1F2937] rounded-lg border border-[#E5E7EB] dark:border-[#374151]">
      <div className="p-6 border-b border-[#E5E7EB] dark:border-[#374151] flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#111827] dark:text-white mb-2">Shareholding Pattern</h2>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Numbers in percentages</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewType('quarterly')}
            className={`px-4 py-1.5 text-sm rounded border transition-colors ${
              viewType === 'quarterly'
                ? 'border-[#4F46E5] dark:border-[#818CF8] bg-[#EEF2FF] dark:bg-[#312E81] text-[#4F46E5] dark:text-[#818CF8]'
                : 'border-[#D1D5DB] dark:border-[#4B5563] text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F3F4F6] dark:hover:bg-[#374151]'
            }`}
          >
            Quarterly
          </button>
          <button
            onClick={() => setViewType('yearly')}
            className={`px-4 py-1.5 text-sm rounded border transition-colors ${
              viewType === 'yearly'
                ? 'border-[#4F46E5] dark:border-[#818CF8] bg-[#EEF2FF] dark:bg-[#312E81] text-[#4F46E5] dark:text-[#818CF8]'
                : 'border-[#D1D5DB] dark:border-[#4B5563] text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F3F4F6] dark:hover:bg-[#374151]'
            }`}
          >
            Yearly
          </button>
          <button className="px-4 py-1.5 border border-[#4F46E5] dark:border-[#818CF8] text-[#4F46E5] dark:text-[#818CF8] text-sm rounded hover:bg-[#EEF2FF] dark:hover:bg-[#312E81] transition-colors">
            TRADES
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] bg-[#F9FAFB] dark:bg-[#374151]">
              <th className="text-left p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-[#F9FAFB] dark:bg-[#374151]"></th>
              {quarters.map((quarter, i) => (
                <th key={i} className="text-right p-3 font-medium whitespace-nowrap text-[#6B7280] dark:text-[#9CA3AF]">
                  {quarter}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shareholdingData.map((row, idx) => (
              <tr key={idx} className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151]">
                <td className="p-3 font-medium sticky left-0 bg-white dark:bg-[#1F2937]">
                  {row.link ? (
                    <button className="text-[#4F46E5] dark:text-[#818CF8] hover:underline flex items-center gap-1">
                      {row.category}
                      <span className="text-[#4F46E5] text-xs">+</span>
                    </button>
                  ) : (
                    <span className="text-[#111827] dark:text-white">{row.category}</span>
                  )}
                </td>
                {row.values.map((value, i) => {
                  const isPercentage = row.category !== 'No. of Shareholders';
                  const prevValue = i > 0 ? row.values[i - 1] : value;
                  const isIncreased = value > prevValue;
                  const isDecreased = value < prevValue;
                  
                  return (
                    <td
                      key={i}
                      className={`text-right p-3 ${
                        isPercentage && isIncreased && row.category === 'Promoters'
                          ? 'text-[#16A34A]'
                          : isPercentage && isDecreased && row.category === 'Promoters'
                          ? 'text-[#DC2626]'
                          : 'text-[#111827] dark:text-white'
                      }`}
                    >
                      {isPercentage ? `${value.toFixed(2)}%` : value.toLocaleString()}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-[#E5E7EB] dark:border-[#374151] bg-[#F9FAFB] dark:bg-[#374151]">
        <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] flex items-center gap-2">
          <sup className="text-[#DC2626]">1</sup>
          The classifications might have changed from Sep 2022 onwards.
          <button className="text-[#4F46E5] dark:text-[#818CF8] hover:underline flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </p>
      </div>
    </div>
  );
}
