export function CompanyPeers() {
  const peers = [
    {
      name: 'Apex Frozen Food',
      cmp: 324.00,
      pe: 37.69,
      marketCap: 1017.79,
      divYield: 0.62,
      npQtr: 10.09,
      qtrProfit: 4686.36,
      salesQtr: 264.29,
      qtrSales: 14.55,
      roce: 2.43,
    },
    {
      name: 'Sharat Industrie',
      cmp: 145.05,
      pe: 34.73,
      marketCap: 168.81,
      divYield: 0.17,
      npQtr: 4.74,
      qtrProfit: 79.55,
      salesQtr: 142.54,
      qtrSales: 47.80,
      roce: 11.88,
    },
    {
      name: 'Coastal Corporat',
      cmp: 43.64,
      pe: 18.87,
      marketCap: 292.29,
      divYield: 0.50,
      npQtr: 7.09,
      qtrProfit: 263.59,
      salesQtr: 302.65,
      qtrSales: 64.89,
      roce: 4.61,
      highlight: true,
    },
    {
      name: 'Kings Infra',
      cmp: 112.40,
      pe: 19.60,
      marketCap: 275.44,
      divYield: 0.00,
      npQtr: 3.21,
      qtrProfit: 18.11,
      salesQtr: 37.01,
      qtrSales: 10.71,
      roce: 20.40,
    },
    {
      name: 'Waterbase',
      cmp: 41.98,
      pe: null,
      marketCap: 173.91,
      divYield: 0.00,
      npQtr: -2.63,
      qtrProfit: 32.74,
      salesQtr: 101.56,
      qtrSales: 52.06,
      roce: -10.62,
    },
    {
      name: 'Zeal Aqua',
      cmp: 12.58,
      pe: 9.07,
      marketCap: 158.60,
      divYield: 0.00,
      npQtr: 7.53,
      qtrProfit: 18.40,
      salesQtr: 222.08,
      qtrSales: 31.14,
      roce: 14.65,
    },
    {
      name: 'Essex Marine',
      cmp: 30.29,
      pe: 7.26,
      marketCap: 46.22,
      divYield: 0.00,
      npQtr: 3.41,
      qtrProfit: 227.88,
      salesQtr: 32.70,
      qtrSales: 158.70,
      roce: 24.53,
    },
  ];

  return (
    <div className="bg-white dark:bg-[#1F2937] rounded-lg border border-[#E5E7EB] dark:border-[#374151]">
      <div className="p-6 border-b border-[#E5E7EB] dark:border-[#374151] flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#111827] dark:text-white mb-2">Peer comparison</h2>
          <div className="flex items-center gap-2 text-sm text-[#6B7280] dark:text-[#9CA3AF]">
            <button className="flex items-center gap-1 text-[#4F46E5] dark:text-[#818CF8]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Fast Moving Consumer Goods
            </button>
            <span>›</span>
            <button className="flex items-center gap-1 text-[#4F46E5] dark:text-[#818CF8]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Fast Moving Consumer Goods
            </button>
            <span>›</span>
            <button className="flex items-center gap-1 text-[#4F46E5] dark:text-[#818CF8]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              Food Products
            </button>
            <span>›</span>
            <button className="flex items-center gap-1 text-[#4F46E5] dark:text-[#818CF8]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              Seafood
            </button>
          </div>
        </div>
        <button className="px-4 py-2 border border-[#4F46E5] dark:border-[#818CF8] text-[#4F46E5] dark:text-[#818CF8] text-sm rounded hover:bg-[#EEF2FF] dark:hover:bg-[#312E81] transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
          </svg>
          EDIT COLUMNS
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E5E7EB] dark:border-[#374151] text-xs text-[#6B7280] dark:text-[#9CA3AF]">
              <th className="text-left p-4 font-medium">S.No.</th>
              <th className="text-left p-4 font-medium">Name</th>
              <th className="text-right p-4 font-medium">CMP Rs.</th>
              <th className="text-right p-4 font-medium">P/E</th>
              <th className="text-right p-4 font-medium">Mar Cap Rs.Cr.</th>
              <th className="text-right p-4 font-medium">Div Yld %</th>
              <th className="text-right p-4 font-medium">NP Qtr Rs.Cr.</th>
              <th className="text-right p-4 font-medium">Qtr Profit Var %</th>
              <th className="text-right p-4 font-medium">Sales Qtr Rs.Cr.</th>
              <th className="text-right p-4 font-medium">Qtr Sales Var %</th>
              <th className="text-right p-4 font-medium">ROCE %</th>
            </tr>
          </thead>
          <tbody>
            {peers.map((peer, index) => (
              <tr
                key={index}
                className={`border-b border-[#E5E7EB] dark:border-[#374151] text-sm ${
                  peer.highlight
                    ? 'bg-[#EEF2FF] dark:bg-[#312E81]'
                    : 'hover:bg-[#F9FAFB] dark:hover:bg-[#374151]'
                }`}
              >
                <td className="p-4 text-[#6B7280] dark:text-[#9CA3AF]">{index + 1}.</td>
                <td className="p-4">
                  <button className="text-[#4F46E5] dark:text-[#818CF8] hover:underline">
                    {peer.name}
                  </button>
                </td>
                <td className="p-4 text-right text-[#111827] dark:text-white">{peer.cmp.toFixed(2)}</td>
                <td className="p-4 text-right text-[#111827] dark:text-white">
                  {peer.pe ? peer.pe.toFixed(2) : '-'}
                </td>
                <td className="p-4 text-right text-[#111827] dark:text-white">{peer.marketCap.toFixed(2)}</td>
                <td className="p-4 text-right text-[#111827] dark:text-white">{peer.divYield.toFixed(2)}</td>
                <td className="p-4 text-right text-[#111827] dark:text-white">{peer.npQtr.toFixed(2)}</td>
                <td className={`p-4 text-right ${peer.qtrProfit >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                  {peer.qtrProfit.toFixed(2)}
                </td>
                <td className="p-4 text-right text-[#111827] dark:text-white">{peer.salesQtr.toFixed(2)}</td>
                <td className={`p-4 text-right ${peer.qtrSales >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                  {peer.qtrSales.toFixed(2)}
                </td>
                <td className={`p-4 text-right ${peer.roce >= 0 ? 'text-[#111827] dark:text-white' : 'text-[#DC2626]'}`}>
                  {peer.roce.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[#F9FAFB] dark:bg-[#374151]">
              <td colSpan={11} className="p-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Detailed Comparison with:</span>
                  <input
                    type="text"
                    placeholder="eg. Infosys"
                    className="px-3 py-1.5 bg-white dark:bg-[#111827] border border-[#D1D5DB] dark:border-[#4B5563] rounded text-sm text-[#111827] dark:text-white placeholder:text-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
                  />
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
