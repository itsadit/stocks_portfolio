/**
 * This is the main home page for the application.
 */

import PortfolioTable from '@/components/PortfolioTable';
import { StockHolding } from '@/interfaces';

/**
 * Fetches the initial portfolio data on the server before the page is rendered.
 */

async function getPortfolioData(): Promise<StockHolding[]> {
  try {
    const res = await fetch('http://localhost:3000/api/portfolio', {
      // This Next.js-specific option ensures we get fresh data on every page load,
      // not a cached version, which is crucial for a dynamic dashboard.
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('Failed to fetch initial portfolio data. Status:', res.status);
      return []; // Return an empty array on an error to prevent a crash.
    }

    const data = await res.json();
    return data.portfolio;
  } catch (error) {
    console.error('Network error connecting to the API:', error);
    return []; // Return an empty array if the network request itself fails.
  }
}

// The default export for the page is an async function, allowing top-level await
// for data fetching. The fetched data is then passed as props to the client component.
export default async function HomePage() {
  const portfolioData = await getPortfolioData();

  return (
    <main className="p-4 sm:p-8">
      <h1 className="mb-4 text-2xl font-bold text-gray-800">My Portfolio Dashboard</h1>
      <PortfolioTable portfolio={portfolioData} />
    </main>
  );
}