'use client';

import React from 'react';
import { 
  Move, 
  RotateCw, 
  Maximize2, 
  Trash2, 
  Copy, 
  Grid3X3, 
  Eye, 
  EyeOff, 
  Compass, 
  Palette, 
  Layers
} from 'lucide-react';
import { useRobotStore, TransformMode } from '@/lib/store/robot-store';

export function TransformToolbar() {
  const transformMode = useRobotStore((state) => state.transformMode);
  const setTransformMode = useRobotStore((state) => state.setTransformMode);
  const gridSnap = useRobotStore((state) => state.gridSnap);
  const setGridSnap = useRobotStore((state) => state.setGridSnap);
  const isWireframe = useRobotStore((state) => state.isWireframe);
  const toggleWireframe = useRobotStore((state) => state.toggleWireframe);
  const selectedPartId = useRobotStore((state) => state.selectedPartId);
  const removePart = useRobotStore((state) => state.removePart);
  const duplicatePart = useRobotStore((state) => state.duplicatePart);
  const updatePartColor = useRobotStore((state) => state.updatePartColor);
  const parts = useRobotStore((state) => state.parts);

  const selectedPart = parts.find((p) => p.instanceId === selectedPartId);

  const colors = [
    '#0EA5E9', // Sky Cyan
    '#3B82F6', // Blue
    '#10B981', // Emerald
    '#EAB308', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#F97316', // Orange
    '#1F2937', // Matte Black
    '#CBD5E1', // Silver
  ];

  return (
    <div className="absolute top-3 left-3 right-3 sm:right-auto z-20 flex items-center gap-1.5 sm:gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-2xl text-white text-xs overflow-x-auto max-w-[calc(100vw-24px)] custom-scrollbar">
      {/* Transform Mode Group */}
      <div className="flex items-center bg-slate-950/70 rounded-lg p-0.5 border border-slate-800/80 flex-shrink-0">
        <button
          title="Move / Translate (W)"
          onClick={() => setTransformMode('translate')}
          className={`px-2 py-1.5 sm:px-2.5 rounded-md transition-all flex items-center gap-1 font-medium ${
            transformMode === 'translate'
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Move className="w-3.5 h-3.5" />
          <span className="text-[11px] hidden xs:inline">Move</span>
        </button>

        <button
          title="Rotate (E)"
          onClick={() => setTransformMode('rotate')}
          className={`px-2 py-1.5 sm:px-2.5 rounded-md transition-all flex items-center gap-1 font-medium ${
            transformMode === 'rotate'
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span className="text-[11px] hidden xs:inline">Rotate</span>
        </button>

        <button
          title="Scale (R)"
          onClick={() => setTransformMode('scale')}
          className={`px-2 py-1.5 sm:px-2.5 rounded-md transition-all flex items-center gap-1 font-medium ${
            transformMode === 'scale'
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="text-[11px] hidden xs:inline">Scale</span>
        </button>
      </div>

      <div className="h-5 w-px bg-slate-800 mx-0.5 flex-shrink-0" />

      {/* Grid Snapping */}
      <div className="flex items-center bg-slate-950/70 rounded-lg p-0.5 border border-slate-800/80 flex-shrink-0">
        <span className="text-slate-400 px-1.5 sm:px-2 flex items-center gap-1 font-mono text-[11px]">
          <Grid3X3 className="w-3.5 h-3.5 text-sky-400" /> <span className="hidden sm:inline">Snap:</span>
        </span>
        {[
          { label: 'Off', val: 0 },
          { label: '0.1m', val: 0.1 },
          { label: '0.25m', val: 0.25 },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => setGridSnap(item.val)}
            className={`px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-md transition-all font-mono text-[11px] ${
              gridSnap === item.val
                ? 'bg-sky-600 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Wireframe Toggle */}
      <button
        title="Toggle Wireframe Shader"
        onClick={toggleWireframe}
        className={`px-2 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 font-medium flex-shrink-0 text-xs ${
          isWireframe
            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800/60'
        }`}
      >
        <Layers className="w-3.5 h-3.5" />
        <span className="hidden xs:inline">{isWireframe ? 'Wire' : 'Solid'}</span>
      </button>

      {/* Part Actions (Active when a part is selected) */}
      {selectedPart && (
        <>
          <div className="h-5 w-px bg-slate-800 mx-0.5 flex-shrink-0" />

          {/* Color Palette */}
          <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-lg border border-slate-800/80 flex-shrink-0">
            <Palette className="w-3.5 h-3.5 text-slate-400 ml-1" />
            <div className="flex items-center gap-1 px-1">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => updatePartColor(selectedPart.instanceId, c)}
                  style={{ backgroundColor: c }}
                  className={`w-3.5 h-3.5 rounded-full border border-slate-700 hover:scale-125 transition-transform ${
                    selectedPart.color === c ? 'ring-2 ring-white scale-110' : ''
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center bg-slate-950/70 rounded-lg p-0.5 border border-slate-800/80 flex-shrink-0">
            <button
              title="Duplicate Part"
              onClick={() => duplicatePart(selectedPart.instanceId)}
              className="px-2 py-1.5 text-slate-300 hover:text-sky-400 hover:bg-slate-800/60 rounded-md transition-all flex items-center gap-1 text-xs"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clone</span>
            </button>

            <button
              title="Delete Part"
              onClick={() => removePart(selectedPart.instanceId)}
              className="px-2 py-1.5 text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-all flex items-center gap-1 text-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
