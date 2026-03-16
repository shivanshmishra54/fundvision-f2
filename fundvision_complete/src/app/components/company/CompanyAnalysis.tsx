export function CompanyAnalysis() {
  const pros = [
    'Stock is trading at 1.08 times its book value',
    'Company is expected to give good quarter',
    'Company has been maintaining a healthy dividend payout of 31.6%',
  ];

  const cons = [
    'Company has low interest coverage ratio.',
    'The company has delivered a poor sales growth of 0.78% over past five years.',
    'Company has a low return on equity of 2.11% over last 3 years.',
    'Company might be capitalizing the interest cost',
    'Earnings include an other income of Rs.17.2 Cr.',
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* PROS */}
        <div className="bg-white dark:bg-[#1F2937] rounded-lg p-6 border-2 border-[#16A34A] dark:border-[#16A34A]">
          <h3 className="font-semibold text-[#111827] dark:text-white mb-4">PROS</h3>
          <ul className="space-y-3">
            {pros.map((pro, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-[#111827] dark:text-white">
                <span className="text-[#16A34A] mt-0.5">•</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CONS */}
        <div className="bg-white dark:bg-[#1F2937] rounded-lg p-6 border-2 border-[#DC2626] dark:border-[#DC2626]">
          <h3 className="font-semibold text-[#111827] dark:text-white mb-4">CONS</h3>
          <ul className="space-y-3">
            {cons.map((con, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-[#111827] dark:text-white">
                <span className="text-[#DC2626] mt-0.5">•</span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1F2937] rounded-lg p-4 border border-[#E5E7EB] dark:border-[#374151]">
        <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] flex items-center gap-2">
          <span className="text-[#DC2626]">+</span>
          The pros and cons are machine generated.
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
