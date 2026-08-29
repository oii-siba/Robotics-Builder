'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { SchematicPort, SchematicSymbolDef } from '@/lib/constants/schematic-symbols';

interface SchematicNodeData {
  symbolDef: SchematicSymbolDef;
  label: string;
  value?: string;
  unit?: string;
  rotation?: number; // 0, 90, 180, 270
  customColor?: string;
}

export function SchematicSymbolNode({ data, selected }: { data: SchematicNodeData; selected?: boolean }) {
  const { symbolDef, label, value, unit, rotation = 0, customColor } = data;
  const { width, height } = symbolDef.dimensions;

  // Convert port position based on rotation
  const getHandlePosition = (pos: 'top' | 'bottom' | 'left' | 'right') => {
    switch (pos) {
      case 'top': return Position.Top;
      case 'bottom': return Position.Bottom;
      case 'left': return Position.Left;
      case 'right': return Position.Right;
    }
  };

  const renderSymbolGraphic = () => {
    switch (symbolDef.svgType) {
      // ================= GROUND =================
      case 'gnd':
        return (
          <g stroke="#38BDF8" strokeWidth="2.5" fill="none">
            <line x1="25" y1="0" x2="25" y2="25" />
            <line x1="10" y1="25" x2="40" y2="25" />
            <line x1="15" y1="32" x2="35" y2="32" />
            <line x1="20" y1="39" x2="30" y2="39" />
          </g>
        );

      // ================= +5V / +3.3V POWER =================
      case 'vcc_5v':
      case 'vcc_3v3':
        return (
          <g stroke="#EF4444" strokeWidth="2.5" fill="none">
            <line x1="25" y1="50" x2="25" y2="20" />
            <circle cx="25" cy="12" r="7" fill="#EF4444" fillOpacity="0.2" />
            <path d="M 20 20 L 25 10 L 30 20" fill="#EF4444" />
          </g>
        );

      // ================= BATTERY =================
      case 'battery_dc':
        return (
          <g stroke="#F59E0B" strokeWidth="2.5" fill="none">
            <line x1="35" y1="0" x2="35" y2="25" />
            <line x1="15" y1="25" x2="55" y2="25" strokeWidth="3.5" />
            <line x1="22" y1="35" x2="48" y2="35" strokeWidth="5" stroke="#1E293B" />
            <line x1="15" y1="45" x2="55" y2="45" strokeWidth="3.5" />
            <line x1="22" y1="55" x2="48" y2="55" strokeWidth="5" stroke="#1E293B" />
            <line x1="35" y1="55" x2="35" y2="80" />
            <text x="60" y="28" fill="#EF4444" fontSize="12" fontWeight="bold" stroke="none">+</text>
            <text x="60" y="60" fill="#94A3B8" fontSize="12" fontWeight="bold" stroke="none">-</text>
          </g>
        );

      // ================= RESISTOR =================
      case 'resistor':
        return (
          <g stroke="#38BDF8" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="0" y1="25" x2="18" y2="25" />
            <polyline points="18,25 24,10 36,40 48,10 60,40 72,25" />
            <line x1="72" y1="25" x2="90" y2="25" />
          </g>
        );

      // ================= POTENTIOMETER =================
      case 'potentiometer':
        return (
          <g stroke="#38BDF8" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="0" y1="50" x2="18" y2="50" />
            <polyline points="18,50 24,35 36,65 48,35 60,65 72,50" />
            <line x1="72" y1="50" x2="90" y2="50" />
            {/* Wiper Arrow */}
            <line x1="45" y1="0" x2="45" y2="25" stroke="#3B82F6" />
            <polygon points="45,28 40,18 50,18" fill="#3B82F6" stroke="none" />
          </g>
        );

      // ================= CAPACITOR =================
      case 'capacitor':
        return (
          <g stroke="#38BDF8" strokeWidth="2.5" fill="none">
            <line x1="0" y1="25" x2="33" y2="25" />
            <line x1="33" y1="8" x2="33" y2="42" strokeWidth="3" />
            <line x1="47" y1="8" x2="47" y2="42" strokeWidth="3" />
            <line x1="47" y1="25" x2="80" y2="25" />
          </g>
        );

      // ================= ELECTROLYTIC CAPACITOR =================
      case 'capacitor_polar':
        return (
          <g stroke="#38BDF8" strokeWidth="2.5" fill="none">
            <line x1="0" y1="27" x2="33" y2="27" />
            <line x1="33" y1="10" x2="33" y2="44" strokeWidth="3.5" />
            <path d="M 47 10 Q 42 27 47 44" strokeWidth="3.5" />
            <line x1="47" y1="27" x2="80" y2="27" />
            <text x="20" y="20" fill="#EF4444" fontSize="12" fontWeight="bold" stroke="none">+</text>
          </g>
        );

      // ================= DIODE =================
      case 'diode':
        return (
          <g stroke="#38BDF8" strokeWidth="2.5" fill="none">
            <line x1="0" y1="25" x2="25" y2="25" />
            <polygon points="25,10 25,40 55,25" fill="#38BDF8" fillOpacity="0.3" />
            <line x1="55" y1="10" x2="55" y2="40" strokeWidth="3" />
            <line x1="55" y1="25" x2="80" y2="25" />
          </g>
        );

      // ================= LED =================
      case 'led':
        return (
          <g stroke="#38BDF8" strokeWidth="2.5" fill="none">
            <line x1="0" y1="35" x2="25" y2="35" />
            <polygon points="25,20 25,50 55,35" fill={customColor || '#EF4444'} fillOpacity="0.4" stroke={customColor || '#EF4444'} />
            <line x1="55" y1="20" x2="55" y2="50" strokeWidth="3" />
            <line x1="55" y1="35" x2="85" y2="35" />
            {/* Outgoing light emission arrows */}
            <path d="M 42 16 L 52 6 M 52 6 L 46 6 M 52 6 L 52 12" stroke="#F59E0B" strokeWidth="2" />
            <path d="M 52 24 L 62 14 M 62 14 L 56 14 M 62 14 L 62 20" stroke="#F59E0B" strokeWidth="2" />
          </g>
        );

      // ================= NPN TRANSISTOR =================
      case 'transistor_npn':
        return (
          <g stroke="#38BDF8" strokeWidth="2.5" fill="none">
            <circle cx="45" cy="40" r="28" stroke="#475569" strokeWidth="1.5" />
            <line x1="0" y1="40" x2="32" y2="40" />
            <line x1="32" y1="22" x2="32" y2="58" strokeWidth="4" />
            {/* Collector */}
            <line x1="32" y1="30" x2="60" y2="12" />
            <line x1="60" y1="12" x2="60" y2="0" />
            {/* Emitter with Arrow */}
            <line x1="32" y1="50" x2="60" y2="68" />
            <polygon points="58,68 46,60 52,52" fill="#38BDF8" stroke="none" />
            <line x1="60" y1="68" x2="60" y2="80" />
          </g>
        );

      // ================= PUSH BUTTON =================
      case 'push_button':
        return (
          <g stroke="#38BDF8" strokeWidth="2.5" fill="none">
            <line x1="0" y1="25" x2="20" y2="25" />
            <circle cx="23" cy="25" r="3" fill="#38BDF8" />
            <line x1="20" y1="14" x2="55" y2="14" strokeWidth="3" />
            <line x1="37" y1="14" x2="37" y2="2" />
            <circle cx="52" cy="25" r="3" fill="#38BDF8" />
            <line x1="55" y1="25" x2="75" y2="25" />
          </g>
        );

      // ================= SPST TOGGLE SWITCH =================
      case 'switch_spst':
        return (
          <g stroke="#38BDF8" strokeWidth="2.5" fill="none">
            <line x1="0" y1="25" x2="20" y2="25" />
            <circle cx="22" cy="25" r="3" fill="#38BDF8" />
            <line x1="22" y1="25" x2="55" y2="10" strokeWidth="3" stroke="#F59E0B" />
            <circle cx="58" cy="25" r="3" fill="#38BDF8" />
            <line x1="60" y1="25" x2="80" y2="25" />
          </g>
        );

      // ================= VOLTMETER / AMMETER =================
      case 'voltmeter':
      case 'ammeter':
        return (
          <g stroke="#38BDF8" strokeWidth="2.5" fill="none">
            <circle cx="35" cy="35" r="22" fill="#0F172A" stroke="#38BDF8" strokeWidth="2.5" />
            <text
              x="35"
              y="42"
              fill="#F8FAFC"
              fontSize="18"
              fontWeight="bold"
              textAnchor="middle"
              stroke="none"
              fontFamily="monospace"
            >
              {symbolDef.svgType === 'voltmeter' ? 'V' : 'A'}
            </text>
            <line x1="35" y1="0" x2="35" y2="13" />
            <line x1="35" y1="57" x2="35" y2="70" />
          </g>
        );

      // ================= 555 TIMER / IC CHIP =================
      case 'ic_555':
        return (
          <g>
            <rect
              x="15"
              y="5"
              width="100"
              height="100"
              rx="6"
              fill="#0F172A"
              stroke="#38BDF8"
              strokeWidth="2.5"
            />
            {/* Top Notch */}
            <path d="M 55 5 A 10 10 0 0 0 75 5" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
            <text x="65" y="45" fill="#38BDF8" fontSize="13" fontWeight="bold" textAnchor="middle">
              NE555
            </text>
            <text x="65" y="62" fill="#94A3B8" fontSize="9" textAnchor="middle" fontFamily="monospace">
              TIMER IC
            </text>
          </g>
        );

      // ================= ARDUINO UNO IC =================
      case 'arduino_uno':
        return (
          <g>
            <rect
              x="15"
              y="5"
              width="150"
              height="200"
              rx="8"
              fill="#005C61"
              stroke="#00878F"
              strokeWidth="2.5"
            />
            <rect x="25" y="15" width="25" height="30" fill="#CBD5E1" rx="2" />
            <rect x="25" y="55" width="22" height="25" fill="#0F172A" rx="2" />
            <text x="90" y="32" fill="#FFFFFF" fontSize="13" fontWeight="bold">
              ARDUINO
            </text>
            <text x="90" y="46" fill="#38BDF8" fontSize="10" fontWeight="bold">
              UNO R3
            </text>
            <circle cx="140" cy="25" r="4" fill="#22C55E" />
          </g>
        );

      // ================= L298N DRIVER =================
      case 'motor_driver_l298n':
        return (
          <g>
            <rect
              x="15"
              y="5"
              width="140"
              height="130"
              rx="8"
              fill="#991B1B"
              stroke="#DC2626"
              strokeWidth="2.5"
            />
            <rect x="50" y="20" width="70" height="40" fill="#0F172A" rx="3" />
            <text x="85" y="45" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">
              L298N
            </text>
            <text x="85" y="90" fill="#FECACA" fontSize="9" textAnchor="middle" fontFamily="monospace">
              DUAL H-BRIDGE
            </text>
          </g>
        );

      // ================= ULTRASONIC SENSOR =================
      case 'sensor_ultrasonic':
        return (
          <g>
            <rect
              x="10"
              y="5"
              width="120"
              height="80"
              rx="8"
              fill="#0284C7"
              stroke="#38BDF8"
              strokeWidth="2.5"
            />
            <circle cx="42" cy="40" r="18" fill="#E2E8F0" stroke="#0F172A" strokeWidth="2" />
            <text x="42" y="45" fill="#0F172A" fontSize="12" fontWeight="bold" textAnchor="middle">T</text>
            <circle cx="98" cy="40" r="18" fill="#E2E8F0" stroke="#0F172A" strokeWidth="2" />
            <text x="98" y="45" fill="#0F172A" fontSize="12" fontWeight="bold" textAnchor="middle">R</text>
            <text x="70" y="75" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">HC-SR04</text>
          </g>
        );

      // ================= SERVO MOTOR =================
      case 'servo_motor':
        return (
          <g>
            <rect
              x="10"
              y="5"
              width="90"
              height="65"
              rx="6"
              fill="#1E3A8A"
              stroke="#3B82F6"
              strokeWidth="2.5"
            />
            <circle cx="70" cy="37" r="16" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2" />
            <text x="40" y="32" fill="#FFFFFF" fontSize="10" fontWeight="bold">SG90</text>
            <text x="40" y="48" fill="#93C5FD" fontSize="8">SERVO</text>
          </g>
        );

      // Default Generic Box
      default:
        return (
          <g>
            <rect
              x="5"
              y="5"
              width={width - 10}
              height={height - 10}
              rx="6"
              fill="#0F172A"
              stroke="#38BDF8"
              strokeWidth="2"
            />
            <text x={width / 2} y={height / 2 + 4} fill="#FFFFFF" fontSize="10" textAnchor="middle">
              {symbolDef.name}
            </text>
          </g>
        );
    }
  };

  return (
    <div
      className={`relative select-none group transition-shadow ${
        selected ? 'ring-2 ring-sky-400 ring-offset-2 ring-offset-slate-950 rounded-lg' : ''
      }`}
      style={{
        width,
        height,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {/* SVG Canvas Graphic */}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        {renderSymbolGraphic()}
      </svg>

      {/* Schematic Terminal Port Handles */}
      {symbolDef.ports.map((port: SchematicPort) => {
        return (
          <div
            key={port.id}
            className="absolute"
            style={{
              left: `${port.xPercent}%`,
              top: `${port.yPercent}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Handle
              type="source"
              position={getHandlePosition(port.position)}
              id={port.id}
              style={{
                width: 10,
                height: 10,
                backgroundColor: port.color || '#38BDF8',
                border: '2px solid #0F172A',
                borderRadius: '50%',
                cursor: 'crosshair',
              }}
              title={`${label}.${port.name}`}
            />
          </div>
        );
      })}

      {/* Component Reference & Value Labels */}
      <div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none whitespace-nowrap"
        style={{ transform: `rotate(${-rotation}deg)` }}
      >
        <span className="text-[11px] font-bold font-mono text-sky-300 drop-shadow-md">
          {label}
        </span>
        {value && (
          <span className="text-[10px] font-mono text-amber-300 drop-shadow-md">
            {value}{unit || ''}
          </span>
        )}
      </div>
    </div>
  );
}
