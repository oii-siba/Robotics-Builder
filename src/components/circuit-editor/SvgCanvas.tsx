'use client';

import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { useCircuitStore } from '@/lib/circuit-engine/circuit-store';
import { SvgComponentRenderer } from './SvgComponentRenderer';
import { CIRCUIT_COMPONENTS_LIBRARY } from '@/lib/circuit-engine/components-library';
import { CircuitPinDef, PlacedCircuitComponent, Point, CircuitWire } from '@/lib/circuit-engine/types';

interface Segment {
  p1: Point;
  p2: Point;
  isHoriz: boolean;
  wireId: string;
}

export function SvgCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const components = useCircuitStore((state) => state.components);
  const wires = useCircuitStore((state) => state.wires);
  const selectedComponentId = useCircuitStore((state) => state.selectedComponentId);
  const selectedWireId = useCircuitStore((state) => state.selectedWireId);
  const setSelectedComponent = useCircuitStore((state) => state.setSelectedComponent);
  const setSelectedWire = useCircuitStore((state) => state.setSelectedWire);

  const zoom = useCircuitStore((state) => state.zoom);
  const pan = useCircuitStore((state) => state.pan);
  const setZoom = useCircuitStore((state) => state.setZoom);
  const setPan = useCircuitStore((state) => state.setPan);
  const showGrid = useCircuitStore((state) => state.showGrid);
  const snapToGrid = useCircuitStore((state) => state.snapToGrid);
  const gridSize = useCircuitStore((state) => state.gridSize);

  const updateComponentPosition = useCircuitStore((state) => state.updateComponentPosition);
  const addComponent = useCircuitStore((state) => state.addComponent);

  const isDrawingWire = useCircuitStore((state) => state.isDrawingWire);
  const wireStart = useCircuitStore((state) => state.wireStart);
  const wireWaypoints = useCircuitStore((state) => state.wireWaypoints);
  const mousePos = useCircuitStore((state) => state.mousePos);
  const startWire = useCircuitStore((state) => state.startWire);
  const startWireFromPoint = useCircuitStore((state) => state.startWireFromPoint);
  const addWireWaypoint = useCircuitStore((state) => state.addWireWaypoint);
  const updateMousePos = useCircuitStore((state) => state.updateMousePos);
  const completeWire = useCircuitStore((state) => state.completeWire);
  const completeWireAtPoint = useCircuitStore((state) => state.completeWireAtPoint);
  const cancelWire = useCircuitStore((state) => state.cancelWire);
  const removeWire = useCircuitStore((state) => state.removeWire);
  const activeWireColor = useCircuitStore((state) => state.activeWireColor);

  // Dragging state
  const [draggingCompId, setDraggingCompId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });

  // Panning state
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<Point>({ x: 0, y: 0 });

  // Screen to World converter
  const screenToWorld = useCallback(
    (clientX: number, clientY: number) => {
      if (!svgRef.current) return { x: 0, y: 0 };
      const rect = svgRef.current.getBoundingClientRect();
      const x = (clientX - rect.left - pan.x) / zoom;
      const y = (clientY - rect.top - pan.y) / zoom;
      return { x, y };
    },
    [pan, zoom]
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const defId = e.dataTransfer.getData('application/robotics-component');
    if (!defId) return;

    const world = screenToWorld(e.clientX, e.clientY);
    addComponent(defId, world.x, world.y);
  };

  // Helper to find exact coordinates of pin or point
  const getPinCanvasCoords = useCallback(
    (componentId?: string, pinId?: string, fallbackPoint?: Point): Point => {
      if (fallbackPoint) return fallbackPoint;
      if (!componentId || !pinId) return { x: 0, y: 0 };

      const comp = components.find((c) => c.instanceId === componentId);
      if (!comp) return { x: 0, y: 0 };

      const def = CIRCUIT_COMPONENTS_LIBRARY.find((d) => d.id === comp.defId);
      if (!def) return { x: comp.x, y: comp.y };

      const pin = def.pins.find((p) => p.id === pinId);
      if (!pin) return { x: comp.x, y: comp.y };

      if (!comp.rotation || comp.rotation === 0) {
        return { x: comp.x + pin.x, y: comp.y + pin.y };
      }

      const rad = (comp.rotation * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const cx = def.width / 2;
      const cy = def.height / 2;
      const dx = pin.x - cx;
      const dy = pin.y - cy;
      const rx = dx * cos - dy * sin;
      const ry = dx * sin + dy * cos;

      return {
        x: comp.x + cx + rx,
        y: comp.y + cy + ry,
      };
    },
    [components]
  );

  // Decompose a list of multi-point waypoints into orthogonal sub-segments
  const getOrthogonalPoints = useCallback((points: Point[]): Point[] => {
    if (points.length < 2) return points;
    const result: Point[] = [points[0]];

    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];

      if (p1.x !== p2.x && p1.y !== p2.y) {
        const midX = p1.x + (p2.x - p1.x) / 2;
        result.push({ x: midX, y: p1.y });
        result.push({ x: midX, y: p2.y });
      }
      result.push(p2);
    }
    return result;
  }, []);

  // Compute all vertical and horizontal line segments for all wires to detect crossings
  const allWireSegments = useMemo(() => {
    const segments: Segment[] = [];

    wires.forEach((w) => {
      const pStart = getPinCanvasCoords(w.fromComponentId, w.fromPinId, w.fromPoint);
      const pEnd = getPinCanvasCoords(w.toComponentId, w.toPinId, w.toPoint);
      const rawPoints = [pStart, ...(w.waypoints || []), pEnd];
      const ortho = getOrthogonalPoints(rawPoints);

      for (let i = 0; i < ortho.length - 1; i++) {
        const p1 = ortho[i];
        const p2 = ortho[i + 1];
        const isHoriz = Math.abs(p1.y - p2.y) < 0.001;
        segments.push({ p1, p2, isHoriz, wireId: w.id });
      }
    });

    return segments;
  }, [wires, getPinCanvasCoords, getOrthogonalPoints]);

  // Generate SVG path with automatic Semicircular Jump Arcs (`⌒`) on crossing wires
  const buildWirePathWithJumps = useCallback(
    (points: Point[], currentWireId?: string): string => {
      if (points.length < 2) return '';
      const ortho = getOrthogonalPoints(points);
      const bridgeRadius = 6;

      let d = `M ${ortho[0].x} ${ortho[0].y}`;

      for (let i = 0; i < ortho.length - 1; i++) {
        const p1 = ortho[i];
        const p2 = ortho[i + 1];
        const isHoriz = Math.abs(p1.y - p2.y) < 0.001;

        if (isHoriz) {
          const y = p1.y;
          const minX = Math.min(p1.x, p2.x);
          const maxX = Math.max(p1.x, p2.x);
          const dir = p2.x > p1.x ? 1 : -1;

          // Find crossing vertical segments from other wires
          const crossings: number[] = [];
          allWireSegments.forEach((seg) => {
            if (seg.wireId !== currentWireId && !seg.isHoriz) {
              const vx = seg.p1.x;
              const minY = Math.min(seg.p1.y, seg.p2.y);
              const maxY = Math.max(seg.p1.y, seg.p2.y);

              // Check if vertical segment crosses this horizontal segment strictly inside
              if (vx > minX + bridgeRadius + 2 && vx < maxX - bridgeRadius - 2) {
                if (y > minY + 2 && y < maxY - 2) {
                  crossings.push(vx);
                }
              }
            }
          });

          // Sort crossings in travel direction
          if (dir === 1) {
            crossings.sort((a, b) => a - b);
          } else {
            crossings.sort((a, b) => b - a);
          }

          if (crossings.length === 0) {
            d += ` L ${p2.x} ${p2.y}`;
          } else {
            let curX = p1.x;
            crossings.forEach((cx) => {
              const beforeX = cx - dir * bridgeRadius;
              const afterX = cx + dir * bridgeRadius;

              // Draw straight line to the start of the bridge arch
              d += ` L ${beforeX} ${y}`;

              // Draw Semicircular Upward Jump Arch `⌒` over the crossing wire!
              // SVG Arc: A rx ry x-axis-rotation large-arc-flag sweep-flag x y
              if (dir === 1) {
                // Moving Left to Right: arch curves upward (sweep = 0)
                d += ` A ${bridgeRadius} ${bridgeRadius} 0 0 0 ${afterX} ${y}`;
              } else {
                // Moving Right to Left: arch curves upward (sweep = 1)
                d += ` A ${bridgeRadius} ${bridgeRadius} 0 0 1 ${afterX} ${y}`;
              }

              curX = afterX;
            });
            d += ` L ${p2.x} ${y}`;
          }
        } else {
          // Vertical segment (draw straight, horizontal segments jump over it)
          d += ` L ${p2.x} ${p2.y}`;
        }
      }

      return d;
    },
    [allWireSegments, getOrthogonalPoints]
  );

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const world = screenToWorld(e.clientX, e.clientY);

    // Right click cancels wire
    if (e.button === 2) {
      e.preventDefault();
      if (isDrawingWire) cancelWire();
      return;
    }

    // Middle click or Alt/Shift to pan
    if (e.button === 1 || e.altKey || e.shiftKey) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      return;
    }

    // When drawing wire, clicking empty canvas adds a custom waypoint corner
    if (isDrawingWire) {
      addWireWaypoint(world.x, world.y);
      return;
    }

    // Click on canvas background deselects
    if (e.target === svgRef.current || (e.target as any)?.id === 'circuit-main-svg') {
      setSelectedComponent(null);
      setSelectedWire(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const world = screenToWorld(e.clientX, e.clientY);

    if (isDrawingWire) {
      updateMousePos(world.x, world.y);
    }

    if (draggingCompId) {
      const newX = world.x - dragOffset.x;
      const newY = world.y - dragOffset.y;
      updateComponentPosition(draggingCompId, newX, newY);
    }

    if (isPanning) {
      setPan(e.clientX - panStart.x, e.clientY - panStart.y);
    }
  };

  const handleMouseUp = () => {
    setDraggingCompId(null);
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom(zoom * zoomFactor);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawingWire) {
        cancelWire();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawingWire, cancelWire]);

  return (
    <div
      ref={containerRef}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onWheel={handleWheel}
      onContextMenu={(e) => e.preventDefault()}
      className="w-full h-full relative overflow-hidden bg-[#0A0E17] select-none cursor-default"
    >
      <svg
        ref={svgRef}
        id="circuit-main-svg"
        width="100%"
        height="100%"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="w-full h-full block"
      >
        {/* Background Dot Grid Pattern */}
        <defs>
          <pattern
            id="circuit-grid"
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
          >
            <circle cx="1" cy="1" r="1.2" fill={showGrid ? '#334155' : 'transparent'} />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#circuit-grid)" />

        {/* Scalable & Pannable Viewport Group */}
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Render Completed Schematic Wires with Jump Arcs */}
          {wires.map((wire) => {
            const pStart = getPinCanvasCoords(wire.fromComponentId, wire.fromPinId, wire.fromPoint);
            const pEnd = getPinCanvasCoords(wire.toComponentId, wire.toPinId, wire.toPoint);
            const allPoints = [pStart, ...(wire.waypoints || []), pEnd];
            const pathData = buildWirePathWithJumps(allPoints, wire.id);
            const isSelected = selectedWireId === wire.id;

            return (
              <g
                key={wire.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isDrawingWire) {
                    const world = screenToWorld(e.clientX, e.clientY);
                    completeWireAtPoint(world.x, world.y, wire.id);
                  } else {
                    setSelectedWire(wire.id);
                  }
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  const world = screenToWorld(e.clientX, e.clientY);
                  startWireFromPoint(world.x, world.y);
                }}
                className="cursor-pointer group"
              >
                {/* Thick hover / click target */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="16"
                  className="hover:stroke-sky-400/20"
                />

                {/* Visible Wire with Clean Semicircular Jump Arcs */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={isSelected ? '#38BDF8' : wire.color || '#38BDF8'}
                  strokeWidth={isSelected ? 4 : 2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all group-hover:stroke-sky-300"
                />

                {/* Pin Terminal Dots */}
                <circle cx={pStart.x} cy={pStart.y} r={3.5} fill={wire.color || '#38BDF8'} />
                <circle cx={pEnd.x} cy={pEnd.y} r={3.5} fill={wire.color || '#38BDF8'} />

                {/* Solid T-Junction Connection Node if tapped into wire */}
                {(wire.isJunction || wire.fromPoint || wire.toPoint) && (
                  <circle
                    cx={pEnd.x}
                    cy={pEnd.y}
                    r={5.5}
                    fill={wire.color || '#38BDF8'}
                    stroke="#0F172A"
                    strokeWidth={1.5}
                    className="drop-shadow"
                  />
                )}

                {/* Corner Waypoint Dots */}
                {wire.waypoints?.map((wp, idx) => (
                  <circle
                    key={idx}
                    cx={wp.x}
                    cy={wp.y}
                    r={2.5}
                    fill={wire.color || '#38BDF8'}
                    opacity={0.8}
                  />
                ))}
              </g>
            );
          })}

          {/* Render Active Multi-Point Wire Preview while drawing */}
          {isDrawingWire && wireStart && (
            <g className="pointer-events-none">
              {(() => {
                const activePoints = [
                  { x: wireStart.x, y: wireStart.y },
                  ...wireWaypoints,
                  { x: mousePos.x, y: mousePos.y },
                ];
                const activePath = buildWirePathWithJumps(activePoints);

                return (
                  <>
                    <path
                      d={activePath}
                      fill="none"
                      stroke={activeWireColor}
                      strokeWidth="2.5"
                      strokeDasharray="4 4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {activePoints.map((pt, idx) => (
                      <circle
                        key={idx}
                        cx={pt.x}
                        cy={pt.y}
                        r={idx === activePoints.length - 1 ? 5 : 3.5}
                        fill={activeWireColor}
                        className={idx === activePoints.length - 1 ? 'animate-pulse' : ''}
                      />
                    ))}
                  </>
                );
              })()}
            </g>
          )}

          {/* Empty Canvas Welcome Watermark */}
          {components.length === 0 && (
            <g transform="translate(320, 220)" className="pointer-events-none select-none opacity-80">
              <rect x="-200" y="-80" width="400" height="160" rx="16" fill="#0F172A" stroke="#1E293B" strokeWidth="1.5" />
              <circle cx="0" cy="-35" r="22" fill="#0284C7" opacity="0.15" />
              <text x="0" y="-30" fill="#38BDF8" fontSize="20" fontWeight="bold" textAnchor="middle">
                ⚡
              </text>
              <text x="0" y="0" fill="#F8FAFC" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                Circuit Canvas Ready
              </text>
              <text x="0" y="24" fill="#94A3B8" fontSize="11" textAnchor="middle" fontFamily="sans-serif">
                👈 Drag or click any component from the catalog on the left to start!
              </text>
              <text x="0" y="44" fill="#64748B" fontSize="10" textAnchor="middle" fontFamily="monospace">
                (Or load a pre-built circuit from the Templates menu above)
              </text>
            </g>
          )}

          {/* Render Placed Robotics Components */}
          {components.map((comp) => (
            <SvgComponentRenderer
              key={comp.instanceId}
              component={comp}
              isSelected={comp.instanceId === selectedComponentId}
              onMouseDown={(e) => {
                e.stopPropagation();
                setSelectedComponent(comp.instanceId);
                const world = screenToWorld(e.clientX, e.clientY);
                setDraggingCompId(comp.instanceId);
                setDragOffset({ x: world.x - comp.x, y: world.y - comp.y });
              }}
              onPinMouseDown={(pin, pinX, pinY, e) => {
                e.stopPropagation();
                if (isDrawingWire) {
                  completeWire(comp.instanceId, pin.id);
                } else {
                  startWire(comp.instanceId, pin.id, pinX, pinY);
                }
              }}
              onPinMouseUp={(pin, e) => {
                e.stopPropagation();
                if (isDrawingWire) {
                  completeWire(comp.instanceId, pin.id);
                }
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
