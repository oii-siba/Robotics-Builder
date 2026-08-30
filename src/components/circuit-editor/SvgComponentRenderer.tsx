'use client';

import React from 'react';
import { PlacedCircuitComponent, CircuitPinDef } from '@/lib/circuit-engine/types';
import { CIRCUIT_COMPONENTS_LIBRARY } from '@/lib/circuit-engine/components-library';

interface SvgComponentRendererProps {
  component: PlacedCircuitComponent;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onPinMouseDown: (pin: CircuitPinDef, pinAbsX: number, pinAbsY: number, e: React.MouseEvent) => void;
  onPinMouseUp: (pin: CircuitPinDef, e: React.MouseEvent) => void;
}

export function SvgComponentRenderer({
  component,
  isSelected,
  onMouseDown,
  onPinMouseDown,
  onPinMouseUp,
}: SvgComponentRendererProps) {
  const def = CIRCUIT_COMPONENTS_LIBRARY.find((c) => c.id === component.defId);
  if (!def) return null;

  const { width, height, pins } = def;
  const scale = component.scale || 1;
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  // Helper to calculate rotated and scaled pin coordinates
  const getPinAbsoluteCoords = (pin: CircuitPinDef) => {
    const pinX = pin.x * scale;
    const pinY = pin.y * scale;

    if (!component.rotation || component.rotation === 0) {
      return { x: component.x + pinX, y: component.y + pinY };
    }

    const rad = (component.rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const cx = scaledWidth / 2;
    const cy = scaledHeight / 2;

    const dx = pinX - cx;
    const dy = pinY - cy;

    const rx = dx * cos - dy * sin;
    const ry = dx * sin + dy * cos;

    return {
      x: component.x + cx + rx,
      y: component.y + cy + ry,
    };
  };

  const renderRealisticVisuals = () => {
    switch (def.renderType) {
      // =========================================================================
      // 1. REALISTIC ESP32 DEVKIT V1
      // =========================================================================
      case 'esp32':
        return (
          <g>
            {/* PCB Base Board */}
            <rect x={0} y={0} width={width} height={height} rx={8} fill="#1E2430" stroke="#0F172A" strokeWidth={1.5} filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))" />
            {/* Mounting Holes */}
            <circle cx={10} cy={10} r={3} fill="#0A0E17" stroke="#475569" strokeWidth={1} />
            <circle cx={width - 10} cy={10} r={3} fill="#0A0E17" stroke="#475569" strokeWidth={1} />
            <circle cx={10} cy={height - 10} r={3} fill="#0A0E17" stroke="#475569" strokeWidth={1} />
            <circle cx={width - 10} cy={height - 10} r={3} fill="#0A0E17" stroke="#475569" strokeWidth={1} />

            {/* PCB Gold Antenna Trace (Top) */}
            <rect x={35} y={6} width={70} height={20} rx={2} fill="#D97706" />
            <path d="M 40 10 H 98 M 40 14 H 98 M 40 18 H 98 M 45 10 V 22 M 55 10 V 22 M 65 10 V 22 M 75 10 V 22 M 85 10 V 22 M 95 10 V 22" stroke="#92400E" strokeWidth={1} />

            {/* Metallic Brushed Nickel RF Shield Can (ESP-WROOM-32) */}
            <rect x={22} y={32} width={96} height={90} rx={4} fill="#CBD5E1" stroke="#94A3B8" strokeWidth={1.5} />
            <rect x={24} y={34} width={92} height={86} rx={3} fill="#E2E8F0" opacity={0.6} />
            <text x={70} y={60} fill="#0F172A" fontSize={10} fontWeight="900" textAnchor="middle" fontFamily="monospace">
              ESP-WROOM-32
            </text>
            <text x={70} y={75} fill="#334155" fontSize={8} fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              Wi-Fi + BLE SoC
            </text>
            <rect x={55} y={85} width={30} height={18} rx={2} fill="#0F172A" />
            <text x={70} y={97} fill="#E2E8F0" fontSize={7} textAnchor="middle" fontFamily="monospace">FCC ID</text>

            {/* Micro USB Port (Bottom) */}
            <rect x={52} y={height - 16} width={36} height={16} rx={2} fill="#94A3B8" stroke="#475569" strokeWidth={1} />
            <rect x={58} y={height - 10} width={24} height={8} rx={1} fill="#1E293B" />

            {/* Tactile Buttons (EN & BOOT) */}
            <rect x={20} y={height - 28} width={16} height={14} rx={2} fill="#64748B" />
            <circle cx={28} cy={height - 21} r={4} fill="#0F172A" />
            <text x={28} y={height - 32} fill="#94A3B8" fontSize={7} textAnchor="middle" fontWeight="bold">EN</text>

            <rect x={width - 36} y={height - 28} width={16} height={14} rx={2} fill="#64748B" />
            <circle cx={width - 28} cy={height - 21} r={4} fill="#0F172A" />
            <text x={width - 28} y={height - 32} fill="#94A3B8" fontSize={7} textAnchor="middle" fontWeight="bold">BOOT</text>

            {/* Status LEDs */}
            <circle cx={35} cy={135} r={2.5} fill="#EF4444" stroke="#7F1D1D" strokeWidth={0.5} />
            <circle cx={width - 35} cy={135} r={2.5} fill="#38BDF8" stroke="#0369A1" strokeWidth={0.5} />

            {/* Header Pins Socket Rails (Left & Right) */}
            <rect x={2} y={24} width={10} height={196} rx={2} fill="#0F172A" />
            <rect x={width - 12} y={24} width={10} height={196} rx={2} fill="#0F172A" />
          </g>
        );

      // =========================================================================
      // 2. REALISTIC ARDUINO UNO R3
      // =========================================================================
      case 'arduino_uno':
        return (
          <g>
            {/* Signature Cyan PCB */}
            <rect x={0} y={0} width={width} height={height} rx={10} fill="#008184" stroke="#005C61" strokeWidth={2} filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))" />
            
            {/* Silver USB Type-B Port */}
            <rect x={12} y={10} width={34} height={38} rx={3} fill="#E2E8F0" stroke="#94A3B8" strokeWidth={1.5} />
            <rect x={20} y={16} width={18} height={26} rx={2} fill="#1E293B" />

            {/* DC Barrel Jack */}
            <rect x={12} y={60} width={36} height={42} rx={3} fill="#0F172A" stroke="#334155" strokeWidth={1} />
            <circle cx={30} cy={81} r={6} fill="#334155" />
            <circle cx={30} cy={81} r={3} fill="#000000" />

            {/* Crystal 16.000 MHz Can */}
            <rect x={60} y={55} width={16} height={28} rx={6} fill="#CBD5E1" stroke="#64748B" strokeWidth={1} />
            <text x={68} y={72} fill="#334155" fontSize={6} fontWeight="bold" textAnchor="middle" transform="rotate(-90 68 72)">16.000</text>

            {/* ATmega328P DIP-28 IC Chip & Socket */}
            <rect x={55} y={105} width={40} height={95} rx={3} fill="#0F172A" stroke="#334155" strokeWidth={1} />
            <path d="M 70 105 A 5 5 0 0 1 80 105" fill="#008184" />
            <text x={75} y={155} fill="#CBD5E1" fontSize={8} fontWeight="bold" textAnchor="middle" transform="rotate(-90 75 155)" fontFamily="monospace">
              ATMEGA328P-PU
            </text>

            {/* Reset Button (Red) */}
            <rect x={105} y={15} width={16} height={16} rx={3} fill="#CBD5E1" />
            <circle cx={113} cy={23} r={5} fill="#EF4444" />

            {/* Silkscreen Branding */}
            <text x={100} y={65} fill="#FFFFFF" fontSize={13} fontWeight="900" fontFamily="sans-serif">
              ARDUINO
            </text>
            <text x={100} y={80} fill="#E0F2FE" fontSize={9} fontWeight="bold" fontFamily="monospace">
              UNO R3
            </text>

            {/* Left & Right Header Pin Strips */}
            <rect x={2} y={24} width={9} height={180} rx={2} fill="#0F172A" />
            <rect x={width - 11} y={24} width={9} height={196} rx={2} fill="#0F172A" />
          </g>
        );

      // =========================================================================
      // 3. REALISTIC L298N MOTOR DRIVER
      // =========================================================================
      case 'driver_l298n':
        return (
          <g>
            {/* Deep Red PCB */}
            <rect x={0} y={0} width={width} height={height} rx={8} fill="#991B1B" stroke="#7F1D1D" strokeWidth={2} filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))" />
            {/* Mounting Holes */}
            <circle cx={10} cy={10} r={3.5} fill="#0A0E17" stroke="#CBD5E1" strokeWidth={1} />
            <circle cx={width - 10} cy={10} r={3.5} fill="#0A0E17" stroke="#CBD5E1" strokeWidth={1} />
            <circle cx={10} cy={height - 10} r={3.5} fill="#0A0E17" stroke="#CBD5E1" strokeWidth={1} />
            <circle cx={width - 10} cy={height - 10} r={3.5} fill="#0A0E17" stroke="#CBD5E1" strokeWidth={1} />

            {/* Large Black Aluminum Heatsink with Fins */}
            <rect x={35} y={15} width={90} height={55} rx={3} fill="#0F172A" stroke="#334155" strokeWidth={1.5} />
            {/* Heatsink Cooling Ridges */}
            <rect x={42} y={15} width={6} height={55} fill="#1E293B" />
            <rect x={54} y={15} width={6} height={55} fill="#1E293B" />
            <rect x={66} y={15} width={6} height={55} fill="#1E293B" />
            <rect x={78} y={15} width={6} height={55} fill="#1E293B" />
            <rect x={90} y={15} width={6} height={55} fill="#1E293B" />
            <rect x={102} y={15} width={6} height={55} fill="#1E293B" />
            <rect x={114} y={15} width={6} height={55} fill="#1E293B" />

            <text x={80} y={48} fill="#F8FAFC" fontSize={13} fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
              L298N
            </text>

            {/* Blue Screw Terminals (Left Power & Right Motor Outs) */}
            <rect x={2} y={25} width={18} height={105} rx={3} fill="#1E40AF" stroke="#1D4ED8" strokeWidth={1} />
            <circle cx={11} cy={35} r={3} fill="#94A3B8" stroke="#475569" strokeWidth={0.5} />
            <circle cx={11} cy={75} r={3} fill="#94A3B8" stroke="#475569" strokeWidth={0.5} />
            <circle cx={11} cy={115} r={3} fill="#94A3B8" stroke="#475569" strokeWidth={0.5} />

            <rect x={width - 20} y={25} width={18} height={120} rx={3} fill="#1E40AF" stroke="#1D4ED8" strokeWidth={1} />
            <circle cx={width - 11} cy={35} r={3} fill="#94A3B8" />
            <circle cx={width - 11} cy={65} r={3} fill="#94A3B8" />
            <circle cx={width - 11} cy={105} r={3} fill="#94A3B8" />
            <circle cx={width - 11} cy={135} r={3} fill="#94A3B8" />

            {/* Black Logic Input Header Pins (Bottom) */}
            <rect x={20} y={height - 18} width={120} height={16} rx={2} fill="#0F172A" />

            {/* Filter Capacitors */}
            <circle cx={42} cy={95} r={10} fill="#0F172A" stroke="#64748B" strokeWidth={1.5} />
            <circle cx={42} cy={95} r={8} fill="#334155" />
            <circle cx={65} cy={95} r={8} fill="#0F172A" stroke="#64748B" strokeWidth={1.5} />
          </g>
        );

      // =========================================================================
      // 4. REALISTIC HC-SR04 ULTRASONIC SONAR
      // =========================================================================
      case 'ultrasonic':
        return (
          <g>
            {/* Blue PCB */}
            <rect x={0} y={0} width={width} height={height} rx={6} fill="#0284C7" stroke="#0369A1" strokeWidth={1.5} filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))" />
            
            {/* Silver Metal Canister T (Transmitter) */}
            <circle cx={35} cy={40} r={24} fill="#CBD5E1" stroke="#475569" strokeWidth={2} />
            <circle cx={35} cy={40} r={20} fill="#E2E8F0" />
            <circle cx={35} cy={40} r={14} fill="#94A3B8" opacity={0.6} />
            <text x={35} y={45} fill="#0F172A" fontSize={16} fontWeight="900" textAnchor="middle" fontFamily="sans-serif">T</text>

            {/* Silver Metal Canister R (Receiver) */}
            <circle cx={95} cy={40} r={24} fill="#CBD5E1" stroke="#475569" strokeWidth={2} />
            <circle cx={95} cy={40} r={20} fill="#E2E8F0" />
            <circle cx={95} cy={40} r={14} fill="#94A3B8" opacity={0.6} />
            <text x={95} y={45} fill="#0F172A" fontSize={16} fontWeight="900" textAnchor="middle" fontFamily="sans-serif">R</text>

            {/* Center Crystal Oscillator */}
            <rect x={58} y={32} width={14} height={20} rx={4} fill="#CBD5E1" stroke="#64748B" strokeWidth={1} />
            <text x={65} y={45} fill="#334155" fontSize={5} fontWeight="bold" textAnchor="middle" transform="rotate(-90 65 45)">4.000</text>

            {/* 4 Gold Terminal Pins (Bottom) */}
            <rect x={15} y={height - 12} width={100} height={10} rx={2} fill="#0F172A" />
          </g>
        );

      // =========================================================================
      // 5. REALISTIC TT DC GEAR MOTOR
      // =========================================================================
      case 'motor_dc':
        return (
          <g>
            {/* Signature Yellow Plastic Gearbox Housing */}
            <rect x={15} y={5} width={width - 25} height={height - 10} rx={6} fill="#FACC15" stroke="#CA8A04" strokeWidth={1.5} filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))" />
            
            {/* Silver Motor Cylinder (Back) */}
            <rect x={0} y={15} width={25} height={height - 30} rx={3} fill="#94A3B8" stroke="#475569" strokeWidth={1.5} />
            <rect x={2} y={18} width={21} height={height - 36} rx={2} fill="#CBD5E1" />

            {/* White Plastic Dual D-Shaft */}
            <circle cx={width - 20} cy={height / 2} r={14} fill="#F8FAFC" stroke="#94A3B8" strokeWidth={1.5} />
            <rect x={width - 24} y={height / 2 - 10} width={8} height={20} fill="#E2E8F0" />

            {/* Gearbox Screw Fasteners */}
            <circle cx={35} cy={18} r={2.5} fill="#713F12" />
            <circle cx={35} cy={height - 18} r={2.5} fill="#713F12" />
            <text x={45} y={height / 2 + 3} fill="#854D0E" fontSize={9} fontWeight="900" fontFamily="sans-serif">
              3-6V DC
            </text>
          </g>
        );

      // =========================================================================
      // 6. REALISTIC SG90 MICRO SERVO
      // =========================================================================
      case 'servo_sg90':
        return (
          <g>
            {/* Translucent Blue Plastic Servo Case */}
            <rect x={15} y={5} width={width - 20} height={height - 10} rx={4} fill="#2563EB" stroke="#1D4ED8" strokeWidth={1.5} filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))" />
            {/* Top Mounting Tabs */}
            <rect x={10} y={18} width={8} height={12} rx={1} fill="#1D4ED8" />
            <circle cx={14} cy={24} r={2} fill="#0F172A" />
            <rect x={width - 10} y={18} width={8} height={12} rx={1} fill="#1D4ED8" />
            <circle cx={width - 6} cy={24} r={2} fill="#0F172A" />

            {/* White Circular Output Gear Horn */}
            <circle cx={width - 32} cy={height / 2} r={16} fill="#F8FAFC" stroke="#CBD5E1" strokeWidth={1.5} />
            <circle cx={width - 32} cy={height / 2} r={4} fill="#475569" />

            {/* Silkscreen Label */}
            <text x={35} y={32} fill="#FFFFFF" fontSize={11} fontWeight="900" fontFamily="sans-serif">
              SG90
            </text>
            <text x={35} y={45} fill="#93C5FD" fontSize={8} fontWeight="bold" fontFamily="sans-serif">
              9g SERVO
            </text>
          </g>
        );

      // =========================================================================
      // 7. REALISTIC 7.4V BATTERY PACK
      // =========================================================================
      case 'battery':
        return (
          <g>
            {/* Dual 18650 Cylindrical Cells with Blue Heatshrink */}
            <rect x={5} y={10} width={32} height={height - 20} rx={6} fill="#0284C7" stroke="#0369A1" strokeWidth={1.5} />
            <rect x={43} y={10} width={32} height={height - 20} rx={6} fill="#0284C7" stroke="#0369A1" strokeWidth={1.5} />
            
            {/* Positive Silver Terminals (Top) */}
            <rect x={14} y={2} width={14} height={10} rx={2} fill="#CBD5E1" stroke="#475569" strokeWidth={1} />
            <rect x={52} y={2} width={14} height={10} rx={2} fill="#CBD5E1" stroke="#475569" strokeWidth={1} />

            {/* Outer Black Heatshrink Wrap Banner */}
            <rect x={2} y={30} width={width - 4} height={38} rx={2} fill="#0F172A" opacity={0.9} />
            <text x={width / 2} y={48} fill="#F59E0B" fontSize={11} fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
              7.4V 2S
            </text>
            <text x={width / 2} y={60} fill="#94A3B8" fontSize={7.5} textAnchor="middle" fontFamily="monospace">
              2600mAh Li-ion
            </text>
          </g>
        );

      // =========================================================================
      // 8. REALISTIC 0.96" I2C OLED DISPLAY
      // =========================================================================
      case 'oled_display':
        return (
          <g>
            {/* Blue Carrier PCB */}
            <rect x={0} y={0} width={width} height={height} rx={6} fill="#1E40AF" stroke="#1D4ED8" strokeWidth={1.5} filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))" />
            
            {/* Deep Glossy Glass OLED Panel (128x64) */}
            <rect x={8} y={18} width={width - 16} height={height - 26} rx={3} fill="#000000" stroke="#334155" strokeWidth={1} />
            {/* Cyan Displayed Graphics Mock */}
            <text x={width / 2} y={42} fill="#38BDF8" fontSize={10} fontWeight="900" textAnchor="middle" fontFamily="monospace">
              128x64 OLED
            </text>
            <rect x={20} y={50} width={60} height={8} rx={1} fill="#0284C7" opacity={0.6} />

            {/* Top 4 Gold Header Pins */}
            <rect x={10} y={2} width={80} height={8} rx={1} fill="#0F172A" />
          </g>
        );

      // =========================================================================
      // 9. REALISTIC RESISTOR (Color Bands)
      // =========================================================================
      case 'resistor':
        return (
          <g>
            {/* Silver Wire Leads */}
            <line x1={0} y1={height / 2} x2={width} y2={height / 2} stroke="#CBD5E1" strokeWidth={2.5} />
            {/* Ceramic Beige Resistor Body */}
            <rect x={18} y={height / 2 - 10} width={width - 36} height={20} rx={6} fill="#E2D9C8" stroke="#A8A29E" strokeWidth={1} filter="drop-shadow(0 2px 4px rgba(0,0,0,0.4))" />
            {/* 4 Standard Color Bands (Red-Red-Brown-Gold = 220Ω) */}
            <rect x={26} y={height / 2 - 10} width={4} height={20} fill="#DC2626" />
            <rect x={34} y={height / 2 - 10} width={4} height={20} fill="#DC2626" />
            <rect x={42} y={height / 2 - 10} width={4} height={20} fill="#78350F" />
            <rect x={52} y={height / 2 - 10} width={4} height={20} fill="#F59E0B" />
          </g>
        );

      // =========================================================================
      // 11. REALISTIC 400-TIE POINT HALF-SIZE BREADBOARD
      // =========================================================================
      case 'breadboard_400': {
        const cols = Array.from({ length: 30 }, (_, i) => i);
        const topPowerY1 = 18;
        const topPowerY2 = 28;
        const topRows = [
          { label: 'j', y: 62 },
          { label: 'i', y: 70 },
          { label: 'h', y: 78 },
          { label: 'g', y: 86 },
          { label: 'f', y: 94 },
        ];
        const botRows = [
          { label: 'e', y: 118 },
          { label: 'd', y: 126 },
          { label: 'c', y: 134 },
          { label: 'b', y: 142 },
          { label: 'a', y: 150 },
        ];
        const botPowerY1 = 178;
        const botPowerY2 = 188;

        const getColX = (colIdx: number) => 36 + colIdx * 10 + Math.floor(colIdx / 5) * 6;

        return (
          <g>
            {/* Interlocking Connection Tabs (Left edge & Top edge) */}
            <circle cx={-3} cy={28} r={5} fill="#F1F3F5" stroke="#D1D5DB" strokeWidth={1} />
            <circle cx={-3} cy={106} r={5} fill="#F1F3F5" stroke="#D1D5DB" strokeWidth={1} />
            <circle cx={-3} cy={182} r={5} fill="#F1F3F5" stroke="#D1D5DB" strokeWidth={1} />
            <circle cx={72} cy={-3} r={5} fill="#F1F3F5" stroke="#D1D5DB" strokeWidth={1} />
            <circle cx={308} cy={-3} r={5} fill="#F1F3F5" stroke="#D1D5DB" strokeWidth={1} />

            {/* Main Breadboard Off-White Body */}
            <rect
              x={0}
              y={0}
              width={width}
              height={height}
              rx={6}
              fill="#FAF9F6"
              stroke="#D1D5DB"
              strokeWidth={1.5}
              filter="drop-shadow(0 4px 10px rgba(0,0,0,0.35))"
            />

            {/* Sub-block Grooves / Section Separators */}
            <line x1={0} y1={46} x2={width} y2={46} stroke="#E5E7EB" strokeWidth={1} />
            <line x1={0} y1={162} x2={width} y2={162} stroke="#E5E7EB" strokeWidth={1} />

            {/* Central IC DIP Ravine Divider */}
            <rect x={0} y={103} width={width} height={8} fill="#E5E7EB" stroke="#D1D5DB" strokeWidth={0.5} />
            <line x1={0} y1={103} x2={width} y2={103} stroke="#9CA3AF" strokeWidth={0.5} opacity={0.6} />
            <line x1={0} y1={111} x2={width} y2={111} stroke="#FFFFFF" strokeWidth={0.5} opacity={0.8} />

            {/* ================= TOP POWER RAILS ================= */}
            {/* Top Negative Rail (Blue) */}
            <line x1={32} y1={10} x2={348} y2={10} stroke="#38BDF8" strokeWidth={1.5} strokeLinecap="round" />
            <text x={16} y={14} fill="#0284C7" fontSize={13} fontWeight="900" textAnchor="middle" fontFamily="sans-serif">−</text>
            <text x={364} y={14} fill="#0284C7" fontSize={13} fontWeight="900" textAnchor="middle" fontFamily="sans-serif">−</text>

            {/* Top Positive Rail (Red) */}
            <line x1={32} y1={36} x2={348} y2={36} stroke="#EF4444" strokeWidth={1.5} strokeLinecap="round" />
            <text x={16} y={40} fill="#DC2626" fontSize={13} fontWeight="900" textAnchor="middle" fontFamily="sans-serif">+</text>
            <text x={364} y={40} fill="#DC2626" fontSize={13} fontWeight="900" textAnchor="middle" fontFamily="sans-serif">+</text>

            {/* Top Power Tie Points */}
            {cols.map((c) => {
              const x = getColX(c);
              return (
                <g key={`top-pwr-${c}`}>
                  {/* Top (-) Power Hole */}
                  <rect x={x - 2.5} y={topPowerY1 - 2.5} width={5} height={5} rx={0.8} fill="#1E293B" stroke="#CBD5E1" strokeWidth={0.5} />
                  <rect x={x - 1} y={topPowerY1 - 1} width={2} height={2} fill="#94A3B8" />
                  {/* Top (+) Power Hole */}
                  <rect x={x - 2.5} y={topPowerY2 - 2.5} width={5} height={5} rx={0.8} fill="#1E293B" stroke="#CBD5E1" strokeWidth={0.5} />
                  <rect x={x - 1} y={topPowerY2 - 1} width={2} height={2} fill="#94A3B8" />
                </g>
              );
            })}

            {/* ================= TOP TERMINAL STRIP (f-j) ================= */}
            {/* Top Column Number Labels */}
            {cols.map((c) => (
              <text
                key={`top-num-${c}`}
                x={getColX(c)}
                y={54}
                fill="#64748B"
                fontSize={5.5}
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="monospace"
              >
                {c + 1}
              </text>
            ))}

            {/* Left & Right Row Labels (f to j) */}
            {topRows.map((r) => (
              <g key={`top-row-lbl-${r.label}`}>
                <text x={20} y={r.y + 2.5} fill="#64748B" fontSize={7.5} fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  {r.label}
                </text>
                <text x={360} y={r.y + 2.5} fill="#64748B" fontSize={7.5} fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  {r.label}
                </text>
              </g>
            ))}

            {/* 5x30 Top Tie Points */}
            {cols.map((c) => {
              const x = getColX(c);
              return topRows.map((r) => (
                <g key={`top-hole-${c}-${r.label}`}>
                  <rect x={x - 2.5} y={r.y - 2.5} width={5} height={5} rx={0.8} fill="#1E293B" stroke="#CBD5E1" strokeWidth={0.5} />
                  <rect x={x - 1} y={r.y - 1} width={2} height={2} fill="#94A3B8" />
                </g>
              ));
            })}

            {/* ================= BOTTOM TERMINAL STRIP (a-e) ================= */}
            {/* Left & Right Row Labels (a to e) */}
            {botRows.map((r) => (
              <g key={`bot-row-lbl-${r.label}`}>
                <text x={20} y={r.y + 2.5} fill="#64748B" fontSize={7.5} fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  {r.label}
                </text>
                <text x={360} y={r.y + 2.5} fill="#64748B" fontSize={7.5} fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  {r.label}
                </text>
              </g>
            ))}

            {/* 5x30 Bottom Tie Points */}
            {cols.map((c) => {
              const x = getColX(c);
              return botRows.map((r) => (
                <g key={`bot-hole-${c}-${r.label}`}>
                  <rect x={x - 2.5} y={r.y - 2.5} width={5} height={5} rx={0.8} fill="#1E293B" stroke="#CBD5E1" strokeWidth={0.5} />
                  <rect x={x - 1} y={r.y - 1} width={2} height={2} fill="#94A3B8" />
                </g>
              ));
            })}

            {/* Bottom Column Number Labels */}
            {cols.map((c) => (
              <text
                key={`bot-num-${c}`}
                x={getColX(c)}
                y={159}
                fill="#64748B"
                fontSize={5.5}
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="monospace"
              >
                {c + 1}
              </text>
            ))}

            {/* ================= BOTTOM POWER RAILS ================= */}
            {/* Bottom Negative Rail (Blue) */}
            <line x1={32} y1={170} x2={348} y2={170} stroke="#38BDF8" strokeWidth={1.5} strokeLinecap="round" />
            <text x={16} y={174} fill="#0284C7" fontSize={13} fontWeight="900" textAnchor="middle" fontFamily="sans-serif">−</text>
            <text x={364} y={174} fill="#0284C7" fontSize={13} fontWeight="900" textAnchor="middle" fontFamily="sans-serif">−</text>

            {/* Bottom Positive Rail (Red) */}
            <line x1={32} y1={196} x2={348} y2={196} stroke="#EF4444" strokeWidth={1.5} strokeLinecap="round" />
            <text x={16} y={200} fill="#DC2626" fontSize={13} fontWeight="900" textAnchor="middle" fontFamily="sans-serif">+</text>
            <text x={364} y={200} fill="#DC2626" fontSize={13} fontWeight="900" textAnchor="middle" fontFamily="sans-serif">+</text>

            {/* Bottom Power Tie Points */}
            {cols.map((c) => {
              const x = getColX(c);
              return (
                <g key={`bot-pwr-${c}`}>
                  {/* Bottom (-) Power Hole */}
                  <rect x={x - 2.5} y={botPowerY1 - 2.5} width={5} height={5} rx={0.8} fill="#1E293B" stroke="#CBD5E1" strokeWidth={0.5} />
                  <rect x={x - 1} y={botPowerY1 - 1} width={2} height={2} fill="#94A3B8" />
                  {/* Bottom (+) Power Hole */}
                  <rect x={x - 2.5} y={botPowerY2 - 2.5} width={5} height={5} rx={0.8} fill="#1E293B" stroke="#CBD5E1" strokeWidth={0.5} />
                  <rect x={x - 1} y={botPowerY2 - 1} width={2} height={2} fill="#94A3B8" />
                </g>
              );
            })}
          </g>
        );
      }

      // =========================================================================
      // 12. REALISTIC DUPONT JUMPER WIRE (M-M)
      // =========================================================================
      case 'jumper_wire': {
        const wireColor = def.bodyColor || '#EF4444';
        return (
          <g>
            {/* Flexible Silicone Wire Body with 3D Highlight Glare */}
            <path
              d="M 24 20 C 52 2, 88 38, 116 20"
              fill="none"
              stroke={wireColor}
              strokeWidth={6}
              strokeLinecap="round"
              filter="drop-shadow(0 3px 5px rgba(0,0,0,0.4))"
            />
            <path
              d="M 24 20 C 52 2, 88 38, 116 20"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={1.5}
              opacity={0.35}
              strokeLinecap="round"
            />

            {/* Left Dupont Connector Housing Boot */}
            <rect x={12} y={12} width={15} height={16} rx={2} fill="#1E293B" stroke="#0F172A" strokeWidth={1.2} />
            <rect x={15} y={16} width={4} height={8} rx={1} fill="#0F172A" />
            <line x1={20} y1={12} x2={20} y2={28} stroke="#334155" strokeWidth={0.8} />

            {/* Left Silver Metal Pin Tip */}
            <rect x={2} y={18.5} width={10} height={3} rx={0.5} fill="#E2E8F0" stroke="#94A3B8" strokeWidth={0.6} />

            {/* Right Dupont Connector Housing Boot */}
            <rect x={113} y={12} width={15} height={16} rx={2} fill="#1E293B" stroke="#0F172A" strokeWidth={1.2} />
            <rect x={121} y={16} width={4} height={8} rx={1} fill="#0F172A" />
            <line x1={120} y1={12} x2={120} y2={28} stroke="#334155" strokeWidth={0.8} />

            {/* Right Silver Metal Pin Tip */}
            <rect x={128} y={18.5} width={10} height={3} rx={0.5} fill="#E2E8F0" stroke="#94A3B8" strokeWidth={0.6} />
          </g>
        );
      }

      // =========================================================================
      // DEFAULT REALISTIC CHIP IC
      // =========================================================================
      default:
        return (
          <g>
            <rect x={0} y={0} width={width} height={height} rx={6} fill={def.bodyColor || '#1E293B'} stroke="#475569" strokeWidth={1.5} filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))" />
            <rect x={4} y={4} width={width - 8} height={height - 8} rx={4} fill="#0F172A" opacity={0.4} />
            <text x={width / 2} y={height / 2 + 4} fill="#F8FAFC" fontSize={11} fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
              {def.name}
            </text>
          </g>
        );
    }
  };

  return (
    <g
      transform={`translate(${component.x}, ${component.y}) rotate(${component.rotation || 0}, ${scaledWidth / 2}, ${scaledHeight / 2}) scale(${scale})`}
      onMouseDown={onMouseDown}
      className="cursor-move select-none"
    >
      {/* Selection Glowing Outline */}
      {isSelected && (
        <rect
          x={-4}
          y={-4}
          width={width + 8}
          height={height + 8}
          rx={8}
          fill="none"
          stroke="#38BDF8"
          strokeWidth={2}
          strokeDasharray="4 2"
          className="animate-pulse"
        />
      )}

      {/* Photorealistic Hardware Illustration */}
      {renderRealisticVisuals()}

      {/* Component Reference Label Top Banner */}
      <text
        x={width / 2}
        y={-8}
        fill="#38BDF8"
        fontSize={12}
        fontWeight="bold"
        fontFamily="monospace"
        textAnchor="middle"
        className="pointer-events-none drop-shadow"
      >
        {component.label}
      </text>

      {/* Terminal Connection Pins with Gold Metal Pads */}
      {pins.map((pin) => {
        const pinCoords = getPinAbsoluteCoords(pin);

        return (
          <g
            key={pin.id}
            onMouseDown={(e) => {
              e.stopPropagation();
              onPinMouseDown(pin, pinCoords.x, pinCoords.y, e);
            }}
            onMouseUp={(e) => {
              e.stopPropagation();
              onPinMouseUp(pin, e);
            }}
            className="group cursor-crosshair"
          >
            {/* Gold Outer Pad */}
            <circle
              cx={pin.x}
              cy={pin.y}
              r={6.5}
              fill="#D97706"
              stroke="#78350F"
              strokeWidth={1}
            />

            {/* Inner Metallic Solder Dot */}
            <circle
              cx={pin.x}
              cy={pin.y}
              r={4}
              fill={pin.color || '#38BDF8'}
              className="transition-transform group-hover:scale-150"
            />

            {/* Large Transparent Hover Area */}
            <circle
              cx={pin.x}
              cy={pin.y}
              r={14}
              fill="transparent"
              className="hover:stroke-sky-400 hover:stroke-1"
            />

            {/* Crisp Silkscreen Pin Label */}
            <text
              x={pin.side === 'left' ? pin.x + 10 : pin.side === 'right' ? pin.x - 10 : pin.x}
              y={pin.side === 'top' ? pin.y + 14 : pin.side === 'bottom' ? pin.y - 10 : pin.y + 3.5}
              fill="#F8FAFC"
              fontSize={8.5}
              fontWeight="900"
              fontFamily="monospace"
              textAnchor={pin.side === 'left' ? 'start' : pin.side === 'right' ? 'end' : 'middle'}
              className="pointer-events-none select-none drop-shadow"
            >
              {pin.name}
            </text>
          </g>
        );
      })}
    </g>
  );
}
