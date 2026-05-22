# PipVault

A modern dark-mode forex trading journal built with React, Vite, and Tailwind CSS.

The app is designed for personal use. It has no backend, database, authentication, or cloud sync. All trades are stored in the browser using `localStorage`.

## Features

- Dark premium trading dashboard UI
- Dashboard cards for:
  - Total trades
  - Win rate
  - Total profit/loss
  - Total pips captured
  - Best trade
  - Worst trade
- Add, edit, and delete trades
- Upload trade screenshots
- Click screenshot thumbnails to open a preview modal
- Search trades
- Filter by Buy/Sell
- Filter by Pair
- Sort table columns
- Auto-calculate risk-to-reward ratio
- Profit rows use green styling
- Loss rows use red styling
- Fully client-side localStorage persistence
- Responsive layout with horizontal table scroll on small screens

## Table Columns

The trades table is ordered for quick PipVault review:

```text
Screenshot
Date
Pair
Buy/Sell
Entry
Exit
TP
SL
Captured Pips
RR Ratio
Emotion
Profit/Loss
Notes
```

Lot size and session are still saved in each trade, but they are not shown in the main table to keep the dashboard cleaner.

## Tech Stack

- React
- Vite
- Tailwind CSS
- Lucide React icons
- Browser localStorage

## Requirements

Install Node.js first:

```text
https://nodejs.org
```

Then check that Node and npm are available:

```bash
node -v
npm.cmd -v
```

On this Windows setup, use `npm.cmd` instead of `npm` because PowerShell may block the `npm.ps1` script.

## Installation

Open a terminal in the project folder:

```bash
cd x:\trade
```

Install dependencies:

```bash
npm.cmd install
```

## Run The App

Start the development server:

```bash
npm.cmd run dev
```

Open the app in your browser:

```text
http://localhost:5174
```

If Vite chooses another port, use the URL shown in the terminal.

## Build For Production

Create a production build:

```bash
npm.cmd run build
```

Preview the production build:

```bash
npm.cmd run preview
```

## Project Structure

```text
src/
  components/
    Button.jsx
    DashboardCard.jsx
    ErrorBoundary.jsx
    Field.jsx
    Modal.jsx
    ScreenshotModal.jsx
    TradeFilters.jsx
    TradeFormModal.jsx
    TradesTable.jsx
  hooks/
    useLocalStorageTrades.js
  pages/
    JournalDashboard.jsx
  utils/
    calculations.js
    filters.js
    formatters.js
    validation.js
  App.jsx
  index.css
  main.jsx
```

## Local Storage

Trades are saved under this key:

```text
trading-journal:trades
```

Screenshots are stored as original image data URLs in localStorage. Large screenshots can fill browser storage. If saving fails, the app shows a storage error message.

To clear all saved trades manually:

1. Open browser DevTools.
2. Go to `Application`.
3. Open `Local Storage`.
4. Select the localhost site.
5. Delete `trading-journal:trades`.
6. Refresh the page.

## Notes

- No database is used.
- No backend is used.
- No authentication is used.
- Data is stored only in the browser on the current device.
- Clearing browser storage will delete saved trades.
