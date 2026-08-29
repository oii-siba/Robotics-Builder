'use client';

import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, TransformControls, Grid, ContactShadows, GizmoHelper, GizmoViewport, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useRobotStore } from '@/lib/store/robot-store';
import { PartMesh } from './PartMesh';

function SceneContent() {
  const parts = useRobotStore((state) => state.parts);
  const selectedPartId = useRobotStore((state) => state.selectedPartId);
  const selectPart = useRobotStore((state) => state.selectPart);
  const transformMode = useRobotStore((state) => state.transformMode);
  const gridSnap = useRobotStore((state) => state.gridSnap);
  const isWireframe = useRobotStore((state) => state.isWireframe);
  const updatePartTransform = useRobotStore((state) => state.updatePartTransform);
  const cameraView = useRobotStore((state) => state.cameraView);

  const orbitRef = useRef<any>(null);
  const transformRef = useRef<any>(null);

  const selectedPart = parts.find((p) => p.instanceId === selectedPartId);

  // Disable OrbitControls when dragging gizmo
  useEffect(() => {
    if (transformRef.current) {
      const controls = transformRef.current;
      const callback = (event: any) => {
        if (orbitRef.current) {
          orbitRef.current.enabled = !event.value;
        }
      };
      controls.addEventListener('dragging-changed', callback);
      return () => controls.removeEventListener('dragging-changed', callback);
    }
  }, [selectedPartId]);

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#38BDF8" />

      {/* Grid Floor */}
      <Grid
        args={[20, 20]}
        cellSize={0.2}
        cellThickness={1}
        cellColor="#334155"
        sectionSize={1}
        sectionThickness={1.5}
        sectionColor="#0284C7"
        fadeDistance={25}
        fadeStrength={1.5}
        position={[0, -0.01, 0]}
      />

      {/* Contact Shadows */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.6}
        scale={15}
        blur={2}
        far={4}
        resolution={1024}
        color="#000000"
      />

      {/* Render Placed Parts */}
      <group onPointerMissed={() => selectPart(null)}>
        {parts.map((part) => (
          <PartMesh
            key={part.instanceId}
            part={part}
            isSelected={part.instanceId === selectedPartId}
            isWireframe={isWireframe}
            onClick={() => selectPart(part.instanceId)}
          />
        ))}
      </group>

      {/* Interactive Transform Gizmo for Selected Part */}
      {selectedPart && (
        <TransformControls
          ref={transformRef}
          position={selectedPart.position}
          rotation={selectedPart.rotation}
          scale={selectedPart.scale}
          mode={transformMode}
          translationSnap={gridSnap > 0 ? gridSnap : null}
          rotationSnap={gridSnap > 0 ? Math.PI / 12 : null}
          scaleSnap={gridSnap > 0 ? 0.1 : null}
          size={0.75}
          onObjectChange={(e: any) => {
            const target = e.target.object;
            if (target) {
              updatePartTransform(
                selectedPart.instanceId,
                [target.position.x, target.position.y, target.position.z],
                [target.rotation.x, target.rotation.y, target.rotation.z],
                [target.scale.x, target.scale.y, target.scale.z]
              );
            }
          }}
        />
      )}

      {/* Camera Controls */}
      <OrbitControls
        ref={orbitRef}
        makeDefault
        minDistance={1}
        maxDistance={25}
        maxPolarAngle={Math.PI / 2 + 0.05} // Prevent going under the grid
      />

      {/* Orientation Viewport Widget */}
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport axisColors={['#EF4444', '#22C55E', '#3B82F6']} labelColor="#FFFFFF" />
      </GizmoHelper>
    </>
  );
}

export function RoboticsCanvas() {
  return (
    <div className="w-full h-full relative bg-slate-950 overflow-hidden select-none">
      <Canvas
        shadows
        camera={{ position: [3.5, 3.5, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        className="w-full h-full"
      >
        <color attach="background" args={['#090D16']} />
        <SceneContent />
      </Canvas>
    </div>
  );
}
