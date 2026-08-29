'use client';

import React, { useEffect, useState } from 'react';
import { 
  X, 
  FolderOpen, 
  Trash2, 
  ArrowRight, 
  Bot, 
  Zap, 
  Calendar, 
  Search, 
  Plus 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuthStore } from '@/lib/auth/auth-store';
import { useCircuitStore } from '@/lib/circuit-engine/circuit-store';
import { useRobotStore } from '@/lib/store/robot-store';
import { getSupabaseClient } from '@/lib/supabase/client';

export function MyProjectsModal() {
  const isOpen = useAuthStore((state) => state.isMyProjectsOpen);
  const setOpen = useAuthStore((state) => state.setMyProjectsOpen);
  const user = useAuthStore((state) => state.user);

  const loadCircuitIntoStore = useCircuitStore((state) => state.loadProjectData);
  const loadRobotIntoStore = useRobotStore((state) => state.loadProject);

  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    async function fetchUserProjects() {
      setIsLoading(true);
      const loaded: any[] = [];

      // 1. Fetch from Supabase
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('updated_at', { ascending: false });

          if (data && !error) {
            data.forEach((d) => {
              loaded.push({
                id: d.id,
                title: d.title,
                components: d.circuit_data?.components || [],
                wires: d.circuit_data?.wires || [],
                parts: d.model_data?.parts || [],
                updatedAt: d.updated_at || d.created_at,
              });
            });
          }
        } catch (err) {
          console.warn('Supabase projects fetch:', err);
        }
      }

      // 2. Fetch local circuits from localStorage
      if (typeof window !== 'undefined') {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('circuit_')) {
            try {
              const parsed = JSON.parse(localStorage.getItem(key) || '{}');
              if (parsed.id && !loaded.some((x) => x.id === parsed.id)) {
                loaded.push({
                  id: parsed.id,
                  title: parsed.title,
                  components: parsed.components || [],
                  wires: parsed.wires || [],
                  parts: [],
                  updatedAt: parsed.updatedAt || parsed.createdAt,
                });
              }
            } catch (e) {
              console.error(e);
            }
          }
        }
      }

      setProjects(loaded);
      setIsLoading(false);
    }

    fetchUserProjects();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOpenProject = (p: any) => {
    if (p.components && p.components.length > 0) {
      loadCircuitIntoStore({
        id: p.id,
        title: p.title,
        components: p.components,
        wires: p.wires,
        createdAt: p.updatedAt,
        updatedAt: p.updatedAt,
      });
    }

    if (p.parts && p.parts.length > 0) {
      loadRobotIntoStore(p);
    }

    setOpen(false);
    confetti({ particleCount: 50, spread: 60 });
  };

  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this project?')) return;

    if (typeof window !== 'undefined') {
      localStorage.removeItem(`circuit_${id}`);
    }

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('projects').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete:', err);
      }
    }

    setProjects((prev) => prev.filter((x) => x.id !== id));
  };

  const filtered = projects.filter((p) =>
    p.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in select-none">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 font-sans max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-none">My Robotics Projects</h3>
              <span className="text-[11px] text-slate-400">{projects.length} Saved in Cloud / Local</span>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-800 bg-slate-950/40">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search your saved circuits and robots..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Projects List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {isLoading ? (
            <div className="text-center py-12 text-xs text-slate-500 font-mono">
              Loading projects from cloud...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs font-mono">
              No saved projects found.
            </div>
          ) : (
            filtered.map((p) => (
              <div
                key={p.id}
                onClick={() => handleOpenProject(p)}
                className="group bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-sky-500/50 rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 group-hover:border-sky-500/30">
                    {p.parts?.length > 0 ? <Bot className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-sky-300 transition-colors">
                      {p.title || 'Untitled Circuit'}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                      <span>{p.components?.length || p.parts?.length || 0} Elements</span>
                      <span>•</span>
                      <span>{p.wires?.length || 0} Wires</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(p.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDeleteProject(p.id, e)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-7 h-7 rounded-lg bg-slate-900 group-hover:bg-sky-500 text-slate-400 group-hover:text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
