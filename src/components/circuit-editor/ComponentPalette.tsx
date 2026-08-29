'use client';

import React, { useState, useMemo } from 'react';
import { 
  Cpu, 
  Cog, 
  Radio, 
  Box, 
  BatteryCharging, 
  Search, 
  Plus, 
  GripVertical, 
  Sparkles, 
  X,
  Tv,
  Layers,
  Camera,
  Wifi,
  Lightbulb,
  ToggleLeft,
  Volume2,
  Compass,
  Hammer,
  ShieldAlert,
  Sliders
} from 'lucide-react';
import { CIRCUIT_COMPONENTS_LIBRARY } from '@/lib/circuit-engine/components-library';
import { ComponentCategory, CircuitComponentDef } from '@/lib/circuit-engine/types';
import { useCircuitStore } from '@/lib/circuit-engine/circuit-store';

export function ComponentPalette() {
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | 'all'>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const addComponent = useCircuitStore((state) => state.addComponent);

  const categories: { id: ComponentCategory | 'all'; label: string; icon: any }[] = [
    { id: 'all', label: 'All Parts', icon: Sparkles },
    { id: 'controllers', label: '🧠 Controllers', icon: Cpu },
    { id: 'motors', label: '⚙️ Motors & Servos', icon: Cog },
    { id: 'drivers', label: '🔌 Motor Drivers', icon: Box },
    { id: 'sensors', label: '👁️ Sensors', icon: Radio },
    { id: 'vision', label: '📷 Vision & AI', icon: Camera },
    { id: 'wireless', label: '📡 Wireless & RF', icon: Wifi },
    { id: 'power', label: '🔋 Power & Battery', icon: BatteryCharging },
    { id: 'indicators', label: '💡 LEDs & Lights', icon: Lightbulb },
    { id: 'controls', label: '🔘 Switches & Joy', icon: ToggleLeft },
    { id: 'displays', label: '🖥️ Displays & LCD', icon: Tv },
    { id: 'audio', label: '🔊 Audio & Buzzers', icon: Volume2 },
    { id: 'electronics', label: '🧩 Passives & ICs', icon: Layers },
    { id: 'mechanical', label: '🛞 Mechanical & 2WD', icon: Cog },
    { id: 'robot_arms', label: '🦾 Robot Arms', icon: Box },
    { id: 'navigation', label: '🧭 Navigation & GPS', icon: Compass },
    { id: 'prototyping', label: '🧱 Breadboards', icon: Hammer },
  ];

  // Get available subcategories for current category
  const subcategories = useMemo(() => {
    const list = new Set<string>();
    CIRCUIT_COMPONENTS_LIBRARY.forEach((c) => {
      if (selectedCategory === 'all' || c.category === selectedCategory) {
        if (c.subcategory) list.add(c.subcategory);
      }
    });
    return Array.from(list);
  }, [selectedCategory]);

  const filteredComponents = useMemo(() => {
    return CIRCUIT_COMPONENTS_LIBRARY.filter((comp) => {
      const matchesCategory = selectedCategory === 'all' || comp.category === selectedCategory;
      const matchesSub = selectedSubcategory === 'all' || comp.subcategory === selectedSubcategory;
      const q = searchQuery.toLowerCase().trim();

      if (!q) return matchesCategory && matchesSub;

      const matchesName = comp.name.toLowerCase().includes(q);
      const matchesDesc = comp.description.toLowerCase().includes(q);
      const matchesPrefix = comp.prefix.toLowerCase().includes(q);
      const matchesInterface = comp.interfaces?.some((i) => i.toLowerCase().includes(q));
      const matchesVoltage = comp.voltage?.toLowerCase().includes(q);

      return (
        matchesCategory &&
        matchesSub &&
        (matchesName || matchesDesc || matchesPrefix || matchesInterface || matchesVoltage)
      );
    });
  }, [selectedCategory, selectedSubcategory, searchQuery]);

  const onDragStart = (e: React.DragEvent, defId: string) => {
    e.dataTransfer.setData('application/robotics-component', defId);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <aside className="w-80 h-full bg-slate-900 border-r border-slate-800 flex flex-col z-20 select-none shadow-2xl">
      {/* Header */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 font-mono">Robotics Catalog</h3>
            <span className="text-[10px] text-slate-400">Drag or click to place</span>
          </div>
        </div>
        <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
          {CIRCUIT_COMPONENTS_LIBRARY.length} Items
        </span>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/40 space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search ESP32, L298N, I2C, Sonar, 5V..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-7 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors font-mono"
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

        {/* Categories Dropdown / Horizontal Scroller */}
        <div className="flex gap-1 overflow-x-auto custom-scrollbar pb-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count =
              cat.id === 'all'
                ? CIRCUIT_COMPONENTS_LIBRARY.length
                : CIRCUIT_COMPONENTS_LIBRARY.filter((c) => c.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedSubcategory('all');
                }}
                className={`px-2 py-1 rounded-md text-[10px] font-medium whitespace-nowrap flex items-center gap-1 transition-all ${
                  isSelected
                    ? 'bg-sky-500 text-white shadow-sm font-bold'
                    : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[9px] px-1 rounded ${isSelected ? 'bg-sky-700 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Subcategories (if available) */}
        {subcategories.length > 1 && (
          <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-800/60">
            <button
              onClick={() => setSelectedSubcategory('all')}
              className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${
                selectedSubcategory === 'all'
                  ? 'bg-slate-800 text-sky-400 font-bold'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              All Types
            </button>
            {subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(sub)}
                className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${
                  selectedSubcategory === sub
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Component Cards List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
        {filteredComponents.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No robotics components match &ldquo;{searchQuery}&rdquo;
          </div>
        ) : (
          filteredComponents.map((comp) => (
            <div
              key={comp.id}
              draggable
              onDragStart={(e) => onDragStart(e, comp.id)}
              onClick={() => addComponent(comp.id, 250, 200)}
              className="group bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-sky-500/60 rounded-xl p-2.5 transition-all cursor-grab active:cursor-grabbing flex items-center justify-between shadow-sm"
              title="Drag onto canvas or click to add"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <GripVertical className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 flex-shrink-0" />
                <div
                  className="w-9 h-9 rounded-lg border border-slate-800 flex items-center justify-center font-mono font-bold text-xs flex-shrink-0"
                  style={{ backgroundColor: comp.bodyColor || '#1E293B', color: comp.accentColor || '#38BDF8' }}
                >
                  {comp.prefix}
                </div>
                <div className="truncate">
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-sky-300 transition-colors truncate">
                    {comp.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[9.5px] text-slate-400 font-mono">
                    <span>{comp.pins.length} Pins</span>
                    {comp.voltage && <span>• {comp.voltage}</span>}
                    {comp.subcategory && <span className="text-slate-500">• {comp.subcategory}</span>}
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addComponent(comp.id, 250, 200);
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
