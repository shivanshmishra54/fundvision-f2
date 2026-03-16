export function CompanyQuarters() {
  const quarters = [
    { period: 'Dec 2022', sales: 58.13, expenses: 50.58, opProfit: 5.55, opm: '9.89%', otherIncome: 1.10, interest: 2.91, depreciation: 2.59, pbt: 1.15, tax: '63.48%', netProfit: 0.41, eps: 0.06 },
    { period: 'Mar 2023', sales: 73.03, expenses: 78.47, opProfit: -5.44, opm: '-7.45%', otherIncome: 0.66, interest: 3.56, depreciation: 3.05, pbt: -11.39, tax: '-18.86%', netProfit: -9.23, eps: -1.37 },
    { period: 'Jun 2023', sales: 100.58, expenses: 90.77, opProfit: 9.81, opm: '9.75%', otherIncome: 1.07, interest: 3.06, depreciation: 2.98, pbt: 4.84, tax: '32.23%', netProfit: 3.28, eps: 0.49 },
    { period: 'Sep 2023', sales: 111.36, expenses: 100.88, opProfit: 10.48, opm: '9.41%', otherIncome: 2.27, interest: 3.74, depreciation: 3.03, pbt: 5.98, tax: '25.25%', netProfit: 4.48, eps: 0.66 },
    { period: 'Dec 2023', sales: 107.00, expenses: 97.65, opProfit: 9.35, opm: '8.74%', otherIncome: 1.70, interest: 3.85, depreciation: 3.04, pbt: 4.16, tax: '29.33%', netProfit: 2.94, eps: 0.44, highlight: true },
    { period: 'Mar 2024', sales: 116.62, expenses: 118.01, opProfit: -1.39, opm: '-1.19%', otherIncome: 2.05, interest: 4.68, depreciation: 3.04, pbt: -7.06, tax: '-12.32%', netProfit: -6.19, eps: -0.92 },
    { period: 'Jun 2024', sales: 132.81, expenses: 123.29, opProfit: 9.52, opm: '7.17%', otherIncome: 1.93, interest: 4.12, depreciation: 3.03, pbt: 4.30, tax: '29.30%', netProfit: 3.05, eps: 0.46 },
    { period: 'Sep 2024', sales: 154.77, expenses: 147.23, opProfit: 7.54, opm: '4.87%', otherIncome: 1.80, interest: 5.02, depreciation: 3.08, pbt: 1.24, tax: '58.87%', netProfit: 0.51, eps: 0.08 },
    { period: 'Dec 2024', sales: 183.55, expenses: 174.56, opProfit: 8.99, opm: '4.90%', otherIncome: 2.94, interest: 6.85, depreciation: 3.06, pbt: 1.92, tax: '-1.56%', netProfit: 1.95, eps: 0.29 },
    { period: 'Mar 2025', sales: 157.00, expenses: 152.60, opProfit: 4.48, opm: '2.85%', otherIncome: 4.43, interest: 5.63, depreciation: 3.23, pbt: 0.05, tax: '2,160.00%', netProfit: -1.03, eps: -0.15 },
    { period: 'Jun 2025', sales: 183.68, expenses: 167.57, opProfit: 16.09, opm: '8.76%', otherIncome: 1.49, interest: 6.42, depreciation: 3.48, pbt: 7.67, tax: '24.90%', netProfit: 5.76, eps: 0.88 },
    { period: 'Sep 2025', sales: 159.88, expenses: 148.54, opProfit: 11.14, opm: '6.98%', otherIncome: 5.84, interest: 7.07, depreciation: 3.07, pbt: 6.84, tax: '46.35%', netProfit: 3.67, eps: 0.55 },
    { period: 'Dec 2025', sales: 302.65, expenses: 285.53, opProfit: 17.12, opm: '5.66%', otherIncome: 5.49, interest: 8.93, depreciation: 5.21, pbt: 7.41, tax: '4.32%', netProfit: 7.09, eps: 1.06 },
  ];

  return (
    <div className="bg-white dark:bg-[#1F2937] rounded-lg border border-[#E5E7EB] dark:border-[#374151]">
      <div className="p-6 border-b border-[#E5E7EB] dark:border-[#374151]">
        <h2 className="text-xl font-semibold text-[#111827] dark:text-white mb-2">Quarterly Results</h2>
        <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
          Consolidated Figures in Rs. Crores / <button className="text-[#4F46E5] dark:text-[#818CF8] hover:underline">View Standalone</button>
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] bg-[#F9FAFB] dark:bg-[#374151]">
              <th className="text-left p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-[#F9FAFB] dark:bg-[#374151]"></th>
              {quarters.map((q, i) => (
                <th key={i} className={`text-right p-3 font-medium whitespace-nowrap ${q.highlight ? 'text-[#4F46E5] dark:text-[#818CF8]' : 'text-[#6B7280] dark:text-[#9CA3AF]'}`}>
                  {q.period}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151]">
              <td className="p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937] flex items-center gap-1">
                Sales <span className="text-[#4F46E5] text-xs">+</span>
              </td>
              {quarters.map((q, i) => (
                <td key={i} className="text-right p-3 text-[#111827] dark:text-white">{q.sales.toFixed(2)}</td>
              ))}
            </tr>
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151]">
              <td className="p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937] flex items-center gap-1">
                Expenses <span className="text-[#4F46E5] text-xs">+</span>
              </td>
              {quarters.map((q, i) => (
                <td key={i} className="text-right p-3 text-[#111827] dark:text-white">{q.expenses.toFixed(2)}</td>
              ))}
            </tr>
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151] font-semibold">
              <td className="p-3 text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937]">Operating Profit</td>
              {quarters.map((q, i) => (
                <td key={i} className={`text-right p-3 ${q.opProfit >= 0 ? 'text-[#111827] dark:text-white' : 'text-[#DC2626]'}`}>
                  {q.opProfit.toFixed(2)}
                </td>
              ))}
            </tr>
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151]">
              <td className="p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937]">OPM %</td>
              {quarters.map((q, i) => (
                <td key={i} className={`text-right p-3 ${parseFloat(q.opm) >= 0 ? 'text-[#111827] dark:text-white' : 'text-[#DC2626]'}`}>
                  {q.opm}
                </td>
              ))}
            </tr>
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151]">
              <td className="p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937] flex items-center gap-1">
                Other Income <span className="text-[#4F46E5] text-xs">+</span>
              </td>
              {quarters.map((q, i) => (
                <td key={i} className="text-right p-3 text-[#111827] dark:text-white">{q.otherIncome.toFixed(2)}</td>
              ))}
            </tr>
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151]">
              <td className="p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937]">Interest</td>
              {quarters.map((q, i) => (
                <td key={i} className="text-right p-3 text-[#111827] dark:text-white">{q.interest.toFixed(2)}</td>
              ))}
            </tr>
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151]">
              <td className="p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937]">Depreciation</td>
              {quarters.map((q, i) => (
                <td key={i} className="text-right p-3 text-[#111827] dark:text-white">{q.depreciation.toFixed(2)}</td>
              ))}
            </tr>
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151] font-semibold">
              <td className="p-3 text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937]">Profit before tax</td>
              {quarters.map((q, i) => (
                <td key={i} className={`text-right p-3 ${q.pbt >= 0 ? 'text-[#111827] dark:text-white' : 'text-[#DC2626]'}`}>
                  {q.pbt.toFixed(2)}
                </td>
              ))}
            </tr>
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151]">
              <td className="p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937]">Tax %</td>
              {quarters.map((q, i) => (
                <td key={i} className="text-right p-3 text-[#111827] dark:text-white">{q.tax}</td>
              ))}
            </tr>
            <tr className="border-b-2 border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151] font-bold">
              <td className="p-3 text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937] flex items-center gap-1">
                Net Profit <span className="text-[#4F46E5] text-xs">+</span>
              </td>
              {quarters.map((q, i) => (
                <td key={i} className={`text-right p-3 ${q.netProfit >= 0 ? 'text-[#111827] dark:text-white' : 'text-[#DC2626]'}`}>
                  {q.netProfit.toFixed(2)}
                </td>
              ))}
            </tr>
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151]">
              <td className="p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937]">EPS in Rs</td>
              {quarters.map((q, i) => (
                <td key={i} className={`text-right p-3 ${q.eps >= 0 ? 'text-[#111827] dark:text-white' : 'text-[#DC2626]'}`}>
                  {q.eps.toFixed(2)}
                </td>
              ))}
            </tr>
            <tr className="hover:bg-[#F9FAFB] dark:hover:bg-[#374151]">
              <td className="p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937]">Raw PDF</td>
              {quarters.map((q, i) => (
                <td key={i} className="text-right p-3">
                  <button className="text-[#4F46E5] dark:text-[#818CF8] hover:underline">
                    <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
