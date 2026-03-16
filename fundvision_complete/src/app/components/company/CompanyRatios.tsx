export function CompanyRatios() {
  const ratios = [
    { name: 'Debtor Days', values: [25, 40, 31, 31, 30, 42, 23, 22, 30, 27, 49, 34] },
    { name: 'Inventory Days', values: [70, 82, 63, 60, 62, 100, 84, 107, 119, 192, 221, 220] },
    { name: 'Days Payable', values: [25, 15, 24, 37, 34, 29, 12, 4, 6, 9, 9, 35] },
    { name: 'Cash Conversion Cycle', values: [69, 107, 70, 54, 59, 112, 95, 125, 142, 210, 261, 220] },
    { name: 'Working Capital Days', values: [-9, -3, -5, 1, 5, 17, 16, 23, 12, 11, 19, -16] },
    { name: 'ROCE %', values: [null, 27, 17, 24, 32, 35, 21, 11, 7, 5, 5, 5] },
  ];

  const years = [
    'Mar 2014', 'Mar 2015', 'Mar 2016', 'Mar 2017', 'Mar 2018', 'Mar 2019',
    'Mar 2020', 'Mar 2021', 'Mar 2022', 'Mar 2023', 'Mar 2024', 'Mar 2025'
  ];

  return (
    <div className="bg-white dark:bg-[#1F2937] rounded-lg border border-[#E5E7EB] dark:border-[#374151]">
      <div className="p-6 border-b border-[#E5E7EB] dark:border-[#374151]">
        <h2 className="text-xl font-semibold text-[#111827] dark:text-white mb-2">Ratios</h2>
        <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
          Consolidated Figures in Rs. Crores / <button className="text-[#4F46E5] dark:text-[#818CF8] hover:underline">View Standalone</button>
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] bg-[#F9FAFB] dark:bg-[#374151]">
              <th className="text-left p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-[#F9FAFB] dark:bg-[#374151]"></th>
              {years.map((year, i) => (
                <th key={i} className="text-right p-3 font-medium whitespace-nowrap text-[#6B7280] dark:text-[#9CA3AF]">
                  {year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ratios.map((ratio, idx) => (
              <tr key={idx} className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151]">
                <td className="p-3 font-medium text-[#111827] dark:text-white sticky left-0 bg-white dark:bg-[#1F2937]">
                  {ratio.name}
                </td>
                {ratio.values.map((value, i) => (
                  <td key={i} className={`text-right p-3 ${
                    value === null ? 'text-[#9CA3AF]' :
                    ratio.name === 'ROCE %' ? (
                      value >= 20 ? 'text-[#4F46E5] dark:text-[#818CF8]' : 
                      value >= 10 ? 'text-[#111827] dark:text-white' : 
                      'text-[#DC2626]'
                    ) :
                    value < 0 ? 'text-[#DC2626]' : 'text-[#111827] dark:text-white'
                  }`}>
                    {value === null ? '' : value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
