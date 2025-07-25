/**
 * Defines the core data structures for the application.
 * This file acts as the single source for the shape of portfolio data
 */

export interface StockHolding {
  // Static data that would be stored for a holding
  particulars: string;
  purchasePrice: number;
  quantity: number;
  sector: string;
  exchange: "NSE" | "BSE";
  symbol: string; // The official ticker symbol used for API lookups

  // Dynamic data fetched from the API
  cmp: number;
  peRatio?: number;
  latestEarnings?: string;
}
