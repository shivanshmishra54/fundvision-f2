export function CompanyCashFlow() {
  const years = [
    { year: 'Mar 2014', operating: -12, investing: -5, financing: 18, netCash: 1 },
    { year: 'Mar 2015', operating: -15, investing: -3, financing: 17, netCash: -2 },
    { year: 'Mar 2016', operating: 23, investing: -3, financing: -20, netCash: 0 },
    { year: 'Mar 2017', operating: 2, investing: -0, financing: 5, netCash: 7 },
    { year: 'Mar 2018', operating: 18, investing: -10, financing: 2, netCash: 9 },
    { year: 'Mar 2019', operating: 26, investing: -3, financing: -13, netCash: 11 },
    { year: 'Mar 2020', operating: 50, investing: -3, financing: -30, netCash: 18 },
    { year: 'Mar 2021', operating: 9, investing: -40, financing: 34, netCash: 2 },
    { year: 'Mar 2022', operating: 1, investing: -56, financing: 35, netCash: -20 },
    { year: 'Mar 2023', operating: 27, investing: -41, financing: 21, netCash: 7 },
    { year: 'Mar 2024', operating: -62, investing: -81, financing: 152, netCash: 9 },
    { year: 'Mar 2025', operating: 5, investing: -54, financing: 58, netCash: 8 },
  ];

  return (
    <div className="bg-white dark:bg-[#1F2937] rounded-lg border border-[#E5E7EB] dark:border-[#374151]">
      <div className="p-6 border-b border-[#E5E7EB] dark:border-[#374151]">
        <h2 className="text-xl font-semibold text-[#111827] dark:text-white mb-2">Cash Flows</h2>
        <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
          Consolidated Figures in Rs. Crores / <button className="text-[#4F46E5] dark:text-[#818CF8] hover:underline">View Standalone</button>
        </p>
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
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151]">
              <td className="p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937] flex items-center gap-1">
                Cash from Operating Activity <span className="text-[#4F46E5] text-xs">+</span>
              </td>
              {years.map((y, i) => (
                <td key={i} className={`text-right p-3 ${y.operating >= 0 ? 'text-[#111827] dark:text-white' : 'text-[#DC2626]'}`}>
                  {y.operating}
                </td>
              ))}
            </tr>
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151]">
              <td className="p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937] flex items-center gap-1">
                Cash from Investing Activity <span className="text-[#4F46E5] text-xs">+</span>
              </td>
              {years.map((y, i) => (
                <td key={i} className={`text-right p-3 ${y.investing >= 0 ? 'text-[#111827] dark:text-white' : 'text-[#DC2626]'}`}>
                  {y.investing}
                </td>
              ))}
            </tr>
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151]">
              <td className="p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937] flex items-center gap-1">
                Cash from Financing Activity <span className="text-[#4F46E5] text-xs">+</span>
              </td>
              {years.map((y, i) => (
                <td key={i} className={`text-right p-3 ${y.financing >= 0 ? 'text-[#111827] dark:text-white' : 'text-[#DC2626]'}`}>
                  {y.financing}
                </td>
              ))}
            </tr>
            <tr className="hover:bg-[#F9FAFB] dark:hover:bg-[#374151] font-semibold">
              <td className="p-3 text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937]">Net Cash Flow</td>
              {years.map((y, i) => (
                <td key={i} className={`text-right p-3 ${y.netCash >= 0 ? 'text-[#111827] dark:text-white' : 'text-[#DC2626]'}`}>
                  {y.netCash}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
