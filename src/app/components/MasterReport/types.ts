export interface CompanySignal {
  id: number;
  company: string;
  signal: string;
  description: string;
  timing: string;
  assetClass: string;
  source: string;
  sourceUrl: string;
  date: string;
}

export interface MarketHook {
  id: number;
  topic: string;
  hook: string;
  data: string[];
}

export interface WeeklyReport {
  weekOf: string;
  weekStart: string;
  weekEnd: string;
  lastUpdated: string;
  companySignals: CompanySignal[];
  marketHooks: MarketHook[];
}

export type CategoryTab = 'companies' | 'market';
