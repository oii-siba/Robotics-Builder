'use client';

import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Crosshair, Trash2 } from 'lucide-react';
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
  const setZoomAndPan = useCircuitStore((state) => state.setZoomAndPan);
  const fitToScreen = useCircuitStore((state) => state.fitToScreen);
  const showGrid = useCircuitStore((state) => state.showGrid);
  const snapToGrid = useCircuitStore((state) => state.snapToGrid);
  const gridSize = useCircuitStore((state) => state.gridSize);

  const updateComponentPosition = useCircuitStore((state) => state.updateComponentPosition);
  const updateComponentScale = useCircuitStore((state) => state.updateComponentScale);
  const rotateComponent = useCircuitStore((state) => state.rotateComponent);
  const addComponent = useCircuitStore((state) => state.addComponent);
  const removeComponent = useCircuitStore((state) => state.removeComponent);

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

  const isCollaborating = useCircuitStore((state) => state.isCollaborating);
  const collaborators = useCircuitStore((state) => state.collaborators);
  const myCollabUser = useCircuitStore((state) => state.myCollabUser);
  const updateMyCursor = useCircuitStore((state) => state.updateMyCursor);

  // Wire quick actions menu position
  const [wireMenuPos, setWireMenuPos] = useState<Point | null>(null);

  // Dragging & Resizing state
  const [draggingCompId, setDraggingCompId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });
  const [resizingState, setResizingState] = useState<{
    compId: string;
    handle: string;
    startMouseX: number;
    startMouseY: number;
    startScale: number;
    initialW: number;
    initialH: number;
  } | null>(null);

  // Smart Alignment Laser Guidelines (Green lines during component movement)
  const [activeAlignmentLines, setActiveAlignmentLines] = useState<
    { type: 'vertical' | 'horizontal'; pos: number; label: string }[]
  >([]);

  const lastCursorBroadcast = useRef<number>(0);

  // Panning state
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<Point>({ x: 0, y: 0 });

  // Screen to World converter
  const screenToWorld = useCallback(
    (clientX: number, clientY: number) => {
      const rect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
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

  // Helper to find exact coordinates of pin or point (with scale support)
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

      const scale = comp.scale || 1;
      const pinX = pin.x * scale;
      const pinY = pin.y * scale;
      const compW = def.width * scale;
      const compH = def.height * scale;

      if (!comp.rotation || comp.rotation === 0) {
        return { x: comp.x + pinX, y: comp.y + pinY };
      }

      const rad = (comp.rotation * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const cx = compW / 2;
      const cy = compH / 2;
      const dx = pinX - cx;
      const dy = pinY - cy;
      const rx = dx * cos - dy * sin;
      const ry = dx * sin + dy * cos;

      return {
        x: comp.x + cx + rx,
        y: comp.y + cy + ry,
      };
    },
    [components]
  );

  // List of all active pins in canvas for auto magnetic snap
  const allPins = useMemo(() => {
    const list: {
      componentId: string;
      pinId: string;
      pinName: string;
      x: number;
      y: number;
      side: string;
    }[] = [];

    components.forEach((comp) => {
      const def = CIRCUIT_COMPONENTS_LIBRARY.find((d) => d.id === comp.defId);
      if (!def) return;
      def.pins.forEach((pin) => {
        const coords = getPinCanvasCoords(comp.instanceId, pin.id);
        list.push({
          componentId: comp.instanceId,
          pinId: pin.id,
          pinName: pin.name,
          x: coords.x,
          y: coords.y,
          side: pin.side,
        });
      });
    });

    return list;
  }, [components, getPinCanvasCoords]);

  // Smart Straight Axis Alignment & Pin Snapping (Sojashoji Straight Wire Alignment)
  const getSnappedWirePoint = useCallback(
    (worldX: number, worldY: number) => {
      if (!isDrawingWire || !wireStart) {
        return { x: worldX, y: worldY, isAlignedH: false, isAlignedV: false, targetPin: null };
      }

      const lastPoint =
        wireWaypoints.length > 0
          ? wireWaypoints[wireWaypoints.length - 1]
          : { x: wireStart.x, y: wireStart.y };

      // 1. Magnetic Pin Snapping (tolerance ~24px)
      const targetPin = allPins.find((p) => {
        if (p.componentId === wireStart.componentId && p.pinId === wireStart.pinId) return false;
        const dx = p.x - worldX;
        const dy = p.y - worldY;
        return Math.sqrt(dx * dx + dy * dy) < 24;
      });

      if (targetPin) {
        return {
          x: targetPin.x,
          y: targetPin.y,
          isAlignedH: Math.abs(targetPin.y - lastPoint.y) < 1,
          isAlignedV: Math.abs(targetPin.x - lastPoint.x) < 1,
          targetPin,
        };
      }

      // 2. Straight Axis Snapping (locks perfectly horizontal or vertical within 16px)
      let sx = worldX;
      let sy = worldY;
      let isAlignedH = false;
      let isAlignedV = false;

      if (Math.abs(worldY - lastPoint.y) < 16) {
        sy = lastPoint.y;
        isAlignedH = true;
      }
      if (Math.abs(worldX - lastPoint.x) < 16) {
        sx = lastPoint.x;
        isAlignedV = true;
      }

      // 3. Grid snap fallback if grid enabled and not axis locked
      if (snapToGrid) {
        if (!isAlignedV) sx = Math.round(sx / gridSize) * gridSize;
        if (!isAlignedH) sy = Math.round(sy / gridSize) * gridSize;
      }

      return {
        x: sx,
        y: sy,
        isAlignedH,
        isAlignedV,
        targetPin: null,
      };
    },
    [isDrawingWire, wireStart, wireWaypoints, allPins, snapToGrid, gridSize]
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

  // Zoom smoothly relative to a specific screen coordinate (cursor or center)
  const zoomAtPoint = useCallback(
    (newZoomVal: number, screenPoint: Point) => {
      const clampedZoom = Math.max(0.2, Math.min(3.0, Number(newZoomVal.toFixed(3))));
      const currentZoom = useCircuitStore.getState().zoom;
      const currentPan = useCircuitStore.getState().pan;

      if (Math.abs(clampedZoom - currentZoom) < 0.001) return;

      // Keep world coordinates under screenPoint invariant:
      // worldX = (screenPoint.x - currentPan.x) / currentZoom
      // newPanX = screenPoint.x - worldX * clampedZoom
      const worldX = (screenPoint.x - currentPan.x) / currentZoom;
      const worldY = (screenPoint.y - currentPan.y) / currentZoom;

      const newPanX = screenPoint.x - worldX * clampedZoom;
      const newPanY = screenPoint.y - worldY * clampedZoom;

      setZoomAndPan(clampedZoom, { x: newPanX, y: newPanY });
    },
    [setZoomAndPan]
  );

  // Zoom In / Out from screen center
  const handleZoomIn = useCallback(() => {
    if (!containerRef.current) {
      setZoom(zoom + 0.2);
      return;
    }
    const rect = containerRef.current.getBoundingClientRect();
    zoomAtPoint(zoom * 1.25, { x: rect.width / 2, y: rect.height / 2 });
  }, [zoom, zoomAtPoint, setZoom]);

  const handleZoomOut = useCallback(() => {
    if (!containerRef.current) {
      setZoom(zoom - 0.2);
      return;
    }
    const rect = containerRef.current.getBoundingClientRect();
    zoomAtPoint(zoom / 1.25, { x: rect.width / 2, y: rect.height / 2 });
  }, [zoom, zoomAtPoint, setZoom]);

  const handleFitToScreen = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    fitToScreen(rect.width, rect.height);
  }, [fitToScreen]);

  const handleResetView = useCallback(() => {
    setZoomAndPan(1, { x: 40, y: 30 });
  }, [setZoomAndPan]);

  // Non-passive wheel event listener for smooth cursor-focused zooming and preventing page scroll/zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      const rect = container.getBoundingClientRect();
      const screenPoint = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      const isPinch = e.ctrlKey || e.metaKey;
      let zoomDelta = -e.deltaY;

      // Normalize delta across high-res trackpads vs notched mouse wheels
      if (Math.abs(zoomDelta) > 100) {
        zoomDelta = Math.sign(zoomDelta) * 70;
      }

      const factor = isPinch
        ? Math.exp(zoomDelta * 0.008)
        : Math.exp(zoomDelta * 0.002);

      const currentZoom = useCircuitStore.getState().zoom;
      zoomAtPoint(currentZoom * factor, screenPoint);
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', onWheel);
    };
  }, [zoomAtPoint]);

  // Multi-touch gestures: Pinch-to-zoom and 2-finger pan, 1-finger canvas background pan
  const touchState = useRef<{
    initialDist: number | null;
    initialZoom: number;
    initialPan: Point;
    initialCenter: Point;
    isSingleTouchPanning: boolean;
    lastTouch: Point;
  }>({
    initialDist: null,
    initialZoom: 1,
    initialPan: { x: 0, y: 0 },
    initialCenter: { x: 0, y: 0 },
    isSingleTouchPanning: false,
    lastTouch: { x: 0, y: 0 },
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getDistance = (t1: Touch, t2: Touch) => {
      const dx = t1.clientX - t2.clientX;
      const dy = t1.clientY - t2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const getCenter = (t1: Touch, t2: Touch, rect: DOMRect) => {
      return {
        x: (t1.clientX + t2.clientX) / 2 - rect.left,
        y: (t1.clientY + t2.clientY) / 2 - rect.top,
      };
    };

    const onTouchStart = (e: TouchEvent) => {
      const rect = container.getBoundingClientRect();
      if (e.touches.length === 2) {
        e.preventDefault();
        const dist = getDistance(e.touches[0], e.touches[1]);
        const center = getCenter(e.touches[0], e.touches[1], rect);
        touchState.current = {
          initialDist: dist,
          initialZoom: useCircuitStore.getState().zoom,
          initialPan: { ...useCircuitStore.getState().pan },
          initialCenter: center,
          isSingleTouchPanning: false,
          lastTouch: { x: 0, y: 0 },
        };
      } else if (e.touches.length === 1) {
        const target = e.target as Element | null;
        const isBg =
          target === container ||
          target === svgRef.current ||
          target?.id === 'circuit-main-svg' ||
          target?.tagName?.toLowerCase() === 'rect';
        if (isBg && !useCircuitStore.getState().isDrawingWire) {
          touchState.current.isSingleTouchPanning = true;
          touchState.current.lastTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      const rect = container.getBoundingClientRect();
      if (e.touches.length === 2 && touchState.current.initialDist) {
        e.preventDefault();
        const newDist = getDistance(e.touches[0], e.touches[1]);
        const newCenter = getCenter(e.touches[0], e.touches[1], rect);
        const scale = newDist / touchState.current.initialDist;
        const targetZoom = Math.max(0.2, Math.min(3.0, touchState.current.initialZoom * scale));

        const initCenter = touchState.current.initialCenter;
        const initPan = touchState.current.initialPan;
        const initZoom = touchState.current.initialZoom;

        const worldX = (initCenter.x - initPan.x) / initZoom;
        const worldY = (initCenter.y - initPan.y) / initZoom;

        const newPanX = newCenter.x - worldX * targetZoom;
        const newPanY = newCenter.y - worldY * targetZoom;

        setZoomAndPan(targetZoom, { x: newPanX, y: newPanY });
      } else if (e.touches.length === 1 && touchState.current.isSingleTouchPanning) {
        e.preventDefault();
        const curX = e.touches[0].clientX;
        const curY = e.touches[0].clientY;
        const dx = curX - touchState.current.lastTouch.x;
        const dy = curY - touchState.current.lastTouch.y;
        touchState.current.lastTouch = { x: curX, y: curY };
        const curPan = useCircuitStore.getState().pan;
        setPan(curPan.x + dx, curPan.y + dy);
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        touchState.current.initialDist = null;
      }
      if (e.touches.length === 0) {
        touchState.current.isSingleTouchPanning = false;
      }
    };

    container.addEventListener('touchstart', onTouchStart, { passive: false });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd);
    container.addEventListener('touchcancel', onTouchEnd);

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [setPan, setZoomAndPan]);

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

    // When drawing wire, clicking empty canvas adds a custom waypoint corner or completes on snapped pin
    if (isDrawingWire) {
      const snapped = getSnappedWirePoint(world.x, world.y);
      if (snapped.targetPin) {
        completeWire(snapped.targetPin.componentId, snapped.targetPin.pinId);
      } else {
        addWireWaypoint(snapped.x, snapped.y);
      }
      return;
    }

    // Click on canvas background deselects and allows drag-panning
    const target = e.target as Element | null;
    if (target === svgRef.current || target?.id === 'circuit-main-svg' || target?.tagName?.toLowerCase() === 'rect') {
      setSelectedComponent(null);
      setSelectedWire(null);
      setWireMenuPos(null);
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const world = screenToWorld(e.clientX, e.clientY);

    if (resizingState) {
      const dx = world.x - resizingState.startMouseX;
      const dy = world.y - resizingState.startMouseY;
      let delta = 0;
      if (resizingState.handle === 'se') delta = (dx + dy) / 2;
      else if (resizingState.handle === 'nw') delta = -(dx + dy) / 2;
      else if (resizingState.handle === 'ne') delta = (dx - dy) / 2;
      else if (resizingState.handle === 'sw') delta = (-dx + dy) / 2;
      else if (resizingState.handle === 'e' || resizingState.handle === 'w') delta = resizingState.handle === 'e' ? dx : -dx;
      else if (resizingState.handle === 's' || resizingState.handle === 'n') delta = resizingState.handle === 's' ? dy : -dy;

      const baseDim = Math.max(resizingState.initialW, resizingState.initialH);
      const newScale = Math.max(0.4, Math.min(3.5, resizingState.startScale + delta / baseDim));
      updateComponentScale(resizingState.compId, newScale);
      return;
    }

    if (isDrawingWire) {
      const snapped = getSnappedWirePoint(world.x, world.y);
      updateMousePos(snapped.x, snapped.y);
    }

    if (draggingCompId) {
      let newX = world.x - dragOffset.x;
      let newY = world.y - dragOffset.y;
      const comp = components.find((c) => c.instanceId === draggingCompId);
      const def = comp ? CIRCUIT_COMPONENTS_LIBRARY.find((d) => d.id === comp.defId) : null;
      const guides: { type: 'vertical' | 'horizontal'; pos: number; label: string }[] = [];

      if (comp && def) {
        const scale = comp.scale || 1;
        const curW = def.width * scale;
        const curH = def.height * scale;
        const curCenterX = newX + curW / 2;
        const curCenterY = newY + curH / 2;

        components.forEach((other) => {
          if (other.instanceId === draggingCompId) return;
          const otherDef = CIRCUIT_COMPONENTS_LIBRARY.find((d) => d.id === other.defId);
          if (!otherDef) return;
          const otherScale = other.scale || 1;
          const otherW = otherDef.width * otherScale;
          const otherH = otherDef.height * otherScale;
          const otherCenterX = other.x + otherW / 2;
          const otherCenterY = other.y + otherH / 2;

          // Vertical alignment snaps (Center, Left, Right)
          if (Math.abs(curCenterX - otherCenterX) < 10) {
            newX = otherCenterX - curW / 2;
            guides.push({ type: 'vertical', pos: otherCenterX, label: 'Center X' });
          } else if (Math.abs(newX - other.x) < 10) {
            newX = other.x;
            guides.push({ type: 'vertical', pos: other.x, label: 'Left Edge' });
          } else if (Math.abs(newX + curW - (other.x + otherW)) < 10) {
            newX = other.x + otherW - curW;
            guides.push({ type: 'vertical', pos: other.x + otherW, label: 'Right Edge' });
          }

          // Horizontal alignment snaps (Center, Top, Bottom)
          if (Math.abs(curCenterY - otherCenterY) < 10) {
            newY = otherCenterY - curH / 2;
            guides.push({ type: 'horizontal', pos: otherCenterY, label: 'Center Y' });
          } else if (Math.abs(newY - other.y) < 10) {
            newY = other.y;
            guides.push({ type: 'horizontal', pos: other.y, label: 'Top Edge' });
          } else if (Math.abs(newY + curH - (other.y + otherH)) < 10) {
            newY = other.y + otherH - curH;
            guides.push({ type: 'horizontal', pos: other.y + otherH, label: 'Bottom Edge' });
          }
        });
      }

      setActiveAlignmentLines(guides);
      updateComponentPosition(draggingCompId, newX, newY);
    }

    if (isPanning) {
      setPan(e.clientX - panStart.x, e.clientY - panStart.y);
    }

    // Broadcast cursor position to partners (throttled ~25fps)
    if (isCollaborating) {
      const now = Date.now();
      if (now - lastCursorBroadcast.current > 40) {
        lastCursorBroadcast.current = now;
        updateMyCursor(Math.round(world.x), Math.round(world.y), draggingCompId);
      }
    }
  };

  const handleMouseUp = () => {
    setDraggingCompId(null);
    setResizingState(null);
    setActiveAlignmentLines([]);
    setIsPanning(false);
  };

  // Keyboard Shortcuts for Zoom, Fit, Pan, Wire & Component deletion
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when user is typing in input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'Escape' && isDrawingWire) {
        cancelWire();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        const state = useCircuitStore.getState();
        if (state.selectedWireId) {
          e.preventDefault();
          removeWire(state.selectedWireId);
          setSelectedWire(null);
          setWireMenuPos(null);
        } else if (state.selectedComponentId) {
          e.preventDefault();
          removeComponent(state.selectedComponentId);
          setSelectedComponent(null);
        }
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        handleZoomOut();
      } else if (e.key === '0' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleResetView();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        handleFitToScreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawingWire, cancelWire, handleZoomIn, handleZoomOut, handleResetView, handleFitToScreen, removeWire, removeComponent, setSelectedWire, setSelectedComponent]);

  return (
    <div
      ref={containerRef}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onContextMenu={(e) => e.preventDefault()}
      className={`w-full h-full relative overflow-hidden bg-[#0A0E17] select-none touch-none ${
        isPanning ? 'cursor-grabbing' : isDrawingWire ? 'cursor-crosshair' : 'cursor-default'
      }`}
    >
      <svg
        ref={svgRef}
        id="circuit-main-svg"
        width="100%"
        height="100%"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className={`w-full h-full block ${isPanning ? 'cursor-grabbing' : ''}`}
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
                    setSelectedComponent(null);
                    const world = screenToWorld(e.clientX, e.clientY);
                    setWireMenuPos(world);
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
                const lastPoint =
                  wireWaypoints.length > 0
                    ? wireWaypoints[wireWaypoints.length - 1]
                    : { x: wireStart.x, y: wireStart.y };

                const isAlignedH = Math.abs(mousePos.y - lastPoint.y) < 0.5;
                const isAlignedV = Math.abs(mousePos.x - lastPoint.x) < 0.5;
                const activePath = buildWirePathWithJumps(activePoints);
                const distancePx = Math.round(Math.hypot(mousePos.x - lastPoint.x, mousePos.y - lastPoint.y));

                return (
                  <>
                    {/* Straight Horizontal Laser Alignment Guide */}
                    {isAlignedH && (
                      <g opacity="0.85">
                        <line
                          x1={Math.min(lastPoint.x, mousePos.x) - 400}
                          y1={lastPoint.y}
                          x2={Math.max(lastPoint.x, mousePos.x) + 400}
                          y2={lastPoint.y}
                          stroke="#10B981"
                          strokeWidth="1.2"
                          strokeDasharray="4 3"
                        />
                        <g transform={`translate(${(lastPoint.x + mousePos.x) / 2}, ${lastPoint.y - 12})`}>
                          <rect x="-44" y="-8" width="88" height="16" rx="4" fill="#064E3B" stroke="#10B981" strokeWidth="1" />
                          <text x="0" y="3.5" fill="#34D399" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                            ↔ Straight (0°)
                          </text>
                        </g>
                      </g>
                    )}

                    {/* Straight Vertical Laser Alignment Guide */}
                    {isAlignedV && (
                      <g opacity="0.85">
                        <line
                          x1={lastPoint.x}
                          y1={Math.min(lastPoint.y, mousePos.y) - 400}
                          x2={lastPoint.x}
                          y2={Math.max(lastPoint.y, mousePos.y) + 400}
                          stroke="#10B981"
                          strokeWidth="1.2"
                          strokeDasharray="4 3"
                        />
                        <g transform={`translate(${lastPoint.x + 14}, ${(lastPoint.y + mousePos.y) / 2})`}>
                          <rect x="0" y="-8" width="88" height="16" rx="4" fill="#064E3B" stroke="#10B981" strokeWidth="1" />
                          <text x="44" y="3.5" fill="#34D399" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                            ↕ Straight (90°)
                          </text>
                        </g>
                      </g>
                    )}

                    {/* Active Wire Path */}
                    <path
                      d={activePath}
                      fill="none"
                      stroke={activeWireColor}
                      strokeWidth="2.5"
                      strokeDasharray="4 4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Wire Waypoint Nodes */}
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

                    {/* Target Pin Magnetic Snapped Ring */}
                    {allPins
                      .filter((p) => Math.hypot(p.x - mousePos.x, p.y - mousePos.y) < 2)
                      .map((p) => (
                        <g key={`${p.componentId}-${p.pinId}`} transform={`translate(${p.x}, ${p.y})`}>
                          <circle cx="0" cy="0" r="10" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 3" />
                          <circle cx="0" cy="0" r="4.5" fill="#38BDF8" />
                          <g transform="translate(0, -18)">
                            <rect x="-38" y="-8" width="76" height="16" rx="4" fill="#0C4A6E" stroke="#38BDF8" strokeWidth="1" />
                            <text x="0" y="3.5" fill="#E0F2FE" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                              🎯 {p.pinName}
                            </text>
                          </g>
                        </g>
                      ))}

                    {/* Distance Badge on Active Wire when not axis aligned */}
                    {!isAlignedH && !isAlignedV && distancePx > 30 && (
                      <g transform={`translate(${(lastPoint.x + mousePos.x) / 2}, ${(lastPoint.y + mousePos.y) / 2 - 10})`}>
                        <rect x="-24" y="-7" width="48" height="14" rx="3" fill="#0F172A" stroke="#334155" strokeWidth="1" />
                        <text x="0" y="3" fill="#94A3B8" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                          {distancePx}px
                        </text>
                      </g>
                    )}
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

          {/* Smart Auto Alignment Laser Guides (Green Lines on Component Movement/Snap) */}
          {activeAlignmentLines.map((guide, idx) => (
            <g key={idx} className="pointer-events-none select-none z-30">
              {guide.type === 'vertical' ? (
                <>
                  <line
                    x1={guide.pos}
                    y1="-10000"
                    x2={guide.pos}
                    y2="10000"
                    stroke="#22C55E"
                    strokeWidth="1.5"
                    strokeDasharray="6 3"
                    className="drop-shadow"
                  />
                  <g transform={`translate(${guide.pos + 6}, 50)`}>
                    <rect x="0" y="-8" width="76" height="16" rx="4" fill="#14532D" stroke="#22C55E" strokeWidth="1" />
                    <text x="38" y="3.5" fill="#86EFAC" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                      {guide.label}
                    </text>
                  </g>
                </>
              ) : (
                <>
                  <line
                    x1="-10000"
                    y1={guide.pos}
                    x2="10000"
                    y2={guide.pos}
                    stroke="#22C55E"
                    strokeWidth="1.5"
                    strokeDasharray="6 3"
                    className="drop-shadow"
                  />
                  <g transform={`translate(50, ${guide.pos - 10})`}>
                    <rect x="-38" y="-8" width="76" height="16" rx="4" fill="#14532D" stroke="#22C55E" strokeWidth="1" />
                    <text x="0" y="3.5" fill="#86EFAC" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                      {guide.label}
                    </text>
                  </g>
                </>
              )}
            </g>
          ))}

          {/* Selected Component Interactive 8-Handle Transform Box + Rotation Handle */}
          {(() => {
            const selectedComp = components.find((c) => c.instanceId === selectedComponentId);
            if (!selectedComp) return null;
            const def = CIRCUIT_COMPONENTS_LIBRARY.find((d) => d.id === selectedComp.defId);
            if (!def) return null;

            const scale = selectedComp.scale || 1;
            const w = def.width * scale;
            const h = def.height * scale;
            const cx = w / 2;
            const cy = h / 2;
            const handleSize = 8;

            const handles: { id: string; x: number; y: number; cursor: string }[] = [
              { id: 'nw', x: -4, y: -4, cursor: 'nwse-resize' },
              { id: 'n', x: cx, y: -4, cursor: 'ns-resize' },
              { id: 'ne', x: w + 4, y: -4, cursor: 'nesw-resize' },
              { id: 'e', x: w + 4, y: cy, cursor: 'ew-resize' },
              { id: 'se', x: w + 4, y: h + 4, cursor: 'nwse-resize' },
              { id: 's', x: cx, y: h + 4, cursor: 'ns-resize' },
              { id: 'sw', x: -4, y: h + 4, cursor: 'nesw-resize' },
              { id: 'w', x: -4, y: cy, cursor: 'ew-resize' },
            ];

            return (
              <g
                transform={`translate(${selectedComp.x}, ${selectedComp.y}) rotate(${selectedComp.rotation || 0}, ${cx}, ${cy})`}
                className="select-none"
              >
                {/* Bounding Selection Outline */}
                <rect
                  x={-4}
                  y={-4}
                  width={w + 8}
                  height={h + 8}
                  rx={6}
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                  className="pointer-events-none"
                />

                {/* Top Rotation Stem & Handle */}
                <line x1={cx} y1={-4} x2={cx} y2={-24} stroke="#38BDF8" strokeWidth={1.5} className="pointer-events-none" />
                <g
                  transform={`translate(${cx}, -24)`}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    rotateComponent(selectedComp.instanceId);
                  }}
                  className="cursor-pointer group"
                >
                  <circle cx="0" cy="0" r="7" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" className="drop-shadow group-hover:scale-125 transition-transform" />
                  <text x="0" y="3" fontSize="9" textAnchor="middle" fill="#0284C7" fontWeight="bold" className="pointer-events-none">
                    ↻
                  </text>
                </g>

                {/* 8 Interactive Resize Handles (White rounded squares matching photo) */}
                {handles.map((hnd) => (
                  <rect
                    key={hnd.id}
                    x={hnd.x - handleSize / 2}
                    y={hnd.y - handleSize / 2}
                    width={handleSize}
                    height={handleSize}
                    rx={2}
                    fill="#FFFFFF"
                    stroke="#0284C7"
                    strokeWidth={1.5}
                    style={{ cursor: hnd.cursor }}
                    className="drop-shadow hover:scale-125 transition-transform hover:fill-sky-100"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      const world = screenToWorld(e.clientX, e.clientY);
                      setResizingState({
                        compId: selectedComp.instanceId,
                        handle: hnd.id,
                        startMouseX: world.x,
                        startMouseY: world.y,
                        startScale: scale,
                        initialW: def.width,
                        initialH: def.height,
                      });
                    }}
                  />
                ))}

                {/* Live Size & Scale Badge when resizing */}
                {resizingState?.compId === selectedComp.instanceId && (
                  <g transform={`translate(${cx}, ${h + 20})`} className="pointer-events-none">
                    <rect x="-42" y="-9" width="84" height="18" rx="4" fill="#0F172A" stroke="#38BDF8" strokeWidth="1" />
                    <text x="0" y="3.5" fill="#38BDF8" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      {Math.round(scale * 100)}% ({Math.round(w)}×{Math.round(h)})
                    </text>
                  </g>
                )}
              </g>
            );
          })()}

          {/* Render Live Remote Partner Cursors & Labels */}
          {isCollaborating &&
            collaborators
              .filter((c) => c.id !== myCollabUser?.id && c.cursor)
              .map((c) => (
                <g
                  key={c.id}
                  transform={`translate(${c.cursor!.x}, ${c.cursor!.y})`}
                  className="pointer-events-none transition-all duration-75 ease-out z-40 select-none"
                >
                  {/* Remote Cursor SVG Arrow */}
                  <path
                    d="M 0 0 L 0 15 L 4.2 11.5 L 8 18 L 10.5 17 L 6.5 10.5 L 12 10.5 Z"
                    fill={c.color}
                    stroke="#0A0E17"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                    className="drop-shadow"
                  />
                  {/* Remote User Pill Badge */}
                  <g transform="translate(12, 12)">
                    <rect
                      x="0"
                      y="0"
                      width={Math.max(c.name.length * 6.8 + 14, 45)}
                      height="17"
                      rx="4"
                      fill={c.color}
                      stroke="#0A0E17"
                      strokeWidth="1"
                      className="drop-shadow"
                    />
                    <text
                      x="6"
                      y="11.5"
                      fill="#FFFFFF"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      {c.name}
                    </text>
                  </g>
                </g>
              ))}
        </g>
      </svg>

      {/* Floating Wire Quick Action Card when a wire is selected */}
      {(() => {
        const selectedWire = wires.find((w) => w.id === selectedWireId);
        if (!selectedWire) return null;

        const containerWidth = containerRef.current?.clientWidth || 800;
        const rawX = wireMenuPos ? wireMenuPos.x * zoom + pan.x : containerWidth / 2 - 100;
        const rawY = wireMenuPos ? wireMenuPos.y * zoom + pan.y : 100;

        const leftPos = Math.max(16, Math.min(containerWidth - 280, rawX - 60));
        const topPos = Math.max(16, rawY - 50);

        return (
          <div
            className="absolute z-30 flex items-center gap-2 bg-slate-900/95 border border-slate-700/80 shadow-2xl p-2 rounded-xl backdrop-blur-md animate-in fade-in zoom-in-95 text-xs text-white select-none"
            style={{ left: leftPos, top: topPos }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-1.5 px-2 py-0.5 border-r border-slate-800">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: selectedWire.color || '#38BDF8' }}
              />
              <span className="font-mono text-[11px] font-bold text-slate-300 max-w-[130px] truncate">
                {selectedWire.label || 'Wire Net'}
              </span>
            </div>

            {/* Delete Wire Button */}
            <button
              onClick={() => {
                removeWire(selectedWire.id);
                setSelectedWire(null);
                setWireMenuPos(null);
              }}
              className="bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
              title="Delete this Wire (Del / Backspace)"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Wire</span>
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                setSelectedWire(null);
                setWireMenuPos(null);
              }}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors text-xs"
              title="Deselect"
            >
              ✕
            </button>
          </div>
        );
      })()}

      {/* Floating Canvas Controls (Zoom In/Out, Fit View, Reset View) */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-1.5 rounded-xl shadow-2xl">
        <button
          onClick={handleZoomOut}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all active:scale-90"
          title="Zoom Out (-)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={handleResetView}
          className="text-[11px] font-mono text-slate-300 hover:text-sky-400 px-2 py-1 rounded-md hover:bg-slate-800/80 font-semibold min-w-[48px] text-center transition-colors"
          title="Click to Reset 100%"
        >
          {Math.round(zoom * 100)}%
        </button>

        <button
          onClick={handleZoomIn}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all active:scale-90"
          title="Zoom In (+)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-800 mx-0.5" />

        <button
          onClick={handleFitToScreen}
          className="p-1.5 text-slate-300 hover:text-sky-400 hover:bg-slate-800 rounded-lg transition-all active:scale-90"
          title="Fit to Screen (F)"
        >
          <Crosshair className="w-4 h-4" />
        </button>

        <button
          onClick={handleResetView}
          className="p-1.5 text-slate-300 hover:text-sky-400 hover:bg-slate-800 rounded-lg transition-all active:scale-90"
          title="Reset View 100% (Ctrl+0)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
