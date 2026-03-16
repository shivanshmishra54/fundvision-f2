export function CompanyDocuments() {
  const documents = [
    { type: 'Annual Report', year: '2024-25', date: 'Mar 2025', size: '2.4 MB' },
    { type: 'Annual Report', year: '2023-24', date: 'Mar 2024', size: '2.1 MB' },
    { type: 'Quarterly Results', year: 'Q3 2024-25', date: 'Dec 2024', size: '856 KB' },
    { type: 'Quarterly Results', year: 'Q2 2024-25', date: 'Sep 2024', size: '742 KB' },
    { type: 'Credit Rating', year: '2024', date: 'Aug 2024', size: '124 KB' },
    { type: 'Concall Transcript', year: 'Q2 2024-25', date: 'Sep 2024', size: '445 KB' },
  ];

  return (
    <div className="bg-white dark:bg-[#1F2937] rounded-lg border border-[#E5E7EB] dark:border-[#374151]">
      <div className="p-6 border-b border-[#E5E7EB] dark:border-[#374151]">
        <h2 className="text-xl font-semibold text-[#111827] dark:text-white mb-2">Documents</h2>
        <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
          Company filings and reports
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-3">
          {documents.map((doc, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-[#E5E7EB] dark:border-[#374151] rounded-lg hover:bg-[#F9FAFB] dark:hover:bg-[#374151] transition-colors"
            >
              <div className="flex items-center gap-4">
                <svg className="w-10 h-10 text-[#DC2626]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                  <path fill="#FFF" d="M14 2v6h6" />
                  <text x="7" y="17" fontSize="6" fill="#FFF" fontWeight="bold">PDF</text>
                </svg>
                <div>
                  <h3 className="font-medium text-[#111827] dark:text-white">{doc.type}</h3>
                  <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                    {doc.year} • {doc.date} • {doc.size}
                  </p>
                </div>
              </div>
              <button className="px-4 py-2 bg-[#4F46E5] dark:bg-[#818CF8] text-white text-sm rounded hover:bg-[#4338CA] dark:hover:bg-[#6366F1] transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
