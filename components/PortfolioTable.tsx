// /components/PortfolioTable.tsx
'use client';

// Import React hooks and the data interface
import React, { useState, useEffect, useMemo } from 'react';
import { StockHolding } from '@/interfaces';

// Define the shape of the props this component expects
interface PortfolioTableProps {
  portfolio: StockHolding[];
}

/**
 * @component PortfolioTable
 * Renders the main portfolio table, including sector grouping and dynamic updates.
 * This component is responsible for all client-side logic like state management,
 * periodic data fetching, and performance optimizations for rendering.
 * @param {StockHolding[]} portfolio - The initial array of stock holdings from the server.
 */
const PortfolioTable: React.FC<PortfolioTableProps> = ({ portfolio: initialPortfolio }) => {
  // State for the portfolio data, initialized with server-side data for a fast first load.
  const [portfolio, setPortfolio] = useState(initialPortfolio);

  // State for handling and displaying any client-side fetch errors to the user.
  const [error, setError] = useState<string | null>(null);

  // This effect sets up a polling mechanism to fetch fresh data every 15 seconds.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/portfolio');
        if (!res.ok) throw new Error('API fetch failed');
        const data = await res.json();
        setPortfolio(data.portfolio);
        setError(null); // Clear previous errors on success
      } catch (err) {
        setError('Could not update portfolio. Data shown may be outdated.');
      }
    };

    const intervalId = setInterval(fetchData, 15000); // Poll every 15 seconds

    // This cleanup function is crucial. It stops the interval when the component
    // is no longer on the screen to prevent memory leaks.
    return () => clearInterval(intervalId);
  }, []); // The empty array [] ensures this effect runs only once when the component mounts.

  // useMemo optimizes performance by only recalculating the total portfolio value
  // when the portfolio data actually changes.
  const totalPortfolioInvestment = useMemo(() =>
    portfolio.reduce((total, stock) => total + (stock.purchasePrice * stock.quantity), 0),
    [portfolio]
  );

  // This useMemo hook handles the complex logic of grouping stocks by sector.
  // It only re-runs this expensive calculation if the portfolio data changes,
  // preventing unnecessary work on each render and keeping the UI fast.
  const groupedPortfolio = useMemo(() => {
    return portfolio.reduce((acc, stock) => {
      const { sector } = stock;
      if (!acc[sector]) {
        acc[sector] = { stocks: [], totalInvestment: 0, totalPresentValue: 0 };
      }
      const investment = stock.purchasePrice * stock.quantity;
      const presentValue = stock.cmp * stock.quantity;
      
      acc[sector].stocks.push(stock);
      acc[sector].totalInvestment += investment;
      acc[sector].totalPresentValue += presentValue;
      return acc;
    }, {} as Record<string, { stocks: StockHolding[]; totalInvestment: number; totalPresentValue: number; }>);
  }, [portfolio]);


  return (
    <div className="overflow-x-auto">
      {error && <p className="mb-4 rounded-md bg-red-100 p-3 text-red-500">{error}</p>}

      {portfolio.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Particulars</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Exchange</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Qty.</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Purchase Price</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">CMP</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Investment</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Portfolio (%)</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Present Value</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Gain/Loss</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
                {Object.entries(groupedPortfolio).map(([sector, data]) => {
                  const sectorGainLoss = data.totalPresentValue - data.totalInvestment;
                  const sectorPortfolioPercentage = (data.totalInvestment / totalPortfolioInvestment) * 100;
                  return (
                    <React.Fragment key={sector}>
                      <tr className="bg-gray-100">
                        <td className="px-6 py-4 text-left font-bold text-gray-900" colSpan={5}>{sector}</td>
                        <td className="px-6 py-4 text-right font-bold text-gray-900">{data.totalInvestment.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right font-bold text-gray-900">{sectorPortfolioPercentage.toFixed(2)}%</td>
                        <td className="px-6 py-4 text-right font-bold text-gray-900">{data.totalPresentValue.toFixed(2)}</td>
                        <td className={`px-6 py-4 text-right font-bold ${sectorGainLoss >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                          {sectorGainLoss.toFixed(2)}
                        </td>
                      </tr>
                      {data.stocks.map((stock) => {
                        const investment = stock.purchasePrice * stock.quantity;
                        const presentValue = stock.cmp * stock.quantity;
                        const gainLoss = presentValue - investment;
                        const portfolioPercentage = (investment / totalPortfolioInvestment) * 100;

                        return (
                          <tr key={stock.particulars}>
                            <td className="whitespace-nowrap py-4 pl-8 pr-6 text-sm text-gray-800">{stock.particulars}</td>
                            <td className="whitespace-nowrap px-6 py-4 text-left text-sm text-gray-500">{stock.exchange}</td>
                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">{stock.quantity}</td>
                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">{stock.purchasePrice.toFixed(2)}</td>
                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">{stock.cmp.toFixed(2)}</td>
                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">{investment.toFixed(2)}</td>
                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">{portfolioPercentage.toFixed(2)}%</td>
                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">{presentValue.toFixed(2)}</td>
                            <td className={`whitespace-nowrap px-6 py-4 text-right text-sm font-medium ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {gainLoss.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
            </tbody>
        </table>
      ) : (
        // Show a message if there's no data and no error.
        !error && <p>No portfolio data available.</p>
      )}
    </div>
  );
};

export default PortfolioTable;