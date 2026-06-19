import { useMemo, useState } from 'react';
import { eachDayOfInterval, eachWeekOfInterval, format, startOfDay, startOfWeek, subMonths } from 'date-fns';
import { getPnlHeatmapCellStyle, groupTradesByDay } from '../../utils/analytics.js';
import { formatCurrency } from '../../utils/formatters.js';

function buildDayLabel(dayStats, day) {
  const label = dayStats?.label || format(day, 'MMM d, yyyy');
  const tradeCount = dayStats?.tradeCount || 0;
  const totalProfitLoss = dayStats?.totalProfitLoss || 0;

  return `${label}: ${tradeCount} ${tradeCount === 1 ? 'trade' : 'trades'}, ${formatCurrency(totalProfitLoss)} P&L`;
}

export default function PnLHeatmap({ trades }) {
  const groupedDays = useMemo(() => groupTradesByDay(trades), [trades]);
  const [tooltip, setTooltip] = useState(null);
  const today = useMemo(() => startOfDay(new Date()), []);
  const calendarStart = useMemo(() => startOfWeek(subMonths(today, 12), { weekStartsOn: 0 }), [today]);
  const days = useMemo(() => eachDayOfInterval({ start: calendarStart, end: today }), [calendarStart, today]);
  const weeks = useMemo(
    () => eachWeekOfInterval({ start: calendarStart, end: today }, { weekStartsOn: 0 }),
    [calendarStart, today],
  );

  function showTooltip(event, day, dayStats) {
    setTooltip({
      x: event.clientX,
      y: event.clientY,
      day,
      dayStats,
    });
  }

  return (
    <section className="rounded-lg border border-cyan-400/15 bg-slate-950/85 p-4 shadow-glow">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-50">Daily P&L Heatmap</h2>
          <p className="mt-1 text-sm text-zinc-400">Last 12 months of realized P&L by trading day</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span>Loss</span>
          <span className="h-3 w-3 rounded-[3px] border border-rose-200/20 bg-rose-500/35" />
          <span className="h-3 w-3 rounded-[3px] border border-slate-400/10 bg-slate-700/80" />
          <span className="h-3 w-3 rounded-[3px] border border-emerald-200/20 bg-emerald-500/35" />
          <span>Profit</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-max gap-2">
          <div className="mt-6 grid grid-rows-7 gap-1 text-[10px] leading-3 text-zinc-500">
            <span />
            <span>Mon</span>
            <span />
            <span>Wed</span>
            <span />
            <span>Fri</span>
            <span />
          </div>
          <div>
            <div
              className="mb-2 grid gap-1 text-[10px] leading-3 text-zinc-500"
              style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 13px))` }}
            >
              {weeks.map((week, index) => {
                const previousWeek = weeks[index - 1];
                const shouldShowMonth = index === 0 || week.getMonth() !== previousWeek.getMonth();

                return <span key={week.toISOString()}>{shouldShowMonth ? format(week, 'MMM') : ''}</span>;
              })}
            </div>
            <div
              className="grid grid-flow-col grid-rows-7 gap-1"
              onMouseLeave={() => setTooltip(null)}
              style={{ gridTemplateRows: 'repeat(7, minmax(0, 13px))' }}
            >
              {days.map((day) => {
                const dateKey = format(day, 'yyyy-MM-dd');
                const dayStats = groupedDays.byDate[dateKey];
                const label = buildDayLabel(dayStats, day);

                return (
                  <div
                    key={dateKey}
                    aria-label={label}
                    className="h-[13px] w-[13px] rounded-[3px] border transition hover:scale-125 hover:ring-1 hover:ring-cyan-100/70"
                    onMouseEnter={(event) => showTooltip(event, day, dayStats)}
                    onMouseMove={(event) => showTooltip(event, day, dayStats)}
                    role="img"
                    style={getPnlHeatmapCellStyle(dayStats, groupedDays)}
                    title={label}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {tooltip ? (
        <div
          className="pointer-events-none fixed z-50 rounded-lg border border-cyan-400/20 bg-slate-950/95 px-3 py-2 text-sm shadow-glow"
          style={{ left: tooltip.x + 14, top: tooltip.y + 14 }}
        >
          <p className="font-semibold text-zinc-100">{tooltip.dayStats?.label || format(tooltip.day, 'MMM d, yyyy')}</p>
          <p className="mt-1 text-zinc-300">{tooltip.dayStats?.tradeCount || 0} trades</p>
          <p
            className={`font-semibold ${
              (tooltip.dayStats?.totalProfitLoss || 0) > 0
                ? 'text-emerald-200'
                : (tooltip.dayStats?.totalProfitLoss || 0) < 0
                  ? 'text-rose-200'
                  : 'text-zinc-400'
            }`}
          >
            {formatCurrency(tooltip.dayStats?.totalProfitLoss || 0)}
          </p>
        </div>
      ) : null}
    </section>
  );
}
