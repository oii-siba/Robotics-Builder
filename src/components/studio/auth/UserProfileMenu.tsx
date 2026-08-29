'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  User as UserIcon, 
  LogOut, 
  FolderOpen, 
  ChevronDown, 
  Sparkles, 
  LogIn,
  ShieldCheck
} from 'lucide-react';
import { useAuthStore } from '@/lib/auth/auth-store';

export function UserProfileMenu() {
  const user = useAuthStore((state) => state.user);
  const setAuthModalOpen = useAuthStore((state) => state.setAuthModalOpen);
  const setMyProjectsOpen = useAuthStore((state) => state.setMyProjectsOpen);
  const signOut = useAuthStore((state) => state.signOut);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <button
        onClick={() => setAuthModalOpen(true, 'signin')}
        className="bg-sky-600/20 hover:bg-sky-600 text-sky-300 hover:text-white border border-sky-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
      >
        <LogIn className="w-3.5 h-3.5" />
        <span>Sign In</span>
      </button>
    );
  }

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Maker';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div ref={menuRef} className="relative select-none text-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 px-2.5 py-1.5 rounded-xl transition-all"
      >
        <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow">
          {initial}
        </div>
        <span className="font-semibold text-slate-200 max-w-[100px] truncate hidden sm:inline">
          {displayName}
        </span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-1.5 z-[100] text-slate-100 animate-in fade-in zoom-in-95 font-sans">
          {/* User Info Header */}
          <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 mb-1">
            <div className="font-bold text-xs text-white truncate">{displayName}</div>
            <div className="text-[10px] text-slate-400 font-mono truncate">{user.email}</div>
          </div>

          {/* Menu Items */}
          <button
            onClick={() => {
              setMyProjectsOpen(true);
              setIsOpen(false);
            }}
            className="w-full text-left p-2 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2.5 text-xs text-slate-200 font-medium"
          >
            <FolderOpen className="w-4 h-4 text-sky-400" />
            <span>My Saved Projects</span>
          </button>

          <div className="h-px bg-slate-800 my-1" />

          {/* Sign Out */}
          <button
            onClick={() => {
              signOut();
              setIsOpen(false);
            }}
            className="w-full text-left p-2 rounded-lg hover:bg-rose-500/10 text-rose-400 transition-colors flex items-center gap-2.5 text-xs font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
