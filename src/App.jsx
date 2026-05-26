import { useState } from 'react';
import { BarChart3, BookOpen, Loader2 } from 'lucide-react';
import JournalDashboard from './pages/JournalDashboard.jsx';
import BacktestJournal from './pages/BacktestJournal.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import UserMenu from './components/UserMenu.jsx';
import { useAuth } from './context/AuthContext.jsx';

export default function App() {
  const { loading, user } = useAuth();
  const [activeView, setActiveView] = useState('live');
  const views = [
    { id: 'live', label: 'Live Journal', icon: BookOpen },
    { id: 'backtest', label: 'Backtest Journal', icon: BarChart3 },
  ];

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center px-4">
        <div className="flex items-center gap-3 rounded-lg border border-cyan-400/15 bg-slate-950/90 px-5 py-4 text-cyan-100 shadow-glow">
          <Loader2 className="animate-spin" size={22} />
          Loading PipVault
        </div>
      </main>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <ErrorBoundary>
      <main className="relative min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1600px] space-y-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <nav className="flex flex-col gap-3 rounded-lg border border-cyan-400/15 bg-slate-950/80 p-2 shadow-glow sm:inline-flex sm:flex-row">
              {views.map((view) => {
                const Icon = view.icon;
                const isActive = activeView === view.id;

                return (
                  <button
                    key={view.id}
                    className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? 'bg-cyan-300 text-slate-950 shadow-neon'
                        : 'text-cyan-100 hover:bg-cyan-950/50 hover:text-white'
                    }`}
                    onClick={() => setActiveView(view.id)}
                    type="button"
                  >
                    <Icon size={18} />
                    {view.label}
                  </button>
                );
              })}
            </nav>
            <UserMenu />
          </div>

          {activeView === 'live' ? <JournalDashboard /> : <BacktestJournal />}
        </div>
      </main>
    </ErrorBoundary>
  );
}
