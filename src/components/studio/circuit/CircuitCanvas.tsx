'use client';

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  ConnectionLineType,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  Zap, 
  Trash2, 
  Plus, 
  RotateCw, 
  Download, 
  Grid3X3, 
  Sparkles, 
  Share2, 
  Copy, 
  Check, 
  Layers, 
  Palette,
  Eye,
  Sliders,
  FileCode2,
  FileImage,
  Undo2,
  Redo2,
  Save,
  MousePointer,
  Move,
  Maximize2,
  FlipHorizontal,
  FolderOpen,
  FilePlus,
  HelpCircle,
  Link2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SchematicSymbolNode } from './SchematicSymbolNode';
import { SchematicSidebar } from './SchematicSidebar';
import { PropertyInspector } from './PropertyInspector';
import { SCHEMATIC_SYMBOLS, SchematicSymbolDef } from '@/lib/constants/schematic-symbols';
import { useRobotStore } from '@/lib/store/robot-store';
import { getSupabaseClient } from '@/lib/supabase/client';

const nodeTypes = {
  schematicSymbol: SchematicSymbolNode,
};

function CircuitCanvasInternal() {
  const reactFlowInstance = useReactFlow();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const title = useRobotStore((state) => state.title);
  const setTitle = useRobotStore((state) => state.setTitle);
  const projectId = useRobotStore((state) => state.projectId);
  const saveProject = useRobotStore((state) => state.saveProject);

  const [wireRouting, setWireRouting] = useState<ConnectionLineType>(ConnectionLineType.SmoothStep);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [gridVariant, setGridVariant] = useState<BackgroundVariant>(BackgroundVariant.Dots);
  const [activeWireColor, setActiveWireColor] = useState<string>('#38BDF8');
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [shareSuccess, setShareSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isNetlistCollapsed, setIsNetlistCollapsed] = useState(false);

  // Initial schematic state
  const initialNodes: Node[] = useMemo(() => {
    return [
      {
        id: 'bt-1',
        type: 'schematicSymbol',
        position: { x: 100, y: 150 },
        data: {
          symbolDef: SCHEMATIC_SYMBOLS.find((s) => s.id === 'battery_dc')!,
          label: 'BT1',
          value: '9V',
          rotation: 0,
        },
      },
      {
        id: 'sw-1',
        type: 'schematicSymbol',
        position: { x: 240, y: 110 },
        data: {
          symbolDef: SCHEMATIC_SYMBOLS.find((s) => s.id === 'switch_spst')!,
          label: 'SW1',
          rotation: 0,
        },
      },
      {
        id: 'r-1',
        type: 'schematicSymbol',
        position: { x: 390, y: 110 },
        data: {
          symbolDef: SCHEMATIC_SYMBOLS.find((s) => s.id === 'resistor')!,
          label: 'R1',
          value: '470',
          unit: 'Ω',
          rotation: 0,
        },
      },
      {
        id: 'led-1',
        type: 'schematicSymbol',
        position: { x: 540, y: 120 },
        data: {
          symbolDef: SCHEMATIC_SYMBOLS.find((s) => s.id === 'led')!,
          label: 'LED1',
          value: 'Red',
          rotation: 90,
          customColor: '#EF4444',
        },
      },
      {
        id: 'gnd-1',
        type: 'schematicSymbol',
        position: { x: 560, y: 260 },
        data: {
          symbolDef: SCHEMATIC_SYMBOLS.find((s) => s.id === 'gnd')!,
          label: 'GND',
          rotation: 0,
        },
      },
    ];
  }, []);

  const initialEdges: Edge[] = useMemo(() => {
    return [
      { id: 'w1', source: 'bt-1', sourceHandle: 'POS', target: 'sw-1', targetHandle: 'p1', type: 'smoothstep', style: { stroke: '#EF4444', strokeWidth: 2.5 } },
      { id: 'w2', source: 'sw-1', sourceHandle: 'p2', target: 'r-1', targetHandle: 'p1', type: 'smoothstep', style: { stroke: '#EF4444', strokeWidth: 2.5 } },
      { id: 'w3', source: 'r-1', sourceHandle: 'p2', target: 'led-1', targetHandle: 'A', type: 'smoothstep', style: { stroke: '#EAB308', strokeWidth: 2.5 } },
      { id: 'w4', source: 'led-1', sourceHandle: 'K', target: 'gnd-1', targetHandle: 'GND', type: 'smoothstep', style: { stroke: '#1F2937', strokeWidth: 2.5 } },
      { id: 'w5', source: 'bt-1', sourceHandle: 'NEG', target: 'gnd-1', targetHandle: 'GND', type: 'smoothstep', style: { stroke: '#1F2937', strokeWidth: 2.5 } },
    ];
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Drag & Drop Handler from Sidebar directly to canvas location
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const symbolId = event.dataTransfer.getData('application/reactflow');
      if (!symbolId) return;

      const symbolDef = SCHEMATIC_SYMBOLS.find((s) => s.id === symbolId);
      if (!symbolDef) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const id = `${symbolDef.id}-${Date.now().toString(36)}`;
      const count = nodes.filter((n) => (n.data as any)?.symbolDef?.id === symbolDef.id).length + 1;
      const label = `${symbolDef.prefix}${count}`;

      const newNode: Node = {
        id,
        type: 'schematicSymbol',
        position,
        data: {
          symbolDef,
          label,
          value: symbolDef.defaultValue,
          unit: symbolDef.defaultUnit,
          rotation: 0,
        },
      };

      setNodes((nds) => [...nds, newNode]);
      setSelectedNodeId(id);
    },
    [reactFlowInstance, nodes, setNodes]
  );

  // Add symbol on click from palette
  const handleAddSymbol = (symbolDef: SchematicSymbolDef) => {
    const id = `${symbolDef.id}-${Date.now().toString(36)}`;
    const count = nodes.filter((n) => (n.data as any)?.symbolDef?.id === symbolDef.id).length + 1;
    const label = `${symbolDef.prefix}${count}`;

    const newNode: Node = {
      id,
      type: 'schematicSymbol',
      position: {
        x: 250 + (Math.random() - 0.5) * 120,
        y: 180 + (Math.random() - 0.5) * 120,
      },
      data: {
        symbolDef,
        label,
        value: symbolDef.defaultValue,
        unit: symbolDef.defaultUnit,
        rotation: 0,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setSelectedNodeId(id);
  };

  // Wire connection
  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;

      const newEdge: Edge = {
        id: `wire-${Date.now().toString(36)}`,
        source: params.source,
        sourceHandle: params.sourceHandle,
        target: params.target,
        targetHandle: params.targetHandle,
        type: wireRouting,
        animated: true,
        style: {
          stroke: activeWireColor,
          strokeWidth: 2.5,
        },
      };

      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, activeWireColor, wireRouting]
  );

  // Update properties
  const handleUpdateNodeData = (nodeId: string, updates: Record<string, any>) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...updates,
            },
          };
        }
        return node;
      })
    );
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    setSelectedNodeId(null);
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  // Keyboard shortcut for Rotate (R) & Delete (Del)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedNodeId) return;
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'SELECT') return;

      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        const node = nodes.find((n) => n.id === selectedNodeId);
        if (node) {
          const currentRot = (node.data as any)?.rotation || 0;
          handleUpdateNodeData(selectedNodeId, { rotation: (currentRot + 90) % 360 });
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        handleDeleteNode(selectedNodeId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, nodes]);

  // Save and generate online share link
  const handleShareCircuit = async () => {
    setIsSaving(true);

    const circuitPayload = {
      id: projectId,
      title: title || 'Electronic Circuit Diagram',
      description: 'Interactive schematic created with Circuit-Diagram EDA Studio.',
      category: 'schematic',
      isPublic: true,
      circuit_data: { nodes, edges },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to LocalStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`circuit_${projectId}`, JSON.stringify(circuitPayload));
      } catch (err) {
        console.error(err);
      }
    }

    // Save to Supabase if connected
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('projects').upsert({
          id: projectId,
          title: title || 'Electronic Circuit Diagram',
          circuit_data: { nodes, edges },
          is_public: true,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Supabase save:', err);
      }
    }

    setIsSaving(false);
    const shareUrl = `${window.location.origin}/share/${projectId}`;
    navigator.clipboard.writeText(shareUrl);
    setShareSuccess(true);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => setShareSuccess(false), 3000);
  };

  const wireColors = [
    { label: '5V / VCC (Red)', color: '#EF4444' },
    { label: '3.3V (Orange)', color: '#F97316' },
    { label: 'GND (Black)', color: '#1F2937' },
    { label: 'Signal (Blue)', color: '#38BDF8' },
    { label: 'PWM (Yellow)', color: '#EAB308' },
    { label: 'I2C/SPI (Green)', color: '#10B981' },
    { label: 'Purple', color: '#8B5CF6' },
  ];

  return (
    <div className={`w-full h-full flex ${themeMode === 'dark' ? 'bg-[#0A0E17]' : 'bg-[#F8FAFC]'} text-white overflow-hidden relative select-none`}>
      {/* Left EDA Component Palette (Drag & Drop support) */}
      <SchematicSidebar onAddSymbol={handleAddSymbol} />

      {/* Main EDA Diagram Canvas */}
      <div ref={reactFlowWrapper} className="flex-1 flex flex-col relative h-full">
        {/* Top Circuit-Diagram.org style Menu & Action Bar */}
        <div className={`h-12 ${themeMode === 'dark' ? 'bg-slate-900/95 border-slate-800' : 'bg-white border-slate-200'} border-b px-4 flex items-center justify-between z-10 text-xs shadow-sm`}>
          <div className="flex items-center gap-3">
            {/* Title */}
            <div className="flex items-center gap-1.5 font-bold text-sky-400 font-mono text-xs">
              <Zap className="w-4 h-4" />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`bg-transparent border border-transparent hover:border-slate-700 focus:border-sky-500 rounded px-1.5 py-0.5 font-bold ${
                  themeMode === 'dark' ? 'text-white' : 'text-slate-900'
                } max-w-[200px] truncate focus:outline-none`}
              />
            </div>

            <div className="h-4 w-px bg-slate-800" />

            {/* Wire Routing Options (90° Manhattan / Bezier / Straight) */}
            <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => setWireRouting(ConnectionLineType.SmoothStep)}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                  wireRouting === ConnectionLineType.SmoothStep
                    ? 'bg-sky-500 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="90-degree Orthogonal Schematic Routing"
              >
                90° Step Wire
              </button>
              <button
                onClick={() => setWireRouting(ConnectionLineType.Bezier)}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                  wireRouting === ConnectionLineType.Bezier
                    ? 'bg-sky-500 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Curved
              </button>
              <button
                onClick={() => setWireRouting(ConnectionLineType.Straight)}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                  wireRouting === ConnectionLineType.Straight
                    ? 'bg-sky-500 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Straight
              </button>
            </div>

            {/* Wire Color Swatches & RGB Custom Color Picker */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              {wireColors.map((item) => (
                <button
                  key={item.color}
                  onClick={() => setActiveWireColor(item.color)}
                  title={item.label}
                  className={`w-4 h-4 rounded-full border border-slate-700 transition-transform ${
                    activeWireColor?.toLowerCase() === item.color.toLowerCase() ? 'ring-2 ring-white scale-110' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: item.color }}
                />
              ))}

              <div className="h-3 w-px bg-slate-800 mx-0.5" />

              {/* RGB Custom Color Picker Button */}
              <label
                className={`relative flex items-center justify-center w-4 h-4 rounded-full cursor-pointer transition-all hover:scale-110 shadow-sm ${
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
                <Palette className="w-2.5 h-2.5 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] pointer-events-none" />
              </label>
            </div>

            {/* Grid Toggle */}
            <button
              onClick={() =>
                setGridVariant(
                  gridVariant === BackgroundVariant.Dots
                    ? BackgroundVariant.Lines
                    : BackgroundVariant.Dots
                )
              }
              className="px-2 py-1 text-slate-300 hover:text-white bg-slate-950 rounded-lg border border-slate-800 flex items-center gap-1 text-[11px]"
              title="Toggle Grid Type"
            >
              <Grid3X3 className="w-3.5 h-3.5 text-sky-400" />
              <span>{gridVariant === BackgroundVariant.Dots ? 'Dots' : 'Grid'}</span>
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Quick Rotate Button when component selected */}
            {selectedNode && (
              <button
                onClick={() => {
                  const currentRot = (selectedNode.data as any)?.rotation || 0;
                  handleUpdateNodeData(selectedNode.id, { rotation: (currentRot + 90) % 360 });
                }}
                className="bg-slate-800 hover:bg-slate-700 text-sky-400 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                title="Rotate Selected Component 90 degrees (R)"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Rotate (R)</span>
              </button>
            )}

            {/* Share Circuit Diagram Online Button */}
            <button
              onClick={handleShareCircuit}
              disabled={isSaving}
              className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-lg shadow-sky-500/25 active:scale-95 disabled:opacity-50"
            >
              {shareSuccess ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{shareSuccess ? 'Link Copied!' : 'Share Circuit Online'}</span>
            </button>

            {/* Clear Canvas */}
            <button
              onClick={() => {
                if (confirm('Clear entire circuit schematic?')) {
                  setNodes([]);
                  setEdges([]);
                  setSelectedNodeId(null);
                }
              }}
              className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-950 hover:bg-rose-500/10 border border-slate-800 rounded-lg transition-colors"
              title="Clear Canvas"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interactive React Flow Circuit Workspace */}
        <div className="flex-1 w-full h-full relative" onDragOver={onDragOver} onDrop={onDrop}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onNodeClick={(_, node) => setSelectedNodeId(node.id)}
            onPaneClick={() => setSelectedNodeId(null)}
            snapToGrid={true}
            snapGrid={[15, 15]}
            connectionLineType={wireRouting}
            connectionLineStyle={{ stroke: activeWireColor, strokeWidth: 2.5 }}
            fitView
            className={themeMode === 'dark' ? 'bg-[#090D16]' : 'bg-[#F8FAFC]'}
          >
            <Background
              variant={gridVariant}
              gap={20}
              size={gridVariant === BackgroundVariant.Dots ? 1.5 : 1}
              color={themeMode === 'dark' ? '#1E293B' : '#CBD5E1'}
            />
            <Controls className="bg-slate-900 border border-slate-800 text-white rounded-xl overflow-hidden shadow-2xl" />
            <MiniMap
              nodeStrokeColor="#38BDF8"
              nodeColor="#1E293B"
              maskColor="rgba(9, 13, 22, 0.8)"
              className="bg-slate-900 border border-slate-800 rounded-xl"
            />
          </ReactFlow>
        </div>

        {/* Netlist Pin Wiring Inspector Footer */}
        {edges.length > 0 && (
          <div
            className={`bg-slate-900/95 border-t border-slate-800 flex flex-col p-2.5 font-mono text-xs overflow-hidden transition-all duration-300 ease-in-out ${
              isNetlistCollapsed ? 'h-9' : 'h-32'
            }`}
          >
            <div
              onClick={() => setIsNetlistCollapsed(!isNetlistCollapsed)}
              className={`flex items-center justify-between text-[11px] text-slate-400 font-bold cursor-pointer hover:text-slate-200 transition-colors ${
                isNetlistCollapsed ? 'pb-0' : 'pb-1 border-b border-slate-800/80'
              }`}
              title={isNetlistCollapsed ? 'Click to expand Netlist' : 'Click to collapse Netlist (View Full Screen)'}
            >
              <span className="flex items-center gap-1 text-sky-400">
                <Zap className="w-3.5 h-3.5" /> Circuit Netlist Wires ({edges.length})
              </span>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-slate-500 font-normal">
                  {isNetlistCollapsed ? 'Click to show wiring details' : 'Drag wires from pin to pin • Click trash to delete'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsNetlistCollapsed(!isNetlistCollapsed);
                  }}
                  className="text-slate-400 hover:text-sky-400 hover:bg-slate-800 px-1.5 py-0.5 rounded flex items-center gap-1 text-[10px]"
                >
                  {isNetlistCollapsed ? (
                    <>
                      <ChevronUp className="w-3.5 h-3.5" />
                      <span>Expand</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3.5 h-3.5" />
                      <span>Collapse</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {!isNetlistCollapsed && (
              <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar pt-1.5 pr-1">
                {edges.map((e) => (
                  <div
                    key={e.id}
                    className="grid grid-cols-12 gap-2 items-center text-[11px] px-2 py-1 bg-slate-950/70 rounded border border-slate-800/80"
                  >
                    <div className="col-span-1">
                      <div
                        className="w-2.5 h-2.5 rounded-full border border-slate-700"
                        style={{ backgroundColor: e.style?.stroke || '#38BDF8' }}
                      />
                    </div>
                    <div className="col-span-4 text-sky-400 font-bold truncate">
                      {e.source} ➔ {e.sourceHandle}
                    </div>
                    <div className="col-span-2 text-center text-slate-600 font-bold">═════</div>
                    <div className="col-span-4 text-amber-400 font-bold truncate">
                      {e.target} ➔ {e.targetHandle}
                    </div>
                    <div className="col-span-1 text-right">
                      <button
                        onClick={() => setEdges((eds) => eds.filter((x) => x.id !== e.id))}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                        title="Cut Wire"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right-Hand Property Inspector for Selected Component */}
      {selectedNode && (
        <PropertyInspector
          selectedNode={selectedNode}
          onUpdateNodeData={handleUpdateNodeData}
          onDeleteNode={handleDeleteNode}
          onClose={() => setSelectedNodeId(null)}
        />
      )}
    </div>
  );
}

export function CircuitCanvas() {
  return (
    <ReactFlowProvider>
      <CircuitCanvasInternal />
    </ReactFlowProvider>
  );
}
