/**
 * This file defines the backend API endpoint for the portfolio dashboard.
 * It is responsible for processing and serving the complete portfolio data as JSON.
 */

import { NextResponse } from 'next/server';
import { StockHolding } from '../../../interfaces';

// This is the initial, static data for the portfolio, taken from the provided CSV file.
// In a real application, this would likely come from a user's database.
const initialPortfolioData: Omit<StockHolding, 'cmp' | 'peRatio' | 'latestEarnings'>[] = [
  { particulars: 'Reliance Industries', quantity: 100, purchasePrice: 2470.10, sector: 'Energy', exchange: 'NSE', symbol: 'RELIANCE.NS' },
  { particulars: 'Tata Consultancy Services', quantity: 50, purchasePrice: 3217.90, sector: 'Technology', exchange: 'NSE', symbol: 'TCS.NS' },
  { particulars: 'HDFC Bank', quantity: 150, purchasePrice: 1422.35, sector: 'Financials', exchange: 'NSE', symbol: 'HDFCBANK.NS' },
  { particulars: 'ICICI Bank', quantity: 200, purchasePrice: 875.50, sector: 'Financials', exchange: 'NSE', symbol: 'ICICIBANK.NS' },
  { particulars: 'Infosys', quantity: 80, purchasePrice: 1485.75, sector: 'Technology', exchange: 'NSE', symbol: 'INFY.NS' },
  { particulars: 'Hindustan Unilever', quantity: 120, purchasePrice: 2550.20, sector: 'Consumer Goods', exchange: 'NSE', symbol: 'HINDUNILVR.NS' },
  { particulars: 'State Bank of India', quantity: 300, purchasePrice: 575.80, sector: 'Financials', exchange: 'NSE', symbol: 'SBIN.NS' },
  { particulars: 'Bharti Airtel', quantity: 250, purchasePrice: 777.90, sector: 'Telecommunication', exchange: 'NSE', symbol: 'BHARTIARTL.NS' },
  { particulars: 'ITC', quantity: 400, purchasePrice: 442.55, sector: 'Consumer Goods', exchange: 'NSE', symbol: 'ITC.NS' },
  { particulars: 'Larsen & Toubro', quantity: 70, purchasePrice: 2375.45, sector: 'Infrastructure', exchange: 'NSE', symbol: 'LT.NS' }
];

export async function GET(request: Request) {
  try {
    // --- MOCK DATA SIMULATION ---
    // The following code simulates fetching live data by generating random values.
    // This is where the live API call (e.g., to 'yahoo-finance2') would be implemented
    // in a production environment, using the 'symbol' from the data above.
    const dynamicPortfolio = initialPortfolioData.map(stock => {
      const priceFluctuation = (Math.random() - 0.5) * 0.1 * stock.purchasePrice;
      const newCmp = parseFloat((stock.purchasePrice + priceFluctuation).toFixed(2));

      return {
        ...stock,
        cmp: newCmp,
        peRatio: parseFloat((Math.random() * 20 + 15).toFixed(2)),
        latestEarnings: `Q${Math.floor(Math.random() * 4) + 1} Earnings Update`,
      };
    });

    return NextResponse.json({ portfolio: dynamicPortfolio });

  } catch (error) {
    console.error("Error processing portfolio data:", error);
    return NextResponse.json(
      { error: 'Failed to process portfolio data' },
      { status: 500 }
    );
  }
}