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

  // Validate Supabase JWT anon key (must be a genuine 3-part JWT and not contain placeholder)
  let finalKey = '';
  if (
    rawKey &&
    !rawKey.includes('placeholder') &&
    !rawKey.includes('local') &&
    rawKey.startsWith('eyJ') &&
    rawKey.split('.').length === 3 &&
    rawKey.split('.')[2].length > 10
  ) {
    finalKey = rawKey;
  }

  return { url: finalUrl, key: finalKey };
};

let cachedClient: SupabaseClient | null = null;
let lastUsedUrl = '';
let lastUsedKey = '';

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key } = getSupabaseCredentials();
  
  // If no valid URL or real valid JWT key exists, return null for graceful local handling
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
