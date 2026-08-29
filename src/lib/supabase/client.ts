import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read from env or local storage config
const getSupabaseCredentials = () => {
  let customUrl = '';
  let customKey = '';

  if (typeof window !== 'undefined') {
    customUrl = localStorage.getItem('robocraft_supabase_url') || '';
    customKey = localStorage.getItem('robocraft_supabase_key') || '';
  }

  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const finalUrl = (customUrl || envUrl).trim().replace(/[\r\n]/g, '');
  const finalKey = (customKey || envKey).trim().replace(/[\r\n]/g, '');

  return { url: finalUrl, key: finalKey };
};

let cachedClient: SupabaseClient | null = null;
let lastUsedUrl = '';
let lastUsedKey = '';

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key } = getSupabaseCredentials();
  
  if (!url || !key || url.includes('placeholder') || key.includes('placeholder')) {
    return null;
  }

  if (!cachedClient || lastUsedUrl !== url || lastUsedKey !== key) {
    try {
      cachedClient = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      lastUsedUrl = url;
      lastUsedKey = key;
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }

  return cachedClient;
};

export const isSupabaseConfigured = (): boolean => {
  const { url, key } = getSupabaseCredentials();
  return Boolean(url && key && !url.includes('placeholder') && !key.includes('placeholder'));
};

export const saveSupabaseCredentialsLocally = (url: string, key: string) => {
  if (typeof window !== 'undefined') {
    const cleanUrl = url.trim().replace(/[\r\n]/g, '');
    const cleanKey = key.trim().replace(/[\r\n]/g, '');
    localStorage.setItem('robocraft_supabase_url', cleanUrl);
    localStorage.setItem('robocraft_supabase_key', cleanKey);
    cachedClient = null; // reset cached instance
  }
};
