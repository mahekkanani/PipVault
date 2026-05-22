export default function DashboardCard({ label, value, detail, tone = 'neutral', icon: Icon }) {
  const tones = {
    neutral: {
      card: 'border-cyan-400/20 bg-gradient-to-br from-cyan-400/[0.12] via-slate-950/90 to-slate-950/90',
      icon: 'border-cyan-300/25 bg-cyan-300/10 text-cyan-200',
      label: 'text-cyan-200/70',
    },
    profit: {
      card: 'border-emerald-400/25 bg-gradient-to-br from-emerald-400/[0.16] via-slate-950/90 to-slate-950/90',
      icon: 'border-emerald-300/25 bg-emerald-300/10 text-emerald-200',
      label: 'text-emerald-200/75',
    },
    loss: {
      card: 'border-rose-400/25 bg-gradient-to-br from-rose-500/[0.16] via-slate-950/90 to-slate-950/90',
      icon: 'border-rose-300/25 bg-rose-300/10 text-rose-200',
      label: 'text-rose-200/75',
    },
    amber: {
      card: 'border-amber-300/25 bg-gradient-to-br from-amber-300/[0.15] via-slate-950/90 to-slate-950/90',
      icon: 'border-amber-200/25 bg-amber-200/10 text-amber-100',
      label: 'text-amber-100/75',
    },
    violet: {
      card: 'border-violet-300/25 bg-gradient-to-br from-violet-400/[0.16] via-slate-950/90 to-slate-950/90',
      icon: 'border-violet-200/25 bg-violet-200/10 text-violet-100',
      label: 'text-violet-100/75',
    },
  };
  const style = tones[tone] || tones.neutral;

  return (
    <article className={`rounded-lg border p-4 shadow-glow transition hover:-translate-y-0.5 hover:shadow-neon ${style.card}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-xs font-medium uppercase tracking-[0.18em] ${style.label}`}>{label}</p>
          <p className="mt-3 text-2xl font-semibold text-zinc-50">{value}</p>
        </div>
        {Icon ? (
          <div className={`rounded-lg border p-2 ${style.icon}`}>
            <Icon size={18} />
          </div>
        ) : null}
      </div>
      {detail ? <p className="mt-3 truncate text-sm text-zinc-400">{detail}</p> : null}
    </article>
  );
}
