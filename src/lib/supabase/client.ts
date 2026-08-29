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

  const rawUrl = (customUrl || envUrl).trim();
  const rawKey = (customKey || envKey).trim();

  // Validate URL format
  let finalUrl = '';
  if (rawUrl && (rawUrl.startsWith('http://') || rawUrl.startsWith('https://'))) {
    finalUrl = rawUrl.replace(/\/+$/, '');
  }

  // Validate Supabase JWT anon key (must be valid JWT without placeholder)
  let finalKey = '';
  if (rawKey && !rawKey.includes('placeholder') && rawKey.startsWith('eyJ')) {
    finalKey = rawKey;
  }

  return { url: finalUrl, key: finalKey };
};

let cachedClient: SupabaseClient | null = null;
let lastUsedUrl = '';
let lastUsedKey = '';

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key } = getSupabaseCredentials();
  
  if (!url || !key) {
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
  return Boolean(url && key);
};

export const saveSupabaseCredentialsLocally = (url: string, key: string) => {
  if (typeof window !== 'undefined') {
    const cleanUrl = url.trim().replace(/\/+$/, '');
    const cleanKey = key.trim();
    localStorage.setItem('robocraft_supabase_url', cleanUrl);
    localStorage.setItem('robocraft_supabase_key', cleanKey);
    cachedClient = null; // reset cached instance
  }
};
