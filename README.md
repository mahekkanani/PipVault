# PipVault

PipVault is a sleek, local-first forex trading journal for tracking trade execution, psychology, screenshots, and performance metrics in one fast dark-mode dashboard.

Built with React, Vite, and Tailwind CSS. No backend. No auth. No database. Your data stays in your browser.

## Why PipVault

Most trading journals are either bloated, spreadsheet-heavy, or locked behind accounts. PipVault keeps the workflow simple:

- Log the trade.
- Review the result.
- Learn from the setup.
- Keep moving.

It is made for personal use, fast review sessions, and clean decision tracking.

## Features

- Premium dark-mode trading dashboard
- Local-only trade storage with `localStorage`
- Add, edit, and delete trades
- Screenshot upload and preview modal
- Search by pair, side, session, emotion, notes, or date
- Filter by pair and Buy/Sell direction
- Sort major table columns
- Automatic risk-to-reward calculation
- Automatic dashboard stats:
  - Total trades
  - Win rate
  - Total profit/loss
  - Total pips captured
  - Best trade
  - Worst trade
- Green styling for profitable trades
- Red styling for losing trades
- Responsive layout for desktop and mobile

## Trade Table

The main table is intentionally ordered for fast review:

```text
Screenshot -> Date -> Pair -> Buy/Sell -> Entry -> Exit -> TP -> SL
Captured Pips -> RR Ratio -> Emotion -> Profit/Loss -> Notes
```

`Lot Size` and `Session` are still captured in the form and saved with each trade, but they are hidden from the main table to keep the review view clean.

## Tech Stack

```text
React
Vite
Tailwind CSS
Lucide React
localStorage
```

## Getting Started

Clone the repo:

```bash
git clone https://github.com/mahekkanani/PipVault.git
cd PipVault
```

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Open the local URL shown in your terminal, usually:

```text
http://localhost:5173
```

On Windows PowerShell, if `npm` is blocked by execution policy, use:

```bash
npm.cmd install
npm.cmd run dev
```

## Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```text
src/
  components/       Reusable UI components
  hooks/            Local state and persistence hooks
  pages/            App screens
  utils/            Calculations, formatting, filtering, validation
  App.jsx
  index.css
  main.jsx
```

## Data Model

Each trade stores:

```text
id
pair
side
lotSize
entry
takeProfit
stopLoss
exit
capturedPips
profitLoss
rrRatio
date
session
emotion
notes
screenshot
```

Trades are saved under this browser storage key:

```text
trading-journal:trades
```

## Local-First Notes

PipVault does not send your trades anywhere. Everything is stored on the device/browser you use.

That also means:

- Clearing browser storage deletes your trades.
- Different browsers/devices will not share data.
- Large screenshots can hit localStorage limits.
- If storage is full, the app shows a save error instead of crashing.

To clear saved trades manually:

1. Open browser DevTools.
2. Go to `Application`.
3. Open `Local Storage`.
4. Select the localhost site.
5. Delete `trading-journal:trades`.
6. Refresh the app.

## Philosophy

PipVault is not trying to be a broker, analytics platform, or social trading tool.

It is a focused journal: clean inputs, useful metrics, screenshot context, and enough structure to help you review your trading behavior honestly.

