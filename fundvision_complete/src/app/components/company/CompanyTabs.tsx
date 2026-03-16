interface CompanyTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function CompanyTabs({ activeTab, onTabChange }: CompanyTabsProps) {
  const tabs = [
    { id: 'chart', label: 'Chart' },
    { id: 'analysis', label: 'Analysis' },
    { id: 'peers', label: 'Peers' },
    { id: 'quarters', label: 'Quarters' },
    { id: 'profit-loss', label: 'Profit & Loss' },
    { id: 'balance-sheet', label: 'Balance Sheet' },
    { id: 'cash-flow', label: 'Cash Flow' },
    { id: 'ratios', label: 'Ratios' },
    { id: 'investors', label: 'Investors' },
    { id: 'documents', label: 'Documents' },
  ];

  return (
    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
            activeTab === tab.id
              ? 'border-[#4F46E5] dark:border-[#818CF8] text-[#4F46E5] dark:text-[#818CF8] font-medium'
              : 'border-transparent text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-white hover:border-[#D1D5DB] dark:hover:border-[#4B5563]'
          }`}
        >
          {tab.label}
        </button>
      ))}
      <div className="ml-auto flex items-center gap-2">
        <button className="px-3 py-1.5 border border-[#D1D5DB] dark:border-[#4B5563] text-[#6B7280] dark:text-[#9CA3AF] text-xs rounded hover:bg-[#F3F4F6] dark:hover:bg-[#374151] transition-colors flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Notebook
        </button>
        <button className="px-3 py-1.5 bg-[#A855F7] text-white text-xs rounded hover:bg-[#9333EA] transition-colors flex items-center gap-1">
          ✨ AI
        </button>
      </div>
    </div>
  );
}
