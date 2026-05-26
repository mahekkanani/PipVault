export function toDbNumber(value) {
  return value === '' || value === null || value === undefined ? null : Number(value);
}

export function mapTradeFromDb(row) {
  return {
    id: row.id,
    pair: row.pair || '',
    side: row.side || 'Buy',
    lotSize: row.lot_size ?? '',
    entry: row.entry ?? '',
    takeProfit: row.take_profit ?? '',
    stopLoss: row.stop_loss ?? '',
    exit: row.exit ?? '',
    capturedPips: row.captured_pips ?? '',
    profitLoss: row.profit_loss ?? '',
    rrRatio: row.rr_ratio ?? 0,
    date: row.date || '',
    session: row.session || 'London',
    emotion: row.emotion || 'Disciplined',
    notes: row.notes || '',
    screenshot: row.screenshot || '',
    createdAt: row.created_at,
  };
}

export function mapTradeToDb(trade) {
  return {
    pair: trade.pair,
    side: trade.side,
    lot_size: toDbNumber(trade.lotSize),
    entry: toDbNumber(trade.entry),
    take_profit: toDbNumber(trade.takeProfit),
    stop_loss: toDbNumber(trade.stopLoss),
    exit: toDbNumber(trade.exit),
    captured_pips: toDbNumber(trade.capturedPips),
    profit_loss: toDbNumber(trade.profitLoss),
    rr_ratio: toDbNumber(trade.rrRatio),
    date: trade.date,
    session: trade.session,
    emotion: trade.emotion,
    notes: trade.notes,
    screenshot: trade.screenshot || '',
  };
}

export function mapBacktestFromDb(row) {
  return {
    id: row.id,
    strategy: row.strategy || '',
    pair: row.pair || '',
    side: row.side || 'Buy',
    entry: row.entry ?? '',
    takeProfit: row.take_profit ?? '',
    stopLoss: row.stop_loss ?? '',
    exit: row.exit ?? '',
    capturedPips: row.captured_pips ?? '',
    profitLoss: row.profit_loss ?? '',
    rrRatio: row.rr_ratio ?? 0,
    date: row.date || '',
    session: row.session || 'London',
    setupGrade: row.setup_grade || 'A',
    followedRules: row.followed_rules ? 'Yes' : 'No',
    mistake: row.mistake || 'None',
    notes: row.notes || '',
    screenshot: row.screenshot || '',
    createdAt: row.created_at,
  };
}

export function mapBacktestToDb(backtest) {
  return {
    strategy: backtest.strategy,
    pair: backtest.pair,
    side: backtest.side,
    entry: toDbNumber(backtest.entry),
    take_profit: toDbNumber(backtest.takeProfit),
    stop_loss: toDbNumber(backtest.stopLoss),
    exit: toDbNumber(backtest.exit),
    captured_pips: toDbNumber(backtest.capturedPips),
    profit_loss: toDbNumber(backtest.profitLoss),
    rr_ratio: toDbNumber(backtest.rrRatio),
    date: backtest.date,
    session: backtest.session,
    setup_grade: backtest.setupGrade,
    followed_rules: backtest.followedRules === 'Yes' || backtest.followedRules === true,
    mistake: backtest.mistake,
    notes: backtest.notes,
    screenshot: backtest.screenshot || '',
  };
}
