import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function getClientUrl(url) {
  try {
    return new URL(url).origin;
  } catch {
    console.warn('VITE_SUPABASE_URL is not configured with a valid Supabase URL.');
    return 'https://placeholder.supabase.co';
  }
}

export const supabase = createClient(getClientUrl(supabaseUrl), supabaseAnonKey || 'placeholder-anon-key');
