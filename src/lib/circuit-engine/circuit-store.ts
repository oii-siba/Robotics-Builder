import { create } from 'zustand';
import { 
  PlacedCircuitComponent, 
  CircuitWire, 
  EditorTool, 
  CircuitProjectData,
  Point,
  Collaborator,
  CollabRole,
} from './types';
import { CIRCUIT_COMPONENTS_LIBRARY } from './components-library';
import { getSupabaseClient } from '../supabase/client';
import { collabSyncService, generateCollabUser } from './collab-sync';

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

  // Realtime Partnership & Collaboration
  isCollaborating: boolean;
  collabRoomId: string | null;
  collabRole: CollabRole;
  myCollabUser: Collaborator | null;
  collaborators: Collaborator[];

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
  setZoomAndPan: (zoom: number, pan: { x: number; y: number }) => void;
  fitToScreen: (containerWidth: number, containerHeight: number) => void;
  toggleGrid: () => void;
  toggleSnapToGrid: () => void;

  // Realtime Collaboration Actions
  startCollaboration: (roomId?: string, role?: CollabRole) => string;
  joinCollaboration: (roomId: string, role?: CollabRole) => void;
  leaveCollaboration: () => void;
  updateMyCursor: (x: number, y: number, activeComponentId?: string | null) => void;

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

  isCollaborating: false,
  collabRoomId: null,
  collabRole: 'editor',
  myCollabUser: null,
  collaborators: [],

  history: [{ components: defaultComponents, wires: defaultWires }],
  historyIndex: 0,

  setTitle: (title) => set({ title, saveStatus: 'unsaved' }),
  setActiveTool: (tool) => set({ activeTool: tool }),
  setActiveWireColor: (color) => set({ activeWireColor: color }),
  setSelectedComponent: (id) => set({ selectedComponentId: id, selectedWireId: null }),
  setSelectedWire: (id) => set({ selectedWireId: id, selectedComponentId: null }),
  setZoom: (zoom) => set({ zoom: Math.max(0.2, Math.min(3.0, Number(zoom.toFixed(3)))) }),
  setPan: (x, y) => set({ pan: { x: Math.round(x), y: Math.round(y) } }),
  setZoomAndPan: (zoom, pan) =>
    set({
      zoom: Math.max(0.2, Math.min(3.0, Number(zoom.toFixed(3)))),
      pan: { x: Math.round(pan.x), y: Math.round(pan.y) },
    }),
  fitToScreen: (containerWidth, containerHeight) => {
    const { components } = get();
    if (components.length === 0) {
      set({ zoom: 1, pan: { x: 40, y: 30 } });
      return;
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    components.forEach((comp) => {
      const def = CIRCUIT_COMPONENTS_LIBRARY.find((c) => c.id === comp.defId);
      const w = def?.width || 80;
      const h = def?.height || 80;
      minX = Math.min(minX, comp.x);
      minY = Math.min(minY, comp.y);
      maxX = Math.max(maxX, comp.x + w);
      maxY = Math.max(maxY, comp.y + h);
    });

    const contentWidth = Math.max(maxX - minX, 120);
    const contentHeight = Math.max(maxY - minY, 120);
    const padding = 80;

    const availableWidth = Math.max(containerWidth - padding * 2, 200);
    const availableHeight = Math.max(containerHeight - padding * 2, 200);

    const scaleX = availableWidth / contentWidth;
    const scaleY = availableHeight / contentHeight;
    const targetZoom = Math.max(0.25, Math.min(1.5, Math.min(scaleX, scaleY)));

    const contentCenterX = minX + contentWidth / 2;
    const contentCenterY = minY + contentHeight / 2;

    const newPanX = containerWidth / 2 - contentCenterX * targetZoom;
    const newPanY = containerHeight / 2 - contentCenterY * targetZoom;

    set({
      zoom: Math.max(0.2, Math.min(3.0, Number(targetZoom.toFixed(3)))),
      pan: { x: Math.round(newPanX), y: Math.round(newPanY) },
    });
  },
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleSnapToGrid: () => set((state) => ({ snapToGrid: !state.snapToGrid })),

  // Realtime Collaboration Actions
  startCollaboration: (customRoomId, role = 'editor') => {
    const state = get();
    const rawId = state.projectId.replace(/^circuit-/, '');
    const roomId = customRoomId || state.collabRoomId || `collab-${rawId.slice(0, 8)}`;
    const user = generateCollabUser(role, true);

    collabSyncService.initRoom(roomId, user);

    set({
      isCollaborating: true,
      collabRoomId: roomId,
      collabRole: role,
      myCollabUser: user,
      collaborators: [user],
    });

    return roomId;
  },

  joinCollaboration: (roomId, role = 'editor') => {
    const user = generateCollabUser(role, false);
    collabSyncService.initRoom(roomId, user);

    set({
      isCollaborating: true,
      collabRoomId: roomId,
      collabRole: role,
      myCollabUser: user,
      collaborators: [user],
    });

    collabSyncService.broadcast({
      type: 'request_sync',
      senderId: user.id,
      senderName: user.name,
      senderColor: user.color,
      roomId,
      timestamp: Date.now(),
    });
  },

  leaveCollaboration: () => {
    collabSyncService.leaveRoom();
    set({
      isCollaborating: false,
      collabRoomId: null,
      myCollabUser: null,
      collaborators: [],
    });
  },

  updateMyCursor: (x, y, activeComponentId = null) => {
    const state = get();
    if (!state.isCollaborating || !state.myCollabUser || !state.collabRoomId) return;

    collabSyncService.broadcast({
      type: 'cursor_move',
      senderId: state.myCollabUser.id,
      senderName: state.myCollabUser.name,
      senderColor: state.myCollabUser.color,
      roomId: state.collabRoomId,
      payload: { x, y, activeComponentId },
      timestamp: Date.now(),
    });
  },

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

    if (state.isCollaborating && state.collabRole === 'editor' && state.myCollabUser && state.collabRoomId) {
      collabSyncService.broadcast({
        type: 'component_add',
        senderId: state.myCollabUser.id,
        senderName: state.myCollabUser.name,
        senderColor: state.myCollabUser.color,
        roomId: state.collabRoomId,
        payload: { component: newComp },
        timestamp: Date.now(),
      });
    }

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

    if (state.isCollaborating && state.collabRole === 'editor' && state.myCollabUser && state.collabRoomId) {
      collabSyncService.broadcast({
        type: 'component_move',
        senderId: state.myCollabUser.id,
        senderName: state.myCollabUser.name,
        senderColor: state.myCollabUser.color,
        roomId: state.collabRoomId,
        payload: { instanceId, x: snapX, y: snapY },
        timestamp: Date.now(),
      });
    }
  },

  rotateComponent: (instanceId) => {
    const state = get();
    set((s) => ({
      components: s.components.map((c) =>
        c.instanceId === instanceId ? { ...c, rotation: (c.rotation + 90) % 360 } : c
      ),
      saveStatus: 'unsaved',
    }));

    if (state.isCollaborating && state.collabRole === 'editor' && state.myCollabUser && state.collabRoomId) {
      collabSyncService.broadcast({
        type: 'component_rotate',
        senderId: state.myCollabUser.id,
        senderName: state.myCollabUser.name,
        senderColor: state.myCollabUser.color,
        roomId: state.collabRoomId,
        payload: { instanceId },
        timestamp: Date.now(),
      });
    }
  },

  updateComponentLabel: (instanceId, label) => {
    const state = get();
    set((s) => ({
      components: s.components.map((c) =>
        c.instanceId === instanceId ? { ...c, label } : c
      ),
      saveStatus: 'unsaved',
    }));

    if (state.isCollaborating && state.collabRole === 'editor' && state.myCollabUser && state.collabRoomId) {
      collabSyncService.broadcast({
        type: 'component_label',
        senderId: state.myCollabUser.id,
        senderName: state.myCollabUser.name,
        senderColor: state.myCollabUser.color,
        roomId: state.collabRoomId,
        payload: { instanceId, label },
        timestamp: Date.now(),
      });
    }
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

    if (state.isCollaborating && state.collabRole === 'editor' && state.myCollabUser && state.collabRoomId) {
      collabSyncService.broadcast({
        type: 'component_delete',
        senderId: state.myCollabUser.id,
        senderName: state.myCollabUser.name,
        senderColor: state.myCollabUser.color,
        roomId: state.collabRoomId,
        payload: { instanceId },
        timestamp: Date.now(),
      });
    }
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

    if (state.isCollaborating && state.collabRole === 'editor' && state.myCollabUser && state.collabRoomId) {
      collabSyncService.broadcast({
        type: 'wire_add',
        senderId: state.myCollabUser.id,
        senderName: state.myCollabUser.name,
        senderColor: state.myCollabUser.color,
        roomId: state.collabRoomId,
        payload: { wire: newWire },
        timestamp: Date.now(),
      });
    }
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

    if (state.isCollaborating && state.collabRole === 'editor' && state.myCollabUser && state.collabRoomId) {
      collabSyncService.broadcast({
        type: 'wire_add',
        senderId: state.myCollabUser.id,
        senderName: state.myCollabUser.name,
        senderColor: state.myCollabUser.color,
        roomId: state.collabRoomId,
        payload: { wire: newWire },
        timestamp: Date.now(),
      });
    }
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

    if (state.isCollaborating && state.collabRole === 'editor' && state.myCollabUser && state.collabRoomId) {
      collabSyncService.broadcast({
        type: 'wire_delete',
        senderId: state.myCollabUser.id,
        senderName: state.myCollabUser.name,
        senderColor: state.myCollabUser.color,
        roomId: state.collabRoomId,
        payload: { wireId },
        timestamp: Date.now(),
      });
    }
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
    const state = get();
    set({
      components: [],
      wires: [],
      selectedComponentId: null,
      selectedWireId: null,
      saveStatus: 'unsaved',
    });

    if (state.isCollaborating && state.collabRole === 'editor' && state.myCollabUser && state.collabRoomId) {
      collabSyncService.broadcast({
        type: 'canvas_clear',
        senderId: state.myCollabUser.id,
        senderName: state.myCollabUser.name,
        senderColor: state.myCollabUser.color,
        roomId: state.collabRoomId,
        timestamp: Date.now(),
      });
    }
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

// Setup Global Collab Message Subscriber
collabSyncService.onMessage((msg) => {
  const store = useCircuitStore.getState();
  if (!store.isCollaborating || msg.roomId !== store.collabRoomId) return;

  switch (msg.type) {
    case 'presence_join': {
      const newUser = msg.payload?.user;
      if (!newUser || newUser.id === store.myCollabUser?.id) return;
      const currentList = store.collaborators.filter((c) => c.id !== newUser.id);
      useCircuitStore.setState({ collaborators: [...currentList, newUser] });

      // If we have content and are host/editor, broadcast full state to help newcomer sync
      if (store.components.length > 0 || store.wires.length > 0) {
        collabSyncService.broadcast({
          type: 'full_sync',
          senderId: store.myCollabUser?.id || 'host',
          senderName: store.myCollabUser?.name || 'Host',
          senderColor: store.myCollabUser?.color || '#38BDF8',
          roomId: store.collabRoomId,
          payload: {
            components: store.components,
            wires: store.wires,
            title: store.title,
          },
          timestamp: Date.now(),
        });
      }
      break;
    }

    case 'presence_heartbeat': {
      const user = msg.payload?.user;
      if (!user || user.id === store.myCollabUser?.id) return;
      const exists = store.collaborators.some((c) => c.id === user.id);
      if (exists) {
        useCircuitStore.setState((s) => ({
          collaborators: s.collaborators.map((c) =>
            c.id === user.id ? { ...c, lastActive: Date.now(), name: user.name, color: user.color } : c
          ),
        }));
      } else {
        useCircuitStore.setState((s) => ({
          collaborators: [...s.collaborators, user],
        }));
      }
      break;
    }

    case 'presence_leave': {
      useCircuitStore.setState((s) => ({
        collaborators: s.collaborators.filter((c) => c.id !== msg.senderId),
      }));
      break;
    }

    case 'cursor_move': {
      const { x, y, activeComponentId } = msg.payload || {};
      useCircuitStore.setState((s) => ({
        collaborators: s.collaborators.map((c) =>
          c.id === msg.senderId
            ? { ...c, cursor: { x, y }, activeComponentId, lastActive: Date.now() }
            : c
        ),
      }));
      break;
    }

    case 'component_add': {
      const comp = msg.payload?.component;
      if (comp && !store.components.some((c) => c.instanceId === comp.instanceId)) {
        useCircuitStore.setState((s) => ({
          components: [...s.components, comp],
          saveStatus: 'unsaved',
        }));
      }
      break;
    }

    case 'component_move': {
      const { instanceId, x, y } = msg.payload || {};
      if (instanceId) {
        useCircuitStore.setState((s) => ({
          components: s.components.map((c) => (c.instanceId === instanceId ? { ...c, x, y } : c)),
          saveStatus: 'unsaved',
        }));
      }
      break;
    }

    case 'component_rotate': {
      const { instanceId } = msg.payload || {};
      if (instanceId) {
        useCircuitStore.setState((s) => ({
          components: s.components.map((c) =>
            c.instanceId === instanceId ? { ...c, rotation: (c.rotation + 90) % 360 } : c
          ),
          saveStatus: 'unsaved',
        }));
      }
      break;
    }

    case 'component_label': {
      const { instanceId, label } = msg.payload || {};
      if (instanceId) {
        useCircuitStore.setState((s) => ({
          components: s.components.map((c) => (c.instanceId === instanceId ? { ...c, label } : c)),
          saveStatus: 'unsaved',
        }));
      }
      break;
    }

    case 'component_delete': {
      const { instanceId } = msg.payload || {};
      if (instanceId) {
        useCircuitStore.setState((s) => ({
          components: s.components.filter((c) => c.instanceId !== instanceId),
          wires: s.wires.filter(
            (w) => w.fromComponentId !== instanceId && w.toComponentId !== instanceId
          ),
          saveStatus: 'unsaved',
        }));
      }
      break;
    }

    case 'wire_add': {
      const wire = msg.payload?.wire;
      if (wire && !store.wires.some((w) => w.id === wire.id)) {
        useCircuitStore.setState((s) => ({
          wires: [...s.wires, wire],
          saveStatus: 'unsaved',
        }));
      }
      break;
    }

    case 'wire_delete': {
      const { wireId } = msg.payload || {};
      if (wireId) {
        useCircuitStore.setState((s) => ({
          wires: s.wires.filter((w) => w.id !== wireId),
          saveStatus: 'unsaved',
        }));
      }
      break;
    }

    case 'canvas_clear': {
      useCircuitStore.setState({
        components: [],
        wires: [],
        selectedComponentId: null,
        selectedWireId: null,
        saveStatus: 'unsaved',
      });
      break;
    }

    case 'request_sync': {
      if (store.components.length > 0 || store.wires.length > 0) {
        collabSyncService.broadcast({
          type: 'full_sync',
          senderId: store.myCollabUser?.id || 'host',
          senderName: store.myCollabUser?.name || 'Host',
          senderColor: store.myCollabUser?.color || '#38BDF8',
          roomId: store.collabRoomId,
          payload: {
            components: store.components,
            wires: store.wires,
            title: store.title,
          },
          timestamp: Date.now(),
        });
      }
      break;
    }

    case 'full_sync': {
      const { components, wires, title } = msg.payload || {};
      if (components && Array.isArray(components)) {
        useCircuitStore.setState({
          components,
          wires: wires || [],
          title: title || store.title,
        });
      }
      break;
    }
  }
});
