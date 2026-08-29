'use client';

import React from 'react';
import { 
  Sliders, 
  RotateCw, 
  Trash2, 
  Tag, 
  Palette, 
  Info, 
  Layers,
  X
} from 'lucide-react';
import { Node } from '@xyflow/react';

interface PropertyInspectorProps {
  selectedNode: Node | null;
  onUpdateNodeData: (nodeId: string, updates: Record<string, any>) => void;
  onDeleteNode: (nodeId: string) => void;
  onClose: () => void;
}

export function PropertyInspector({
  selectedNode,
  onUpdateNodeData,
  onDeleteNode,
  onClose,
}: PropertyInspectorProps) {
  if (!selectedNode) return null;

  const data = selectedNode.data as any;
  const symbolDef = data?.symbolDef;
  const rotation = data?.rotation || 0;

  const handleRotate = () => {
    const nextRot = (rotation + 90) % 360;
    onUpdateNodeData(selectedNode.id, { rotation: nextRot });
  };

  const colors = ['#EF4444', '#10B981', '#3B82F6', '#EAB308', '#8B5CF6', '#F97316'];

  return (
    <aside className="w-72 bg-slate-900 border-l border-slate-800 flex flex-col z-20 select-none shadow-2xl text-white">
      {/* Header */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Sliders className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 font-mono">Component Properties</h3>
            <span className="text-[10px] text-slate-400">{symbolDef?.name || 'Selected Element'}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Property Fields */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-mono">
        {/* Component Label */}
        <div className="space-y-1.5">
          <label className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
            <Tag className="w-3 h-3 text-sky-400" /> Reference Label (Designator)
          </label>
          <input
            type="text"
            value={data.label || ''}
            onChange={(e) => onUpdateNodeData(selectedNode.id, { label: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500 font-bold"
          />
        </div>

        {/* Component Value & Unit */}
        {symbolDef?.defaultValue !== undefined && (
          <div className="space-y-1.5">
            <label className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
              <Layers className="w-3 h-3 text-amber-400" /> Value & Units
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={data.value || ''}
                onChange={(e) => onUpdateNodeData(selectedNode.id, { value: e.target.value })}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500 font-bold"
              />
              {symbolDef.unitOptions && (
                <select
                  value={data.unit || symbolDef.defaultUnit}
                  onChange={(e) => onUpdateNodeData(selectedNode.id, { unit: e.target.value })}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
                >
                  {symbolDef.unitOptions.map((u: string) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        )}

        {/* Rotation & Orientation */}
        <div className="space-y-1.5">
          <label className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
            <RotateCw className="w-3 h-3 text-emerald-400" /> Orientation Angle
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRotate}
              className="flex-1 bg-slate-800 hover:bg-slate-700 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-200 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Rotate 90° ({rotation}°)</span>
            </button>
          </div>
        </div>

        {/* Custom Color */}
        <div className="space-y-1.5">
          <label className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
            <Palette className="w-3 h-3 text-purple-400" /> Highlight Color
          </label>
          <div className="flex items-center gap-1.5 bg-slate-950 p-2 rounded-lg border border-slate-800">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => onUpdateNodeData(selectedNode.id, { customColor: c })}
                style={{ backgroundColor: c }}
                className={`w-4 h-4 rounded-full border border-slate-700 hover:scale-125 transition-transform ${
                  data.customColor === c ? 'ring-2 ring-white scale-110' : ''
                }`}
              />
            ))}
          </div>
        </div>

        {/* Pinout Terminals */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800">
          <label className="text-slate-400 text-[11px] font-semibold">
            Terminal Pins ({symbolDef?.ports?.length || 0})
          </label>
          <div className="space-y-1 max-h-36 overflow-y-auto custom-scrollbar">
            {symbolDef?.ports?.map((p: any) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-1.5 rounded bg-slate-950 border border-slate-800/80 text-[10px]"
              >
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: p.color || '#38BDF8' }}
                  />
                  <span className="text-slate-300 font-bold">{p.name}</span>
                </div>
                <span className="text-slate-500 uppercase">{p.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Button */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        <button
          onClick={() => onDeleteNode(selectedNode.id)}
          className="w-full bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Component (Del)</span>
        </button>
      </div>
    </aside>
  );
}
