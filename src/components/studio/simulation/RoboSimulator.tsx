'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Gamepad2, 
  Gauge, 
  Radar, 
  Activity, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight 
} from 'lucide-react';
import { useRobotStore } from '@/lib/store/robot-store';

export function RoboSimulator() {
  const title = useRobotStore((state) => state.title);
  const parts = useRobotStore((state) => state.parts);

  const [isRunning, setIsRunning] = useState(true);
  const [robotPos, setRobotPos] = useState({ x: 250, y: 200, angle: 0 });
  const [speed, setSpeed] = useState({ left: 0, right: 0 });
  const [obstacleDistance, setObstacleDistance] = useState(65);
  const [batteryPct, setBatteryPct] = useState(98);
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([
    'RoboSimulator Arena Ready.',
    'Telemetry link established at 115200 baud.',
  ]);

  // Virtual Obstacles in 2D Arena
  const obstacles = [
    { x: 120, y: 100, w: 50, h: 50 },
    { x: 380, y: 150, w: 60, h: 40 },
    { x: 200, y: 320, w: 80, h: 40 },
  ];

  // Simulation Loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setRobotPos((prev) => {
        const rad = (prev.angle * Math.PI) / 180;
        const moveStep = (speed.left + speed.right) * 0.05;
        const rotStep = (speed.right - speed.left) * 0.1;

        let newX = prev.x + Math.sin(rad) * moveStep;
        let newY = prev.y - Math.cos(rad) * moveStep;
        let newAngle = (prev.angle + rotStep) % 360;

        // Boundaries
        newX = Math.max(30, Math.min(470, newX));
        newY = Math.max(30, Math.min(370, newY));

        // Calculate simulated distance to closest obstacle or wall
        let minDist = 300;
        obstacles.forEach((obs) => {
          const dx = obs.x + obs.w / 2 - newX;
          const dy = obs.y + obs.h / 2 - newY;
          const d = Math.sqrt(dx * dx + dy * dy) - 20;
          if (d < minDist && d > 0) minDist = Math.round(d);
        });
        setObstacleDistance(minDist);

        return { x: newX, y: newY, angle: newAngle };
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isRunning, speed]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        setSpeed({ left: 80, right: 80 });
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        setSpeed({ left: -60, right: -60 });
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setSpeed({ left: -40, right: 60 });
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setSpeed({ left: 60, right: -40 });
      }
    };

    const handleKeyUp = () => {
      setSpeed({ left: 0, right: 0 });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const resetArena = () => {
    setRobotPos({ x: 250, y: 200, angle: 0 });
    setSpeed({ left: 0, right: 0 });
  };

  return (
    <div className="w-full h-full bg-slate-950 text-white p-3 sm:p-6 overflow-y-auto custom-scrollbar select-none flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-sky-400" />
              <span>Virtual Simulation Arena</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 font-mono mt-0.5">
              Live hardware simulation & kinematics verification for &ldquo;{title}&rdquo;
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isRunning ? 'Pause Sim' : 'Run Sim'}</span>
            </button>

            <button
              onClick={resetArena}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Simulator Grid & Telemetry Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* 2D Physics Arena Canvas */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-col items-center shadow-2xl relative overflow-hidden">
            <div className="w-full flex justify-between items-center text-xs font-mono text-slate-400 pb-2 sm:pb-3 border-b border-slate-800">
              <span className="flex items-center gap-1.5 text-sky-400 font-bold text-[11px] sm:text-xs">
                <Radar className="w-4 h-4" /> 500mm x 400mm Arena
              </span>
              <span className="text-[10px] sm:text-xs text-slate-500">WASD / Touch D-Pad</span>
            </div>

            {/* Arena SVG Floor */}
            <div className="w-full aspect-[5/4] max-w-[500px] bg-slate-950 rounded-xl border border-slate-800 my-3 sm:my-4 relative overflow-hidden shadow-inner">
              {/* Floor Grid lines */}
              <svg className="w-full h-full absolute inset-0" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="arena-grid" width="25" height="25" patternUnits="userSpaceOnUse">
                    <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#1E293B" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#arena-grid)" />

                {/* Obstacle Rectangles */}
                {obstacles.map((obs, i) => (
                  <rect
                    key={i}
                    x={obs.x}
                    y={obs.y}
                    width={obs.w}
                    height={obs.h}
                    fill="#334155"
                    stroke="#475569"
                    strokeWidth="2"
                    rx="4"
                  />
                ))}

                {/* Simulated Sonar Radar Cone */}
                <g transform={`translate(${robotPos.x}, ${robotPos.y}) rotate(${robotPos.angle})`}>
                  <path
                    d={`M 0 -15 L -${obstacleDistance * 0.4} -${obstacleDistance} L ${
                      obstacleDistance * 0.4
                    } -${obstacleDistance} Z`}
                    fill="rgba(56, 189, 248, 0.15)"
                    stroke="rgba(56, 189, 248, 0.5)"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                </g>

                {/* Simulated Robot Body */}
                <g transform={`translate(${robotPos.x}, ${robotPos.y}) rotate(${robotPos.angle})`}>
                  {/* Robot Chassis Box */}
                  <rect
                    x="-20"
                    y="-25"
                    width="40"
                    height="50"
                    rx="6"
                    fill="#0284C7"
                    stroke="#38BDF8"
                    strokeWidth="2"
                  />
                  {/* Left & Right Wheels */}
                  <rect x="-26" y="-12" width="6" height="24" rx="2" fill="#0F172A" />
                  <rect x="20" y="-12" width="6" height="24" rx="2" fill="#0F172A" />
                  {/* Front Sonar Sensor */}
                  <circle cx="0" cy="-22" r="5" fill="#E2E8F0" />
                  {/* Heading Indicator Arrow */}
                  <line x1="0" y1="-5" x2="0" y2="-20" stroke="#FFFFFF" strokeWidth="2" />
                </g>
              </svg>
            </div>

            {/* Virtual D-Pad with Mouse & Touch Hold Event Handlers */}
            <div className="flex flex-col items-center gap-1 pb-1">
              <button
                onMouseDown={() => setSpeed({ left: 80, right: 80 })}
                onMouseUp={() => setSpeed({ left: 0, right: 0 })}
                onTouchStart={(e) => {
                  e.preventDefault();
                  setSpeed({ left: 80, right: 80 });
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  setSpeed({ left: 0, right: 0 });
                }}
                className="w-11 h-11 bg-slate-800 hover:bg-sky-500 rounded-xl flex items-center justify-center text-white transition-all active:scale-90 active:bg-sky-500 shadow-md touch-none"
                title="Drive Forward"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
              <div className="flex gap-1.5">
                <button
                  onMouseDown={() => setSpeed({ left: -40, right: 60 })}
                  onMouseUp={() => setSpeed({ left: 0, right: 0 })}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    setSpeed({ left: -40, right: 60 });
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    setSpeed({ left: 0, right: 0 });
                  }}
                  className="w-11 h-11 bg-slate-800 hover:bg-sky-500 rounded-xl flex items-center justify-center text-white transition-all active:scale-90 active:bg-sky-500 shadow-md touch-none"
                  title="Turn Left"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onMouseDown={() => setSpeed({ left: -60, right: -60 })}
                  onMouseUp={() => setSpeed({ left: 0, right: 0 })}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    setSpeed({ left: -60, right: -60 });
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    setSpeed({ left: 0, right: 0 });
                  }}
                  className="w-11 h-11 bg-slate-800 hover:bg-sky-500 rounded-xl flex items-center justify-center text-white transition-all active:scale-90 active:bg-sky-500 shadow-md touch-none"
                  title="Drive Backward"
                >
                  <ArrowDown className="w-5 h-5" />
                </button>
                <button
                  onMouseDown={() => setSpeed({ left: 60, right: -40 })}
                  onMouseUp={() => setSpeed({ left: 0, right: 0 })}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    setSpeed({ left: 60, right: -40 });
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    setSpeed({ left: 0, right: 0 });
                  }}
                  className="w-11 h-11 bg-slate-800 hover:bg-sky-500 rounded-xl flex items-center justify-center text-white transition-all active:scale-90 active:bg-sky-500 shadow-md touch-none"
                  title="Turn Right"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Telemetry & Sensor Gauges */}
          <div className="lg:col-span-4 space-y-4">
            {/* Sonar Sensor Reading Card */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-sky-400 font-bold">
                  <Activity className="w-4 h-4" /> HC-SR04 Sonar Distance
                </span>
                <span className="text-emerald-400">ONLINE</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono text-white">
                  {obstacleDistance}
                </span>
                <span className="text-xs font-mono text-slate-400">cm</span>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full transition-all duration-100 ${
                    obstacleDistance < 25
                      ? 'bg-rose-500'
                      : obstacleDistance < 60
                      ? 'bg-amber-400'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, (obstacleDistance / 150) * 100)}%` }}
                />
              </div>
            </div>

            {/* Motor Speeds */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
              <div className="text-xs font-mono text-slate-400 font-bold flex items-center gap-1.5 text-amber-400">
                <Gauge className="w-4 h-4" /> Motor Speed PWM Telemetry
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                  <span className="text-slate-400 text-[10px] uppercase">Motor Left</span>
                  <div className="text-lg font-bold text-sky-400 mt-1">{speed.left} RPM</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                  <span className="text-slate-400 text-[10px] uppercase">Motor Right</span>
                  <div className="text-lg font-bold text-sky-400 mt-1">{speed.right} RPM</div>
                </div>
              </div>
            </div>

            {/* Virtual Battery Health */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Li-Ion Pack (7.4V)</span>
                <span className="text-emerald-400 font-bold">{batteryPct}% (7.82V)</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-emerald-500" style={{ width: `${batteryPct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
