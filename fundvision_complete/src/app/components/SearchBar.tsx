import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router';
import { searchStocks } from '../../api/stocks';
import type { StockSearchResult } from '../../api/stocks';

const TRENDING = [
  { symbol: 'RELIANCE', name: 'Reliance Industries' },
  { symbol: 'TCS',      name: 'Tata Consultancy Services' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank' },
  { symbol: 'INFY',     name: 'Infosys' },
  { symbol: 'SBIN',     name: 'State Bank of India' },
];

interface SearchBarProps {
  large?: boolean;
}

export function SearchBar({ large = false }: SearchBarProps) {
  const navigate = useNavigate();
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState<StockSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const debounceRef           = useRef<ReturnType<typeof setTimeout>>();
  const containerRef          = useRef<HTMLDivElement>(null);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!query.trim()) { setResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try { setResults(await searchStocks(query, 8)); }
      catch { setResults([]); }
      finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setFocused(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (symbol: string) => {
    setQuery(''); setResults([]); setFocused(false);
    navigate(`/company/${symbol}`);
  };

  const showDropdown = focused && (results.length > 0 || query === '');
  const inputClass = large
    ? "w-full pl-12 pr-10 py-3.5 bg-white dark:bg-[#374151] border border-[#D1D5DB] dark:border-[#4B5563] rounded-lg text-base text-[#111827] dark:text-white placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] shadow-sm"
    : "w-full pl-9 pr-9 py-2 bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#4B5563] rounded-lg text-sm text-[#111827] dark:text-white placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]";

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className={`absolute ${large ? 'left-4 w-5 h-5' : 'left-3 w-4 h-4'} top-1/2 -translate-y-1/2 text-[#9CA3AF]`} />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder={large ? "Search for a company, e.g. Reliance, TCS…" : "Search stocks…"}
          className={inputClass}
        />
        {loading && <Loader2 className={`absolute ${large ? 'right-4' : 'right-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-[#4F46E5] animate-spin`} />}
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-xl shadow-xl z-50 overflow-hidden">
          {results.length > 0 ? (
            <>
              <div className="px-3 py-2 text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF] border-b border-[#F3F4F6] dark:border-[#374151]">Results</div>
              {results.map(stock => (
                <button key={stock.symbol} onClick={() => handleSelect(stock.symbol)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#F9FAFB] dark:hover:bg-[#374151] transition-colors text-left">
                  <div className="w-8 h-8 rounded-lg bg-[#F3F4F6] dark:bg-[#374151] flex items-center justify-center text-xs font-bold text-[#4F46E5] flex-shrink-0">
                    {stock.symbol.slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#111827] dark:text-white truncate">{stock.name}</p>
                    <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">{stock.symbol} · {stock.exchange}</p>
                  </div>
                </button>
              ))}
            </>
          ) : (
            <>
              <div className="px-3 py-2 text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF] border-b border-[#F3F4F6] dark:border-[#374151] flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Trending
              </div>
              {TRENDING.map(t => (
                <button key={t.symbol} onClick={() => handleSelect(t.symbol)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#F9FAFB] dark:hover:bg-[#374151] transition-colors text-left">
                  <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] dark:bg-[#312E81] flex items-center justify-center text-xs font-bold text-[#4F46E5] flex-shrink-0">
                    {t.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm text-[#111827] dark:text-white">{t.name}</p>
                    <p className="text-xs text-[#6B7280]">{t.symbol}</p>
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
