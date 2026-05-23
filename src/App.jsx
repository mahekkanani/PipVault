import { useState } from 'react';
import { BarChart3, BookOpen } from 'lucide-react';
import JournalDashboard from './pages/JournalDashboard.jsx';
import BacktestJournal from './pages/BacktestJournal.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

export default function App() {
  const [activeView, setActiveView] = useState('live');
  const views = [
    { id: 'live', label: 'Live Journal', icon: BookOpen },
    { id: 'backtest', label: 'Backtest Journal', icon: BarChart3 },
  ];

  return (
    <ErrorBoundary>
      <main className="relative min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1600px] space-y-6">
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

          {activeView === 'live' ? <JournalDashboard /> : <BacktestJournal />}
        </div>
      </main>
    </ErrorBoundary>
  );
}
