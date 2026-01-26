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
