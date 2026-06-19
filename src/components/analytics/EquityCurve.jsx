import { useMemo } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { calculateEquityCurve } from '../../utils/analytics.js';
import { formatCurrency } from '../../utils/formatters.js';

function EquityTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  const point = payload[0].payload;

  return (
    <div className="rounded-lg border border-cyan-400/20 bg-slate-950/95 px-3 py-2 text-sm shadow-glow">
      <p className="font-semibold text-zinc-100">{point.tooltipDate}</p>
      <p className="mt-1 text-cyan-100">Cumulative P&L: {formatCurrency(point.cumulativeProfitLoss)}</p>
    </div>
  );
}

export default function EquityCurve({ trades }) {
  const data = useMemo(() => calculateEquityCurve(trades), [trades]);
  const finalEquity = data[data.length - 1]?.cumulativeProfitLoss ?? 0;
  const lineColor = finalEquity >= 0 ? '#34d399' : '#fb7185';

  return (
    <section className="rounded-lg border border-cyan-400/15 bg-slate-950/85 p-4 shadow-glow">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-50">Equity Curve</h2>
          <p className="mt-1 text-sm text-zinc-400">Running cumulative P&L by trade date</p>
        </div>
        <div className={`text-sm font-semibold ${finalEquity >= 0 ? 'text-emerald-200' : 'text-rose-200'}`}>
          {formatCurrency(finalEquity)}
        </div>
      </div>

      {data.length < 2 ? (
        <div className="grid h-80 place-items-center rounded-lg border border-dashed border-cyan-400/15 bg-slate-900/35 px-6 text-center text-sm text-zinc-400">
          Log more trades to see your equity curve
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 14, bottom: 8, left: 2 }}>
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
                tickFormatter={(value) => formatCurrency(value)}
                tickLine={false}
                width={76}
              />
              <Tooltip content={<EquityTooltip />} cursor={{ stroke: 'rgba(34, 211, 238, 0.28)' }} />
              <ReferenceLine y={0} stroke="rgba(226, 232, 240, 0.35)" strokeDasharray="4 4" />
              <Line
                type="monotone"
                dataKey="cumulativeProfitLoss"
                stroke={lineColor}
                strokeWidth={3}
                dot={{ r: 3, stroke: lineColor, strokeWidth: 2, fill: '#020617' }}
                activeDot={{ r: 5, stroke: '#f8fafc', strokeWidth: 2, fill: lineColor }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
