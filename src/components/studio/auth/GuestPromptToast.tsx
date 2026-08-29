'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, X, KeyRound, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/lib/auth/auth-store';
import { useCircuitStore } from '@/lib/circuit-engine/circuit-store';
import { useRobotStore } from '@/lib/store/robot-store';

export function GuestPromptToast() {
  const user = useAuthStore((state) => state.user);
  const promptLogin = useAuthStore((state) => state.promptLogin);
  const circuitComponents = useCircuitStore((state) => state.components);
  const robotParts = useRobotStore((state) => state.parts);

  const [isVisible, setIsVisible] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  useEffect(() => {
    if (user || hasDismissed) {
      setIsVisible(false);
      return;
    }

    // Trigger toast if user has placed components or after 30 seconds of activity
    const totalElements = circuitComponents.length + robotParts.length;
    if (totalElements >= 2) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      if (!user && !hasDismissed) {
        setIsVisible(true);
      }
    }, 45000);

    return () => clearTimeout(timer);
  }, [user, hasDismissed, circuitComponents.length, robotParts.length]);

  if (!isVisible || user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm bg-slate-900/95 border border-sky-500/40 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl text-slate-100 font-sans animate-in fade-in slide-in-from-bottom-5 select-none">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-400 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white leading-none">Don&apos;t Lose Your Circuit!</h4>
            <p className="text-[11px] text-slate-300 mt-1 leading-snug">
              Sign in with 1-click Gmail OTP to save your robotics design permanently.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setIsVisible(false);
            setHasDismissed(true);
          }}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors flex-shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => {
            promptLogin('Sign in with 1-click Gmail OTP to save and sync your robotics circuit!');
            setIsVisible(false);
          }}
          className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold py-1.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-sky-500/25 active:scale-95 transition-all"
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Sign In Free</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => {
            setIsVisible(false);
            setHasDismissed(true);
          }}
          className="text-[11px] text-slate-400 hover:text-slate-200 px-2 py-1 rounded-lg"
        >
          Later
        </button>
      </div>
    </div>
  );
}
