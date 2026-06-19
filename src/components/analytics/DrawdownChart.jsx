import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { calculateDrawdown } from '../../utils/analytics.js';
import { formatCurrency } from '../../utils/formatters.js';

function DrawdownTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  const point = payload[0].payload;

  return (
    <div className="rounded-lg border border-rose-400/20 bg-slate-950/95 px-3 py-2 text-sm shadow-glow">
      <p className="font-semibold text-zinc-100">{point.tooltipDate}</p>
      <p className="mt-1 text-rose-100">Drawdown: {formatCurrency(Math.abs(point.drawdown))}</p>
      <p className="text-zinc-400">Equity: {formatCurrency(point.cumulativeProfitLoss)}</p>
    </div>
  );
}

export default function DrawdownChart({ trades }) {
  const drawdown = useMemo(() => calculateDrawdown(trades), [trades]);

  return (
    <section className="rounded-lg border border-cyan-400/15 bg-slate-950/85 p-4 shadow-glow">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-50">Drawdown</h2>
          <p className="mt-1 text-sm text-zinc-400">Peak-to-trough pressure on the equity curve</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:min-w-72">
          <div className="rounded-lg border border-rose-400/20 bg-rose-500/10 px-3 py-2">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-rose-100/70">Max Drawdown</p>
            <p className="mt-2 text-lg font-semibold text-rose-100">{formatCurrency(drawdown.maxDrawdown)}</p>
          </div>
          <div className="rounded-lg border border-amber-300/20 bg-amber-300/10 px-3 py-2">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-amber-100/70">Current Drawdown</p>
            <p className="mt-2 text-lg font-semibold text-amber-100">{formatCurrency(drawdown.currentDrawdown)}</p>
          </div>
        </div>
      </div>

      {drawdown.points.length ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={drawdown.points} margin={{ top: 10, right: 14, bottom: 8, left: 2 }}>
              <defs>
                <linearGradient id="drawdownFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#fb7185" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#fb7185" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
              <XAxis
                dataKey="label"
                minTickGap={22}
                stroke="rgba(165, 243, 252, 0.42)"
                tick={{ fill: 'rgba(226, 232, 240, 0.72)', fontSize: 12 }}
                tickLine={false}
              />
              <YAxis
                stroke="rgba(165, 243, 252, 0.42)"
                tick={{ fill: 'rgba(226, 232, 240, 0.72)', fontSize: 12 }}
                tickFormatter={(value) => formatCurrency(Math.abs(value))}
                tickLine={false}
                width={76}
              />
              <Tooltip content={<DrawdownTooltip />} cursor={{ stroke: 'rgba(251, 113, 133, 0.28)' }} />
              <ReferenceLine y={0} stroke="rgba(226, 232, 240, 0.35)" strokeDasharray="4 4" />
              <Area
                type="monotone"
                dataKey="drawdown"
                stroke="#fb7185"
                strokeWidth={2}
                fill="url(#drawdownFill)"
                activeDot={{ r: 5, stroke: '#f8fafc', strokeWidth: 2, fill: '#fb7185' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="grid h-80 place-items-center rounded-lg border border-dashed border-cyan-400/15 bg-slate-900/35 px-6 text-center text-sm text-zinc-400">
          Log trades to track drawdown
        </div>
      )}
    </section>
  );
}
