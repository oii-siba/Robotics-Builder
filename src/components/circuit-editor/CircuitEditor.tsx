'use client';

import React, { useState } from 'react';
import { EditorToolbar } from './EditorToolbar';
import { ComponentPalette } from './ComponentPalette';
import { SvgCanvas } from './SvgCanvas';
import { PropertiesSidebar } from './PropertiesSidebar';
import { ConnectionTable } from './ConnectionTable';
import { useCircuitStore } from '@/lib/circuit-engine/circuit-store';
import { Cpu, ListCollapse, Sliders } from 'lucide-react';

export function CircuitEditor() {
  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState(false);
  const [isMobileNetlistOpen, setIsMobileNetlistOpen] = useState(false);
  const selectedComponentId = useCircuitStore((state) => state.selectedComponentId);
  const wires = useCircuitStore((state) => state.wires);

  return (
    <div className="w-full h-full flex flex-col bg-[#0A0E17] text-white overflow-hidden select-none font-sans">
      {/* Top Toolbar */}
      <EditorToolbar />

      {/* Center Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Component Library Palette (Desktop Sidebar) */}
        <div className="hidden lg:block h-full">
          <ComponentPalette />
        </div>

        {/* Mobile Component Library Drawer with Backdrop */}
        {isMobilePaletteOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobilePaletteOpen(false)}
            />
            <div className="relative z-50 w-80 max-w-[85vw] h-full shadow-2xl animate-in slide-in-from-left duration-200">
              <ComponentPalette
                isMobileOpen={true}
                onClose={() => setIsMobilePaletteOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Center SVG Vector Canvas & Bottom Connection Table */}
        <div className="flex-1 flex flex-col relative h-full overflow-hidden w-full">
          <div className="flex-1 w-full h-full relative">
            <SvgCanvas />

            {/* Mobile Floating Action Buttons */}
            <div className="lg:hidden absolute bottom-4 left-4 z-20 flex items-center gap-2">
              {/* Floating Add Components Button */}
              <button
                onClick={() => setIsMobilePaletteOpen(true)}
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xl shadow-sky-500/30 flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <Cpu className="w-4 h-4" />
                <span>Parts</span>
              </button>

              {/* Floating Netlist Button if wires exist */}
              {wires.length > 0 && (
                <button
                  onClick={() => setIsMobileNetlistOpen(!isMobileNetlistOpen)}
                  className={`text-xs font-bold px-3 py-2 rounded-xl shadow-xl border flex items-center gap-1.5 active:scale-95 transition-all ${
                    isMobileNetlistOpen
                      ? 'bg-sky-500 text-white border-sky-400'
                      : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  <ListCollapse className="w-4 h-4" />
                  <span>Netlist ({wires.length})</span>
                </button>
              )}
            </div>
          </div>

          {/* Desktop Connection Table */}
          <div className="hidden lg:block">
            <ConnectionTable />
          </div>

          {/* Mobile Collapsible Connection Table */}
          {isMobileNetlistOpen && (
            <div className="lg:hidden z-30 animate-in slide-in-from-bottom duration-200">
              <ConnectionTable onClose={() => setIsMobileNetlistOpen(false)} />
            </div>
          )}
        </div>

        {/* Right Properties Inspector (Desktop) */}
        <div className="hidden lg:block h-full">
          <PropertiesSidebar />
        </div>

        {/* Mobile Properties Inspector Drawer */}
        {selectedComponentId && (
          <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 max-h-[65vh] flex flex-col bg-slate-900 border-t border-slate-800 shadow-2xl rounded-t-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
            <PropertiesSidebar />
          </div>
        )}
      </div>
    </div>
  );
}
