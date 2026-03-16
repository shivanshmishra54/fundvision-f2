import { useEffect, useState, useRef } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { getMarketOverview } from '../../api/stocks';
import type { MarketIndex } from '../../api/stocks';
import { WS_BASE } from '../../api/client';

export function MarketOverview() {
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [loading, setLoading] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    getMarketOverview()
      .then((data) => setIndices(data.indices || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const url = `${WS_BASE}/ws/market/${token ? `?token=${token}` : ''}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'market_update' && Array.isArray(msg.indices)) {
          setIndices(prev => prev.map(idx => {
            const live = msg.indices.find((i: any) => i.symbol === idx.symbol);
            return live ? { ...idx, current_value: String(live.current_value), day_change: String(live.day_change), day_change_pct: String(live.day_change_pct) } : idx;
          }));
        }
      } catch {}
    };
    const ping = setInterval(() => { if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ action: 'ping' })); }, 30000);
    ws.onclose = () => clearInterval(ping);
    return () => { ws.close(); };
  }, []);

  const displayIndices = indices.length > 0 ? indices : [
    { symbol: 'NIFTY50', name: 'Nifty 50', current_value: '22821.40', day_change: '279.30', day_change_pct: '1.24', sparkline: [22100,22300,22200,22500,22400,22600,22800] },
    { symbol: 'SENSEX',  name: 'Sensex',   current_value: '75410.25', day_change: '735.60', day_change_pct: '0.98', sparkline: [74200,74500,74800,74600,75000,75200,75400] },
  ];

  if (loading) return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 animate-pulse">
      <div className="h-4 bg-[#F3F4F6] rounded w-32 mb-4" />
      {[1,2].map(i => <div key={i} className="mb-4"><div className="h-3 bg-[#F3F4F6] rounded w-20 mb-2" /><div className="h-5 bg-[#F3F4F6] rounded w-36" /></div>)}
    </div>
  );

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
      <h3 className="text-[#111827] mb-4 font-medium text-sm">Market Overview</h3>
      <div className="space-y-4">
        {displayIndices.map(idx => {
          const change = parseFloat(String(idx.day_change_pct));
          const isPos = change >= 0;
          const sparkData = (idx.sparkline || []).map(v => ({ value: v }));
          return (
            <div key={idx.symbol}>
              <div className="text-sm text-[#6B7280]">{idx.name}</div>
              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-[#111827] font-medium">{Number(idx.current_value).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                  <span className={`text-sm font-medium ${isPos ? 'text-[#16A34A]' : 'text-red-500'}`}>{isPos ? '+' : ''}{Number(idx.day_change_pct).toFixed(2)}%</span>
                </div>
                {sparkData.length > 0 && (
                  <ResponsiveContainer width={80} height={32}>
                    <LineChart data={sparkData}><Line type="monotone" dataKey="value" stroke={isPos ? '#16A34A' : '#EF4444'} strokeWidth={1.5} dot={false} /></LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
