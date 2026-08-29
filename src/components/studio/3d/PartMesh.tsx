'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { PlacedPart } from '@/lib/types/robot';
import { ROBOT_PARTS_CATALOG } from '@/lib/constants/robot-parts';

interface PartMeshProps {
  part: PlacedPart;
  isSelected: boolean;
  isWireframe?: boolean;
  onClick?: (e: any) => void;
}

export function PartMesh({ part, isSelected, isWireframe = false, onClick }: PartMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const catalogItem = ROBOT_PARTS_CATALOG.find((p) => p.id === part.partId);
  const meshType = catalogItem?.meshType || 'custom_box';
  const customColor = part.color || catalogItem?.defaultColor || '#3B82F6';

  const renderGeometry = () => {
    switch (meshType) {
      // ================= ARDUINO UNO =================
      case 'arduino_uno':
        return (
          <group>
            <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.4, 0.05, 1.1]} />
              <meshStandardMaterial color={customColor} roughness={0.3} metalness={0.1} wireframe={isWireframe} />
            </mesh>
            <mesh position={[-0.55, 0.15, -0.35]} castShadow>
              <boxGeometry args={[0.35, 0.2, 0.25]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.2} wireframe={isWireframe} />
            </mesh>
            <mesh position={[-0.55, 0.15, 0.35]} castShadow>
              <boxGeometry args={[0.3, 0.22, 0.25]} />
              <meshStandardMaterial color="#0F172A" roughness={0.6} wireframe={isWireframe} />
            </mesh>
            <mesh position={[0.1, 0.1, 0.1]} castShadow>
              <boxGeometry args={[0.7, 0.08, 0.2]} />
              <meshStandardMaterial color="#1E293B" roughness={0.5} wireframe={isWireframe} />
            </mesh>
            <mesh position={[0, 0.12, -0.48]}>
              <boxGeometry args={[1.2, 0.12, 0.08]} />
              <meshStandardMaterial color="#0F172A" roughness={0.7} wireframe={isWireframe} />
            </mesh>
            <mesh position={[0.1, 0.12, 0.48]}>
              <boxGeometry args={[1.0, 0.12, 0.08]} />
              <meshStandardMaterial color="#0F172A" roughness={0.7} wireframe={isWireframe} />
            </mesh>
            <mesh position={[0.5, 0.1, -0.2]}>
              <sphereGeometry args={[0.03, 16, 16]} />
              <meshStandardMaterial color="#22C55E" emissive="#22C55E" emissiveIntensity={0.8} />
            </mesh>
          </group>
        );

      // ================= ARDUINO MEGA =================
      case 'arduino_mega':
        return (
          <group>
            <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
              <boxGeometry args={[2.1, 0.05, 1.1]} />
              <meshStandardMaterial color={customColor} roughness={0.3} metalness={0.1} wireframe={isWireframe} />
            </mesh>
            <mesh position={[-0.9, 0.15, -0.35]} castShadow>
              <boxGeometry args={[0.35, 0.2, 0.25]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.2} wireframe={isWireframe} />
            </mesh>
            <mesh position={[-0.9, 0.15, 0.35]} castShadow>
              <boxGeometry args={[0.3, 0.22, 0.25]} />
              <meshStandardMaterial color="#0F172A" roughness={0.6} wireframe={isWireframe} />
            </mesh>
            <mesh position={[-0.2, 0.1, 0]}>
              <boxGeometry args={[0.4, 0.05, 0.4]} />
              <meshStandardMaterial color="#0F172A" roughness={0.5} wireframe={isWireframe} />
            </mesh>
            <mesh position={[0.8, 0.12, 0]}>
              <boxGeometry args={[0.3, 0.12, 0.9]} />
              <meshStandardMaterial color="#0F172A" roughness={0.7} wireframe={isWireframe} />
            </mesh>
          </group>
        );

      // ================= ARDUINO NANO =================
      case 'arduino_nano':
        return (
          <group>
            <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.9, 0.04, 0.4]} />
              <meshStandardMaterial color={customColor} roughness={0.3} wireframe={isWireframe} />
            </mesh>
            <mesh position={[-0.4, 0.09, 0]} castShadow>
              <boxGeometry args={[0.18, 0.08, 0.15]} />
              <meshStandardMaterial color="#CBD5E1" metalness={0.8} roughness={0.2} wireframe={isWireframe} />
            </mesh>
            <mesh position={[0, 0.08, 0]}>
              <boxGeometry args={[0.2, 0.04, 0.2]} />
              <meshStandardMaterial color="#0F172A" roughness={0.5} wireframe={isWireframe} />
            </mesh>
          </group>
        );

      // ================= ESP32 =================
      case 'esp32':
        return (
          <group>
            <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.1, 0.04, 0.6]} />
              <meshStandardMaterial color="#1E293B" roughness={0.4} wireframe={isWireframe} />
            </mesh>
            <mesh position={[0.15, 0.09, 0]} castShadow>
              <boxGeometry args={[0.45, 0.06, 0.45]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.15} wireframe={isWireframe} />
            </mesh>
            <mesh position={[0.45, 0.07, 0]}>
              <boxGeometry args={[0.15, 0.02, 0.4]} />
              <meshStandardMaterial color="#D97706" metalness={0.6} roughness={0.3} wireframe={isWireframe} />
            </mesh>
            <mesh position={[-0.5, 0.08, 0]} castShadow>
              <boxGeometry args={[0.16, 0.07, 0.16]} />
              <meshStandardMaterial color="#CBD5E1" metalness={0.8} roughness={0.2} wireframe={isWireframe} />
            </mesh>
          </group>
        );

      // ================= RASPBERRY PI 4 =================
      case 'raspberry_pi':
        return (
          <group>
            <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.7, 0.05, 1.15]} />
              <meshStandardMaterial color="#059669" roughness={0.3} wireframe={isWireframe} />
            </mesh>
            <mesh position={[0.7, 0.2, 0.25]} castShadow>
              <boxGeometry args={[0.35, 0.3, 0.35]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.8} roughness={0.2} wireframe={isWireframe} />
            </mesh>
            <mesh position={[0.7, 0.2, -0.25]} castShadow>
              <boxGeometry args={[0.35, 0.3, 0.35]} />
              <meshStandardMaterial color="#3B82F6" metalness={0.5} roughness={0.3} wireframe={isWireframe} />
            </mesh>
            <mesh position={[-0.1, 0.12, 0.48]}>
              <boxGeometry args={[1.0, 0.14, 0.12]} />
              <meshStandardMaterial color="#0F172A" roughness={0.8} wireframe={isWireframe} />
            </mesh>
            <mesh position={[-0.1, 0.12, 0]}>
              <boxGeometry args={[0.3, 0.06, 0.3]} />
              <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.2} wireframe={isWireframe} />
            </mesh>
          </group>
        );

      // ================= SG90 SERVO =================
      case 'servo_sg90':
        return (
          <group>
            <mesh position={[0, 0.25, 0]} castShadow>
              <boxGeometry args={[0.45, 0.5, 0.25]} />
              <meshStandardMaterial color={customColor} transparent opacity={0.85} roughness={0.2} wireframe={isWireframe} />
            </mesh>
            <mesh position={[0.1, 0.55, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, 0.12, 16]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.4} wireframe={isWireframe} />
            </mesh>
            <mesh position={[0.1, 0.62, 0]} castShadow>
              <boxGeometry args={[0.4, 0.03, 0.08]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.3} wireframe={isWireframe} />
            </mesh>
          </group>
        );

      // ================= MG996R SERVO =================
      case 'servo_mg996r':
        return (
          <group>
            <mesh position={[0, 0.4, 0]} castShadow>
              <boxGeometry args={[0.8, 0.8, 0.4]} />
              <meshStandardMaterial color="#1F2937" roughness={0.6} metalness={0.2} wireframe={isWireframe} />
            </mesh>
            <mesh position={[0.2, 0.85, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.12, 0.15, 16]} />
              <meshStandardMaterial color="#F59E0B" metalness={0.85} roughness={0.25} wireframe={isWireframe} />
            </mesh>
          </group>
        );

      // ================= NEMA 17 STEPPER MOTOR =================
      case 'stepper_motor_nema17':
        return (
          <group>
            <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.84, 0.8, 0.84]} />
              <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.5} wireframe={isWireframe} />
            </mesh>
            <mesh position={[0, 0.9, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.1, 0.4, 24]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.15} wireframe={isWireframe} />
            </mesh>
          </group>
        );

      // ================= DRONE BRUSHLESS MOTOR =================
      case 'motor_drone_brushless':
        return (
          <group>
            <mesh position={[0, 0.2, 0]} castShadow>
              <cylinderGeometry args={[0.3, 0.3, 0.35, 24]} />
              <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.2} wireframe={isWireframe} />
            </mesh>
            {/* Propeller Blade */}
            <mesh position={[0, 0.42, 0]} rotation={[0, 0.3, 0]} castShadow>
              <boxGeometry args={[2.0, 0.02, 0.15]} />
              <meshStandardMaterial color="#0F172A" roughness={0.4} wireframe={isWireframe} />
            </mesh>
          </group>
        );

      // ================= DC GEAR MOTOR =================
      case 'dc_gear_motor':
        return (
          <group>
            <mesh position={[0, 0.2, 0]} castShadow>
              <boxGeometry args={[0.8, 0.4, 0.35]} />
              <meshStandardMaterial color="#EAB308" roughness={0.4} wireframe={isWireframe} />
            </mesh>
            <mesh position={[-0.55, 0.2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.16, 0.16, 0.5, 16]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.85} roughness={0.3} wireframe={isWireframe} />
            </mesh>
          </group>
        );

      // ================= RELAY MODULE =================
      case 'relay_module':
        return (
          <group>
            <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.0, 0.05, 0.5]} />
              <meshStandardMaterial color="#1E293B" roughness={0.3} wireframe={isWireframe} />
            </mesh>
            {/* Blue Relay Cube */}
            <mesh position={[-0.15, 0.2, 0]} castShadow>
              <boxGeometry args={[0.45, 0.3, 0.35]} />
              <meshStandardMaterial color="#1D4ED8" roughness={0.4} wireframe={isWireframe} />
            </mesh>
            {/* Terminal Block */}
            <mesh position={[0.35, 0.15, 0]}>
              <boxGeometry args={[0.2, 0.2, 0.4]} />
              <meshStandardMaterial color="#059669" roughness={0.4} wireframe={isWireframe} />
            </mesh>
          </group>
        );

      // ================= OLED DISPLAY =================
      case 'display_oled_096':
        return (
          <group>
            <mesh position={[0, 0.05, 0]} castShadow>
              <boxGeometry args={[0.6, 0.05, 0.6]} />
              <meshStandardMaterial color="#0F172A" roughness={0.4} wireframe={isWireframe} />
            </mesh>
            {/* Glowing Blue Glass Display */}
            <mesh position={[0, 0.09, 0]}>
              <boxGeometry args={[0.48, 0.02, 0.35]} />
              <meshStandardMaterial color="#0284C7" emissive="#38BDF8" emissiveIntensity={0.6} roughness={0.1} />
            </mesh>
          </group>
        );

      // ================= RGB LED MATRIX =================
      case 'display_matrix_rgb':
        return (
          <group>
            <mesh position={[0, 0.04, 0]} castShadow>
              <boxGeometry args={[1.2, 0.04, 1.2]} />
              <meshStandardMaterial color="#0F172A" roughness={0.5} wireframe={isWireframe} />
            </mesh>
            {/* Glowing NeoPixels */}
            {[-0.4, -0.15, 0.15, 0.4].map((x, i) =>
              [-0.4, -0.15, 0.15, 0.4].map((z, j) => (
                <mesh key={`${i}-${j}`} position={[x, 0.07, z]}>
                  <boxGeometry args={[0.15, 0.02, 0.15]} />
                  <meshStandardMaterial
                    color={(i + j) % 2 === 0 ? '#38BDF8' : '#EC4899'}
                    emissive={(i + j) % 2 === 0 ? '#38BDF8' : '#EC4899'}
                    emissiveIntensity={0.8}
                  />
                </mesh>
              ))
            )}
          </group>
        );

      // ================= LIDAR SENSOR =================
      case 'sensor_lidar':
        return (
          <group>
            <mesh position={[0, 0.15, 0]} castShadow>
              <boxGeometry args={[0.7, 0.25, 0.4]} />
              <meshStandardMaterial color="#111827" roughness={0.5} wireframe={isWireframe} />
            </mesh>
            {/* Dual Optical Lenses */}
            <mesh position={[-0.15, 0.15, 0.21]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
              <meshStandardMaterial color="#DC2626" emissive="#DC2626" emissiveIntensity={0.4} />
            </mesh>
            <mesh position={[0.15, 0.15, 0.21]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
              <meshStandardMaterial color="#1E293B" roughness={0.2} metalness={0.8} />
            </mesh>
          </group>
        );

      // ================= ESP32-CAM =================
      case 'sensor_camera_ov2640':
        return (
          <group>
            <mesh position={[0, 0.05, 0]} castShadow>
              <boxGeometry args={[0.8, 0.05, 0.55]} />
              <meshStandardMaterial color="#1E293B" roughness={0.4} wireframe={isWireframe} />
            </mesh>
            {/* Camera Lens */}
            <mesh position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.12, 0.1, 16]} />
              <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Flash LED */}
            <mesh position={[0.25, 0.09, 0]}>
              <boxGeometry args={[0.08, 0.04, 0.08]} />
              <meshStandardMaterial color="#FEF08A" emissive="#FEF08A" emissiveIntensity={0.9} />
            </mesh>
          </group>
        );

      // ================= HC-SR04 ULTRASONIC =================
      case 'sensor_ultrasonic':
        return (
          <group>
            <mesh position={[0, 0.2, 0]} castShadow>
              <boxGeometry args={[0.9, 0.4, 0.06]} />
              <meshStandardMaterial color="#0284C7" roughness={0.3} wireframe={isWireframe} />
            </mesh>
            <mesh position={[-0.26, 0.2, 0.15]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.16, 0.16, 0.25, 24]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.15} wireframe={isWireframe} />
            </mesh>
            <mesh position={[0.26, 0.2, 0.15]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.16, 0.16, 0.25, 24]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.15} wireframe={isWireframe} />
            </mesh>
          </group>
        );

      // ================= DRONE X FRAME =================
      case 'chassis_drone_x':
        return (
          <group>
            {/* Center Plate */}
            <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.6, 0.6, 0.06, 8]} />
              <meshStandardMaterial color="#0F172A" roughness={0.6} wireframe={isWireframe} />
            </mesh>
            {/* 4 Diagonal Carbon Fiber Arms */}
            {[0.785, 2.356, 3.927, 5.498].map((angle, idx) => (
              <mesh key={idx} position={[Math.cos(angle) * 1.0, 0.05, Math.sin(angle) * 1.0]} rotation={[0, -angle, 0]} castShadow>
                <boxGeometry args={[1.6, 0.08, 0.15]} />
                <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.4} wireframe={isWireframe} />
              </mesh>
            ))}
          </group>
        );

      // ================= MECANUM WHEEL =================
      case 'wheel_mecanum':
        return (
          <group>
            <mesh castShadow>
              <cylinderGeometry args={[0.5, 0.5, 0.35, 24]} />
              <meshStandardMaterial color="#1E293B" roughness={0.7} wireframe={isWireframe} />
            </mesh>
            {/* 45 degree Angled Rollers */}
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <mesh key={idx} rotation={[0, (idx * Math.PI) / 3, Math.PI / 4]} position={[0, 0, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 0.42, 12]} />
                <meshStandardMaterial color="#EAB308" roughness={0.4} />
              </mesh>
            ))}
          </group>
        );

      // ================= BREADBOARD =================
      case 'breadboard_400':
        return (
          <group>
            <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.6, 0.08, 1.1]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.3} wireframe={isWireframe} />
            </mesh>
            {/* Center divider channel */}
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[1.5, 0.02, 0.08]} />
              <meshStandardMaterial color="#E2E8F0" roughness={0.5} />
            </mesh>
            {/* Red & Blue Power Rail lines */}
            <mesh position={[0, 0.1, -0.45]}>
              <boxGeometry args={[1.5, 0.01, 0.03]} />
              <meshStandardMaterial color="#EF4444" />
            </mesh>
            <mesh position={[0, 0.1, 0.45]}>
              <boxGeometry args={[1.5, 0.01, 0.03]} />
              <meshStandardMaterial color="#3B82F6" />
            </mesh>
          </group>
        );

      // ================= 2WD CHASSIS =================
      case 'chassis_2wd':
        return (
          <group>
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[2.2, 0.06, 2.6]} />
              <meshStandardMaterial color={customColor} transparent opacity={0.7} roughness={0.1} metalness={0.1} wireframe={isWireframe} />
            </mesh>
          </group>
        );

      // ================= 4WD CHASSIS =================
      case 'chassis_4wd':
        return (
          <group>
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[2.5, 0.08, 3.2]} />
              <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} wireframe={isWireframe} />
            </mesh>
            <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
              <boxGeometry args={[2.5, 0.08, 3.2]} />
              <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} wireframe={isWireframe} />
            </mesh>
          </group>
        );

      // ================= RUBBER WHEEL =================
      case 'wheel_rubber':
        return (
          <group>
            <mesh castShadow>
              <cylinderGeometry args={[0.45, 0.45, 0.25, 32]} />
              <meshStandardMaterial color="#0F172A" roughness={0.9} wireframe={isWireframe} />
            </mesh>
            <mesh>
              <cylinderGeometry args={[0.3, 0.3, 0.27, 24]} />
              <meshStandardMaterial color="#EAB308" roughness={0.3} wireframe={isWireframe} />
            </mesh>
          </group>
        );

      // Default fallback
      default:
        return (
          <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.8, 0.5, 0.8]} />
            <meshStandardMaterial color={customColor} roughness={0.4} wireframe={isWireframe} />
          </mesh>
        );
    }
  };

  return (
    <group
      ref={groupRef}
      position={part.position}
      rotation={part.rotation}
      scale={part.scale}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
    >
      {renderGeometry()}

      {isSelected && (
        <group>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(1.2, 1.0, 1.2)]} />
            <lineBasicMaterial color="#38BDF8" linewidth={2} />
          </lineSegments>
          <pointLight color="#38BDF8" intensity={1.5} distance={2} position={[0, 0.8, 0]} />
        </group>
      )}
    </group>
  );
}
