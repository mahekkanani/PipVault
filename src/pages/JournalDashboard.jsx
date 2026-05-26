import { useMemo, useRef, useState } from 'react';
import { Activity, BadgeDollarSign, BarChart3, Download, Flame, Loader2, Target, Trophy, Upload } from 'lucide-react';
import DashboardCard from '../components/DashboardCard.jsx';
import Button from '../components/Button.jsx';
import ScreenshotModal from '../components/ScreenshotModal.jsx';
import TradeFilters from '../components/TradeFilters.jsx';
import TradeFormModal from '../components/TradeFormModal.jsx';
import TradesTable from '../components/TradesTable.jsx';
import { useTrades } from '../hooks/useTrades.js';
import { calculateStats } from '../utils/calculations.js';
import { exportCSV, exportJSON, importJSON } from '../utils/exportImport.js';
import { filterTrades, getUniquePairs, sortTrades } from '../utils/filters.js';
import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters.js';

export default function JournalDashboard() {
  const { trades, loading, error, addTrade, updateTrade, deleteTrade } = useTrades();
  const [filters, setFilters] = useState({ search: '', side: 'All', pair: 'All' });
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [editingTrade, setEditingTrade] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [previewScreenshot, setPreviewScreenshot] = useState('');
  const [importStatus, setImportStatus] = useState('');
  const fileInputRef = useRef(null);

  const stats = useMemo(() => calculateStats(trades), [trades]);
  const pairs = useMemo(() => getUniquePairs(trades), [trades]);
  const visibleTrades = useMemo(
    () => sortTrades(filterTrades(trades, filters), sortConfig),
    [trades, filters, sortConfig],
  );

  function handleSort(key) {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc',
    }));
  }

  function openAddForm() {
    setEditingTrade(null);
    setIsFormOpen(true);
  }

  async function handleSave(trade) {
    const saved = editingTrade ? await updateTrade(trade.id, trade) : await addTrade(trade);

    if (!saved) return;

    setIsFormOpen(false);
    setEditingTrade(null);
  }

  async function handleImport(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportStatus('');

    try {
      const count = await importJSON(file, addTrade);
      setImportStatus(`Imported ${count} trades.`);
    } catch (importError) {
      console.error('Unable to import trades:', importError);
      setImportStatus(importError.message || 'Unable to import trades.');
    } finally {
      event.target.value = '';
    }
  }

  function handleEdit(trade) {
    setEditingTrade(trade);
    setIsFormOpen(true);
  }

  async function handleDelete(id) {
    if (window.confirm('Delete this trade? This cannot be undone.')) {
      await deleteTrade(id);
    }
  }

  function renderStatus() {
    if (loading) {
      return (
        <div className="flex items-center gap-3 rounded-lg border border-cyan-400/15 bg-slate-950/80 px-4 py-3 text-sm text-cyan-100">
          <Loader2 className="animate-spin" size={18} />
          Loading trades
        </div>
      );
    }

    if (error) {
      return <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>;
    }

    if (importStatus) {
      return <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">{importStatus}</div>;
    }

    return null;
  }

  const profitTone = stats.totalProfitLoss > 0 ? 'profit' : stats.totalProfitLoss < 0 ? 'loss' : 'neutral';

  return (
    <>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200">PipVault</p>
            <h1 className="mt-3 bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-3xl font-semibold text-transparent sm:text-4xl">
              Forex performance vault
            </h1>
          </div>
          <div className="rounded-lg border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm font-medium text-amber-100">
            {visibleTrades.length} of {trades.length} trades shown
          </div>
        </header>

        {renderStatus()}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <DashboardCard label="Total Trades" value={stats.totalTrades} detail="All recorded setups" icon={Activity} tone="violet" />
          <DashboardCard label="Win Rate" value={formatPercent(stats.winRate)} detail="Profit > 0" icon={Target} tone="profit" />
          <DashboardCard
            label="Total P/L"
            value={formatCurrency(stats.totalProfitLoss)}
            detail="Net vault result"
            icon={BadgeDollarSign}
            tone={profitTone}
          />
          <DashboardCard label="Total Pips" value={formatNumber(stats.totalPips)} detail="Captured movement" icon={BarChart3} tone="neutral" />
          <DashboardCard
            label="Best Trade"
            value={stats.bestTrade ? formatCurrency(stats.bestTrade.profitLoss) : '$0.00'}
            detail={stats.bestTrade ? stats.bestTrade.pair : 'No trades yet'}
            icon={Trophy}
            tone="amber"
          />
          <DashboardCard
            label="Worst Trade"
            value={stats.worstTrade ? formatCurrency(stats.worstTrade.profitLoss) : '$0.00'}
            detail={stats.worstTrade ? stats.worstTrade.pair : 'No trades yet'}
            icon={Flame}
            tone="loss"
          />
        </section>

        <div className="flex flex-col gap-3 xl:flex-row xl:items-start">
          <div className="flex-1">
            <TradeFilters filters={filters} onFiltersChange={setFilters} pairs={pairs} onAddTrade={openAddForm} />
          </div>
          <div className="grid gap-3 sm:grid-cols-3 xl:w-auto">
            <Button onClick={() => exportJSON(trades)} type="button" variant="secondary">
              <Download size={18} />
              Export JSON
            </Button>
            <Button onClick={() => exportCSV(trades)} type="button" variant="secondary">
              <Download size={18} />
              Export CSV
            </Button>
            <Button onClick={() => fileInputRef.current?.click()} type="button" variant="secondary">
              <Upload size={18} />
              Import
            </Button>
            <input ref={fileInputRef} className="sr-only" accept="application/json,.json" type="file" onChange={handleImport} />
          </div>
        </div>

        <TradesTable
          trades={visibleTrades}
          sortConfig={sortConfig}
          onSort={handleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPreview={setPreviewScreenshot}
        />
      </div>

      {isFormOpen ? (
        <TradeFormModal
          trade={editingTrade}
          onSave={handleSave}
          onClose={() => {
            setIsFormOpen(false);
            setEditingTrade(null);
          }}
        />
      ) : null}

      <ScreenshotModal screenshot={previewScreenshot} onClose={() => setPreviewScreenshot('')} />
    </>
  );
}
