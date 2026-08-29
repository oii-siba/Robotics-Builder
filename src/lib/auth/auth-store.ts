import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { getSupabaseClient } from '../supabase/client';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  isMyProjectsOpen: boolean;
  authMode: 'signin' | 'signup';
  authPromptReason: string | null;

  // Actions
  setUser: (user: User | null, session: Session | null) => void;
  setAuthModalOpen: (open: boolean, mode?: 'signin' | 'signup', reason?: string) => void;
  setMyProjectsOpen: (open: boolean) => void;
  promptLogin: (reason?: string) => void;
  initializeAuth: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  isAuthModalOpen: false,
  isMyProjectsOpen: false,
  authMode: 'signup',
  authPromptReason: null,

  setUser: (user, session) => {
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('robocraft_active_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('robocraft_active_user');
      }
    }
    set({ user, session, isLoading: false });
  },
  
  setAuthModalOpen: (open, mode = 'signup', reason) => 
    set({ isAuthModalOpen: open, authMode: mode, authPromptReason: reason || null }),

  setMyProjectsOpen: (open) => set({ isMyProjectsOpen: open }),

  promptLogin: (reason = 'Please sign in to save your circuit permanently to your cloud account!') => {
    set({
      isAuthModalOpen: true,
      authMode: 'signup',
      authPromptReason: reason,
    });
  },

  initializeAuth: async () => {
    // 1. Instantly restore from localStorage for zero-delay persistent login
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('robocraft_active_user');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.email) {
            set({ user: parsed, isLoading: false });
          }
        } catch (e) {
          console.error(e);
        }
      }
    }

    // 2. Fetch active Supabase session
    const supabase = getSupabaseClient();
    if (!supabase) {
      set({ isLoading: false });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        get().setUser(session.user, session);
      } else {
        set({ isLoading: false });
      }

      // Listen for background auth state changes
      supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          get().setUser(session.user, session);
        } else if (_event === 'SIGNED_OUT') {
          get().setUser(null, null);
        }
      });
    } catch (err) {
      console.warn('Supabase Auth restore error:', err);
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('robocraft_active_user');
    }
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Sign out error:', err);
      }
    }
    set({ user: null, session: null });
  },
}));
