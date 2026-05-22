import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'trading-journal:trades';

function readStoredTrades() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((trade) => trade && typeof trade === 'object') : [];
  } catch {
    return [];
  }
}

export function useLocalStorageTrades() {
  const [trades, setTrades] = useState(readStoredTrades);
  const [storageError, setStorageError] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
      setStorageError('');
    } catch (error) {
      setStorageError(
        error?.name === 'QuotaExceededError'
          ? 'Storage is full. Try deleting older trades or uploading a smaller screenshot.'
          : 'Unable to save trades locally.',
      );
    }
  }, [trades]);

  const actions = useMemo(
    () => ({
      addTrade: (trade) => setTrades((current) => [trade, ...current]),
      updateTrade: (trade) =>
        setTrades((current) => current.map((item) => (item.id === trade.id ? trade : item))),
      deleteTrade: (id) => setTrades((current) => current.filter((trade) => trade.id !== id)),
    }),
    [],
  );

  return { trades, storageError, ...actions };
}
