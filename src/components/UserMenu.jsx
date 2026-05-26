import { LogOut, UserCircle } from 'lucide-react';
import Button from './Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function UserMenu() {
  const { signOut, user } = useAuth();

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-cyan-400/15 bg-slate-950/80 p-2 text-sm shadow-glow sm:flex-row sm:items-center">
      <div className="flex min-w-0 items-center gap-2 px-2 text-cyan-100">
        <UserCircle className="shrink-0 text-cyan-200" size={18} />
        <span className="truncate">{user?.email}</span>
      </div>
      <Button className="shrink-0" onClick={signOut} type="button" variant="secondary">
        <LogOut size={16} />
        Sign Out
      </Button>
    </div>
  );
}
