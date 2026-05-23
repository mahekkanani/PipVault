import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'trading-journal:backtests';

function readStoredBacktests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((trade) => trade && typeof trade === 'object') : [];
  } catch {
    return [];
  }
}

export function useLocalStorageBacktests() {
  const [backtests, setBacktests] = useState(readStoredBacktests);
  const [storageError, setStorageError] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(backtests));
      setStorageError('');
    } catch (error) {
      setStorageError(
        error?.name === 'QuotaExceededError'
          ? 'Storage is full. Try deleting older backtests or uploading a smaller screenshot.'
          : 'Unable to save backtests locally.',
      );
    }
  }, [backtests]);

  const actions = useMemo(
    () => ({
      addBacktest: (backtest) => setBacktests((current) => [backtest, ...current]),
      updateBacktest: (backtest) =>
        setBacktests((current) => current.map((item) => (item.id === backtest.id ? backtest : item))),
      deleteBacktest: (id) => setBacktests((current) => current.filter((backtest) => backtest.id !== id)),
    }),
    [],
  );

  return { backtests, storageError, ...actions };
}
