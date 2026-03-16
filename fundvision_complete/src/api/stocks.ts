/**
 * api/stocks.ts  —  Stock & Market data API calls
 */

import client from './client';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StockSearchResult {
  id: number;
  symbol: string;
  name: string;
  exchange: string;
  sector: string;
  logo_url: string;
}

export interface StockDetail {
  id: number;
  symbol: string;
  name: string;
  exchange: string;
  sector: string;
  industry: string;
  current_price: string;
  day_change: string;
  day_change_pct: string;
  week_52_high: string;
  week_52_low: string;
  market_cap: string;
  volume: number;
  logo_url: string;
  is_following: boolean;
  overview: CompanyOverview;
  profit_loss: ProfitLossRow[];
  balance_sheets: BalanceSheetRow[];
  cash_flows: CashFlowRow[];
  ratios: RatioRow[];
  quarterly_results: QuarterlyRow[];
  peers: PeerRow[];
  shareholding: ShareholdingRow[];
}

export interface CompanyOverview {
  pe_ratio: string;
  pb_ratio: string;
  div_yield_pct: string;
  book_value: string;
  face_value: string;
  roce_pct: string;
  roe_pct: string;
  debt_to_equity: string;
  sales_cagr_10y: string;
  profit_cagr_10y: string;
  stock_cagr_10y: string;
  roe_avg_10y: string;
  about: string;
}

export interface ProfitLossRow {
  year: string;
  sales: number;
  expenses: number;
  opProfit: number;
  opm: string;
  otherIncome: number;
  interest: number;
  depreciation: number;
  pbt: number;
  tax: string;
  netProfit: number;
  eps: number;
  dividend: string;
}

export interface BalanceSheetRow {
  year: string;
  equity: number;
  reserves: number;
  borrowings: number;
  otherLiab: number;
  totalLiab: number;
  fixedAssets: number;
  cwip: number;
  investments: number;
  otherAssets: number;
  totalAssets: number;
}

export interface CashFlowRow {
  year: string;
  operating: number;
  investing: number;
  financing: number;
  netCash: number;
}

export interface RatioRow {
  year: string;
  debtorDays: number | null;
  inventoryDays: number | null;
  daysPayable: number | null;
  cashConversionCycle: number | null;
  workingCapitalDays: number | null;
  roce: number | null;
}

export interface QuarterlyRow {
  quarter: string;
  sales: number;
  expenses: number;
  opProfit: number;
  opm: string;
  otherIncome: number;
  interest: number;
  depreciation: number;
  pbt: number;
  netProfit: number;
  eps: number;
}

export interface PeerRow {
  peer_symbol: string;
  name: string;
  cmp: number;
  pe: number | null;
  marketCap: number;
  divYield: number;
  npQtr: number;
  qtrProfit: number;
  salesQtr: number;
  qtrSales: number;
  roce: number;
  is_current: boolean;
}

export interface ShareholdingRow {
  period: string;
  promoter_pct: number;
  dii_pct: number;
  fii_pct: number;
  public_pct: number;
  others_pct: number;
}

export interface ChartDataPoint {
  date: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: number;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  current_value: string;
  day_change: string;
  day_change_pct: string;
  sparkline: number[];
}

// ─── Search ───────────────────────────────────────────────────────────────────
export async function searchStocks(query: string, limit = 10): Promise<StockSearchResult[]> {
  if (!query.trim()) return [];
  const { data } = await client.get<StockSearchResult[]>('/stocks/search/', {
    params: { q: query, limit },
  });
  return data;
}

// ─── Stock Detail ─────────────────────────────────────────────────────────────
export async function getStockDetail(symbol: string): Promise<StockDetail> {
  const { data } = await client.get<StockDetail>(`/stocks/${symbol}/`);
  return data;
}

// ─── Chart Data ───────────────────────────────────────────────────────────────
export async function getChartData(
  symbol: string,
  interval: string = '1d',
  fromDate?: string,
  toDate?: string
): Promise<ChartDataPoint[]> {
  const { data } = await client.get<ChartDataPoint[]>(`/stocks/${symbol}/chart/`, {
    params: { interval, from_date: fromDate, to_date: toDate },
  });
  return data;
}

// ─── Market Overview ──────────────────────────────────────────────────────────
export async function getMarketOverview(): Promise<{ indices: MarketIndex[] }> {
  const { data } = await client.get('/market/overview/');
  return data;
}
