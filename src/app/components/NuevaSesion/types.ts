export interface CompanySignal {
  id: string;
  company: string;
  signal: string;
  assetClass: string;
}

export interface MarketHook {
  id: string;
  topic: string;
  hook: string;
}
