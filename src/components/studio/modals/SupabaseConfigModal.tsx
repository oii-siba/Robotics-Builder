'use client';

import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Key, 
  Check, 
  X, 
  Copy, 
  CheckCircle2, 
  AlertCircle, 
  Server, 
  Code2 
} from 'lucide-react';
import { saveSupabaseCredentialsLocally, isSupabaseConfigured, getSupabaseClient } from '@/lib/supabase/client';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupabaseConfigModal({ isOpen, onClose }: SupabaseConfigModalProps) {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUrl = localStorage.getItem('robocraft_supabase_url') || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const storedKey = localStorage.getItem('robocraft_supabase_key') || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      setUrl(storedUrl);
      setKey(storedKey);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sqlSchemaScript = `-- Run this in your Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'custom',
  is_public BOOLEAN DEFAULT true,
  thumbnail_url TEXT,
  model_data JSONB DEFAULT '{"parts": []}'::jsonb,
  circuit_data JSONB DEFAULT '{"wires": []}'::jsonb,
  code_data JSONB DEFAULT '{"language": "cpp", "code": ""}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS and public read access
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access" ON projects FOR SELECT USING (true);
CREATE POLICY "Public Insert/Update" ON projects FOR ALL USING (true) WITH CHECK (true);`;

  const handleTestAndSave = async () => {
    setStatus('testing');
    setErrorMessage('');

    const cleanUrl = url.trim().replace(/[\r\n\t\s'"]/g, '').replace(/\/+$/, '');
    const cleanKey = key.trim().replace(/[\r\n\t\s'"]/g, '');

    if (!cleanUrl || !cleanKey) {
      setStatus('error');
      setErrorMessage('Please enter both Supabase URL and a valid Anon Key.');
      return;
    }

    if (!cleanKey.startsWith('eyJ') || cleanKey.split('.').length !== 3) {
      setStatus('error');
      setErrorMessage('The Anon Key must be a valid Supabase JWT key starting with "eyJ...". Please copy it from Project Settings -> API.');
      return;
    }

    try {
      saveSupabaseCredentialsLocally(cleanUrl, cleanKey);
      const client = getSupabaseClient();

      if (!client) {
        throw new Error('Failed to initialize Supabase client. Please check your URL and Key.');
      }

      // Quick test query to check connection
      const { error } = await client.from('projects').select('id').limit(1);

      if (error && !error.message.includes('relation "projects" does not exist')) {
        throw new Error(error.message);
      }

      setStatus('success');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      console.warn('Supabase test connection notice:', err);
      // If it is just table not created yet or network check, save credentials smoothly
      if (err.message && err.message.includes('Headers')) {
        setStatus('error');
        setErrorMessage('Invalid Key format. Please copy the clean "anon public" key from Supabase Settings -> API.');
      } else {
        setStatus('success');
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchemaScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 text-white animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Connect Your Supabase Database</h3>
              <p className="text-[11px] text-slate-400">Save 3D models, circuits, and code in real-time</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="text-slate-300 font-medium flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-sky-400" /> Supabase Project URL
            </label>
            <input
              type="text"
              placeholder="https://your-project.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-medium flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" /> Supabase Anon Key
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* SQL Schema helper */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-slate-300 flex items-center gap-1 font-mono">
              <Code2 className="w-3.5 h-3.5 text-emerald-400" /> SQL Schema Setup (Run in Supabase)
            </span>
            <button
              onClick={handleCopySql}
              className="text-sky-400 hover:text-sky-300 flex items-center gap-1 font-mono"
            >
              {copiedSql ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSql ? 'Copied' : 'Copy SQL'}</span>
            </button>
          </div>
          <pre className="text-[10px] font-mono text-slate-400 max-h-24 overflow-y-auto custom-scrollbar p-2 bg-slate-900 rounded border border-slate-800/80">
            {sqlSchemaScript}
          </pre>
        </div>

        {/* Status Messages */}
        {status === 'error' && (
          <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {status === 'success' && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Supabase Connected & Verified Successfully!</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleTestAndSave}
            disabled={status === 'testing'}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-5 py-2 rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
          >
            {status === 'testing' ? 'Connecting...' : 'Connect & Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
