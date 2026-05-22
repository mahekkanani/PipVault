import React from 'react';
import Button from './Button.jsx';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  clearJournalData = () => {
    localStorage.removeItem('trading-journal:trades');
    window.location.reload();
  };

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <section className="w-full max-w-xl rounded-lg border border-red-500/30 bg-zinc-950 p-6 shadow-glow">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-red-300">App Error</p>
          <h1 className="mt-3 text-2xl font-semibold text-zinc-50">PipVault could not render.</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            This is usually caused by invalid saved browser data. You can clear the local PipVault data and reload the app.
          </p>
          <pre className="mt-4 max-h-40 overflow-auto rounded-lg border border-zinc-800 bg-black p-3 text-xs text-red-200">
            {this.state.error.message}
          </pre>
          <div className="mt-5 flex justify-end">
            <Button variant="danger" onClick={this.clearJournalData}>
              Clear Local Data
            </Button>
          </div>
        </section>
      </main>
    );
  }
}
