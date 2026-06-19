import { useMemo } from 'react';
import { Flame, Gauge, Repeat, ShieldAlert, TrendingDown, TrendingUp, Trophy, Zap } from 'lucide-react';
import DashboardCard from '../DashboardCard.jsx';
import { calculateAdvancedStats } from '../../utils/analytics.js';
import { formatCurrency, formatNumber } from '../../utils/formatters.js';

function emptyAwareValue(stats, value, formatter = (item) => item) {
  if (!stats.hasTrades) return '—';
  if (value === null || value === undefined) return '—';
  return formatter(value);
}

function formatProfitFactor(stats) {
  if (!stats.hasTrades) return '—';
  if (stats.profitFactor === Infinity) return '∞';
  if (stats.profitFactor === null || stats.profitFactor === undefined) return 'N/A';
  return formatNumber(stats.profitFactor);
}

function formatStreak(stats, value) {
  return emptyAwareValue(stats, value, (item) => formatNumber(item));
}

export default function AdvancedStats({ trades }) {
  const stats = useMemo(() => calculateAdvancedStats(trades), [trades]);
  const expectancyTone = stats.expectancy > 0 ? 'profit' : stats.expectancy < 0 ? 'loss' : 'neutral';

  const cards = [
    {
      label: 'Profit Factor',
      value: formatProfitFactor(stats),
      detail: 'Gross win / gross loss',
      icon: TrendingUp,
      tone: 'amber',
    },
    {
      label: 'Expectancy',
      value: emptyAwareValue(stats, stats.expectancy, formatCurrency),
      detail: 'Average P&L per trade',
      icon: Gauge,
      tone: expectancyTone,
    },
    {
      label: 'Average Win',
      value: emptyAwareValue(stats, stats.averageWin, formatCurrency),
      detail: 'Mean winning trade',
      icon: Trophy,
      tone: 'profit',
    },
    {
      label: 'Average Loss',
      value: emptyAwareValue(stats, stats.averageLoss, (value) => formatCurrency(Math.abs(value))),
      detail: 'Mean losing trade',
      icon: ShieldAlert,
      tone: 'loss',
    },
    {
      label: 'Largest Win',
      value: emptyAwareValue(stats, stats.largestWin, formatCurrency),
      detail: 'Best closed trade',
      icon: Zap,
      tone: 'profit',
    },
    {
      label: 'Largest Loss',
      value: emptyAwareValue(stats, stats.largestLoss, formatCurrency),
      detail: 'Worst closed trade',
      icon: Flame,
      tone: 'loss',
    },
    {
      label: 'Current Win Streak',
      value: formatStreak(stats, stats.currentWinStreak),
      detail: 'Most recent winners',
      icon: Repeat,
      tone: 'profit',
    },
    {
      label: 'Current Loss Streak',
      value: formatStreak(stats, stats.currentLossStreak),
      detail: 'Most recent losers',
      icon: Repeat,
      tone: 'loss',
    },
    {
      label: 'Longest Win Streak',
      value: formatStreak(stats, stats.longestWinStreak),
      detail: 'Best run ever',
      icon: TrendingUp,
      tone: 'violet',
    },
    {
      label: 'Longest Loss Streak',
      value: formatStreak(stats, stats.longestLossStreak),
      detail: 'Worst run ever',
      icon: TrendingDown,
      tone: 'loss',
    },
  ];

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-zinc-50">Advanced Stats</h2>
        <p className="mt-1 text-sm text-zinc-400">Deeper performance metrics from your logged trades</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <DashboardCard key={card.label} {...card} />
        ))}
      </div>
    </section>
  );
}
