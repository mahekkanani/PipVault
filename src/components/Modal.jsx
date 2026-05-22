import { X } from 'lucide-react';
import Button from './Button.jsx';

export default function Modal({ title, children, onClose, size = 'max-w-3xl' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className={`max-h-[92vh] w-full overflow-hidden rounded-lg border border-cyan-400/20 bg-slate-950 shadow-neon ${size}`}>
        <div className="flex items-center justify-between border-b border-cyan-400/15 bg-gradient-to-r from-cyan-400/10 via-violet-400/10 to-rose-400/10 px-5 py-4">
          <h2 className="text-lg font-semibold text-zinc-50">{title}</h2>
          <Button aria-label="Close modal" variant="ghost" className="h-9 w-9 p-0" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
        <div className="max-h-[calc(92vh-73px)] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
