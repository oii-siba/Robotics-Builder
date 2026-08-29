import { create } from 'zustand';
import { 
  PlacedCircuitComponent, 
  CircuitWire, 
  EditorTool, 
  CircuitProjectData,
  Point
} from './types';
import { CIRCUIT_COMPONENTS_LIBRARY } from './components-library';
import { getSupabaseClient } from '../supabase/client';

interface CircuitState {
  projectId: string;
  title: string;
  description: string;
  isPublic: boolean;
  saveStatus: 'saved' | 'saving' | 'unsaved' | 'error';
  lastSavedAt: string | null;

  // Viewport & Grid
  zoom: number;
  pan: { x: number; y: number };
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;

  // Tools & Selection
  activeTool: EditorTool;
  selectedComponentId: string | null;
  selectedWireId: string | null;

  // Canvas Data
  components: PlacedCircuitComponent[];
  wires: CircuitWire[];

  // Interactive Multi-Point Wiring State
  isDrawingWire: boolean;
  wireStart: {
    componentId?: string;
    pinId?: string;
    point?: Point;
    x: number;
    y: number;
  } | null;
  wireWaypoints: Point[]; // User clicked corner waypoints
  mousePos: Point;
  activeWireColor: string;

  // Undo / Redo History
  history: {
    components: PlacedCircuitComponent[];
    wires: CircuitWire[];
  }[];
  historyIndex: number;

  // Actions
  setTitle: (title: string) => void;
  setActiveTool: (tool: EditorTool) => void;
  setActiveWireColor: (color: string) => void;
  setSelectedComponent: (id: string | null) => void;
  setSelectedWire: (id: string | null) => void;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  toggleGrid: () => void;
  toggleSnapToGrid: () => void;

  addComponent: (defId: string, x: number, y: number) => string;
  updateComponentPosition: (instanceId: string, x: number, y: number) => void;
  rotateComponent: (instanceId: string) => void;
  updateComponentLabel: (instanceId: string, label: string) => void;
  removeComponent: (instanceId: string) => void;

  // Wiring Actions
  startWire: (componentId: string, pinId: string, x: number, y: number) => void;
  startWireFromPoint: (x: number, y: number) => void;
  addWireWaypoint: (x: number, y: number) => void;
  updateMousePos: (x: number, y: number) => void;
  completeWire: (componentId: string, pinId: string) => void;
  completeWireAtPoint: (x: number, y: number, targetWireId?: string) => void;
  cancelWire: () => void;
  removeWire: (wireId: string) => void;

  undo: () => void;
  redo: () => void;
  clearCanvas: () => void;
  saveProject: () => Promise<{ success: boolean; id: string }>;
  loadProjectData: (data: CircuitProjectData) => void;
}

const defaultComponents: PlacedCircuitComponent[] = [];
const defaultWires: CircuitWire[] = [];

export const useCircuitStore = create<CircuitState>((set, get) => ({
  projectId: `circuit-${Date.now().toString(36)}`,
  title: 'Untitled Robotics Circuit',
  description: 'Smart robotics schematic with customizable multi-point orthogonal wiring.',
  isPublic: true,
  saveStatus: 'saved',
  lastSavedAt: null,

  zoom: 1,
  pan: { x: 40, y: 30 },
  showGrid: true,
  snapToGrid: true,
  gridSize: 20,

  activeTool: 'select',
  selectedComponentId: null,
  selectedWireId: null,

  components: defaultComponents,
  wires: defaultWires,

  isDrawingWire: false,
  wireStart: null,
  wireWaypoints: [],
  mousePos: { x: 0, y: 0 },
  activeWireColor: '#38BDF8',

  history: [{ components: defaultComponents, wires: defaultWires }],
  historyIndex: 0,

  setTitle: (title) => set({ title, saveStatus: 'unsaved' }),
  setActiveTool: (tool) => set({ activeTool: tool }),
  setActiveWireColor: (color) => set({ activeWireColor: color }),
  setSelectedComponent: (id) => set({ selectedComponentId: id, selectedWireId: null }),
  setSelectedWire: (id) => set({ selectedWireId: id, selectedComponentId: null }),
  setZoom: (zoom) => set({ zoom: Math.max(0.3, Math.min(2.5, zoom)) }),
  setPan: (x, y) => set({ pan: { x, y } }),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleSnapToGrid: () => set((state) => ({ snapToGrid: !state.snapToGrid })),

  addComponent: (defId, x, y) => {
    const state = get();
    const def = CIRCUIT_COMPONENTS_LIBRARY.find((c) => c.id === defId);
    if (!def) return '';

    const count = state.components.filter((c) => c.defId === defId).length + 1;
    const instanceId = `${def.id}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;
    const label = `${def.prefix}-${count}`;

    const snapX = state.snapToGrid ? Math.round(x / state.gridSize) * state.gridSize : x;
    const snapY = state.snapToGrid ? Math.round(y / state.gridSize) * state.gridSize : y;

    const newComp: PlacedCircuitComponent = {
      instanceId,
      defId,
      label,
      x: snapX,
      y: snapY,
      rotation: 0,
    };

    const newComponents = [...state.components, newComp];
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push({ components: newComponents, wires: state.wires });

    set({
      components: newComponents,
      selectedComponentId: instanceId,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      saveStatus: 'unsaved',
    });

    return instanceId;
  },

  updateComponentPosition: (instanceId, x, y) => {
    const state = get();
    const snapX = state.snapToGrid ? Math.round(x / state.gridSize) * state.gridSize : x;
    const snapY = state.snapToGrid ? Math.round(y / state.gridSize) * state.gridSize : y;

    set((s) => ({
      components: s.components.map((c) =>
        c.instanceId === instanceId ? { ...c, x: snapX, y: snapY } : c
      ),
      saveStatus: 'unsaved',
    }));
  },

  rotateComponent: (instanceId) => {
    const state = get();
    set((s) => ({
      components: s.components.map((c) =>
        c.instanceId === instanceId ? { ...c, rotation: (c.rotation + 90) % 360 } : c
      ),
      saveStatus: 'unsaved',
    }));
  },

  updateComponentLabel: (instanceId, label) => {
    set((state) => ({
      components: state.components.map((c) =>
        c.instanceId === instanceId ? { ...c, label } : c
      ),
      saveStatus: 'unsaved',
    }));
  },

  removeComponent: (instanceId) => {
    const state = get();
    const newComponents = state.components.filter((c) => c.instanceId !== instanceId);
    const newWires = state.wires.filter(
      (w) => w.fromComponentId !== instanceId && w.toComponentId !== instanceId
    );

    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push({ components: newComponents, wires: newWires });

    set({
      components: newComponents,
      wires: newWires,
      selectedComponentId: state.selectedComponentId === instanceId ? null : state.selectedComponentId,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      saveStatus: 'unsaved',
    });
  },

  // 1. Start wire from component pin
  startWire: (componentId, pinId, x, y) => {
    set({
      isDrawingWire: true,
      wireStart: { componentId, pinId, x, y },
      wireWaypoints: [],
      mousePos: { x, y },
    });
  },

  // 2. Start wire from an existing wire junction point
  startWireFromPoint: (x, y) => {
    set({
      isDrawingWire: true,
      wireStart: { point: { x, y }, x, y },
      wireWaypoints: [],
      mousePos: { x, y },
    });
  },

  // 3. User clicks on canvas to add a custom bend waypoint
  addWireWaypoint: (x, y) => {
    const state = get();
    if (!state.isDrawingWire) return;
    const snapX = state.snapToGrid ? Math.round(x / state.gridSize) * state.gridSize : x;
    const snapY = state.snapToGrid ? Math.round(y / state.gridSize) * state.gridSize : y;

    set({
      wireWaypoints: [...state.wireWaypoints, { x: snapX, y: snapY }],
    });
  },

  updateMousePos: (x, y) => {
    set({ mousePos: { x, y } });
  },

  // 4. Complete wire at a component pin
  completeWire: (componentId, pinId) => {
    const state = get();
    if (!state.wireStart) return;

    if (state.wireStart.componentId === componentId && state.wireStart.pinId === pinId) {
      set({ isDrawingWire: false, wireStart: null, wireWaypoints: [] });
      return;
    }

    const wireId = `w-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;
    const newWire: CircuitWire = {
      id: wireId,
      fromComponentId: state.wireStart.componentId,
      fromPinId: state.wireStart.pinId,
      fromPoint: state.wireStart.point,
      toComponentId: componentId,
      toPinId: pinId,
      waypoints: state.wireWaypoints,
      color: state.activeWireColor,
      label: `${state.wireStart.pinId || 'Wire'} ➔ ${pinId}`,
    };

    const newWires = [...state.wires, newWire];
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push({ components: state.components, wires: newWires });

    set({
      wires: newWires,
      isDrawingWire: false,
      wireStart: null,
      wireWaypoints: [],
      history: newHistory,
      historyIndex: newHistory.length - 1,
      saveStatus: 'unsaved',
    });
  },

  // 5. Complete wire as a T-Junction on another wire
  completeWireAtPoint: (x, y) => {
    const state = get();
    if (!state.wireStart) return;

    const wireId = `w-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;
    const newWire: CircuitWire = {
      id: wireId,
      fromComponentId: state.wireStart.componentId,
      fromPinId: state.wireStart.pinId,
      fromPoint: state.wireStart.point,
      toPoint: { x, y },
      waypoints: state.wireWaypoints,
      color: state.activeWireColor,
      isJunction: true,
      label: `Tap Junction`,
    };

    const newWires = [...state.wires, newWire];
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push({ components: state.components, wires: newWires });

    set({
      wires: newWires,
      isDrawingWire: false,
      wireStart: null,
      wireWaypoints: [],
      history: newHistory,
      historyIndex: newHistory.length - 1,
      saveStatus: 'unsaved',
    });
  },

  cancelWire: () => {
    set({ isDrawingWire: false, wireStart: null, wireWaypoints: [] });
  },

  removeWire: (wireId) => {
    const state = get();
    const newWires = state.wires.filter((w) => w.id !== wireId);
    set({
      wires: newWires,
      selectedWireId: state.selectedWireId === wireId ? null : state.selectedWireId,
      saveStatus: 'unsaved',
    });
  },

  undo: () => {
    const state = get();
    if (state.historyIndex > 0) {
      const prevIdx = state.historyIndex - 1;
      const snapshot = state.history[prevIdx];
      set({
        components: snapshot.components,
        wires: snapshot.wires,
        historyIndex: prevIdx,
        saveStatus: 'unsaved',
      });
    }
  },

  redo: () => {
    const state = get();
    if (state.historyIndex < state.history.length - 1) {
      const nextIdx = state.historyIndex + 1;
      const snapshot = state.history[nextIdx];
      set({
        components: snapshot.components,
        wires: snapshot.wires,
        historyIndex: nextIdx,
        saveStatus: 'unsaved',
      });
    }
  },

  clearCanvas: () => {
    set({
      components: [],
      wires: [],
      selectedComponentId: null,
      selectedWireId: null,
      saveStatus: 'unsaved',
    });
  },

  saveProject: async () => {
    const state = get();
    set({ saveStatus: 'saving' });

    const payload: CircuitProjectData = {
      id: state.projectId,
      title: state.title,
      description: state.description,
      components: state.components,
      wires: state.wires,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`circuit_${state.projectId}`, JSON.stringify(payload));
      } catch (err) {
        console.error(err);
      }
    }

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('projects').upsert({
          id: state.projectId,
          title: state.title,
          circuit_data: { components: state.components, wires: state.wires },
          is_public: state.isPublic,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Supabase save warning:', err);
      }
    }

    set({ 
      saveStatus: 'saved',
      lastSavedAt: new Date().toLocaleTimeString()
    });

    return { success: true, id: state.projectId };
  },

  loadProjectData: (data) => {
    set({
      projectId: data.id,
      title: data.title,
      description: data.description || '',
      components: data.components || [],
      wires: data.wires || [],
      history: [{ components: data.components || [], wires: data.wires || [] }],
      historyIndex: 0,
      saveStatus: 'saved',
    });
  },
}));
