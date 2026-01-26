export interface ICryptocurrency {
  id: string;
  name: string;
  symbol: string;
  rank: string;
  price_usd: string;
  price_btc: string;
  "24h_volume_usd": string;
  market_cap_usd: string;
  available_supply: string;
  total_supply: string;
  max_supply: string | null;
  percent_change_1h: string;
  percent_change_24h: string;
  percent_change_7d: string;
  last_updated: string;
}

// Old Bitcoin Price Index interfaces (kept for backward compatibility)
export interface ICurrency {
  code: string;
  symbol: string;
  rate: string;
  description: string;
  rate_float: number;
}

export interface IBPI {
  USD: ICurrency;
  GBP: ICurrency;
  EUR: ICurrency;
}

export interface ITime {
  updated: string;
  updatedISO: string;
  updateduk: string;
}

export interface IBitcoinPrice {
  time: ITime;
  disclaimer: string;
  chartName: string;
  bpi: IBPI;
}
