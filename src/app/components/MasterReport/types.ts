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
  companySignals: Record<string, unknown>[];
  marketHooks: MarketHook[];
}

export type CategoryTab = 'senales' | 'ganchos';
