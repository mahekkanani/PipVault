import { useMemo, useState } from 'react';
import { Activity, BadgeDollarSign, BarChart3, ClipboardCheck, Gauge, Loader2, Percent, Target, TrendingUp } from 'lucide-react';
import BacktestFilters from '../components/BacktestFilters.jsx';
import BacktestFormModal from '../components/BacktestFormModal.jsx';
import BacktestsTable from '../components/BacktestsTable.jsx';
import DashboardCard from '../components/DashboardCard.jsx';
import ScreenshotModal from '../components/ScreenshotModal.jsx';
import { useBacktests } from '../hooks/useBacktests.js';
import { calculateBacktestStats } from '../utils/calculations.js';
import { filterBacktests, getUniquePairs, getUniqueStrategies, sortTrades } from '../utils/filters.js';
import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters.js';

export default function BacktestJournal() {
  const { backtests, loading, error, addBacktest, updateBacktest, deleteBacktest } = useBacktests();
  const [filters, setFilters] = useState({
    search: '',
    strategy: 'All',
    pair: 'All',
    side: 'All',
    setupGrade: 'All',
    followedRules: 'All',
  });
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [editingBacktest, setEditingBacktest] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [previewScreenshot, setPreviewScreenshot] = useState('');

  const stats = useMemo(() => calculateBacktestStats(backtests), [backtests]);
  const pairs = useMemo(() => getUniquePairs(backtests), [backtests]);
  const strategies = useMemo(() => getUniqueStrategies(backtests), [backtests]);
  const visibleBacktests = useMemo(
    () => sortTrades(filterBacktests(backtests, filters), sortConfig),
    [backtests, filters, sortConfig],
  );

  function handleSort(key) {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc',
    }));
  }

  function openAddForm() {
    setEditingBacktest(null);
    setIsFormOpen(true);
  }

  async function handleSave(backtest) {
    const saved = editingBacktest ? await updateBacktest(backtest.id, backtest) : await addBacktest(backtest);

    if (!saved) return;

    setIsFormOpen(false);
    setEditingBacktest(null);
  }

  function handleEdit(backtest) {
    setEditingBacktest(backtest);
    setIsFormOpen(true);
  }

  async function handleDelete(id) {
    if (window.confirm('Delete this backtest? This cannot be undone.')) {
      await deleteBacktest(id);
    }
  }

  function renderStatus() {
    if (loading) {
      return (
        <div className="flex items-center gap-3 rounded-lg border border-cyan-400/15 bg-slate-950/80 px-4 py-3 text-sm text-cyan-100">
          <Loader2 className="animate-spin" size={18} />
          Loading backtests
        </div>
      );
    }

    if (error) {
      return <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>;
    }

    return null;
  }

  const profitTone = stats.totalProfitLoss > 0 ? 'profit' : stats.totalProfitLoss < 0 ? 'loss' : 'neutral';

  return (
    <>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200">Journal for Backtest</p>
            <h1 className="mt-3 bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-3xl font-semibold text-transparent sm:text-4xl">
              Strategy profitability lab
            </h1>
          </div>
          <div className="rounded-lg border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm font-medium text-amber-100">
            {visibleBacktests.length} of {backtests.length} backtests shown
          </div>
        </header>

        {renderStatus()}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardCard label="Total Backtests" value={stats.totalBacktests} detail="Historical/replay trades" icon={Activity} tone="violet" />
          <DashboardCard label="Win Rate" value={formatPercent(stats.winRate)} detail="Profit > 0" icon={Target} tone="profit" />
          <DashboardCard label="Net P/L" value={formatCurrency(stats.totalProfitLoss)} detail="Backtest result" icon={BadgeDollarSign} tone={profitTone} />
          <DashboardCard label="Total Pips" value={formatNumber(stats.totalPips)} detail="Captured movement" icon={BarChart3} tone="neutral" />
          <DashboardCard label="Profit Factor" value={formatNumber(stats.profitFactor)} detail="Gross win / gross loss" icon={TrendingUp} tone="amber" />
          <DashboardCard label="Expectancy" value={formatCurrency(stats.expectancy)} detail="Average result per test" icon={Gauge} tone={profitTone} />
          <DashboardCard label="Average RR" value={`1:${formatNumber(stats.averageRr)}`} detail="Planned risk profile" icon={Percent} tone="neutral" />
          <DashboardCard label="Rule-Following" value={formatPercent(stats.ruleFollowingRate)} detail="Followed rules = Yes" icon={ClipboardCheck} tone="profit" />
        </section>

        <BacktestFilters
          filters={filters}
          onFiltersChange={setFilters}
          pairs={pairs}
          strategies={strategies}
          onAddBacktest={openAddForm}
        />

        <BacktestsTable
          backtests={visibleBacktests}
          sortConfig={sortConfig}
          onSort={handleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPreview={setPreviewScreenshot}
        />
      </div>

      {isFormOpen ? (
        <BacktestFormModal
          backtest={editingBacktest}
          onSave={handleSave}
          onClose={() => {
            setIsFormOpen(false);
            setEditingBacktest(null);
          }}
        />
      ) : null}

      <ScreenshotModal screenshot={previewScreenshot} onClose={() => setPreviewScreenshot('')} />
    </>
  );
}
