import JournalDashboard from './pages/JournalDashboard.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

export default function App() {
  return (
    <ErrorBoundary>
      <JournalDashboard />
    </ErrorBoundary>
  );
}
