import { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';

type Fund = {
  id: string;
  name: string;
  type: 'Stock' | 'Mutual Fund';
  cagr3y: number;
  cagr5y: number;
  sharpeRatio: number;
  expenseRatio: number;
  marketCapAum: string;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
};

const fundsData: Fund[] = [
  {
    id: '1',
    name: 'Parag Parikh Flexi Cap Fund',
    type: 'Mutual Fund',
    cagr3y: 18.4,
    cagr5y: 21.2,
    sharpeRatio: 2.14,
    expenseRatio: 0.74,
    marketCapAum: '₹52,400 Cr',
    riskLevel: 'High',
  },
  {
    id: '2',
    name: 'Reliance Industries Ltd',
    type: 'Stock',
    cagr3y: 12.8,
    cagr5y: 15.6,
    sharpeRatio: 1.45,
    expenseRatio: 0,
    marketCapAum: '₹18.2L Cr',
    riskLevel: 'Moderate',
  },
  {
    id: '3',
    name: 'HDFC Mid Cap Opportunities Fund',
    type: 'Mutual Fund',
    cagr3y: 24.1,
    cagr5y: 19.8,
    sharpeRatio: 1.92,
    expenseRatio: 0.95,
    marketCapAum: '₹68,120 Cr',
    riskLevel: 'Very High',
  },
  {
    id: '4',
    name: 'TCS Ltd',
    type: 'Stock',
    cagr3y: 9.2,
    cagr5y: 13.4,
    sharpeRatio: 1.68,
    expenseRatio: 0,
    marketCapAum: '₹13.8L Cr',
    riskLevel: 'Low',
  },
  {
    id: '5',
    name: 'SBI Small Cap Fund',
    type: 'Mutual Fund',
    cagr3y: 32.5,
    cagr5y: 28.4,
    sharpeRatio: 1.56,
    expenseRatio: 1.12,
    marketCapAum: '₹38,750 Cr',
    riskLevel: 'Very High',
  },
  {
    id: '6',
    name: 'HDFC Bank Ltd',
    type: 'Stock',
    cagr3y: 7.8,
    cagr5y: 11.2,
    sharpeRatio: 1.82,
    expenseRatio: 0,
    marketCapAum: '₹12.4L Cr',
    riskLevel: 'Low',
  },
  {
    id: '7',
    name: 'Axis Bluechip Fund',
    type: 'Mutual Fund',
    cagr3y: 15.6,
    cagr5y: 17.8,
    sharpeRatio: 2.08,
    expenseRatio: 0.58,
    marketCapAum: '₹42,890 Cr',
    riskLevel: 'Moderate',
  },
  {
    id: '8',
    name: 'Infosys Ltd',
    type: 'Stock',
    cagr3y: 11.4,
    cagr5y: 14.9,
    sharpeRatio: 1.72,
    expenseRatio: 0,
    marketCapAum: '₹7.2L Cr',
    riskLevel: 'Moderate',
  },
];

type SortKey = keyof Pick<Fund, 'cagr3y' | 'cagr5y' | 'sharpeRatio' | 'expenseRatio'>;

export function DataTable() {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedData = [...fundsData].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const getPerformanceColor = (value: number, type: 'cagr' | 'sharpe' | 'expense') => {
    if (type === 'cagr') {
      return value >= 15 ? 'text-[#16A34A]' : value < 10 ? 'text-[#DC2626]' : 'text-[#111827]';
    }
    if (type === 'sharpe') {
      return value >= 1.8 ? 'text-[#16A34A]' : value < 1.5 ? 'text-[#DC2626]' : 'text-[#111827]';
    }
    if (type === 'expense') {
      return value <= 0.7 ? 'text-[#16A34A]' : value > 1.0 ? 'text-[#DC2626]' : 'text-[#111827]';
    }
    return 'text-[#111827]';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'text-[#16A34A]';
      case 'Moderate':
        return 'text-[#111827]';
      case 'High':
        return 'text-[#F59E0B]';
      case 'Very High':
        return 'text-[#DC2626]';
      default:
        return 'text-[#111827]';
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 pb-12 md:pb-16 bg-white dark:bg-[#1F2937]">
      <div className="bg-white dark:bg-[#374151] border border-[#E5E7EB] dark:border-[#4B5563] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F9FAFB] dark:bg-[#1F2937] border-b border-[#E5E7EB] dark:border-[#4B5563]">
                <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs text-[#6B7280] dark:text-[#9CA3AF] font-medium uppercase tracking-wider whitespace-nowrap">Name</th>
                <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs text-[#6B7280] dark:text-[#9CA3AF] font-medium uppercase tracking-wider whitespace-nowrap">Type</th>
                <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs text-[#6B7280] dark:text-[#9CA3AF] font-medium uppercase tracking-wider whitespace-nowrap">
                  <button
                    onClick={() => handleSort('cagr3y')}
                    className="flex items-center gap-1.5 hover:text-[#111827] dark:hover:text-white transition-colors"
                  >
                    3Y CAGR
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </th>
                <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs text-[#6B7280] dark:text-[#9CA3AF] font-medium uppercase tracking-wider whitespace-nowrap">
                  <button
                    onClick={() => handleSort('cagr5y')}
                    className="flex items-center gap-1.5 hover:text-[#111827] dark:hover:text-white transition-colors"
                  >
                    5Y CAGR
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </th>
                <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs text-[#6B7280] dark:text-[#9CA3AF] font-medium uppercase tracking-wider whitespace-nowrap">
                  <button
                    onClick={() => handleSort('sharpeRatio')}
                    className="flex items-center gap-1.5 hover:text-[#111827] dark:hover:text-white transition-colors"
                  >
                    Sharpe Ratio
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </th>
                <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs text-[#6B7280] dark:text-[#9CA3AF] font-medium uppercase tracking-wider whitespace-nowrap">
                  <button
                    onClick={() => handleSort('expenseRatio')}
                    className="flex items-center gap-1.5 hover:text-[#111827] dark:hover:text-white transition-colors"
                  >
                    Expense Ratio
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </th>
                <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs text-[#6B7280] dark:text-[#9CA3AF] font-medium uppercase tracking-wider whitespace-nowrap">Market Cap / AUM</th>
                <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs text-[#6B7280] dark:text-[#9CA3AF] font-medium uppercase tracking-wider whitespace-nowrap">Risk Level</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-[#374151] divide-y divide-[#E5E7EB] dark:divide-[#4B5563]">
              {sortedData.map((fund) => (
                <tr
                  key={fund.id}
                  className="hover:bg-[#F9FAFB] dark:hover:bg-[#1F2937] transition-colors"
                >
                  <td className="px-3 md:px-6 py-3 md:py-4 text-[#111827] dark:text-white text-xs md:text-sm whitespace-nowrap">{fund.name}</td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-[#6B7280] dark:text-[#9CA3AF] text-xs md:text-sm whitespace-nowrap">{fund.type}</td>
                  <td className={`px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium whitespace-nowrap ${getPerformanceColor(fund.cagr3y, 'cagr')}`}>
                    {fund.cagr3y}%
                  </td>
                  <td className={`px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium whitespace-nowrap ${getPerformanceColor(fund.cagr5y, 'cagr')}`}>
                    {fund.cagr5y}%
                  </td>
                  <td className={`px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium whitespace-nowrap ${getPerformanceColor(fund.sharpeRatio, 'sharpe')}`}>
                    {fund.sharpeRatio}
                  </td>
                  <td className={`px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium whitespace-nowrap ${fund.type === 'Stock' ? 'text-[#D1D5DB] dark:text-[#6B7280]' : getPerformanceColor(fund.expenseRatio, 'expense')}`}>
                    {fund.type === 'Stock' ? '—' : `${fund.expenseRatio}%`}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-[#111827] dark:text-white text-xs md:text-sm whitespace-nowrap">{fund.marketCapAum}</td>
                  <td className={`px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium whitespace-nowrap ${getRiskColor(fund.riskLevel)}`}>
                    {fund.riskLevel}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}