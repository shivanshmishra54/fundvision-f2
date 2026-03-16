import { useState } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function CompanyChart() {
  const [timeRange, setTimeRange] = useState('1Yr');
  const [chartType, setChartType] = useState('Price');

  const timeRanges = ['1M', '6M', '1Yr', '3Yr', '5Yr', '10Yr', 'Max'];

  // Mock data for the chart
  const data = [
    { id: '1', date: 'Apr 2025', price: 42, volume: 8000, pe: 42 },
    { id: '2', date: 'May 2025', price: 38, volume: 6000, pe: 40 },
    { id: '3', date: 'Jun 2025', price: 40, volume: 10000, pe: 41 },
    { id: '4', date: 'Jul 2025', price: 45, volume: 12000, pe: 43 },
    { id: '5', date: 'Aug 2025', price: 43, volume: 7000, pe: 42 },
    { id: '6', date: 'Sep 2025', price: 48, volume: 15000, pe: 45 },
    { id: '7', date: 'Oct 2025', price: 52, volume: 20000, pe: 48 },
    { id: '8', date: 'Nov 2025', price: 49, volume: 11000, pe: 46 },
    { id: '9', date: 'Dec 2025', price: 47, volume: 9000, pe: 45 },
    { id: '10', date: 'Jan 2026', price: 51, volume: 14000, pe: 47 },
    { id: '11', date: 'Feb 2026', price: 48, volume: 10000, pe: 46 },
    { id: '12', date: 'Mar 2026', price: 43, volume: 8500, pe: 42 },
  ];

  return (
    <div className="bg-white dark:bg-[#1F2937] rounded-lg p-6 border border-[#E5E7EB] dark:border-[#374151]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-xs rounded transition-colors ${
                timeRange === range
                  ? 'bg-[#4F46E5] dark:bg-[#818CF8] text-white'
                  : 'bg-[#F3F4F6] dark:bg-[#374151] text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#E5E7EB] dark:hover:bg-[#4B5563]'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setChartType('Price')}
            className={`px-3 py-1.5 text-xs rounded border transition-colors ${
              chartType === 'Price'
                ? 'border-[#4F46E5] dark:border-[#818CF8] bg-[#EEF2FF] dark:bg-[#312E81] text-[#4F46E5] dark:text-[#818CF8]'
                : 'border-[#D1D5DB] dark:border-[#4B5563] text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F3F4F6] dark:hover:bg-[#374151]'
            }`}
          >
            Price
          </button>
          <button
            onClick={() => setChartType('PE Ratio')}
            className={`px-3 py-1.5 text-xs rounded border transition-colors ${
              chartType === 'PE Ratio'
                ? 'border-[#4F46E5] dark:border-[#818CF8] bg-[#EEF2FF] dark:bg-[#312E81] text-[#4F46E5] dark:text-[#818CF8]'
                : 'border-[#D1D5DB] dark:border-[#4B5563] text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F3F4F6] dark:hover:bg-[#374151]'
            }`}
          >
            PE Ratio
          </button>
          <button className="px-3 py-1.5 text-xs rounded border border-[#D1D5DB] dark:border-[#4B5563] text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F3F4F6] dark:hover:bg-[#374151] transition-colors flex items-center gap-1">
            More
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button className="px-3 py-1.5 text-xs rounded border border-[#D1D5DB] dark:border-[#4B5563] text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F3F4F6] dark:hover:bg-[#374151] transition-colors flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Alerts
          </button>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#6B7280', fontSize: 12 }}
            stroke="#E5E7EB"
          />
          <YAxis 
            yAxisId="left"
            tick={{ fill: '#6B7280', fontSize: 12 }}
            stroke="#E5E7EB"
            label={{ value: 'Volume', angle: -90, position: 'insideLeft', fill: '#6B7280' }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            tick={{ fill: '#6B7280', fontSize: 12 }}
            stroke="#E5E7EB"
            label={{ value: chartType === 'Price' ? 'Price (₹)' : 'PE Ratio', angle: 90, position: 'insideRight', fill: '#6B7280' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#FFF',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="volume" fill="#93C5FD" opacity={0.5} name="Volume" />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey={chartType === 'Price' ? 'price' : 'pe'} 
            stroke="#4F46E5" 
            strokeWidth={2}
            dot={false}
            name={chartType === 'Price' ? 'Price' : 'PE Ratio'}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4 text-xs">
        <label className="flex items-center gap-2">
          <input type="checkbox" defaultChecked className="rounded" />
          <span className="text-[#4F46E5] dark:text-[#818CF8]">Price on NSE</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" className="rounded" />
          <span className="text-[#6B7280] dark:text-[#9CA3AF]">50 DMA</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" className="rounded" />
          <span className="text-[#6B7280] dark:text-[#9CA3AF]">200 DMA</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" defaultChecked className="rounded" />
          <span className="text-[#93C5FD]">Volume</span>
        </label>
      </div>
    </div>
  );
}