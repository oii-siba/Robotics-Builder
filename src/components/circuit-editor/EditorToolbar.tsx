'use client';

import React, { useState, useRef } from 'react';
import { 
  Zap, 
  RotateCw, 
  Trash2, 
  Undo2, 
  Redo2, 
  Share2, 
  Save, 
  Check, 
  Sparkles, 
  Download, 
  Upload, 
  FileCode2, 
  ChevronDown,
  Copy,
  Image as ImageIcon,
  FolderOpen,
  Users,
  Radio,
  Palette,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCircuitStore } from '@/lib/circuit-engine/circuit-store';
import { PRESET_CIRCUITS } from '@/lib/circuit-engine/circuit-presets';
import { useAuthStore } from '@/lib/auth/auth-store';
import { CircuitCollabModal } from './CircuitCollabModal';

export function EditorToolbar() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const title = useCircuitStore((state) => state.title);
  const setTitle = useCircuitStore((state) => state.setTitle);
  const activeWireColor = useCircuitStore((state) => state.activeWireColor);
  const setActiveWireColor = useCircuitStore((state) => state.setActiveWireColor);
  const showGrid = useCircuitStore((state) => state.showGrid);
  const toggleGrid = useCircuitStore((state) => state.toggleGrid);
  const snapToGrid = useCircuitStore((state) => state.snapToGrid);
  const toggleSnapToGrid = useCircuitStore((state) => state.toggleSnapToGrid);
  const selectedComponentId = useCircuitStore((state) => state.selectedComponentId);
  const selectedWireId = useCircuitStore((state) => state.selectedWireId);
  const setSelectedWire = useCircuitStore((state) => state.setSelectedWire);
  const setSelectedComponent = useCircuitStore((state) => state.setSelectedComponent);
  const rotateComponent = useCircuitStore((state) => state.rotateComponent);
  const removeComponent = useCircuitStore((state) => state.removeComponent);
  const removeWire = useCircuitStore((state) => state.removeWire);
  const undo = useCircuitStore((state) => state.undo);
  const redo = useCircuitStore((state) => state.redo);
  const clearCanvas = useCircuitStore((state) => state.clearCanvas);
  const saveProject = useCircuitStore((state) => state.saveProject);
  const saveStatus = useCircuitStore((state) => state.saveStatus);
  const projectId = useCircuitStore((state) => state.projectId);
  const components = useCircuitStore((state) => state.components);
  const wires = useCircuitStore((state) => state.wires);
  const loadProjectData = useCircuitStore((state) => state.loadProjectData);

  const isCollaborating = useCircuitStore((state) => state.isCollaborating);
  const collaborators = useCircuitStore((state) => state.collaborators);

  const [copiedLink, setCopiedLink] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isCollabOpen, setIsCollabOpen] = useState(false);

  // 1. Export Circuit as JPEG Image
  const handleExportJPEG = () => {
    const svgElement = document.getElementById('circuit-main-svg');
    if (!svgElement) return;

    const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
    const bbox = svgElement.getBoundingClientRect();
    const width = bbox.width || 1280;
    const height = bbox.height || 800;

    clonedSvg.setAttribute('width', `${width}`);
    clonedSvg.setAttribute('height', `${height}`);

    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = 2; // 2x high resolution
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Fill Dark EDA Background
      ctx.fillStyle = '#0A0E17';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);

      const jpegUrl = canvas.toDataURL('image/jpeg', 0.95);
      const link = document.createElement('a');
      link.href = jpegUrl;
      link.download = `${title.replace(/\s+/g, '_')}_Circuit.jpg`;
      link.click();
      URL.revokeObjectURL(url);
      setShowExportMenu(false);
      confetti({ particleCount: 60, spread: 60 });
    };
    img.src = url;
  };

  // 2. Export Circuit as PNG Image (Transparent/Crisp)
  const handleExportPNG = () => {
    const svgElement = document.getElementById('circuit-main-svg');
    if (!svgElement) return;

    const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
    const bbox = svgElement.getBoundingClientRect();
    const width = bbox.width || 1280;
    const height = bbox.height || 800;

    clonedSvg.setAttribute('width', `${width}`);
    clonedSvg.setAttribute('height', `${height}`);

    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = 2;
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#0A0E17';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);

      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `${title.replace(/\s+/g, '_')}_Circuit.png`;
      link.click();
      URL.revokeObjectURL(url);
      setShowExportMenu(false);
      confetti({ particleCount: 60, spread: 60 });
    };
    img.src = url;
  };

  // 3. Download Circuit as JSON File
  const handleExportJSON = () => {
    const circuitPayload = {
      id: projectId,
      title: title || 'Robotics Circuit Diagram',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      components,
      wires,
    };

    const blob = new Blob([JSON.stringify(circuitPayload, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_Circuit.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
    confetti({ particleCount: 50, spread: 60 });
  };

  // 4. Import / Load Circuit JSON File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed.components && Array.isArray(parsed.components)) {
          loadProjectData({
            id: parsed.id || `circuit-${Date.now().toString(36)}`,
            title: parsed.title || file.name.replace('.json', ''),
            description: parsed.description || '',
            components: parsed.components,
            wires: parsed.wires || [],
            createdAt: parsed.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          confetti({ particleCount: 60, spread: 60 });
        } else {
          alert('Invalid Circuit JSON format.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // 5. Save and Share URL with Guest Protection
  const handleSaveCircuit = async () => {
    const user = useAuthStore.getState().user;
    if (!user) {
      useAuthStore.getState().promptLogin('Sign in with 1-click Gmail OTP to save your circuit permanently to your cloud account!');
      return;
    }
    await saveProject();
  };

  const handleShare = async () => {
    const user = useAuthStore.getState().user;
    if (!user) {
      useAuthStore.getState().promptLogin('Please sign in with Gmail OTP to save and share your circuit online!');
      return;
    }

    await saveProject();
    if (typeof window !== 'undefined') {
      const shareUrl = `${window.location.origin}/share/${projectId}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // 6. Load Pre-built Robotics Template
  const handleSelectPreset = (preset: typeof PRESET_CIRCUITS[0]) => {
    loadProjectData({
      id: `circuit-${Date.now().toString(36)}`,
      title: preset.name,
      description: preset.description,
      components: preset.components,
      wires: preset.wires,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setShowPresets(false);
    confetti({ particleCount: 60, spread: 60 });
  };

  const wireColors = [
    { label: '5V (Red)', color: '#EF4444' },
    { label: '3.3V (Orange)', color: '#F97316' },
    { label: 'GND (Black)', color: '#1F2937' },
    { label: 'Signal (Blue)', color: '#38BDF8' },
    { label: 'PWM (Yellow)', color: '#EAB308' },
    { label: 'I2C/SPI (Green)', color: '#10B981' },
  ];

  return (
    <header className="h-12 bg-slate-900 border-b border-slate-800 px-2 sm:px-4 flex items-center justify-between z-30 select-none text-xs text-white shadow-md overflow-x-auto custom-scrollbar gap-2">
      {/* Hidden File Input for JSON Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Left Title & Preset Templates */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <div className="flex items-center gap-1 font-bold text-sky-400 font-mono">
          <Zap className="w-4 h-4 flex-shrink-0" />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent border border-transparent hover:border-slate-700 focus:border-sky-500 rounded px-1 py-0.5 font-bold text-white w-24 xs:w-32 sm:w-44 truncate focus:outline-none"
          />
        </div>

        {/* Pre-built Robotics Circuit Templates Dropdown */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 px-2 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xs:inline">Templates</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {showPresets && (
            <div className="absolute left-0 mt-1 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 text-xs text-white animate-in fade-in zoom-in-95">
              <div className="text-[10px] uppercase font-mono text-slate-500 px-2 py-1">
                Load Pre-Built Robotics Circuit
              </div>
              {PRESET_CIRCUITS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p)}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-800/80 transition-colors flex flex-col gap-0.5"
                >
                  <span className="font-semibold text-slate-200">{p.name}</span>
                  <span className="text-[10px] text-slate-400 truncate">
                    {p.components.length} Components • {p.wires.length} Wires
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-slate-800 flex-shrink-0" />

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 bg-slate-950 p-0.5 rounded-lg border border-slate-800 flex-shrink-0">
          <button
            onClick={undo}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={redo}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Wire Colors & RGB Custom Color Picker */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 flex-shrink-0">
          {wireColors.map((item) => (
            <button
              key={item.color}
              onClick={() => setActiveWireColor(item.color)}
              title={item.label}
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-slate-700 transition-transform ${
                activeWireColor?.toLowerCase() === item.color.toLowerCase() ? 'ring-2 ring-white scale-110' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: item.color }}
            />
          ))}

          <div className="h-3 w-px bg-slate-800 mx-0.5" />

          {/* RGB Custom Color Picker Button */}
          <label
            className={`relative flex items-center justify-center w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full cursor-pointer transition-all hover:scale-110 shadow-sm ${
              !wireColors.some((c) => c.color.toLowerCase() === (activeWireColor || '').toLowerCase())
                ? 'ring-2 ring-sky-400 scale-110 border border-white'
                : 'border border-slate-600 hover:border-slate-400'
            }`}
            style={{
              background: !wireColors.some((c) => c.color.toLowerCase() === (activeWireColor || '').toLowerCase())
                ? activeWireColor
                : 'conic-gradient(from 0deg, #ef4444, #f97316, #eab308, #10b981, #06b6d4, #3b82f6, #8b5cf6, #ec4899, #ef4444)',
            }}
            title={`Custom RGB Wire Color Picker (${activeWireColor})`}
          >
            <input
              type="color"
              value={activeWireColor?.startsWith('#') ? activeWireColor : '#38BDF8'}
              onChange={(e) => setActiveWireColor(e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
            <Palette className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] pointer-events-none" />
          </label>
        </div>

        {/* Grid Controls */}
        <div className="flex items-center gap-0.5 bg-slate-950 p-0.5 rounded-lg border border-slate-800 flex-shrink-0">
          <button
            onClick={toggleGrid}
            className={`px-1.5 py-1 rounded text-[11px] font-mono transition-colors ${
              showGrid ? 'text-sky-400 font-bold bg-slate-800' : 'text-slate-400 hover:text-white'
            }`}
          >
            Grid
          </button>
          <button
            onClick={toggleSnapToGrid}
            className={`px-1.5 py-1 rounded text-[11px] font-mono transition-colors ${
              snapToGrid ? 'text-sky-400 font-bold bg-slate-800' : 'text-slate-400 hover:text-white'
            }`}
          >
            Snap
          </button>
        </div>
      </div>

      {/* Right JSON Import/Export, JPEG Export, Save & Share */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        {/* Import JSON File */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
          title="Open / Import Circuit JSON File"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Import</span>
        </button>

        {/* Export Dropdown Menu (JPEG / PNG / JSON) */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border border-slate-700"
            title="Export Image or JSON"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Export</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {showExportMenu && (
            <div className="absolute right-0 mt-1 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 text-xs text-white animate-in fade-in zoom-in-95">
              <div className="text-[10px] uppercase font-mono text-slate-500 px-2 py-1">
                Save & Export As
              </div>

              {/* JPEG Export Option */}
              <button
                onClick={handleExportJPEG}
                className="w-full text-left p-2 rounded-lg hover:bg-slate-800/80 transition-colors flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="font-semibold text-slate-200 block">JPEG Image (.jpg)</span>
                  <span className="text-[10px] text-slate-400">High-Resolution 2X JPEG</span>
                </div>
              </button>

              {/* PNG Export Option */}
              <button
                onClick={handleExportPNG}
                className="w-full text-left p-2 rounded-lg hover:bg-slate-800/80 transition-colors flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="font-semibold text-slate-200 block">PNG Image (.png)</span>
                  <span className="text-[10px] text-slate-400">Lossless Crisp PNG</span>
                </div>
              </button>

              {/* JSON Export Option */}
              <button
                onClick={handleExportJSON}
                className="w-full text-left p-2 rounded-lg hover:bg-slate-800/80 transition-colors flex items-center gap-2"
              >
                <FileCode2 className="w-4 h-4 text-sky-400" />
                <div>
                  <span className="font-semibold text-slate-200 block">JSON Data File (.json)</span>
                  <span className="text-[10px] text-slate-400">Reusable Circuit Netlist</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Rotate selected */}
        {selectedComponentId && (
          <button
            onClick={() => rotateComponent(selectedComponentId)}
            className="bg-slate-800 hover:bg-slate-700 text-sky-400 px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Rotate"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Rotate</span>
          </button>
        )}

        {/* Delete selected component or wire */}
        {(selectedComponentId || selectedWireId) && (
          <button
            onClick={() => {
              if (selectedComponentId) {
                removeComponent(selectedComponentId);
                setSelectedComponent(null);
              }
              if (selectedWireId) {
                removeWire(selectedWireId);
                setSelectedWire(null);
              }
            }}
            className="bg-rose-500/15 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/30 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all active:scale-95 shadow-sm animate-in fade-in"
            title={selectedWireId ? 'Delete Wire (Del)' : 'Delete Component (Del)'}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{selectedWireId ? 'Delete Wire' : 'Delete'}</span>
          </button>
        )}

        {/* Realtime Partnership & Co-Design Button */}
        <button
          onClick={() => setIsCollabOpen(true)}
          className={`text-xs px-2.5 sm:px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-md ${
            isCollaborating
              ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 shadow-emerald-500/10'
              : 'bg-gradient-to-r from-sky-600/30 to-blue-600/30 hover:from-sky-600/40 hover:to-blue-600/40 text-sky-300 border border-sky-500/30'
          }`}
          title="Share in Partnership & Co-Design Live"
        >
          <Users className="w-3.5 h-3.5" />
          {isCollaborating ? (
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Co-Design ({collaborators.length})</span>
            </span>
          ) : (
            <span>Partnership</span>
          )}
        </button>

        {/* Save to Supabase */}
        <button
          onClick={handleSaveCircuit}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
          title="Save Circuit"
        >
          {saveStatus === 'saved' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
          <span className="hidden md:inline">{saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : 'Save'}</span>
        </button>

        {/* Share Circuit Online */}
        <button
          onClick={handleShare}
          className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs px-2.5 sm:px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-lg shadow-sky-500/25 active:scale-95"
          title="Share Circuit Online"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Share2 className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
        </button>
      </div>

      {/* Circuit Partnership & Co-Design Modal */}
      <CircuitCollabModal
        isOpen={isCollabOpen}
        onClose={() => setIsCollabOpen(false)}
      />
    </header>
  );
}
