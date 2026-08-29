'use client';

import React, { useState } from 'react';
import { useRobotStore } from '@/lib/store/robot-store';
import { Navbar } from '@/components/studio/Navbar';
import { RoboticsCanvas } from '@/components/studio/3d/RoboticsCanvas';
import { TransformToolbar } from '@/components/studio/3d/TransformToolbar';
import { PartsCatalog } from '@/components/studio/parts-palette/PartsCatalog';
import { CircuitEditor } from '@/components/circuit-editor/CircuitEditor';
import { FirmwareEditor } from '@/components/studio/editor/FirmwareEditor';
import { BillOfMaterials } from '@/components/studio/bom/BillOfMaterials';
import { RoboSimulator } from '@/components/studio/simulation/RoboSimulator';
import { ShareModal } from '@/components/studio/share/ShareModal';
import { SupabaseConfigModal } from '@/components/studio/modals/SupabaseConfigModal';
import { AuthModal } from '@/components/studio/auth/AuthModal';
import { MyProjectsModal } from '@/components/studio/modals/MyProjectsModal';
import { useAuthStore } from '@/lib/auth/auth-store';
import { useCircuitStore } from '@/lib/circuit-engine/circuit-store';
import { GuestPromptToast } from '@/components/studio/auth/GuestPromptToast';
import { Box, Zap, Code2, Package, Gamepad2 } from 'lucide-react';

export default function StudioPage() {
  const activeTab = useRobotStore((state) => state.activeTab);
  const setActiveTab = useRobotStore((state) => state.setActiveTab);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  React.useEffect(() => {
    initializeAuth();

    // Auto-detect and join real-time partnership room if ?collab= is in URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const collabRoom = params.get('collab');
      if (collabRoom) {
        setActiveTab('circuit-wiring');
        useCircuitStore.getState().joinCollaboration(collabRoom, 'editor');
      }
    }
  }, [initializeAuth, setActiveTab]);

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSupabaseOpen, setIsSupabaseOpen] = useState(false);
  const [isMobilePartsOpen, setIsMobilePartsOpen] = useState(false);

  const mobileTabs = [
    { id: '3d-workbench' as const, label: '3D CAD', icon: Box },
    { id: 'circuit-wiring' as const, label: 'Circuit CAD', icon: Zap },
    { id: 'firmware-code' as const, label: 'Code', icon: Code2 },
    { id: 'bom-specs' as const, label: 'BOM', icon: Package },
    { id: 'simulation' as const, label: 'Sim', icon: Gamepad2 },
  ];

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Studio Navbar */}
      <Navbar
        onOpenShare={() => setIsShareOpen(true)}
        onOpenSupabase={() => setIsSupabaseOpen(true)}
      />

      {/* Main Studio Viewport */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* 3D Workbench Mode */}
        {activeTab === '3d-workbench' && (
          <div className="flex-1 flex w-full h-full relative overflow-hidden">
            {/* Desktop Left Sidebar */}
            <div className="hidden lg:block h-full">
              <PartsCatalog />
            </div>

            {/* Mobile Parts Drawer with Backdrop */}
            {isMobilePartsOpen && (
              <div className="lg:hidden fixed inset-0 z-40 flex">
                <div 
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                  onClick={() => setIsMobilePartsOpen(false)}
                />
                <div className="relative z-50 w-80 max-w-[85vw] h-full shadow-2xl animate-in slide-in-from-left duration-200">
                  <PartsCatalog
                    isMobileOpen={true}
                    onClose={() => setIsMobilePartsOpen(false)}
                  />
                </div>
              </div>
            )}

            {/* 3D Viewport Area (Full screen on mobile) */}
            <div className="flex-1 h-full relative w-full">
              <TransformToolbar />
              <RoboticsCanvas />

              {/* Floating Mobile Trigger for Parts Library */}
              <button
                onClick={() => setIsMobilePartsOpen(true)}
                className="lg:hidden absolute bottom-4 left-4 z-20 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xl shadow-sky-500/30 flex items-center gap-2 active:scale-95 transition-all"
              >
                <Package className="w-4 h-4" />
                <span>Parts Library & Scene</span>
              </button>
            </div>
          </div>
        )}

        {/* Custom Vector SVG Robotics Circuit Editor */}
        {activeTab === 'circuit-wiring' && (
          <div className="flex-1 w-full h-full">
            <CircuitEditor />
          </div>
        )}

        {/* Firmware Code Editor Mode */}
        {activeTab === 'firmware-code' && (
          <div className="flex-1 w-full h-full">
            <FirmwareEditor />
          </div>
        )}

        {/* Bill of Materials & Specs Mode */}
        {activeTab === 'bom-specs' && (
          <div className="flex-1 w-full h-full">
            <BillOfMaterials />
          </div>
        )}

        {/* Live Simulation Arena Mode */}
        {activeTab === 'simulation' && (
          <div className="flex-1 w-full h-full">
            <RoboSimulator />
          </div>
        )}
      </main>

      {/* Mobile Bottom Mode Switcher */}
      <div className="lg:hidden h-14 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-around px-1 select-none z-30 pb-[env(safe-area-inset-bottom,0px)] shadow-2xl">
        {mobileTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all relative ${
                isActive
                  ? 'text-sky-400 font-bold bg-sky-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'scale-110 text-sky-400' : ''} transition-transform`} />
              <span>{tab.label}</span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400 absolute bottom-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Modals & Guest Toasts */}
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
      <SupabaseConfigModal isOpen={isSupabaseOpen} onClose={() => setIsSupabaseOpen(false)} />
      <AuthModal />
      <MyProjectsModal />
      <GuestPromptToast />
    </div>
  );
}
