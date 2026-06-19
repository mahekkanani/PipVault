import { Loader2 } from 'lucide-react';
import AdvancedStats from '../components/analytics/AdvancedStats.jsx';
import DrawdownChart from '../components/analytics/DrawdownChart.jsx';
import EquityCurve from '../components/analytics/EquityCurve.jsx';
import PnLHeatmap from '../components/analytics/PnLHeatmap.jsx';
import { useTrades } from '../hooks/useTrades.js';

export default function AnalyticsPage() {
  const { trades, loading, error } = useTrades();

  function renderStatus() {
    if (loading) {
      return (
        <div className="flex items-center gap-3 rounded-lg border border-cyan-400/15 bg-slate-950/80 px-4 py-3 text-sm text-cyan-100">
          <Loader2 className="animate-spin" size={18} />
          Loading analytics
        </div>
      );
    }

    if (error) {
      return <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>;
    }

    return null;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200">PipVault Analytics</p>
          <h1 className="mt-3 bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-3xl font-semibold text-transparent sm:text-4xl">
            Performance intelligence
          </h1>
        </div>
        <div className="rounded-lg border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm font-medium text-amber-100">
          {trades.length} logged trades analyzed
        </div>
      </header>

      {renderStatus()}

      <AdvancedStats trades={trades} />

      <section className="grid gap-6 xl:grid-cols-2">
        <EquityCurve trades={trades} />
        <DrawdownChart trades={trades} />
      </section>

      <PnLHeatmap trades={trades} />
    </div>
  );
}
