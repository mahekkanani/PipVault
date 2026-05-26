import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../lib/supabase.js';
import { deleteStoredScreenshot, uploadScreenshot } from '../utils/screenshotStorage.js';
import { mapTradeFromDb, mapTradeToDb } from '../utils/supabaseMappers.js';

export function useTrades() {
  const { user } = useAuth();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTrades = useCallback(async () => {
    if (!user?.id) {
      setTrades([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: fetchError } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (fetchError) throw fetchError;
      setTrades((data || []).map(mapTradeFromDb));
    } catch (fetchError) {
      console.error('Unable to fetch trades:', fetchError);
      setError(fetchError.message || 'Unable to fetch trades.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  async function addTrade(trade) {
    setError('');

    try {
      const screenshot = await uploadScreenshot({
        file: trade.screenshotFile,
        fallback: trade.screenshot,
        userId: user.id,
        folder: 'trades',
      });

      const { screenshotFile, id, createdAt, ...tradeData } = trade;
      const { error: insertError } = await supabase
        .from('trades')
        .insert({ ...mapTradeToDb({ ...tradeData, screenshot }), user_id: user.id });

      if (insertError) throw insertError;
      await fetchTrades();
      return true;
    } catch (saveError) {
      console.error('Unable to add trade:', saveError);
      setError(saveError.message || 'Unable to add trade.');
      return false;
    }
  }

  async function updateTrade(id, updates) {
    setError('');

    try {
      const currentTrade = trades.find((trade) => trade.id === id);
      const screenshot = await uploadScreenshot({
        file: updates.screenshotFile,
        fallback: updates.screenshot,
        userId: user.id,
        folder: 'trades',
      });

      if (updates.screenshotFile && currentTrade?.screenshot && currentTrade.screenshot !== screenshot) {
        await deleteStoredScreenshot(currentTrade.screenshot);
      }

      const { screenshotFile, createdAt, ...tradeData } = updates;
      const { error: updateError } = await supabase
        .from('trades')
        .update(mapTradeToDb({ ...tradeData, screenshot }))
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
      await fetchTrades();
      return true;
    } catch (saveError) {
      console.error('Unable to update trade:', saveError);
      setError(saveError.message || 'Unable to update trade.');
      return false;
    }
  }

  async function deleteTrade(id) {
    setError('');

    try {
      const trade = trades.find((item) => item.id === id);
      const { error: deleteError } = await supabase
        .from('trades')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;
      await deleteStoredScreenshot(trade?.screenshot);
      await fetchTrades();
      return true;
    } catch (deleteError) {
      console.error('Unable to delete trade:', deleteError);
      setError(deleteError.message || 'Unable to delete trade.');
      return false;
    }
  }

  return { trades, loading, error, addTrade, updateTrade, deleteTrade };
}
