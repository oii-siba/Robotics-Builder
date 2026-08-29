import React from 'react';
import Link from 'next/link';
import { 
  Bot, 
  Box, 
  Zap, 
  Code2, 
  Package, 
  Gamepad2, 
  Share2, 
  Database, 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';
import { PRESET_PROJECTS } from '@/lib/constants/preset-templates';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Header */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Robotics Builder Logo"
            className="w-10 h-10 rounded-xl object-contain bg-white/5 border border-sky-500/30 p-0.5 shadow-md shadow-sky-500/20"
          />
          <div className="flex flex-col">
            <span className="font-black text-base tracking-tight text-white leading-none font-sans">
              ROBOTICS <span className="text-sky-400">BUILDER</span>
            </span>
            <span className="text-[9px] font-mono text-emerald-400 font-semibold tracking-wider">
              DESIGN • BUILD • INNOVATE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/share/preset-obstacle-rover-2wd"
            className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-900 transition-colors hidden sm:inline"
          >
            Explore 3D Demos
          </Link>
          <Link
            href="/studio"
            className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-sky-500/20 active:scale-95"
          >
            <span>Launch Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 lg:px-12 max-w-6xl mx-auto text-center space-y-8 overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-sky-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen Web 3D Robotics CAD & Circuit Workbench</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Design, Wire & Code <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400">
            Modular Robots in 3D
          </span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Assemble real microcontrollers (Arduino, ESP32), motors, sensors, and chassis in a full 3D canvas.
          Connect pin-to-pin wiring circuits, write firmware code in Monaco IDE, and share your robot online with one click!
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/studio"
            className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all flex items-center gap-2 shadow-xl shadow-sky-500/25 active:scale-95"
          >
            <Bot className="w-4 h-4" />
            <span>Open 3D Robotics Workbench</span>
          </Link>

          <Link
            href="/share/preset-obstacle-rover-2wd"
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-sm px-6 py-3.5 rounded-xl transition-all flex items-center gap-2"
          >
            <Share2 className="w-4 h-4 text-sky-400" />
            <span>View Public Showcase Demo</span>
          </Link>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 px-6 lg:px-12 max-w-6xl mx-auto w-full">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl font-bold text-slate-100">
            All-In-One Hardware Engineering Studio
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Everything you need from 3D mechanical CAD to embedded firmware
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-sky-500/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Box className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-200">3D Part Assembly</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Drag-and-drop realistic 3D Arduino Uno, ESP32, SG90 Servos, DC Gear Motors, Ultrasonic Sonar, and chassis with transform gizmos & snap-to-grid.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-sky-500/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-200">Interactive Circuit Wiring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pin-to-pin wiring diagram builder built on React Flow. Connect VCC, GND, PWM, and I2C lines with live netlist verification.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-sky-500/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-200">Monaco Firmware IDE</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Write Arduino C++ and MicroPython firmware with pre-built kinematics and obstacle avoidance starter codes, syntax check, and serial output.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-sky-500/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-200">Virtual Simulation Arena</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Drive your robot with keyboard/joystick controls, monitor ultrasonic distance radar sweeps, and check motor telemetry in real-time.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-sky-500/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-200">Bill of Materials & Cost</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Auto-calculate exact part count, estimated pricing, power budget current draw (mA), and battery runtime with CSV export.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-sky-500/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-200">Supabase Cloud Sync</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Connect your Supabase PostgreSQL database to save multiple robot projects, generate shareable links, and collaborate seamlessly.
            </p>
          </div>
        </div>
      </section>

      {/* Preset Robotics Templates Section */}
      <section className="py-16 px-6 lg:px-12 max-w-6xl mx-auto w-full border-t border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">
              Ready-Made Robot Templates
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Load and customize pre-engineered robots in 1-click
            </p>
          </div>

          <Link
            href="/studio"
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 font-mono"
          >
            <span>Open All in Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRESET_PROJECTS.map((preset) => (
            <div
              key={preset.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all group"
            >
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-wider text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                  {preset.category}
                </span>
                <h3 className="text-base font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
                  {preset.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {preset.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">
                  {preset.parts.length} Parts Placed
                </span>
                <Link
                  href={`/share/${preset.id}`}
                  className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
                >
                  <span>Inspect 3D</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-8 px-6 text-center text-xs text-slate-500 font-mono">
        <p>© 2026 RoboCraft Studio • Next.js • Three.js • React Flow • Supabase • Monaco Editor</p>
      </footer>
    </div>
  );
}
