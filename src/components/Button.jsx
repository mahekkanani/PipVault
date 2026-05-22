export default function Button({ children, className = '', variant = 'primary', ...props }) {
  const variants = {
    primary:
      'bg-gradient-to-r from-emerald-400 via-cyan-300 to-sky-400 text-slate-950 shadow-neon hover:brightness-110',
    secondary: 'bg-slate-950/80 text-cyan-100 hover:bg-cyan-950/50 border border-cyan-400/20',
    danger: 'bg-rose-500/15 text-rose-200 hover:bg-rose-500/25 border border-rose-400/30',
    ghost: 'text-zinc-300 hover:bg-fuchsia-500/10 hover:text-fuchsia-100',
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
