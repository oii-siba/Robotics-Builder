'use client';

import React from 'react';
import { Zap, Trash2, FileText, Download } from 'lucide-react';
import { useCircuitStore } from '@/lib/circuit-engine/circuit-store';
import { CIRCUIT_COMPONENTS_LIBRARY } from '@/lib/circuit-engine/components-library';
import { Point } from '@/lib/circuit-engine/types';

interface ConnectionTableProps {
  onClose?: () => void;
}

export function ConnectionTable({ onClose }: ConnectionTableProps) {
  const wires = useCircuitStore((state) => state.wires);
  const components = useCircuitStore((state) => state.components);
  const removeWire = useCircuitStore((state) => state.removeWire);
  const title = useCircuitStore((state) => state.title);

  if (wires.length === 0) return null;

  const getPinName = (componentId?: string, pinId?: string, point?: Point) => {
    if (point) return `Node (${Math.round(point.x)}, ${Math.round(point.y)})`;
    if (!componentId || !pinId) return 'Wire Junction';

    const comp = components.find((c) => c.instanceId === componentId);
    if (!comp) return pinId;
    const def = CIRCUIT_COMPONENTS_LIBRARY.find((d) => d.id === comp.defId);
    const pin = def?.pins.find((p) => p.id === pinId);
    return `${comp.label} (${pin?.name || pinId})`;
  };

  const handleExportNetlist = () => {
    let txt = `Robotics Pin Interconnect Netlist: ${title}\n================================================\n\n`;
    wires.forEach((w, idx) => {
      txt += `${idx + 1}. ${getPinName(w.fromComponentId, w.fromPinId, w.fromPoint)} ➔ ${getPinName(w.toComponentId, w.toPinId, w.toPoint)} [Color: ${w.color}]\n`;
    });

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_Pinout.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-36 sm:h-40 bg-slate-900/95 border-t border-slate-800 flex flex-col p-2 sm:p-2.5 font-mono text-xs overflow-hidden select-none">
      <div className="flex items-center justify-between pb-1.5 text-[11px] text-slate-400 font-bold border-b border-slate-800">
        <span className="flex items-center gap-1.5 text-sky-400 truncate">
          <Zap className="w-3.5 h-3.5 flex-shrink-0" /> Netlist ({wires.length} Wires)
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleExportNetlist}
            className="text-slate-400 hover:text-white flex items-center gap-1 text-[10px]"
            title="Download Netlist"
          >
            <Download className="w-3 h-3" />
            <span className="hidden xs:inline">Export</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 text-[10px]"
              title="Close Netlist"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar pt-1.5 pr-1">
        {wires.map((w) => (
          <div
            key={w.id}
            className="grid grid-cols-12 gap-2 items-center text-[11px] px-2.5 py-1 bg-slate-950/60 hover:bg-slate-950 rounded border border-slate-800/80 transition-colors"
          >
            <div className="col-span-1 flex items-center">
              <div
                className="w-3 h-3 rounded-full border border-slate-700 shadow-sm"
                style={{ backgroundColor: w.color }}
              />
            </div>
            <div className="col-span-5 text-sky-400 font-bold truncate">
              {getPinName(w.fromComponentId, w.fromPinId, w.fromPoint)}
            </div>
            <div className="col-span-1 text-center text-slate-500 font-bold">➔</div>
            <div className="col-span-4 text-amber-400 font-bold truncate">
              {getPinName(w.toComponentId, w.toPinId, w.toPoint)}
            </div>
            <div className="col-span-1 text-right">
              <button
                onClick={() => removeWire(w.id)}
                className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                title="Delete Connection"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
