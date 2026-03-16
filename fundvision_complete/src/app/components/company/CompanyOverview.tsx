export function CompanyOverview() {
  const metrics = [
    { label: 'Market Cap', value: '₹ 292 Cr.' },
    { label: 'Current Price', value: '₹ 43.6' },
    { label: 'High / Low', value: '₹ 54.6 / 29.7' },
    { label: 'Stock P/E', value: '18.9' },
    { label: 'Book Value', value: '₹ 40.5' },
    { label: 'Dividend Yield', value: '0.50 %' },
    { label: 'ROCE', value: '4.61 %' },
    { label: 'ROE', value: '1.71 %' },
    { label: 'Face Value', value: '₹ 2.00' },
  ];

  return (
    <div className="bg-white dark:bg-[#1F2937] rounded-lg p-6 border border-[#E5E7EB] dark:border-[#374151] mb-4">
      <div className="grid grid-cols-3 gap-x-8 gap-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">{metric.label}</span>
            <span className="text-sm font-medium text-[#111827] dark:text-white">{metric.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-[#E5E7EB] dark:border-[#374151]">
        <button className="text-[#4F46E5] dark:text-[#818CF8] text-sm flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add ratio to table
        </button>
        <input
          type="text"
          placeholder="eg. Promoter holding"
          className="w-full mt-2 px-3 py-2 bg-white dark:bg-[#111827] border border-[#D1D5DB] dark:border-[#4B5563] rounded text-sm text-[#111827] dark:text-white placeholder:text-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
        />
      </div>
    </div>
  );
}
