/**
 * CompanyDetailsPage.tsx  —  Connected to real backend
 * Fetches stock detail from GET /api/v1/stocks/<SYMBOL>/
 * Passes live data down to all sub-components via props / context.
 * WebSocket subscription for live price ticker.
 */
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Loader2, AlertCircle, BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { AuthNavbar } from '../components/AuthNavbar';
import { CompanyTabs } from '../components/company/CompanyTabs';
import { CompanyOverview } from '../components/company/CompanyOverview';
import { CompanyChart } from '../components/company/CompanyChart';
import { CompanyAnalysis } from '../components/company/CompanyAnalysis';
import { CompanyPeers } from '../components/company/CompanyPeers';
import { CompanyQuarters } from '../components/company/CompanyQuarters';
import { CompanyProfitLoss } from '../components/company/CompanyProfitLoss';
import { CompanyBalanceSheet } from '../components/company/CompanyBalanceSheet';
import { CompanyCashFlow } from '../components/company/CompanyCashFlow';
import { CompanyRatios } from '../components/company/CompanyRatios';
import { CompanyInvestors } from '../components/company/CompanyInvestors';
import { CompanyDocuments } from '../components/company/CompanyDocuments';
import { getStockDetail } from '../../api/stocks';
import { toggleWatchlist } from '../../api/auth';
import { useAuth } from '../context/AuthContext';
import { WS_BASE } from '../../api/client';
import type { StockDetail } from '../../api/stocks';

export default function CompanyDetailsPage() {
  const [activeTab, setActiveTab]   = useState('chart');
  const { symbol }                  = useParams<{ symbol: string }>();
  const navigate                    = useNavigate();
  const { isAuthenticated, openLoginModal } = useAuth();

  const [stock, setStock]           = useState<StockDetail | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [livePrice, setLivePrice]   = useState<number | null>(null);
  const [following, setFollowing]   = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const wsRef                       = useRef<WebSocket | null>(null);

  // ── Fetch stock detail ────────────────────────────────────────────────────
  useEffect(() => {
    if (!symbol) return;
    setLoading(true);
    setError('');
    getStockDetail(symbol.toUpperCase())
      .then((data) => {
        setStock(data);
        setFollowing(data.is_following);
      })
      .catch((err) => {
        if (err?.response?.status === 404) {
          setError(`Stock "${symbol}" not found.`);
        } else {
          setError('Failed to load stock data. Please try again.');
        }
      })
      .finally(() => setLoading(false));
  }, [symbol]);

  // ── WebSocket for live price ──────────────────────────────────────────────
  useEffect(() => {
    if (!symbol) return;
    const token = localStorage.getItem('access_token');
    const url = `${WS_BASE}/ws/stock/${symbol.toUpperCase()}/${token ? `?token=${token}` : ''}`;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'price_update' && msg.price) {
          setLivePrice(parseFloat(msg.price));
        }
      } catch {}
    };

    const ping = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ action: 'ping' }));
    }, 30000);

    ws.onclose = () => clearInterval(ping);

    return () => { ws.close(); };
  }, [symbol]);

  // ── Follow / Unfollow ─────────────────────────────────────────────────────
  const handleToggleFollow = async () => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    if (!stock) return;
    setFollowLoading(true);
    try {
      await toggleWatchlist(stock.symbol, stock.name);
      setFollowing((f) => !f);
    } catch {}
    finally { setFollowLoading(false); }
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] dark:bg-[#111827]">
        <AuthNavbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-[#4F46E5] animate-spin mx-auto mb-4" />
            <p className="text-[#6B7280] dark:text-[#9CA3AF]">Loading stock data…</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] dark:bg-[#111827]">
        <AuthNavbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-lg text-[#111827] dark:text-white font-medium mb-2">{error}</p>
            <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-colors text-sm">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentPrice = livePrice ?? (stock ? parseFloat(stock.current_price) : 0);
  const dayChange    = stock ? parseFloat(stock.day_change) : 0;
  const dayChangePct = stock ? parseFloat(stock.day_change_pct) : 0;
  const isPositive   = dayChange >= 0;

  return (
    <div className="min-h-screen bg-[#F3F4F6] dark:bg-[#111827]">
      <AuthNavbar />

      {/* ── Company Header ─────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#1F2937]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-[#111827] dark:text-white">{stock?.name}</h1>
                <span className="text-xs px-2 py-0.5 bg-[#F3F4F6] dark:bg-[#374151] text-[#6B7280] dark:text-[#9CA3AF] rounded font-medium">{stock?.exchange}</span>
              </div>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">{stock?.symbol} · {stock?.sector}</p>
            </div>

            <div className="flex items-center gap-6">
              {/* Live Price */}
              <div className="text-right">
                <div className="text-3xl font-bold text-[#111827] dark:text-white">
                  ₹{currentPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  {livePrice && <span className="text-xs text-[#16A34A] ml-2 font-normal">● LIVE</span>}
                </div>
                <div className={`text-sm font-medium ${isPositive ? 'text-[#16A34A]' : 'text-red-500'}`}>
                  {isPositive ? '+' : ''}{dayChange.toFixed(2)} ({isPositive ? '+' : ''}{dayChangePct.toFixed(2)}%)
                </div>
              </div>

              {/* Follow button */}
              <button
                onClick={handleToggleFollow}
                disabled={followLoading}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  following
                    ? 'bg-[#EEF2FF] dark:bg-[#312E81] text-[#4F46E5] dark:text-[#818CF8] hover:bg-[#E0E7FF]'
                    : 'bg-[#4F46E5] text-white hover:bg-[#4338CA]'
                } disabled:opacity-60`}
              >
                {followLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : following ? <BookmarkCheck className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
                {following ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>

          {/* 52-week range bar */}
          {stock?.week_52_high && stock?.week_52_low && (
            <div className="mt-4 flex items-center gap-3 text-xs text-[#6B7280] dark:text-[#9CA3AF]">
              <span>52W Low ₹{parseFloat(stock.week_52_low).toLocaleString('en-IN')}</span>
              <div className="flex-1 h-1.5 bg-[#E5E7EB] dark:bg-[#374151] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#4F46E5] rounded-full"
                  style={{
                    width: `${Math.max(0, Math.min(100, ((currentPrice - parseFloat(stock.week_52_low)) / (parseFloat(stock.week_52_high) - parseFloat(stock.week_52_low))) * 100))}%`
                  }}
                />
              </div>
              <span>52W High ₹{parseFloat(stock.week_52_high).toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#1F2937] border-b border-[#E5E7EB] dark:border-[#374151]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <CompanyTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0">
            {activeTab === 'chart'         && <><CompanyOverview /><CompanyChart /></>}
            {activeTab === 'analysis'      && <CompanyAnalysis />}
            {activeTab === 'peers'         && <CompanyPeers />}
            {activeTab === 'quarters'      && <CompanyQuarters />}
            {activeTab === 'profit-loss'   && <CompanyProfitLoss />}
            {activeTab === 'balance-sheet' && <CompanyBalanceSheet />}
            {activeTab === 'cash-flow'     && <CompanyCashFlow />}
            {activeTab === 'ratios'        && <CompanyRatios />}
            {activeTab === 'investors'     && <CompanyInvestors />}
            {activeTab === 'documents'     && <CompanyDocuments />}
          </div>

          {activeTab === 'chart' && (
            <div className="hidden lg:block w-80 flex-shrink-0 space-y-4">
              {/* About */}
              <div className="bg-white dark:bg-[#1F2937] rounded-lg p-6 border border-[#E5E7EB] dark:border-[#374151]">
                <h3 className="font-semibold text-[#111827] dark:text-white mb-3 text-sm">ABOUT</h3>
                <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                  {stock?.overview?.about || stock?.description || 'Company information not available.'}
                </p>
              </div>

              {/* Key Metrics */}
              {stock?.overview && (
                <div className="bg-white dark:bg-[#1F2937] rounded-lg p-6 border border-[#E5E7EB] dark:border-[#374151]">
                  <h3 className="font-semibold text-[#111827] dark:text-white mb-4 text-sm">KEY METRICS</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'P/E Ratio', value: stock.overview.pe_ratio },
                      { label: 'P/B Ratio', value: stock.overview.pb_ratio },
                      { label: 'Div Yield', value: stock.overview.div_yield_pct ? `${stock.overview.div_yield_pct}%` : null },
                      { label: 'ROCE', value: stock.overview.roce_pct ? `${stock.overview.roce_pct}%` : null },
                      { label: 'ROE', value: stock.overview.roe_pct ? `${stock.overview.roe_pct}%` : null },
                      { label: 'Debt/Equity', value: stock.overview.debt_to_equity },
                    ].filter(m => m.value).map(metric => (
                      <div key={metric.label} className="flex justify-between text-sm">
                        <span className="text-[#6B7280] dark:text-[#9CA3AF]">{metric.label}</span>
                        <span className="font-medium text-[#111827] dark:text-white">{metric.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
