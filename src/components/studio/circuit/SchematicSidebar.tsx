'use client';

import React, { useState } from 'react';
import { 
  Zap, 
  Search, 
  Plus, 
  BatteryCharging, 
  Cpu, 
  ToggleLeft, 
  Gauge, 
  Layers, 
  Radio, 
  Sparkles,
  X,
  GripVertical
} from 'lucide-react';
import { SCHEMATIC_SYMBOLS, SchematicCategory, SchematicSymbolDef } from '@/lib/constants/schematic-symbols';

interface SchematicSidebarProps {
  onAddSymbol: (symbol: SchematicSymbolDef) => void;
}

export function SchematicSidebar({ onAddSymbol }: SchematicSidebarProps) {
  const [selectedCategory, setSelectedCategory] = useState<SchematicCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: SchematicCategory | 'all'; label: string; icon: any }[] = [
    { id: 'all', label: 'All Symbols', icon: Sparkles },
    { id: 'sources', label: 'Power & GND', icon: BatteryCharging },
    { id: 'passives', label: 'R / C / L Passives', icon: Layers },
    { id: 'semiconductors', label: 'Diodes & Transistors', icon: Zap },
    { id: 'switches', label: 'Switches & Relays', icon: ToggleLeft },
    { id: 'ics_modules', label: 'ICs & Microcontrollers', icon: Cpu },
    { id: 'meters', label: 'Volt / Ammeters', icon: Gauge },
  ];

  const filteredSymbols = SCHEMATIC_SYMBOLS.filter((sym) => {
    const matchesCategory = selectedCategory === 'all' || sym.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesName = sym.name.toLowerCase().includes(q);
    const matchesDesc = sym.description.toLowerCase().includes(q);
    const matchesPrefix = sym.prefix.toLowerCase().includes(q);
    return matchesCategory && (matchesName || matchesDesc || matchesPrefix);
  });

  const onDragStart = (event: React.DragEvent, symbolId: string) => {
    event.dataTransfer.setData('application/reactflow', symbolId);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-72 sm:w-80 h-full bg-slate-900 border-r border-slate-800 flex flex-col z-20 select-none shadow-2xl">
      {/* Header */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 font-mono">Schematic Toolbox</h3>
            <span className="text-[10px] text-slate-400">Drag or click to place</span>
          </div>
        </div>
        <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
          {SCHEMATIC_SYMBOLS.length} Symbols
        </span>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/40 space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Resistor, Battery, Diode, LED, 555..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-7 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2 py-1 rounded-md text-[10px] font-medium flex items-center gap-1 transition-all ${
                  isSelected
                    ? 'bg-sky-500 text-white shadow-sm font-bold'
                    : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Symbol Palette List with Drag & Drop */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        {filteredSymbols.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">
            No schematic symbols match &ldquo;{searchQuery}&rdquo;
          </div>
        ) : (
          filteredSymbols.map((sym) => (
            <div
              key={sym.id}
              draggable
              onDragStart={(e) => onDragStart(e, sym.id)}
              onClick={() => onAddSymbol(sym)}
              className="group bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-sky-500/50 rounded-xl p-2.5 transition-all cursor-grab active:cursor-grabbing flex items-center justify-between shadow-sm"
              title="Drag onto canvas or click to add"
            >
              <div className="flex items-center gap-2.5">
                <GripVertical className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 flex-shrink-0" />
                <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 font-mono font-bold text-xs group-hover:border-sky-500/40 transition-colors flex-shrink-0">
                  {sym.prefix}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-sky-300 transition-colors">
                    {sym.name}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {sym.ports.length} Pins {sym.defaultValue ? `• ${sym.defaultValue}` : ''}
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddSymbol(sym);
                }}
                className="w-7 h-7 rounded-lg bg-slate-800/80 group-hover:bg-sky-500 text-slate-300 group-hover:text-white flex items-center justify-center transition-colors flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
