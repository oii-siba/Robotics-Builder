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
import { GuestPromptToast } from '@/components/studio/auth/GuestPromptToast';
import { Box, Zap, Code2, Package, Gamepad2 } from 'lucide-react';

export default function StudioPage() {
  const activeTab = useRobotStore((state) => state.activeTab);
  const setActiveTab = useRobotStore((state) => state.setActiveTab);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  React.useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSupabaseOpen, setIsSupabaseOpen] = useState(false);

  const mobileTabs = [
    { id: 'circuit-wiring' as const, label: 'Circuit CAD', icon: Zap },
    { id: '3d-workbench' as const, label: '3D CAD', icon: Box },
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
        {/* Custom Vector SVG Robotics Circuit Editor */}
        {activeTab === 'circuit-wiring' && (
          <div className="flex-1 w-full h-full">
            <CircuitEditor />
          </div>
        )}

        {/* 3D Workbench Mode */}
        {activeTab === '3d-workbench' && (
          <div className="flex-1 flex w-full h-full relative">
            <PartsCatalog />
            <div className="flex-1 h-full relative">
              <TransformToolbar />
              <RoboticsCanvas />
            </div>
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
      <div className="lg:hidden h-12 bg-slate-900 border-t border-slate-800 flex items-center justify-around px-2 select-none z-30">
        {mobileTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-md text-[10px] font-semibold transition-all ${
                isActive ? 'text-sky-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
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
