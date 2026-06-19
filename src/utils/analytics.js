import { format, isValid, parseISO, startOfDay } from 'date-fns';
import { toNumber } from './calculations.js';

function readField(trade, camelKey, snakeKey) {
  return trade?.[camelKey] ?? trade?.[snakeKey];
}

function readProfitLoss(trade) {
  return toNumber(readField(trade, 'profitLoss', 'profit_loss'));
}

function readCreatedAt(trade) {
  return readField(trade, 'createdAt', 'created_at');
}

function parseTradeDateValue(value) {
  if (!value) return null;

  if (value instanceof Date) {
    return isValid(value) ? value : null;
  }

  const parsedDate = parseISO(String(value));
  return isValid(parsedDate) ? parsedDate : null;
}

function getTradeDate(trade) {
  return parseTradeDateValue(trade?.date) || parseTradeDateValue(readCreatedAt(trade));
}

function compareTradesAscending(left, right) {
  const leftDate = getTradeDate(left.trade);
  const rightDate = getTradeDate(right.trade);
  const leftTime = leftDate?.getTime() ?? Number.MAX_SAFE_INTEGER;
  const rightTime = rightDate?.getTime() ?? Number.MAX_SAFE_INTEGER;

  if (leftTime !== rightTime) return leftTime - rightTime;

  const leftCreatedAt = parseTradeDateValue(readCreatedAt(left.trade));
  const rightCreatedAt = parseTradeDateValue(readCreatedAt(right.trade));
  const leftCreatedTime = leftCreatedAt?.getTime() ?? Number.MAX_SAFE_INTEGER;
  const rightCreatedTime = rightCreatedAt?.getTime() ?? Number.MAX_SAFE_INTEGER;

  if (leftCreatedTime !== rightCreatedTime) return leftCreatedTime - rightCreatedTime;
  return left.index - right.index;
}

function sortTradesAscending(trades) {
  return [...(trades || [])]
    .map((trade, index) => ({ trade, index }))
    .sort(compareTradesAscending)
    .map(({ trade }) => trade);
}

function getChartDateLabel(trade, fallbackIndex) {
  const date = getTradeDate(trade);

  if (!date) {
    return {
      dateKey: `trade-${fallbackIndex + 1}`,
      label: `Trade ${fallbackIndex + 1}`,
      tooltipDate: `Trade ${fallbackIndex + 1}`,
    };
  }

  return {
    dateKey: format(date, 'yyyy-MM-dd'),
    label: format(date, 'MMM d'),
    tooltipDate: format(date, 'MMM d, yyyy'),
  };
}

function average(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

function calculateLongestStreak(results, target) {
  let current = 0;
  let longest = 0;

  results.forEach((result) => {
    if (result === target) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  });

  return longest;
}

function calculateCurrentStreak(results, target) {
  let streak = 0;

  for (let index = results.length - 1; index >= 0; index -= 1) {
    if (results[index] !== target) break;
    streak += 1;
  }

  return streak;
}

export function calculateEquityCurve(trades) {
  let cumulativeProfitLoss = 0;

  return sortTradesAscending(trades).map((trade, index) => {
    const profitLoss = readProfitLoss(trade);
    cumulativeProfitLoss += profitLoss;

    return {
      ...getChartDateLabel(trade, index),
      tradeNumber: index + 1,
      profitLoss,
      cumulativeProfitLoss,
    };
  });
}

export function calculateDrawdown(trades) {
  const equityCurve = calculateEquityCurve(trades);
  let peakEquity = 0;
  let maxDrawdown = 0;

  const points = equityCurve.map((point) => {
    peakEquity = Math.max(peakEquity, point.cumulativeProfitLoss);
    const drawdown = point.cumulativeProfitLoss - peakEquity;
    maxDrawdown = Math.max(maxDrawdown, Math.abs(drawdown));

    return {
      ...point,
      peakEquity,
      drawdown,
    };
  });

  const currentDrawdown = points.length ? Math.abs(points[points.length - 1].drawdown) : 0;

  return {
    points,
    maxDrawdown,
    currentDrawdown,
  };
}

export function calculateAdvancedStats(trades) {
  const sortedTrades = sortTradesAscending(trades);
  const profitLossValues = sortedTrades.map(readProfitLoss);
  const winningValues = profitLossValues.filter((value) => value > 0);
  const losingValues = profitLossValues.filter((value) => value < 0);
  const grossProfit = winningValues.reduce((sum, value) => sum + value, 0);
  const grossLoss = Math.abs(losingValues.reduce((sum, value) => sum + value, 0));
  const results = profitLossValues.map((value) => (value > 0 ? 'win' : value < 0 ? 'loss' : 'flat'));
  const hasTrades = profitLossValues.length > 0;

  return {
    hasTrades,
    profitFactor: grossLoss ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : null,
    expectancy: hasTrades ? average(profitLossValues) : null,
    averageWin: average(winningValues),
    averageLoss: average(losingValues),
    largestWin: winningValues.length ? Math.max(...winningValues) : null,
    largestLoss: losingValues.length ? Math.min(...losingValues) : null,
    currentWinStreak: hasTrades ? calculateCurrentStreak(results, 'win') : null,
    currentLossStreak: hasTrades ? calculateCurrentStreak(results, 'loss') : null,
    longestWinStreak: hasTrades ? calculateLongestStreak(results, 'win') : null,
    longestLossStreak: hasTrades ? calculateLongestStreak(results, 'loss') : null,
  };
}

export function groupTradesByDay(trades) {
  const byDate = {};

  (trades || []).forEach((trade) => {
    const tradeDate = getTradeDate(trade);
    if (!tradeDate) return;

    const day = startOfDay(tradeDate);
    const dateKey = format(day, 'yyyy-MM-dd');

    if (!byDate[dateKey]) {
      byDate[dateKey] = {
        date: day,
        dateKey,
        label: format(day, 'MMM d, yyyy'),
        tradeCount: 0,
        totalProfitLoss: 0,
      };
    }

    byDate[dateKey].tradeCount += 1;
    byDate[dateKey].totalProfitLoss += readProfitLoss(trade);
  });

  const days = Object.values(byDate);
  const maxProfit = days.reduce((max, day) => Math.max(max, day.totalProfitLoss), 0);
  const maxLoss = days.reduce((max, day) => Math.max(max, Math.abs(Math.min(day.totalProfitLoss, 0))), 0);

  return {
    byDate,
    days,
    maxProfit,
    maxLoss,
  };
}

export function getPnlHeatmapCellStyle(dayStats, groupedDays) {
  if (!dayStats?.tradeCount) {
    return {
      backgroundColor: 'rgba(30, 41, 59, 0.8)',
      borderColor: 'rgba(148, 163, 184, 0.1)',
    };
  }

  if (dayStats.totalProfitLoss > 0) {
    const intensity = groupedDays.maxProfit ? Math.max(0.22, dayStats.totalProfitLoss / groupedDays.maxProfit) : 0.22;

    return {
      backgroundColor: `rgba(16, 185, 129, ${0.24 + intensity * 0.66})`,
      borderColor: `rgba(110, 231, 183, ${0.18 + intensity * 0.44})`,
    };
  }

  if (dayStats.totalProfitLoss < 0) {
    const intensity = groupedDays.maxLoss ? Math.max(0.22, Math.abs(dayStats.totalProfitLoss) / groupedDays.maxLoss) : 0.22;

    return {
      backgroundColor: `rgba(244, 63, 94, ${0.24 + intensity * 0.66})`,
      borderColor: `rgba(253, 164, 175, ${0.18 + intensity * 0.44})`,
    };
  }

  return {
    backgroundColor: 'rgba(34, 211, 238, 0.28)',
    borderColor: 'rgba(103, 232, 249, 0.28)',
  };
}
