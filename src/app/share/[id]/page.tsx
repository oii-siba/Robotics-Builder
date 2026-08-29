'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, ContactShadows } from '@react-three/drei';
import {
  Bot,
  Zap,
  Code2,
  Package,
  Share2,
  Copy,
  Check,
  ArrowLeft,
  Edit3,
  Box,
  Layers,
  Sparkles,
  Download,
  FileCode2,
  Image as ImageIcon,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RobotProject, PlacedPart } from '@/lib/types/robot';
import { ROBOT_PARTS_CATALOG } from '@/lib/constants/robot-parts';
import { PartMesh } from '@/components/studio/3d/PartMesh';
import { useRobotStore } from '@/lib/store/robot-store';
import { useCircuitStore } from '@/lib/circuit-engine/circuit-store';
import { SvgComponentRenderer } from '@/components/circuit-editor/SvgComponentRenderer';
import { getSupabaseClient } from '@/lib/supabase/client';

interface SharePageProps {
  params: Promise<{ id: string }>;
}

export default function SharePage({ params }: SharePageProps) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  const router = useRouter();

  const loadProjectIntoStore = useRobotStore((state) => state.loadProject);
  const loadCircuitIntoStore = useCircuitStore((state) => state.loadProjectData);

  const [activeTab, setActiveTab] = useState<'3d' | 'circuit' | 'code' | 'bom'>('3d');
  const [activeProject, setActiveProject] = useState<any | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch project from Supabase or LocalStorage
  useEffect(() => {
    async function fetchProject() {
      setIsLoading(true);

      // 1. Try Supabase
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .single();

          if (data && !error) {
            const projectData = {
              id: data.id,
              title: data.title || 'Robotics CAD Project',
              description: data.description || '',
              category: data.category || 'custom',
              isPublic: true,
              parts: data.model_data?.parts || [],
              wires: data.circuit_data?.wires || [],
              components: data.circuit_data?.components || [],
              code: data.code_data || { language: 'cpp', code: '// RoboCraft Firmware\nvoid setup() {}\nvoid loop() {}' },
              createdAt: data.created_at,
              updatedAt: data.updated_at,
            };
            setActiveProject(projectData);
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Supabase fetch:', err);
        }
      }

      // 2. Try LocalStorage
      if (typeof window !== 'undefined') {
        const storedCircuit = localStorage.getItem(`circuit_${projectId}`);
        if (storedCircuit) {
          try {
            const parsed = JSON.parse(storedCircuit);
            setActiveProject({
              id: parsed.id,
              title: parsed.title,
              description: parsed.description,
              isPublic: true,
              parts: [],
              components: parsed.components || [],
              wires: parsed.wires || [],
              createdAt: parsed.createdAt,
              updatedAt: parsed.updatedAt,
            });
            setActiveTab('circuit');
            setIsLoading(false);
            return;
          } catch (e) {
            console.error(e);
          }
        }

        const storedProject = localStorage.getItem(`robot_project_${projectId}`);
        if (storedProject) {
          try {
            setActiveProject(JSON.parse(storedProject));
            setIsLoading(false);
            return;
          } catch (e) {
            console.error(e);
          }
        }
      }

      // 3. Fallback default project
      setActiveProject({
        id: projectId,
        title: 'Obstacle Avoiding Rover Robot',
        description: 'ESP32 controlled autonomous rover with ultrasonic obstacle detection.',
        parts: [
          { instanceId: 'esp32-1', partId: 'esp32_devkit_v1', name: 'ESP32 DevKit', position: [0, 0.5, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
          { instanceId: 'l298n-1', partId: 'driver_l298n', name: 'L298N Driver', position: [0, 0.5, -1.2], rotation: [0, 0, 0], scale: [1, 1, 1] },
          { instanceId: 'chassis-1', partId: 'chassis_2wd_acrylic', name: '2WD Chassis', position: [0, 0.1, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
          { instanceId: 'sonar-1', partId: 'sensor_ultrasonic_hcsr04', name: 'HC-SR04', position: [0, 0.7, 1.3], rotation: [0, 0, 0], scale: [1, 1, 1] },
        ],
        components: [
          { instanceId: 'esp32-1', defId: 'esp32_devkit', label: 'ESP32', x: 200, y: 100, rotation: 0 },
          { instanceId: 'l298n-1', defId: 'l298n_driver', label: 'L298N', x: 520, y: 110, rotation: 0 },
        ],
        wires: [
          { id: 'w1', fromComponentId: 'esp32-1', fromPinId: 'D25', toComponentId: 'l298n-1', toPinId: 'IN1', color: '#38BDF8', label: 'GPIO25 ➔ IN1' },
          { id: 'w2', fromComponentId: 'esp32-1', fromPinId: 'D26', toComponentId: 'l298n-1', toPinId: 'IN2', color: '#38BDF8', label: 'GPIO26 ➔ IN2' },
        ],
        code: {
          language: 'cpp',
          fileName: 'ObstacleAvoidance.ino',
          code: `// RoboCraft Autonomous Rover\n#define TRIG_PIN 13\n#define ECHO_PIN 12\n\nvoid setup() {\n  Serial.begin(115200);\n  pinMode(TRIG_PIN, OUTPUT);\n  pinMode(ECHO_PIN, INPUT);\n}\n\nvoid loop() {\n  // Sonar sweep distance detection\n  digitalWrite(TRIG_PIN, LOW);\n  delayMicroseconds(2);\n  digitalWrite(TRIG_PIN, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(TRIG_PIN, LOW);\n  long duration = pulseIn(ECHO_PIN, HIGH);\n  long distance = duration * 0.034 / 2;\n  Serial.println(distance);\n  delay(100);\n}`,
        },
      });
      setIsLoading(false);
    }

    fetchProject();
  }, [projectId]);

  const handleCopyShareUrl = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      confetti({ particleCount: 60, spread: 60 });
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCloneToStudio = () => {
    if (!activeProject) return;
    if (activeProject.parts && activeProject.parts.length > 0) {
      loadProjectIntoStore(activeProject);
    }
    if (activeProject.components && activeProject.components.length > 0) {
      loadCircuitIntoStore({
        id: activeProject.id,
        title: activeProject.title,
        description: activeProject.description,
        components: activeProject.components,
        wires: activeProject.wires || [],
        createdAt: activeProject.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    router.push('/studio');
  };

  const handleExportJSON = () => {
    if (!activeProject) return;
    const blob = new Blob([JSON.stringify(activeProject, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeProject.title.replace(/\s+/g, '_')}_Circuit.json`;
    a.click();
    URL.revokeObjectURL(url);
    confetti({ particleCount: 50, spread: 60 });
  };

  if (isLoading || !activeProject) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-slate-950 text-white font-mono text-xs">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
          <span>Loading Robotics Project...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* Top Banner */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 z-20 shadow-md">
        <div className="flex items-center gap-3">
          <Link
            href="/studio"
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Studio</span>
          </Link>

          <div className="h-4 w-px bg-slate-800" />

          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Robotics Builder Logo"
              className="w-8 h-8 rounded-xl object-contain bg-white/5 border border-sky-500/30 p-0.5 shadow-md shadow-sky-500/20"
            />
            <div>
              <h1 className="text-xs sm:text-sm font-bold text-white leading-none">
                {activeProject.title}
              </h1>
              <span className="text-[10px] text-emerald-400 font-mono">
                ● Robotics Builder Showcase
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
            title="Download JSON File"
          >
            <FileCode2 className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Download JSON</span>
          </button>

          <button
            onClick={handleCopyShareUrl}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share Link'}</span>
          </button>

          <button
            onClick={handleCloneToStudio}
            className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-lg shadow-sky-500/25 active:scale-95"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Fork & Edit in Studio</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Mode Selector Tabs */}
        <div className="h-10 bg-slate-900/80 border-b border-slate-800 px-4 flex items-center gap-2 z-10 text-xs">
          <button
            onClick={() => setActiveTab('3d')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === '3d' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Assembly ({(activeProject.parts || []).length})</span>
          </button>
          <button
            onClick={() => setActiveTab('circuit')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'circuit' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Circuit Schematic ({(activeProject.wires || []).length} Wires)</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'code' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Firmware Code</span>
          </button>
        </div>

        {/* Tab 1: 3D Scene View */}
        {activeTab === '3d' && (
          <div className="flex-1 w-full h-full relative">
            <Canvas shadows camera={{ position: [3.5, 3.5, 4.5], fov: 45 }} className="w-full h-full">
              <ambientLight intensity={0.8} />
              <directionalLight position={[10, 15, 10]} intensity={1.2} castShadow />
              <pointLight position={[-10, 10, -10]} intensity={0.5} color="#38BDF8" />
              <Grid args={[20, 20]} cellSize={0.2} cellColor="#334155" sectionSize={1} sectionColor="#0284C7" position={[0, -0.01, 0]} />
              <ContactShadows position={[0, 0, 0]} opacity={0.6} scale={15} blur={2} />
              <group>
                {(activeProject.parts || []).map((part: PlacedPart) => (
                  <PartMesh key={part.instanceId} part={part} isSelected={false} />
                ))}
              </group>
              <OrbitControls makeDefault enableDamping dampingFactor={0.05} />
            </Canvas>
          </div>
        )}

        {/* Tab 2: Interactive Circuit View */}
        {activeTab === 'circuit' && (
          <div className="flex-1 w-full h-full bg-[#0A0E17] flex flex-col overflow-hidden relative">
            <div className="flex-1 w-full h-full relative p-4 flex items-center justify-center overflow-auto custom-scrollbar">
              <svg width="900" height="550" className="border border-slate-800/80 rounded-2xl bg-[#090D16] shadow-2xl">
                <defs>
                  <pattern id="share-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1.2" fill="#334155" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#share-grid)" />

                <g transform="translate(40, 40)">
                  {(activeProject.components || []).map((comp: any) => (
                    <SvgComponentRenderer
                      key={comp.instanceId}
                      component={comp}
                      isSelected={false}
                      onMouseDown={() => {}}
                      onPinMouseDown={() => {}}
                      onPinMouseUp={() => {}}
                    />
                  ))}
                </g>
              </svg>
            </div>

            {/* Wire Pinout List Footer */}
            <div className="h-28 bg-slate-900 border-t border-slate-800 p-3 font-mono text-xs overflow-y-auto custom-scrollbar">
              <div className="text-slate-400 font-bold text-[11px] mb-1.5 flex items-center gap-1 text-sky-400">
                <Zap className="w-3.5 h-3.5" /> Interconnect Pinout Wires ({activeProject.wires?.length || 0})
              </div>
              <div className="space-y-1">
                {(activeProject.wires || []).map((w: any) => (
                  <div key={w.id} className="flex items-center gap-3 px-2 py-1 bg-slate-950 rounded border border-slate-800 text-[11px]">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: w.color || '#38BDF8' }} />
                    <span className="text-sky-400 font-bold">{w.fromComponentId} ({w.fromPinId})</span>
                    <span className="text-slate-500">➔</span>
                    <span className="text-amber-400 font-bold">{w.toComponentId} ({w.toPinId})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Firmware Code View */}
        {activeTab === 'code' && (
          <div className="flex-1 w-full h-full bg-slate-950 p-6 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between pb-3">
              <span className="text-xs font-mono text-slate-300 font-bold">
                {activeProject.code?.fileName || 'Firmware.ino'}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(activeProject.code?.code || '');
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1 rounded-lg flex items-center gap-1"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 overflow-y-auto custom-scrollbar">
              {activeProject.code?.code}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}
