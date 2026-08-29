'use client';

import React from 'react';
import { 
  Sliders, 
  RotateCw, 
  Trash2, 
  Tag, 
  Layers, 
  X, 
  Cpu, 
  CheckCircle2, 
  Zap 
} from 'lucide-react';
import { useCircuitStore } from '@/lib/circuit-engine/circuit-store';
import { CIRCUIT_COMPONENTS_LIBRARY } from '@/lib/circuit-engine/components-library';

interface PropertiesSidebarProps {
  onClose?: () => void;
}

export function PropertiesSidebar({ onClose }: PropertiesSidebarProps) {
  const selectedComponentId = useCircuitStore((state) => state.selectedComponentId);
  const setSelectedComponent = useCircuitStore((state) => state.setSelectedComponent);
  const components = useCircuitStore((state) => state.components);
  const wires = useCircuitStore((state) => state.wires);
  const rotateComponent = useCircuitStore((state) => state.rotateComponent);
  const updateComponentLabel = useCircuitStore((state) => state.updateComponentLabel);
  const removeComponent = useCircuitStore((state) => state.removeComponent);

  if (!selectedComponentId) return null;

  const component = components.find((c) => c.instanceId === selectedComponentId);
  if (!component) return null;

  const def = CIRCUIT_COMPONENTS_LIBRARY.find((d) => d.id === component.defId);
  if (!def) return null;

  // Find wires attached to this component
  const connectedWires = wires.filter(
    (w) => w.fromComponentId === component.instanceId || w.toComponentId === component.instanceId
  );

  return (
    <aside className="w-full sm:w-72 bg-slate-900 border-l border-slate-800 flex flex-col z-30 select-none shadow-2xl text-white h-full">
      {/* Header */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Sliders className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 font-mono">Component Inspector</h3>
            <span className="text-[10px] text-slate-400">{def.name}</span>
          </div>
        </div>
        <button
          onClick={() => {
            setSelectedComponent(null);
            if (onClose) onClose();
          }}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          title="Close Inspector"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-mono">
        {/* Label Field */}
        <div className="space-y-1.5">
          <label className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
            <Tag className="w-3 h-3 text-sky-400" /> Reference Label
          </label>
          <input
            type="text"
            value={component.label}
            onChange={(e) => updateComponentLabel(component.instanceId, e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500 font-bold"
          />
        </div>

        {/* Position & Dimensions */}
        <div className="space-y-1.5">
          <label className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
            <Layers className="w-3 h-3 text-amber-400" /> Position Coordinates
          </label>
          <div className="grid grid-cols-2 gap-2 text-slate-300">
            <div className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5">
              <span className="text-slate-500 text-[10px]">X: </span>
              <span className="font-bold text-sky-400">{Math.round(component.x)} px</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5">
              <span className="text-slate-500 text-[10px]">Y: </span>
              <span className="font-bold text-sky-400">{Math.round(component.y)} px</span>
            </div>
          </div>
        </div>

        {/* Rotation */}
        <div className="space-y-1.5">
          <label className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
            <RotateCw className="w-3 h-3 text-emerald-400" /> Orientation
          </label>
          <button
            onClick={() => rotateComponent(component.instanceId)}
            className="w-full bg-slate-800 hover:bg-slate-700 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-200 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5 text-sky-400" />
            <span>Rotate 90° ({component.rotation || 0}°)</span>
          </button>
        </div>

        {/* Pinout Terminals */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800">
          <label className="text-slate-400 text-[11px] font-semibold flex items-center justify-between">
            <span>Terminal Pins ({def.pins.length})</span>
            <span className="text-[10px] text-sky-400">{connectedWires.length} Connected</span>
          </label>

          <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
            {def.pins.map((p) => {
              const isConnected = connectedWires.some(
                (w) =>
                  (w.fromComponentId === component.instanceId && w.fromPinId === p.id) ||
                  (w.toComponentId === component.instanceId && w.toPinId === p.id)
              );

              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-1.5 rounded bg-slate-950 border border-slate-800/80 text-[10px]"
                >
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: p.color || '#38BDF8' }}
                    />
                    <span className="text-slate-200 font-bold">{p.name}</span>
                  </div>
                  <span className={isConnected ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    {isConnected ? '✓ Connected' : p.type}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Delete Button */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        <button
          onClick={() => removeComponent(component.instanceId)}
          className="w-full bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Component (Del)</span>
        </button>
      </div>
    </aside>
  );
}
