import { toNumber } from './calculations.js';

const SEARCH_FIELDS = ['pair', 'side', 'date', 'session', 'emotion', 'notes'];
const BACKTEST_SEARCH_FIELDS = [
  'strategy',
  'pair',
  'side',
  'date',
  'session',
  'setupGrade',
  'followedRules',
  'mistake',
  'notes',
];

export function getUniquePairs(trades) {
  return [...new Set(trades.map((trade) => trade.pair).filter(Boolean))].sort();
}

export function getUniqueStrategies(backtests) {
  return [...new Set(backtests.map((trade) => trade.strategy).filter(Boolean))].sort();
}

export function filterTrades(trades, filters) {
  const search = filters.search.trim().toLowerCase();

  return trades.filter((trade) => {
    const matchesSearch =
      !search ||
      SEARCH_FIELDS.some((field) => String(trade[field] || '').toLowerCase().includes(search));
    const matchesSide = filters.side === 'All' || trade.side === filters.side;
    const matchesPair = filters.pair === 'All' || trade.pair === filters.pair;

    return matchesSearch && matchesSide && matchesPair;
  });
}

export function sortTrades(trades, sortConfig) {
  const sorted = [...trades];
  const { key, direction } = sortConfig;
  const multiplier = direction === 'asc' ? 1 : -1;

  sorted.sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    if (['profitLoss', 'capturedPips', 'rrRatio', 'lotSize', 'entry', 'takeProfit', 'stopLoss', 'exit'].includes(key)) {
      return (toNumber(aValue) - toNumber(bValue)) * multiplier;
    }

    return String(aValue || '').localeCompare(String(bValue || '')) * multiplier;
  });

  return sorted;
}

export function filterBacktests(backtests, filters) {
  const search = filters.search.trim().toLowerCase();

  return backtests.filter((trade) => {
    const matchesSearch =
      !search ||
      BACKTEST_SEARCH_FIELDS.some((field) => String(trade[field] || '').toLowerCase().includes(search));
    const matchesStrategy = filters.strategy === 'All' || trade.strategy === filters.strategy;
    const matchesSide = filters.side === 'All' || trade.side === filters.side;
    const matchesPair = filters.pair === 'All' || trade.pair === filters.pair;
    const matchesSetupGrade = filters.setupGrade === 'All' || trade.setupGrade === filters.setupGrade;
    const matchesFollowedRules = filters.followedRules === 'All' || trade.followedRules === filters.followedRules;

    return matchesSearch && matchesStrategy && matchesSide && matchesPair && matchesSetupGrade && matchesFollowedRules;
  });
}
