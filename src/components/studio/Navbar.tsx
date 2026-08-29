'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bot, 
  Box, 
  Zap, 
  Code2, 
  Package, 
  Gamepad2, 
  Share2, 
  Save, 
  Database, 
  FolderPlus, 
  Sparkles, 
  Check, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useRobotStore, StudioTab } from '@/lib/store/robot-store';
import { PRESET_PROJECTS } from '@/lib/constants/preset-templates';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { UserProfileMenu } from '@/components/studio/auth/UserProfileMenu';
import { useAuthStore } from '@/lib/auth/auth-store';

interface NavbarProps {
  onOpenShare: () => void;
  onOpenSupabase: () => void;
}

export function Navbar({ onOpenShare, onOpenSupabase }: NavbarProps) {
  const title = useRobotStore((state) => state.title);
  const setTitle = useRobotStore((state) => state.setTitle);
  const activeTab = useRobotStore((state) => state.activeTab);
  const setActiveTab = useRobotStore((state) => state.setActiveTab);
  const saveStatus = useRobotStore((state) => state.saveStatus);
  const saveProject = useRobotStore((state) => state.saveProject);
  const loadPreset = useRobotStore((state) => state.loadPreset);
  const resetProject = useRobotStore((state) => state.resetProject);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const presetsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (presetsRef.current && !presetsRef.current.contains(e.target as Node)) {
        setShowPresetsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tabs: { id: StudioTab; label: string; icon: any }[] = [
    { id: '3d-workbench', label: '3D Assembly', icon: Box },
    { id: 'circuit-wiring', label: 'Circuit Wiring', icon: Zap },
    { id: 'firmware-code', label: 'Firmware Code', icon: Code2 },
    { id: 'bom-specs', label: 'BOM & Specs', icon: Package },
    { id: 'simulation', label: 'Simulation Arena', icon: Gamepad2 },
  ];

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-2.5 sm:px-4 relative z-50 select-none shadow-md">
      {/* Brand & Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
          <img
            src="/logo.png"
            alt="Robotics Builder Logo"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-contain bg-white/5 border border-sky-500/30 p-0.5 shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col hidden xs:flex">
            <span className="font-black text-xs sm:text-sm tracking-tight text-white leading-none font-sans">
              ROBOTICS <span className="text-sky-400">BUILDER</span>
            </span>
            <span className="text-[7.5px] sm:text-[8.5px] font-mono text-emerald-400 font-semibold tracking-wider">
              DESIGN • BUILD • INNOVATE
            </span>
          </div>
        </Link>

        <div className="h-5 w-px bg-slate-800 hidden sm:block flex-shrink-0" />

        {/* Project Title */}
        <div className="flex items-center gap-1 min-w-0">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent hover:bg-slate-800/80 focus:bg-slate-950 border border-transparent focus:border-slate-700 rounded-md px-1.5 sm:px-2 py-1 text-xs font-semibold text-slate-200 focus:outline-none w-24 xs:w-32 sm:w-44 md:w-56 transition-colors truncate"
          />

          {/* Preset Templates Dropdown */}
          <div ref={presetsRef} className="relative flex-shrink-0">
            <button
              onClick={() => setShowPresetsMenu(!showPresetsMenu)}
              className="text-[11px] font-mono text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 px-1.5 sm:px-2 py-1 rounded-md flex items-center gap-1 transition-colors"
              title="Load Preset Robot"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Templates</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showPresetsMenu && (
              <div className="absolute left-0 top-full mt-1.5 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-[100] text-xs text-white animate-in fade-in zoom-in-95">
                <div className="text-[10px] uppercase font-mono text-slate-500 px-2 py-1">
                  Load Preset Robot
                </div>
                {PRESET_PROJECTS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      loadPreset(preset.id);
                      setShowPresetsMenu(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-800/80 transition-colors flex flex-col gap-0.5"
                  >
                    <span className="font-semibold text-slate-200">{preset.title}</span>
                    <span className="text-[10px] text-slate-400 truncate">
                      {preset.parts.length} parts • {preset.category}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Mode Navigation Tabs (Desktop only) */}
      <nav className="hidden lg:flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isActive
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Action Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        {/* Supabase Connection Status Pill */}
        <button
          onClick={onOpenSupabase}
          className="text-xs font-mono px-2 sm:px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950/60 text-slate-300 flex items-center gap-1.5 transition-colors"
          title="Supabase Database Settings"
        >
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden xl:inline">Supabase</span>
        </button>

        {/* Save Button */}
        <button
          onClick={() => {
            const user = useAuthStore.getState().user;
            if (!user) {
              useAuthStore.getState().promptLogin('Sign in with 1-click Gmail OTP to save your robot project permanently!');
              return;
            }
            saveProject();
          }}
          className={`text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
            saveStatus === 'saving'
              ? 'bg-slate-800 text-slate-400 animate-pulse'
              : saveStatus === 'unsaved'
              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
          title="Save Project"
        >
          {saveStatus === 'saved' ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          <span className="hidden md:inline">
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'unsaved' ? 'Save' : 'Saved'}
          </span>
        </button>

        {/* Share Button (Special Highlight) */}
        <button
          onClick={() => {
            const user = useAuthStore.getState().user;
            if (!user) {
              useAuthStore.getState().promptLogin('Please sign in with Gmail OTP to share your project online!');
              return;
            }
            onOpenShare();
          }}
          className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs px-2.5 sm:px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-lg shadow-sky-500/25 active:scale-95"
          title="Share Project Online"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Share</span>
        </button>

        {/* User Account / Profile Menu */}
        <UserProfileMenu />
      </div>
    </header>
  );
}
