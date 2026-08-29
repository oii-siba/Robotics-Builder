import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read from env or local storage config
const getSupabaseCredentials = () => {
  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem('robocraft_supabase_url');
    const customKey = localStorage.getItem('robocraft_supabase_key');
    if (customUrl && customKey) {
      return { url: customUrl, key: customKey };
    }
  }

  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return { url: envUrl, key: envKey };
};

let cachedClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key } = getSupabaseCredentials();
  if (!url || !key || url.includes('placeholder')) {
    return null;
  }
  if (!cachedClient) {
    try {
      cachedClient = createClient(url, key);
    } catch {
      return null;
    }
  }
  return cachedClient;
};

export const isSupabaseConfigured = (): boolean => {
  const { url, key } = getSupabaseCredentials();
  return Boolean(url && key && !url.includes('placeholder'));
};

export const saveSupabaseCredentialsLocally = (url: string, key: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('robocraft_supabase_url', url);
    localStorage.setItem('robocraft_supabase_key', key);
    cachedClient = null; // reset cached instance
  }
};
