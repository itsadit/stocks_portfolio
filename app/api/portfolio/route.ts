/**
 * This file defines the backend API endpoint for the portfolio dashboard.
 * It is responsible for processing and serving the complete portfolio data as JSON.
 */

import { NextResponse } from 'next/server';
import { StockHolding } from '../../../interfaces';

// This represents the user's initial portfolio data. In a real application

const initialPortfolioData: Omit<StockHolding, 'cmp' | 'peRatio' | 'latestEarnings'>[] = [
  { particulars: 'Reliance Industries', purchasePrice: 2500, quantity: 10, sector: 'Energy', exchange: 'NSE', symbol: 'RELIANCE.NS' },
  { particulars: 'Tata Consultancy Services', purchasePrice: 3800, quantity: 5, sector: 'Technology', exchange: 'NSE', symbol: 'TCS.NS' },
  { particulars: 'HDFC Bank', purchasePrice: 1500, quantity: 15, sector: 'Financials', exchange: 'BSE', symbol: 'HDFCBANK.BO' },
];

export async function GET(request: Request) {
  try {
    // --- MOCK DATA SIMULATION ---
    // The following code simulates fetching live data by generating random values.
    // In a production environment, this block would be replaced with calls to a live
    // data-fetching library like 'yahoo-finance2', using the 'symbol' from above.
    
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