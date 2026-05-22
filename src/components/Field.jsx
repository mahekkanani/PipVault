export function Field({ label, error, children }) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-200/70">{label}</span>
      {children}
      {error ? <p className="text-xs text-red-300">{error}</p> : null}
    </label>
  );
}

const baseControl =
  'w-full rounded-lg border border-cyan-400/15 bg-slate-950/90 px-3 py-2.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 hover:border-cyan-300/30 focus:border-cyan-300/80 focus:ring-2 focus:ring-cyan-300/15';

export function Input({ className = '', ...props }) {
  return <input className={`${baseControl} ${className}`} {...props} />;
}

export function Select({ children, className = '', ...props }) {
  return (
    <select className={`${baseControl} ${className}`} {...props}>
      {children}
    </select>
  );
}

export function Textarea({ className = '', ...props }) {
  return <textarea className={`${baseControl} min-h-28 resize-y ${className}`} {...props} />;
}
