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
