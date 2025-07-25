Technical Document: Dynamic Portfolio Dashboard

This document explains some of the key problems I faced while building the portfolio dashboard and the solutions I came up with.

1. Getting Live Data Without an Official API
   Challenge: My main challenge was that Yahoo Finance and Google Finance don't have official APIs that I can just call. I needed a way to get live data like the Current Market Price (CMP) and P/E Ratios.

Solution: I decided to create my own API endpoint inside the Next.js project at /api/portfolio. This acts as a middleman. My frontend doesn't have to worry about the messy details of getting the data; it just calls my simple API endpoint.

My plan to get the live data would be to use a library called yahoo-finance2. Inside my API route, I would loop through my list of stocks and use this library to fetch the details for each one. I would use Promise.all to run all these requests at the same time, which is much faster than doing them one by one. This way, all the complex logic is hidden away on the backend.

2. Updating the Dashboard Automatically
   Challenge: The dashboard needed to update every 15 seconds with new data, without the user having to refresh the page.

Solution: I handled this in two parts:

First Load: For the initial page load, I made the main page a Next.js Server Component. This let me use async/await to fetch the data on the server first. The benefit is that the user sees the full dashboard right away, instead of a blank screen that then loads data.

Live Updates: For the automatic refresh, I used React's useEffect hook in the PortfolioTable component. I set up a setInterval timer to call my API every 15 seconds. When new data comes back, I use the useState hook to update the table. I also made sure to include a cleanup function in my useEffect to clear the interval when the component isn't on the screen anymore, which stops it from running in the background and causing problems.

3. Making the App Perform Well
   Challenge: I noticed that calculating the stock groups by sector was a lot of work. This calculation was happening over and over again every time the data refreshed, even if the portfolio itself hadn't changed, which could make the app feel slow.

Solution: To fix this, I used a React hook called useMemo. This hook saves, or "memoizes," the result of my grouping calculation. It only does the heavy lifting of re-calculating the groups if the main portfolio data changes. For all other updates, it uses the saved result. This made the dashboard much more responsive.

4. Handling Errors
   Challenge: If the API call failed for any reason, the whole application would crash, which is a bad user experience.

Solution: I added error handling in two key places:

On the Server: For the initial data load, I wrapped the fetch call in a try...catch block. If there's an error, it sends an empty list to the page. This way, the page still loads properly and just shows a "No data available" message.

On the Client: For the refreshing data, I also used a try...catch. If an update fails, I use a useState variable to store an error message. This message is then shown as a banner at the top of the table, so the user knows there was a problem with the update, but the app keeps working with the last known data.
