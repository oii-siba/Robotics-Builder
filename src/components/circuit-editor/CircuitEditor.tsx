'use client';

import React from 'react';
import { EditorToolbar } from './EditorToolbar';
import { ComponentPalette } from './ComponentPalette';
import { SvgCanvas } from './SvgCanvas';
import { PropertiesSidebar } from './PropertiesSidebar';
import { ConnectionTable } from './ConnectionTable';

export function CircuitEditor() {
  return (
    <div className="w-full h-full flex flex-col bg-[#0A0E17] text-white overflow-hidden select-none font-sans">
      {/* Top Toolbar */}
      <EditorToolbar />

      {/* Center Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Component Library Palette */}
        <ComponentPalette />

        {/* Center SVG Vector Canvas & Bottom Connection Table */}
        <div className="flex-1 flex flex-col relative h-full overflow-hidden">
          <div className="flex-1 w-full h-full relative">
            <SvgCanvas />
          </div>
          <ConnectionTable />
        </div>

        {/* Right Properties Inspector */}
        <PropertiesSidebar />
      </div>
    </div>
  );
}
