import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../lib/supabase.js';
import { deleteStoredScreenshot, uploadScreenshot } from '../utils/screenshotStorage.js';
import { mapBacktestFromDb, mapBacktestToDb } from '../utils/supabaseMappers.js';

export function useBacktests() {
  const { user } = useAuth();
  const [backtests, setBacktests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBacktests = useCallback(async () => {
    if (!user?.id) {
      setBacktests([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: fetchError } = await supabase
        .from('backtests')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (fetchError) throw fetchError;
      setBacktests((data || []).map(mapBacktestFromDb));
    } catch (fetchError) {
      console.error('Unable to fetch backtests:', fetchError);
      setError(fetchError.message || 'Unable to fetch backtests.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchBacktests();
  }, [fetchBacktests]);

  async function addBacktest(backtest) {
    setError('');

    try {
      const screenshot = await uploadScreenshot({
        file: backtest.screenshotFile,
        fallback: backtest.screenshot,
        userId: user.id,
        folder: 'backtests',
      });

      const { screenshotFile, id, createdAt, ...backtestData } = backtest;
      const { error: insertError } = await supabase
        .from('backtests')
        .insert({ ...mapBacktestToDb({ ...backtestData, screenshot }), user_id: user.id });

      if (insertError) throw insertError;
      await fetchBacktests();
      return true;
    } catch (saveError) {
      console.error('Unable to add backtest:', saveError);
      setError(saveError.message || 'Unable to add backtest.');
      return false;
    }
  }

  async function updateBacktest(id, updates) {
    setError('');

    try {
      const currentBacktest = backtests.find((backtest) => backtest.id === id);
      const screenshot = await uploadScreenshot({
        file: updates.screenshotFile,
        fallback: updates.screenshot,
        userId: user.id,
        folder: 'backtests',
      });

      if (updates.screenshotFile && currentBacktest?.screenshot && currentBacktest.screenshot !== screenshot) {
        await deleteStoredScreenshot(currentBacktest.screenshot);
      }

      const { screenshotFile, createdAt, ...backtestData } = updates;
      const { error: updateError } = await supabase
        .from('backtests')
        .update(mapBacktestToDb({ ...backtestData, screenshot }))
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
      await fetchBacktests();
      return true;
    } catch (saveError) {
      console.error('Unable to update backtest:', saveError);
      setError(saveError.message || 'Unable to update backtest.');
      return false;
    }
  }

  async function deleteBacktest(id) {
    setError('');

    try {
      const backtest = backtests.find((item) => item.id === id);
      const { error: deleteError } = await supabase
        .from('backtests')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;
      await deleteStoredScreenshot(backtest?.screenshot);
      await fetchBacktests();
      return true;
    } catch (deleteError) {
      console.error('Unable to delete backtest:', deleteError);
      setError(deleteError.message || 'Unable to delete backtest.');
      return false;
    }
  }

  return { backtests, loading, error, addBacktest, updateBacktest, deleteBacktest };
}
