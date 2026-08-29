'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Share2, 
  Copy, 
  Check, 
  Zap, 
  ShieldCheck, 
  Eye, 
  LogOut, 
  Plus, 
  ArrowRight, 
  Sparkles,
  Wifi,
  Radio,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCircuitStore } from '@/lib/circuit-engine/circuit-store';
import { CollabRole } from '@/lib/circuit-engine/types';

interface CircuitCollabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CircuitCollabModal({ isOpen, onClose }: CircuitCollabModalProps) {
  const isCollaborating = useCircuitStore((state) => state.isCollaborating);
  const collabRoomId = useCircuitStore((state) => state.collabRoomId);
  const collabRole = useCircuitStore((state) => state.collabRole);
  const myCollabUser = useCircuitStore((state) => state.myCollabUser);
  const collaborators = useCircuitStore((state) => state.collaborators);
  const startCollaboration = useCircuitStore((state) => state.startCollaboration);
  const joinCollaboration = useCircuitStore((state) => state.joinCollaboration);
  const leaveCollaboration = useCircuitStore((state) => state.leaveCollaboration);

  const [activeTab, setActiveTab] = useState<'share' | 'join'>('share');
  const [joinRoomInput, setJoinRoomInput] = useState('');
  const [selectedRole, setSelectedRole] = useState<CollabRole>('editor');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Auto start collaboration session if not yet started when opening modal
  useEffect(() => {
    if (isOpen && !isCollaborating) {
      startCollaboration(undefined, selectedRole);
    }
  }, [isOpen, isCollaborating, startCollaboration, selectedRole]);

  if (!isOpen) return null;

  const currentRoomId = collabRoomId || 'collab-session';
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/studio?collab=${currentRoomId}`
    : `http://localhost:3000/studio?collab=${currentRoomId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentRoomId);
    setCopiedCode(true);
    confetti({ particleCount: 40, spread: 50 });
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleJoinExisting = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanRoom = joinRoomInput.trim().replace(/^.*[?&]collab=/, '');
    if (!cleanRoom) return;

    joinCollaboration(cleanRoom, selectedRole);
    confetti({ particleCount: 70, spread: 70 });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-xl bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-white font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">Circuit Partnership & Co-Design</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-400">Design robotics schematics together in real time with your team</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800/80 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('share')}
            className={`px-4 py-2 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'share'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Invite Partners</span>
          </button>

          <button
            onClick={() => setActiveTab('join')}
            className={`px-4 py-2 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'join'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Join Existing Room</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {activeTab === 'share' ? (
            <>
              {/* Room Code Banner */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5 text-sky-400" /> Co-Design Room Code
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                  </button>
                </div>
                <div className="flex items-center justify-between bg-slate-900/90 px-3 py-2 rounded-lg border border-slate-800">
                  <span className="font-mono text-sm font-bold text-sky-300 tracking-wide select-all">
                    {currentRoomId}
                  </span>
                  <span className="text-[11px] text-slate-400 font-sans">Share this code with your partner</span>
                </div>
              </div>

              {/* Direct Co-Design Invite Link */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Direct Collaboration Link</span>
                  <span className="text-[11px] text-slate-400">Open in any browser</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 select-all focus:outline-none focus:border-sky-500"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-sky-500/20 flex items-center gap-1.5 active:scale-95 transition-all"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* Your Display Name on Cursor */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Your Cursor Display Name</span>
                  <span className="text-[10px] text-sky-400">Visible to all partners</span>
                </label>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow"
                    style={{ backgroundColor: myCollabUser?.color || '#38BDF8' }}
                  >
                    {(myCollabUser?.name || 'U').slice(0, 2).toUpperCase()}
                  </div>
                  <input
                    type="text"
                    defaultValue={myCollabUser?.name || 'Partner'}
                    onBlur={(e) => {
                      if (e.target.value.trim()) {
                        useCircuitStore.getState().setCollabUserName(e.target.value.trim());
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        (e.target as HTMLInputElement).blur();
                      }
                    }}
                    placeholder="Enter your name..."
                    className="flex-1 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Active Collaborators Section */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    Active Partners ({collaborators.length})
                  </span>
                  <span className="text-[11px] text-slate-400">Multi-cursor synced</span>
                </div>

                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                  {collaborators.map((c) => {
                    const isMe = c.id === myCollabUser?.id;
                    return (
                      <div
                        key={c.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80"
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white shadow"
                            style={{ backgroundColor: c.color }}
                          >
                            {c.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-200">{c.name}</span>
                              {isMe && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                                  You
                                </span>
                              )}
                              {c.isHost && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  Host
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Online • {c.role === 'editor' ? 'Co-Designer (Full Edit)' : 'Reviewer (Viewer)'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          {c.role === 'editor' ? (
                            <ShieldCheck className="w-4 h-4 text-sky-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* Join Existing Room Form */
            <form onSubmit={handleJoinExisting} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">
                  Enter Partner Room Code or URL
                </label>
                <input
                  type="text"
                  placeholder="e.g. collab-39f8a2 or paste invite link..."
                  value={joinRoomInput}
                  onChange={(e) => setJoinRoomInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">
                  Select Your Access Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('editor')}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                      selectedRole === 'editor'
                        ? 'bg-sky-500/10 border-sky-500 text-sky-400'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> Co-Designer
                    </span>
                    <span className="text-[10px] text-slate-400">Add/move components & wire pins</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('viewer')}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                      selectedRole === 'viewer'
                        ? 'bg-sky-500/10 border-sky-500 text-sky-400'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" /> Reviewer
                    </span>
                    <span className="text-[10px] text-slate-400">Inspect wiring & view live changes</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={!joinRoomInput.trim()}
                className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-xl shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <span>Connect to Partner Room</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          {isCollaborating ? (
            <button
              onClick={() => {
                leaveCollaboration();
                onClose();
              }}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Leave Partnership Room</span>
            </button>
          ) : (
            <span className="text-xs text-slate-500">Private session</span>
          )}

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-lg text-slate-200 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
