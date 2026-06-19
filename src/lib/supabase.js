import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function getRequiredEnv(name, value) {
  if (!value) {
    throw new Error(`${name} is required. Add it to .env and restart the dev server.`);
  }

  return value;
}

function getClientUrl(url) {
  try {
    return new URL(url).origin;
  } catch {
    throw new Error('VITE_SUPABASE_URL is not configured with a valid Supabase URL.');
  }
}

async function supabaseFetch(input, init) {
  const fetcher = globalThis.fetch;

  if (typeof fetcher !== 'function') {
    throw new Error('This browser does not support fetch, which Supabase requires.');
  }

  const response = await fetcher.call(globalThis, input, init);

  if (!response || typeof response.ok !== 'boolean') {
    throw new Error('Supabase request failed before a response was returned. Check your network or browser extensions.');
  }

  return response;
}

export const supabase = createClient(
  getClientUrl(getRequiredEnv('VITE_SUPABASE_URL', supabaseUrl)),
  getRequiredEnv('VITE_SUPABASE_ANON_KEY', supabaseAnonKey),
  {
    global: {
      fetch: supabaseFetch,
    },
  },
);
