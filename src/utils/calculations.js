export function toNumber(value) {
  if (value === '' || value === null || value === undefined) return 0;
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

export function calculateRiskReward(entry, stopLoss, takeProfit) {
  const entryPrice = toNumber(entry);
  const stop = toNumber(stopLoss);
  const target = toNumber(takeProfit);
  const risk = Math.abs(entryPrice - stop);
  const reward = Math.abs(target - entryPrice);

  if (!risk || !reward) return 0;
  return Number((reward / risk).toFixed(2));
}

export function calculateStats(trades) {
  const totalTrades = trades.length;
  const winningTrades = trades.filter((trade) => toNumber(trade.profitLoss) > 0).length;
  const totalProfitLoss = trades.reduce((sum, trade) => sum + toNumber(trade.profitLoss), 0);
  const totalPips = trades.reduce((sum, trade) => sum + toNumber(trade.capturedPips), 0);
  const bestTrade = trades.reduce(
    (best, trade) => (toNumber(trade.profitLoss) > toNumber(best?.profitLoss) ? trade : best),
    null,
  );
  const worstTrade = trades.reduce(
    (worst, trade) => (toNumber(trade.profitLoss) < toNumber(worst?.profitLoss) ? trade : worst),
    null,
  );

  return {
    totalTrades,
    winRate: totalTrades ? (winningTrades / totalTrades) * 100 : 0,
    totalProfitLoss,
    totalPips,
    bestTrade,
    worstTrade,
  };
}

export function calculateBacktestStats(backtests) {
  const totalBacktests = backtests.length;
  const winningTrades = backtests.filter((trade) => toNumber(trade.profitLoss) > 0);
  const losingTrades = backtests.filter((trade) => toNumber(trade.profitLoss) < 0);
  const totalProfitLoss = backtests.reduce((sum, trade) => sum + toNumber(trade.profitLoss), 0);
  const totalPips = backtests.reduce((sum, trade) => sum + toNumber(trade.capturedPips), 0);
  const totalWins = winningTrades.reduce((sum, trade) => sum + toNumber(trade.profitLoss), 0);
  const totalLosses = Math.abs(losingTrades.reduce((sum, trade) => sum + toNumber(trade.profitLoss), 0));
  const averageRr = totalBacktests
    ? backtests.reduce((sum, trade) => sum + toNumber(trade.rrRatio), 0) / totalBacktests
    : 0;
  const followedRulesCount = backtests.filter((trade) => trade.followedRules === 'Yes').length;

  return {
    totalBacktests,
    winRate: totalBacktests ? (winningTrades.length / totalBacktests) * 100 : 0,
    totalProfitLoss,
    totalPips,
    profitFactor: totalLosses ? totalWins / totalLosses : totalWins ? totalWins : 0,
    expectancy: totalBacktests ? totalProfitLoss / totalBacktests : 0,
    averageRr,
    ruleFollowingRate: totalBacktests ? (followedRulesCount / totalBacktests) * 100 : 0,
  };
}
