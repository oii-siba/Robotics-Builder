'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, 
  Cog, 
  Radio, 
  Box, 
  BatteryCharging, 
  Tv,
  Plus, 
  Search, 
  Layers, 
  Sparkles, 
  X, 
  Trash2,
  Tag,
  Wrench
} from 'lucide-react';
import { ROBOT_PARTS_CATALOG } from '@/lib/constants/robot-parts';
import { PartCategory, RobotPartDefinition } from '@/lib/types/robot';
import { useRobotStore } from '@/lib/store/robot-store';

export function PartsCatalog() {
  const [selectedCategory, setSelectedCategory] = useState<PartCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'catalog' | 'hierarchy'>('catalog');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const addPart = useRobotStore((state) => state.addPart);
  const parts = useRobotStore((state) => state.parts);
  const selectedPartId = useRobotStore((state) => state.selectedPartId);
  const selectPart = useRobotStore((state) => state.selectPart);
  const removePart = useRobotStore((state) => state.removePart);

  // Quick keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        setActiveTab('catalog');
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const categories: { id: PartCategory | 'all'; label: string; icon: any }[] = [
    { id: 'all', label: 'All', icon: Sparkles },
    { id: 'controllers', label: 'MCUs / Boards', icon: Cpu },
    { id: 'actuators', label: 'Motors & Drivers', icon: Cog },
    { id: 'sensors', label: 'Sensors & LiDAR', icon: Radio },
    { id: 'structural', label: 'Chassis & Drones', icon: Box },
    { id: 'displays', label: 'Displays & RGB', icon: Tv },
    { id: 'power', label: 'Power & Battery', icon: BatteryCharging },
    { id: 'accessories', label: 'Prototyping', icon: Wrench },
  ];

  const filteredParts = ROBOT_PARTS_CATALOG.filter((part) => {
    const matchesCategory = selectedCategory === 'all' || part.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesName = part.name.toLowerCase().includes(q);
    const matchesDesc = part.description.toLowerCase().includes(q);
    const matchesId = part.id.toLowerCase().includes(q);
    const matchesCategoryName = part.category.toLowerCase().includes(q);
    const matchesTags = part.tags?.some((t) => t.toLowerCase().includes(q));

    return matchesCategory && (matchesName || matchesDesc || matchesId || matchesCategoryName || matchesTags);
  });

  return (
    <aside className="w-80 sm:w-96 h-full bg-slate-900 border-r border-slate-800 flex flex-col z-10 select-none shadow-2xl">
      {/* Catalog / Hierarchy Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'catalog'
              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Parts Library ({ROBOT_PARTS_CATALOG.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('hierarchy')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'hierarchy'
              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Scene ({parts.length})</span>
        </button>
      </div>

      {activeTab === 'catalog' ? (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Search Bar */}
          <div className="p-3 border-b border-slate-800 bg-slate-950/40 space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search Arduino, LiDAR, Servo, Drone, Camera... (Press '/')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
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

            {/* Category Filter Pills */}
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
                        ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30 font-bold'
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

          {/* Part Cards Scrollable List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
            {filteredParts.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs space-y-2">
                <Search className="w-8 h-8 mx-auto text-slate-600" />
                <p>No robotics parts found matching &ldquo;{searchQuery}&rdquo;</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="text-sky-400 hover:underline text-[11px]"
                >
                  Clear search filters
                </button>
              </div>
            ) : (
              filteredParts.map((item) => (
                <div
                  key={item.id}
                  className="group bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-sky-500/60 rounded-xl p-3 transition-all flex flex-col gap-2 relative shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-100 group-hover:text-sky-400 transition-colors">
                        {item.name}
                      </h4>
                      <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500 font-semibold">
                        {item.category}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-1.5 py-0.5 rounded flex-shrink-0 font-semibold">
                      ${item.approxPriceUsd.toFixed(2)}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Specs & Pins Badges */}
                  <div className="flex flex-wrap gap-1 text-[10px] font-mono">
                    {item.specs.voltage && (
                      <span className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-amber-300">
                        ⚡ {item.specs.voltage}
                      </span>
                    )}
                    {item.specs.torque && (
                      <span className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-indigo-300">
                        ⚙️ {item.specs.torque}
                      </span>
                    )}
                    {item.pins && (
                      <span className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-sky-300">
                        📌 {item.pins.length} Pins
                      </span>
                    )}
                  </div>

                  {/* Add Button */}
                  <button
                    onClick={() => addPart(item.id)}
                    className="mt-1 w-full bg-slate-800/90 hover:bg-sky-500 text-slate-200 hover:text-white font-semibold text-xs py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to 3D Robot</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Scene Tree / Hierarchy */
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
          <div className="text-[11px] font-mono text-slate-400 px-1 pb-1">
            Assembled Parts in 3D Scene ({parts.length})
          </div>

          {parts.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs space-y-2">
              <Box className="w-8 h-8 mx-auto text-slate-600" />
              <p>No parts placed yet. Click on any part in the library to add it!</p>
            </div>
          ) : (
            parts.map((p) => {
              const isSelected = p.instanceId === selectedPartId;
              return (
                <div
                  key={p.instanceId}
                  onClick={() => selectPart(p.instanceId)}
                  className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-sky-500/20 border-sky-500 text-white shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: p.color || '#3B82F6' }}
                    />
                    <span className="truncate font-medium">{p.name}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      title="Delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        removePart(p.instanceId);
                      }}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </aside>
  );
}
