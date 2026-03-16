export function CompanyProfitLoss() {
  const years = [
    { year: 'Mar 2014', sales: 230, expenses: 207, opProfit: 23, opm: '10%', otherIncome: 0, interest: 5, depreciation: 2, pbt: 17, tax: '34%', netProfit: 11, eps: 1.82, dividend: '0%' },
    { year: 'Mar 2015', sales: 278, expenses: 251, opProfit: 27, opm: '10%', otherIncome: 1, interest: 10, depreciation: 3, pbt: 15, tax: '36%', netProfit: 10, eps: 1.64, dividend: '2%' },
    { year: 'Mar 2016', sales: 335, expenses: 314, opProfit: 20, opm: '6%', otherIncome: 1, interest: 8, depreciation: 3, pbt: 11, tax: '40%', netProfit: 7, eps: 1.16, dividend: '6%' },
    { year: 'Mar 2017', sales: 489, expenses: 460, opProfit: 29, opm: '6%', otherIncome: 1, interest: 9, depreciation: 3, pbt: 18, tax: '46%', netProfit: 10, eps: 1.64, dividend: '4%' },
    { year: 'Mar 2018', sales: 613, expenses: 566, opProfit: 48, opm: '8%', otherIncome: 4, interest: 10, depreciation: 3, pbt: 38, tax: '37%', netProfit: 24, eps: 4.04, dividend: '2%' },
    { year: 'Mar 2019', sales: 601, expenses: 542, opProfit: 59, opm: '10%', otherIncome: 16, interest: 10, depreciation: 3, pbt: 62, tax: '38%', netProfit: 38, eps: 6.38, dividend: '4%' },
    { year: 'Mar 2020', sales: 604, expenses: 564, opProfit: 40, opm: '7%', otherIncome: 15, interest: 7, depreciation: 3, pbt: 45, tax: '24%', netProfit: 34, eps: 5.75, dividend: '4%' },
    { year: 'Mar 2021', sales: 473, expenses: 446, opProfit: 26, opm: '5%', otherIncome: 8, interest: 4, depreciation: 4, pbt: 26, tax: '30%', netProfit: 18, eps: 2.96, dividend: '17%' },
    { year: 'Mar 2022', sales: 491, expenses: 475, opProfit: 16, opm: '3%', otherIncome: 13, interest: 6, depreciation: 4, pbt: 19, tax: '30%', netProfit: 14, eps: 2.00, dividend: '17%' },
    { year: 'Mar 2023', sales: 353, expenses: 333, opProfit: 20, opm: '6%', otherIncome: 12, interest: 11, depreciation: 9, pbt: 11, tax: '38%', netProfit: 7, eps: 0.99, dividend: '26%' },
    { year: 'Mar 2024', sales: 436, expenses: 407, opProfit: 28, opm: '6%', otherIncome: 7, interest: 12, depreciation: 12, pbt: 8, tax: '43%', netProfit: 5, eps: 0.67, dividend: '36%' },
    { year: 'Mar 2025', sales: 628, expenses: 598, opProfit: 31, opm: '5%', otherIncome: 11, interest: 22, depreciation: 15, pbt: 8, tax: '40%', netProfit: 4, eps: 0.67, dividend: '33%' },
    { year: 'TTM', sales: 803, expenses: 754, opProfit: 49, opm: '6%', otherIncome: 17, interest: 29, depreciation: 15, pbt: 22, tax: '', netProfit: 15, eps: 2.32, dividend: '' },
  ];

  const growthMetrics = [
    { label: 'Compounded Sales Growth', period: '10 Years', value: '' },
    { label: 'Compounded Profit Growth', period: '10 Years', value: '-8%' },
    { label: 'Stock Price CAGR', period: '10 Years', value: '54%' },
    { label: 'Return on Equity', period: '10 Years', value: '11%' },
  ];

  return (
    <div className="bg-white dark:bg-[#1F2937] rounded-lg border border-[#E5E7EB] dark:border-[#374151]">
      <div className="p-6 border-b border-[#E5E7EB] dark:border-[#374151] flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#111827] dark:text-white mb-2">Profit & Loss</h2>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
            Consolidated Figures in Rs. Crores / <button className="text-[#4F46E5] dark:text-[#818CF8] hover:underline">View Standalone</button>
          </p>
        </div>
        <button className="px-4 py-2 border border-[#4F46E5] dark:border-[#818CF8] text-[#4F46E5] dark:text-[#818CF8] text-sm rounded hover:bg-[#EEF2FF] dark:hover:bg-[#312E81] transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          RELATED PARTY
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] bg-[#F9FAFB] dark:bg-[#374151]">
              <th className="text-left p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-[#F9FAFB] dark:bg-[#374151]"></th>
              {years.map((y, i) => (
                <th key={i} className={`text-right p-3 font-medium whitespace-nowrap ${y.year === 'TTM' ? 'text-[#4F46E5] dark:text-[#818CF8]' : 'text-[#6B7280] dark:text-[#9CA3AF]'}`}>
                  {y.year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151]">
              <td className="p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937] flex items-center gap-1">
                Sales <span className="text-[#4F46E5] text-xs">+</span>
              </td>
              {years.map((y, i) => (
                <td key={i} className="text-right p-3 text-[#111827] dark:text-white">{y.sales}</td>
              ))}
            </tr>
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151]">
              <td className="p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937] flex items-center gap-1">
                Expenses <span className="text-[#4F46E5] text-xs">+</span>
              </td>
              {years.map((y, i) => (
                <td key={i} className="text-right p-3 text-[#111827] dark:text-white">{y.expenses}</td>
              ))}
            </tr>
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151] font-semibold">
              <td className="p-3 text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937]">Operating Profit</td>
              {years.map((y, i) => (
                <td key={i} className="text-right p-3 text-[#111827] dark:text-white">{y.opProfit}</td>
              ))}
            </tr>
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151]">
              <td className="p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937]">OPM %</td>
              {years.map((y, i) => (
                <td key={i} className={`text-right p-3 ${y.opm.includes('-') ? 'text-[#DC2626]' : y.opm === '10%' ? 'text-[#4F46E5]' : y.opm === '8%' || y.opm === '6%' ? 'text-[#4F46E5]' : 'text-[#111827] dark:text-white'}`}>
                  {y.opm}
                </td>
              ))}
            </tr>
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151]">
              <td className="p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937] flex items-center gap-1">
                Other Income <span className="text-[#4F46E5] text-xs">+</span>
              </td>
              {years.map((y, i) => (
                <td key={i} className="text-right p-3 text-[#111827] dark:text-white">{y.otherIncome}</td>
              ))}
            </tr>
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151]">
              <td className="p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937]">Interest</td>
              {years.map((y, i) => (
                <td key={i} className="text-right p-3 text-[#111827] dark:text-white">{y.interest}</td>
              ))}
            </tr>
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151]">
              <td className="p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937]">Depreciation</td>
              {years.map((y, i) => (
                <td key={i} className="text-right p-3 text-[#111827] dark:text-white">{y.depreciation}</td>
              ))}
            </tr>
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151] font-semibold">
              <td className="p-3 text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937]">Profit before tax</td>
              {years.map((y, i) => (
                <td key={i} className="text-right p-3 text-[#111827] dark:text-white">{y.pbt}</td>
              ))}
            </tr>
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151]">
              <td className="p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937]">Tax %</td>
              {years.map((y, i) => (
                <td key={i} className="text-right p-3 text-[#111827] dark:text-white">{y.tax}</td>
              ))}
            </tr>
            <tr className="border-b-2 border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151] font-bold">
              <td className="p-3 text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937] flex items-center gap-1">
                Net Profit <span className="text-[#4F46E5] text-xs">+</span>
              </td>
              {years.map((y, i) => (
                <td key={i} className="text-right p-3 text-[#111827] dark:text-white">{y.netProfit}</td>
              ))}
            </tr>
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151]">
              <td className="p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937]">EPS in Rs</td>
              {years.map((y, i) => (
                <td key={i} className="text-right p-3 text-[#111827] dark:text-white">{y.eps}</td>
              ))}
            </tr>
            <tr className="hover:bg-[#F9FAFB] dark:hover:bg-[#374151]">
              <td className="p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937]">Dividend Payout %</td>
              {years.map((y, i) => (
                <td key={i} className="text-right p-3 text-[#111827] dark:text-white">{y.dividend}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Growth Metrics */}
      <div className="p-6 border-t border-[#E5E7EB] dark:border-[#374151] grid grid-cols-4 gap-8">
        {growthMetrics.map((metric, i) => (
          <div key={i} className="text-center">
            <div className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-1">{metric.label}</div>
            <div className={`text-2xl font-bold ${metric.value.includes('-') ? 'text-[#DC2626]' : 'text-[#111827] dark:text-white'}`}>
              {metric.value || '-'}
            </div>
            <div className="text-xs text-[#9CA3AF] mt-1">{metric.period}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
