import { ArrowDownUp, Edit3, Image, Trash2 } from 'lucide-react';
import Button from './Button.jsx';
import { formatCurrency, formatDate, formatNumber } from '../utils/formatters.js';

const columns = [
  ['screenshot', 'Screenshot'],
  ['date', 'Date'],
  ['strategy', 'Strategy'],
  ['pair', 'Pair'],
  ['side', 'Buy/Sell'],
  ['entry', 'Entry'],
  ['exit', 'Exit'],
  ['takeProfit', 'TP'],
  ['stopLoss', 'SL'],
  ['capturedPips', 'Captured Pips'],
  ['rrRatio', 'RR'],
  ['setupGrade', 'Setup Grade'],
  ['followedRules', 'Rules'],
  ['mistake', 'Mistake'],
  ['profitLoss', 'Profit/Loss'],
  ['notes', 'Notes'],
];

const sortableColumns = new Set([
  'date',
  'strategy',
  'pair',
  'side',
  'entry',
  'exit',
  'takeProfit',
  'stopLoss',
  'capturedPips',
  'rrRatio',
  'setupGrade',
  'followedRules',
  'mistake',
  'profitLoss',
]);

export default function BacktestsTable({ backtests, sortConfig, onSort, onEdit, onDelete, onPreview }) {
  return (
    <div className="overflow-hidden rounded-lg border border-cyan-400/15 bg-slate-950/85 shadow-glow">
      <div className="overflow-x-auto">
        <table className="min-w-[1500px] w-full border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-950">
            <tr className="border-b border-cyan-400/15 bg-gradient-to-r from-cyan-400/10 via-violet-400/10 to-rose-400/10">
              {columns.map(([key, label]) => (
                <th key={key} className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100/70">
                  {sortableColumns.has(key) ? (
                    <button className="inline-flex items-center gap-2 hover:text-white" onClick={() => onSort(key)}>
                      {label}
                      <ArrowDownUp size={14} className={sortConfig.key === key ? 'text-amber-200' : ''} />
                    </button>
                  ) : (
                    label
                  )}
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100/70">Actions</th>
            </tr>
          </thead>
          <tbody>
            {backtests.length ? (
              backtests.map((trade) => {
                const isProfit = Number(trade.profitLoss) > 0;
                const isLoss = Number(trade.profitLoss) < 0;

                return (
                  <tr
                    key={trade.id}
                    className={`border-b border-white/[0.04] transition hover:bg-cyan-400/[0.08] ${
                      isProfit ? 'bg-emerald-400/[0.07]' : isLoss ? 'bg-rose-500/[0.07]' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      {trade.screenshot ? (
                        <button
                          className="h-12 w-16 overflow-hidden rounded-md border border-cyan-400/20 bg-black transition hover:border-cyan-300/80"
                          onClick={() => onPreview(trade.screenshot)}
                          aria-label="Open screenshot preview"
                        >
                          <img src={trade.screenshot} alt={`${trade.strategy} backtest screenshot`} className="h-full w-full object-cover" />
                        </button>
                      ) : (
                        <div className="flex h-12 w-16 items-center justify-center rounded-md border border-cyan-400/10 bg-black text-cyan-900">
                          <Image size={18} />
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-300">{formatDate(trade.date)}</td>
                    <td className="max-w-52 truncate px-4 py-3 font-semibold text-zinc-100" title={trade.strategy}>{trade.strategy}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-zinc-100">{trade.pair}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${trade.side === 'Buy' ? 'bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-300/20' : 'bg-rose-500/15 text-rose-200 ring-1 ring-rose-300/20'}`}>
                        {trade.side}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-300">{trade.entry}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-300">{trade.exit}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-300">{trade.takeProfit || '-'}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-300">{trade.stopLoss || '-'}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-300">{formatNumber(trade.capturedPips)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-300">1:{formatNumber(trade.rrRatio)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-300">{trade.setupGrade}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${trade.followedRules === 'Yes' ? 'bg-cyan-400/15 text-cyan-100 ring-1 ring-cyan-300/20' : 'bg-amber-400/15 text-amber-100 ring-1 ring-amber-300/20'}`}>
                        {trade.followedRules}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-300">{trade.mistake || 'None'}</td>
                    <td className={`whitespace-nowrap px-4 py-3 font-semibold ${isProfit ? 'text-emerald-200' : isLoss ? 'text-rose-200' : 'text-zinc-300'}`}>
                      {formatCurrency(trade.profitLoss)}
                    </td>
                    <td className="max-w-72 truncate px-4 py-3 text-zinc-400" title={trade.notes}>{trade.notes || '-'}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button variant="secondary" className="h-9 w-9 p-0" onClick={() => onEdit(trade)} aria-label="Edit backtest">
                          <Edit3 size={16} />
                        </Button>
                        <Button variant="danger" className="h-9 w-9 p-0" onClick={() => onDelete(trade.id)} aria-label="Delete backtest">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-16 text-center text-zinc-500">
                  No backtests match the current view.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
