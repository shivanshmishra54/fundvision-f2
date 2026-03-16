export function CompanyBalanceSheet() {
  const years = [
    { year: 'Mar 2014', equity: 1, reserves: 25, borrowings: 51, otherLiab: 23, totalLiab: 100, fixedAssets: 32, cwip: 0, investments: 0, otherAssets: 67, totalAssets: 100 },
    { year: 'Mar 2015', equity: 1, reserves: 35, borrowings: 77, otherLiab: 22, totalLiab: 135, fixedAssets: 34, cwip: 0, investments: 0, otherAssets: 102, totalAssets: 135 },
    { year: 'Mar 2016', equity: 3, reserves: 40, borrowings: 64, otherLiab: 30, totalLiab: 137, fixedAssets: 35, cwip: 0, investments: 1, otherAssets: 101, totalAssets: 137 },
    { year: 'Mar 2017', equity: 3, reserves: 50, borrowings: 77, otherLiab: 56, totalLiab: 186, fixedAssets: 32, cwip: 1, investments: 1, otherAssets: 153, totalAssets: 186 },
    { year: 'Mar 2018', equity: 3, reserves: 74, borrowings: 92, otherLiab: 66, totalLiab: 234, fixedAssets: 45, cwip: 0, investments: 1, otherAssets: 188, totalAssets: 234 },
    { year: 'Mar 2019', equity: 10, reserves: 103, borrowings: 128, otherLiab: 49, totalLiab: 291, fixedAssets: 44, cwip: 2, investments: 1, otherAssets: 243, totalAssets: 291 },
    { year: 'Mar 2020', equity: 10, reserves: 133, borrowings: 112, otherLiab: 25, totalLiab: 281, fixedAssets: 50, cwip: 2, investments: 1, otherAssets: 227, totalAssets: 281 },
    { year: 'Mar 2021', equity: 11, reserves: 165, borrowings: 138, otherLiab: 12, totalLiab: 326, fixedAssets: 82, cwip: 32, investments: 2, otherAssets: 229, totalAssets: 326 },
    { year: 'Mar 2022', equity: 12, reserves: 193, borrowings: 173, otherLiab: 20, totalLiab: 398, fixedAssets: 69, cwip: 92, investments: 1, otherAssets: 236, totalAssets: 398 },
    { year: 'Mar 2023', equity: 13, reserves: 232, borrowings: 176, otherLiab: 23, totalLiab: 443, fixedAssets: 181, cwip: 17, investments: 1, otherAssets: 244, totalAssets: 443 },
    { year: 'Mar 2024', equity: 13, reserves: 246, borrowings: 333, otherLiab: 38, totalLiab: 630, fixedAssets: 178, cwip: 87, investments: 2, otherAssets: 363, totalAssets: 630 },
    { year: 'Mar 2025', equity: 13, reserves: 249, borrowings: 411, otherLiab: 77, totalLiab: 750, fixedAssets: 179, cwip: 140, investments: 2, otherAssets: 429, totalAssets: 750 },
    { year: 'Sep 2025', equity: 13, reserves: 258, borrowings: 417, otherLiab: 112, totalLiab: 800, fixedAssets: 329, cwip: 9, investments: 2, otherAssets: 460, totalAssets: 800 },
  ];

  return (
    <div className="bg-white dark:bg-[#1F2937] rounded-lg border border-[#E5E7EB] dark:border-[#374151]">
      <div className="p-6 border-b border-[#E5E7EB] dark:border-[#374151] flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#111827] dark:text-white mb-2">Balance Sheet</h2>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
            Consolidated Figures in Rs. Crores / <button className="text-[#4F46E5] dark:text-[#818CF8] hover:underline">View Standalone</button>
          </p>
        </div>
        <button className="px-4 py-2 border border-[#4F46E5] dark:border-[#818CF8] text-[#4F46E5] dark:text-[#818CF8] text-sm rounded hover:bg-[#EEF2FF] dark:hover:bg-[#312E81] transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          CORPORATE ACTIONS
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] bg-[#F9FAFB] dark:bg-[#374151]">
              <th className="text-left p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-[#F9FAFB] dark:bg-[#374151]"></th>
              {years.map((y, i) => (
                <th key={i} className="text-right p-3 font-medium whitespace-nowrap text-[#6B7280] dark:text-[#9CA3AF]">
                  {y.year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Liabilities Section */}
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151]">
              <td className="p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937]">Equity Capital</td>
              {years.map((y, i) => (
                <td key={i} className="text-right p-3 text-[#111827] dark:text-white">{y.equity}</td>
              ))}
            </tr>
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151]">
              <td className="p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937]">Reserves</td>
              {years.map((y, i) => (
                <td key={i} className="text-right p-3 text-[#111827] dark:text-white">{y.reserves}</td>
              ))}
            </tr>
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151]">
              <td className="p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937] flex items-center gap-1">
                Borrowings <span className="text-[#4F46E5] text-xs">+</span>
              </td>
              {years.map((y, i) => (
                <td key={i} className="text-right p-3 text-[#111827] dark:text-white">{y.borrowings}</td>
              ))}
            </tr>
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151]">
              <td className="p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937] flex items-center gap-1">
                Other Liabilities <span className="text-[#4F46E5] text-xs">+</span>
              </td>
              {years.map((y, i) => (
                <td key={i} className="text-right p-3 text-[#111827] dark:text-white">{y.otherLiab}</td>
              ))}
            </tr>
            <tr className="border-b-2 border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151] font-semibold">
              <td className="p-3 text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937]">Total Liabilities</td>
              {years.map((y, i) => (
                <td key={i} className="text-right p-3 text-[#111827] dark:text-white">{y.totalLiab}</td>
              ))}
            </tr>

            {/* Assets Section */}
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151]">
              <td className="p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937] flex items-center gap-1">
                Fixed Assets <span className="text-[#4F46E5] text-xs">+</span>
              </td>
              {years.map((y, i) => (
                <td key={i} className="text-right p-3 text-[#111827] dark:text-white">{y.fixedAssets}</td>
              ))}
            </tr>
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151]">
              <td className="p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937]">CWIP</td>
              {years.map((y, i) => (
                <td key={i} className="text-right p-3 text-[#111827] dark:text-white">{y.cwip}</td>
              ))}
            </tr>
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151]">
              <td className="p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937]">Investments</td>
              {years.map((y, i) => (
                <td key={i} className="text-right p-3 text-[#4F46E5] dark:text-[#818CF8]">{y.investments}</td>
              ))}
            </tr>
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151]">
              <td className="p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937] flex items-center gap-1">
                Other Assets <span className="text-[#4F46E5] text-xs">+</span>
              </td>
              {years.map((y, i) => (
                <td key={i} className="text-right p-3 text-[#111827] dark:text-white">{y.otherAssets}</td>
              ))}
            </tr>
            <tr className="hover:bg-[#F9FAFB] dark:hover:bg-[#374151] font-semibold">
              <td className="p-3 text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937]">Total Assets</td>
              {years.map((y, i) => (
                <td key={i} className="text-right p-3 text-[#111827] dark:text-white">{y.totalAssets}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
