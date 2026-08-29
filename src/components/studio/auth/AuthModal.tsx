'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  Check, 
  AlertCircle,
  Bot,
  KeyRound,
  RotateCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuthStore } from '@/lib/auth/auth-store';
import { getSupabaseClient } from '@/lib/supabase/client';

export function AuthModal() {
  const isOpen = useAuthStore((state) => state.isAuthModalOpen);
  const setOpen = useAuthStore((state) => state.setAuthModalOpen);
  const mode = useAuthStore((state) => state.authMode);
  const setUser = useAuthStore((state) => state.setUser);

  // Steps: 'form' | 'otp_verify'
  const [step, setStep] = useState<'form' | 'otp_verify'>('form');
  const [authType, setAuthType] = useState<'otp' | 'password'>('otp'); // Default to OTP verification
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(mode || 'signup');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  // OTP Resend countdown
  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  if (!isOpen) return null;

  // 1. Send OTP Code to Gmail / Email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const supabase = getSupabaseClient();
    if (!supabase) {
      // Mock local OTP for testing if offline
      setStep('otp_verify');
      setResendTimer(30);
      setSuccessMsg(`Mock OTP sent to ${email}. (Enter any 6-digit code like 123456)`);
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          data: {
            full_name: name || email.split('@')[0],
          },
          shouldCreateUser: true,
        },
      });

      if (error) throw error;

      setStep('otp_verify');
      setResendTimer(45);
      setSuccessMsg(`6-digit verification code sent to ${email}! Check your inbox.`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send OTP code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Verify 6-Digit OTP Code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otpCode.trim();
    if (cleanOtp.length < 6) {
      setErrorMsg('Please enter the full verification code received in your email.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    const supabase = getSupabaseClient();
    if (!supabase) {
      // Mock verification
      setUser(
        {
          id: `user-${Date.now()}`,
          email,
          user_metadata: { full_name: name || email.split('@')[0] },
          app_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as any,
        null
      );
      setSuccessMsg('Email verified successfully! Welcome to RoboCraft.');
      confetti({ particleCount: 70, spread: 70 });
      setTimeout(() => {
        setOpen(false);
        setStep('form');
      }, 1200);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: cleanOtp,
        type: 'email',
      });

      if (error) throw error;

      if (data.user) {
        setUser(data.user, data.session);
        setSuccessMsg('Email verified successfully! Welcome to RoboCraft.');
        confetti({ particleCount: 80, spread: 70 });
        setTimeout(() => {
          setOpen(false);
          setStep('form');
        }, 1200);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid or expired OTP code. Please check and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Password-based fallback login
  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const supabase = getSupabaseClient();
    if (!supabase) {
      setUser(
        {
          id: `user-${Date.now()}`,
          email,
          user_metadata: { full_name: name || email.split('@')[0] },
          app_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as any,
        null
      );
      setSuccessMsg('Logged in successfully!');
      confetti({ particleCount: 60, spread: 60 });
      setTimeout(() => setOpen(false), 1200);
      setIsLoading(false);
      return;
    }

    try {
      if (activeTab === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
        setSuccessMsg('Account created! Please check your email to verify.');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setUser(data.user, data.session);
        setSuccessMsg('Welcome back!');
        confetti({ particleCount: 60, spread: 60 });
        setTimeout(() => setOpen(false), 1200);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in select-none">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 font-sans">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="Robotics Builder Logo"
              className="w-8 h-8 rounded-xl object-contain bg-white/5 border border-sky-500/30 p-0.5 shadow-md shadow-sky-500/20"
            />
            <div>
              <h3 className="text-sm font-bold text-white leading-none">Robotics Builder Account</h3>
              <span className="text-[11px] text-slate-400">Gmail OTP Security Verification</span>
            </div>
          </div>
          <button
            onClick={() => {
              setOpen(false);
              setStep('form');
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Custom Auth Prompt Reason Banner */}
        {useAuthStore.getState().authPromptReason && (
          <div className="mx-4 mt-3 p-3 bg-gradient-to-r from-sky-500/20 to-indigo-500/20 border border-sky-500/30 rounded-xl text-sky-200 text-xs flex items-center gap-2.5 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 animate-pulse" />
            <span className="font-semibold leading-tight">{useAuthStore.getState().authPromptReason}</span>
          </div>
        )}

        {/* Error and Success Alerts */}
        <div className="px-4 pt-2 space-y-2">
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-2 text-xs">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* ================= STEP 1: INITIAL EMAIL FORM ================= */}
        {step === 'form' && (
          <div className="p-4 pt-2 space-y-3.5 text-xs">
            {/* Auth Method Selector */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setAuthType('otp')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  authType === 'otp'
                    ? 'bg-sky-500 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Gmail OTP (Recommended)</span>
              </button>
              <button
                type="button"
                onClick={() => setAuthType('password')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  authType === 'password'
                    ? 'bg-sky-500 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Password</span>
              </button>
            </div>

            {authType === 'otp' ? (
              /* OTP Form */
              <form onSubmit={handleSendOtp} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-slate-400 text-[11px] font-semibold">Your Name (Optional)</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Alex Maker"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 text-[11px] font-semibold">Gmail / Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      placeholder="yourname@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500">
                    We will send a 6-digit verification code to this Gmail address.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                >
                  <span>{isLoading ? 'Sending Code...' : 'Send 6-Digit OTP Code'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* Password Form */
              <form onSubmit={handlePasswordAuth} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-slate-400 text-[11px] font-semibold">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      placeholder="user@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 text-[11px] font-semibold">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                >
                  <span>{isLoading ? 'Processing...' : activeTab === 'signup' ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        )}

        {/* ================= STEP 2: 6-DIGIT OTP VERIFICATION ================= */}
        {step === 'otp_verify' && (
          <form onSubmit={handleVerifyOtp} className="p-4 pt-2 space-y-4 text-xs">
            <div className="text-center space-y-1 pb-1">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center mx-auto mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-white">Enter Security Verification Code</h4>
              <p className="text-slate-400 text-[11px]">
                Enter the code sent to <span className="text-sky-400 font-mono font-bold">{email}</span>
              </p>
            </div>

            {/* OTP Input (supports 6 to 8 digits) */}
            <div className="space-y-1.5">
              <input
                type="text"
                autoFocus
                required
                maxLength={8}
                placeholder="Enter Code"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-slate-950 border-2 border-sky-500/40 focus:border-sky-400 rounded-2xl py-3 text-center text-xl tracking-[0.3em] font-mono font-bold text-white focus:outline-none shadow-inner"
              />
            </div>

            {/* Verify & Login Button */}
            <button
              type="submit"
              disabled={isLoading || otpCode.length < 6}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              <span>{isLoading ? 'Verifying...' : 'Verify Code & Log In'}</span>
              <Check className="w-4 h-4" />
            </button>

            {/* Resend & Change Email */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setStep('form');
                  setOtpCode('');
                }}
                className="text-slate-400 hover:text-white"
              >
                Change Email
              </button>

              <button
                type="button"
                disabled={resendTimer > 0 || isLoading}
                onClick={handleSendOtp}
                className="text-sky-400 hover:text-sky-300 font-semibold disabled:opacity-50 flex items-center gap-1"
              >
                <RotateCw className="w-3 h-3" />
                <span>{resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
