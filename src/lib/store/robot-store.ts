import { create } from 'zustand';
import { PlacedPart, WireConnection, CodeData, RobotProject } from '../types/robot';
import { ROBOT_PARTS_CATALOG } from '../constants/robot-parts';
import { PRESET_PROJECTS } from '../constants/preset-templates';
import { getSupabaseClient } from '../supabase/client';

export type StudioTab = '3d-workbench' | 'circuit-wiring' | 'firmware-code' | 'bom-specs' | 'simulation';
export type TransformMode = 'translate' | 'rotate' | 'scale';

interface RobotStudioState {
  // Project Info
  projectId: string;
  title: string;
  description: string;
  category: string;
  isPublic: boolean;
  saveStatus: 'saved' | 'saving' | 'unsaved' | 'error';
  lastSavedAt: string | null;

  // Active UI
  activeTab: StudioTab;
  setActiveTab: (tab: StudioTab) => void;

  // 3D Scene
  parts: PlacedPart[];
  selectedPartId: string | null;
  transformMode: TransformMode;
  gridSnap: number; // 0 for off, 0.1, 0.25, 0.5
  isWireframe: boolean;
  cameraView: 'perspective' | 'top' | 'front' | 'side' | 'isometric';

  // 3D Actions
  addPart: (partId: string, customPos?: [number, number, number]) => string;
  updatePartTransform: (
    instanceId: string, 
    position?: [number, number, number], 
    rotation?: [number, number, number], 
    scale?: [number, number, number]
  ) => void;
  updatePartColor: (instanceId: string, color: string) => void;
  removePart: (instanceId: string) => void;
  duplicatePart: (instanceId: string) => void;
  selectPart: (instanceId: string | null) => void;
  setTransformMode: (mode: TransformMode) => void;
  setGridSnap: (snap: number) => void;
  toggleWireframe: () => void;
  setCameraView: (view: 'perspective' | 'top' | 'front' | 'side' | 'isometric') => void;

  // Circuit Wiring
  wires: WireConnection[];
  activeWireColor: string;
  setActiveWireColor: (color: string) => void;
  addWire: (wire: Omit<WireConnection, 'id'>) => void;
  removeWire: (wireId: string) => void;

  // Firmware Code
  codeData: CodeData;
  setCode: (code: string) => void;
  setCodeLanguage: (lang: 'cpp' | 'python') => void;
  setFileName: (name: string) => void;

  // Project Management
  setTitle: (title: string) => void;
  setDescription: (desc: string) => void;
  setIsPublic: (isPublic: boolean) => void;
  loadProject: (project: RobotProject) => void;
  loadPreset: (presetId: string) => void;
  resetProject: () => void;
  saveProject: () => Promise<{ success: boolean; id: string; error?: string }>;
}

const defaultProject = PRESET_PROJECTS[0];

export const useRobotStore = create<RobotStudioState>((set, get) => ({
  projectId: defaultProject.id,
  title: defaultProject.title,
  description: defaultProject.description,
  category: defaultProject.category,
  isPublic: true,
  saveStatus: 'saved',
  lastSavedAt: new Date().toLocaleTimeString(),

  activeTab: '3d-workbench',
  setActiveTab: (tab) => set({ activeTab: tab }),

  parts: defaultProject.parts,
  selectedPartId: 'chassis-1',
  transformMode: 'translate',
  gridSnap: 0.1,
  isWireframe: false,
  cameraView: 'perspective',

  addPart: (partId, customPos) => {
    const catalogItem = ROBOT_PARTS_CATALOG.find((p) => p.id === partId);
    const instanceId = `${partId}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    
    // Calculate a good placement position if not provided
    const newPos: [number, number, number] = customPos || [
      (Math.random() - 0.5) * 0.5,
      0.5,
      (Math.random() - 0.5) * 0.5,
    ];

    const newPart: PlacedPart = {
      instanceId,
      partId,
      name: catalogItem ? catalogItem.name : 'Component',
      position: newPos,
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: catalogItem?.defaultColor,
    };

    set((state) => ({
      parts: [...state.parts, newPart],
      selectedPartId: instanceId,
      saveStatus: 'unsaved',
    }));

    return instanceId;
  },

  updatePartTransform: (instanceId, position, rotation, scale) => {
    set((state) => ({
      parts: state.parts.map((part) => {
        if (part.instanceId !== instanceId) return part;
        return {
          ...part,
          position: position ?? part.position,
          rotation: rotation ?? part.rotation,
          scale: scale ?? part.scale,
        };
      }),
      saveStatus: 'unsaved',
    }));
  },

  updatePartColor: (instanceId, color) => {
    set((state) => ({
      parts: state.parts.map((part) => 
        part.instanceId === instanceId ? { ...part, color } : part
      ),
      saveStatus: 'unsaved',
    }));
  },

  removePart: (instanceId) => {
    set((state) => ({
      parts: state.parts.filter((p) => p.instanceId !== instanceId),
      wires: state.wires.filter(
        (w) => w.sourceInstanceId !== instanceId && w.targetInstanceId !== instanceId
      ),
      selectedPartId: state.selectedPartId === instanceId ? null : state.selectedPartId,
      saveStatus: 'unsaved',
    }));
  },

  duplicatePart: (instanceId) => {
    const part = get().parts.find((p) => p.instanceId === instanceId);
    if (!part) return;

    const newInstanceId = `${part.partId}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const duplicated: PlacedPart = {
      ...part,
      instanceId: newInstanceId,
      name: `${part.name} (Copy)`,
      position: [part.position[0] + 0.2, part.position[1] + 0.1, part.position[2] + 0.2],
    };

    set((state) => ({
      parts: [...state.parts, duplicated],
      selectedPartId: newInstanceId,
      saveStatus: 'unsaved',
    }));
  },

  selectPart: (instanceId) => set({ selectedPartId: instanceId }),
  setTransformMode: (mode) => set({ transformMode: mode }),
  setGridSnap: (snap) => set({ gridSnap: snap }),
  toggleWireframe: () => set((state) => ({ isWireframe: !state.isWireframe })),
  setCameraView: (view) => set({ cameraView: view }),

  // Circuit Wiring
  wires: defaultProject.wires,
  activeWireColor: '#EF4444',
  setActiveWireColor: (color) => set({ activeWireColor: color }),

  addWire: (wire) => {
    const id = `wire-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;
    set((state) => ({
      wires: [...state.wires, { ...wire, id }],
      saveStatus: 'unsaved',
    }));
  },

  removeWire: (wireId) => {
    set((state) => ({
      wires: state.wires.filter((w) => w.id !== wireId),
      saveStatus: 'unsaved',
    }));
  },

  // Firmware Code
  codeData: defaultProject.code,
  setCode: (code) => {
    set((state) => ({
      codeData: { ...state.codeData, code },
      saveStatus: 'unsaved',
    }));
  },
  setCodeLanguage: (language) => {
    set((state) => ({
      codeData: { ...state.codeData, language },
      saveStatus: 'unsaved',
    }));
  },
  setFileName: (fileName) => {
    set((state) => ({
      codeData: { ...state.codeData, fileName },
      saveStatus: 'unsaved',
    }));
  },

  // Project Management
  setTitle: (title) => set({ title, saveStatus: 'unsaved' }),
  setDescription: (description) => set({ description, saveStatus: 'unsaved' }),
  setIsPublic: (isPublic) => set({ isPublic, saveStatus: 'unsaved' }),

  loadProject: (project) => {
    set({
      projectId: project.id,
      title: project.title,
      description: project.description,
      category: project.category,
      isPublic: project.isPublic,
      parts: project.parts || [],
      wires: project.wires || [],
      codeData: project.code || {
        language: 'cpp',
        fileName: 'main.ino',
        code: '// Arduino firmware\nvoid setup() {}\nvoid loop() {}',
      },
      selectedPartId: project.parts?.[0]?.instanceId || null,
      saveStatus: 'saved',
    });
  },

  loadPreset: (presetId) => {
    const preset = PRESET_PROJECTS.find((p) => p.id === presetId);
    if (preset) {
      get().loadProject(preset);
    }
  },

  resetProject: () => {
    const newId = `robot-${Date.now().toString(36)}`;
    set({
      projectId: newId,
      title: 'New Robotic Build',
      description: 'Custom modular robotics creation assembled in RoboCraft Studio.',
      category: 'custom',
      isPublic: true,
      parts: [],
      wires: [],
      codeData: {
        language: 'cpp',
        fileName: 'RobotFirmware.ino',
        code: '// Start coding your robot firmware\nvoid setup() {\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  // your control loop\n}',
      },
      selectedPartId: null,
      saveStatus: 'unsaved',
    });
  },

  saveProject: async () => {
    const state = get();
    set({ saveStatus: 'saving' });

    const currentProject: RobotProject = {
      id: state.projectId,
      title: state.title,
      description: state.description,
      category: state.category,
      isPublic: state.isPublic,
      parts: state.parts,
      wires: state.wires,
      code: state.codeData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to LocalStorage as instant backup
    if (typeof window !== 'undefined') {
      try {
        const savedProjectsRaw = localStorage.getItem('robocraft_local_projects') || '[]';
        const savedProjects: RobotProject[] = JSON.parse(savedProjectsRaw);
        const existingIdx = savedProjects.findIndex((p) => p.id === state.projectId);
        if (existingIdx >= 0) {
          savedProjects[existingIdx] = currentProject;
        } else {
          savedProjects.unshift(currentProject);
        }
        localStorage.setItem('robocraft_local_projects', JSON.stringify(savedProjects));
      } catch (err) {
        console.error('LocalStorage save error:', err);
      }
    }

    // Attempt Supabase Sync if configured
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase.from('projects').upsert({
          id: state.projectId,
          title: state.title,
          description: state.description,
          category: state.category,
          is_public: state.isPublic,
          model_data: { parts: state.parts },
          circuit_data: { wires: state.wires },
          code_data: state.codeData,
          updated_at: new Date().toISOString(),
        });

        if (error) {
          console.warn('Supabase sync warning:', error.message);
        }
      } catch (err) {
        console.warn('Supabase save error:', err);
      }
    }

    set({ 
      saveStatus: 'saved',
      lastSavedAt: new Date().toLocaleTimeString(),
    });

    return { success: true, id: state.projectId };
  },
}));
