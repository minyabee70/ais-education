import React from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export const STATIONS = [
  { id: 'seoul', name: '인천/서울 연안망', pos: [-2, 2.5], color: '#38bdf8' },
  { id: 'sokcho', name: '속초 연안망', pos: [1.5, 3], color: '#38bdf8' },
  { id: 'nirs', name: 'NIRS (국가정보자원관리원)', pos: [0, 0], color: '#b026ff', isCenter: true },
  { id: 'mokpo', name: '목포 연안망', pos: [-1.5, -2.5], color: '#38bdf8' },
  { id: 'busan', name: '부산 연안망', pos: [2, -2], color: '#38bdf8' }
];

export function KoreaMap2D() {
  return (
    <group>
      {/* 2D Grid Background */}
      <mesh position={[0, 0, -1]}>
        <planeGeometry args={[30, 30]} />
        <meshBasicMaterial color="#020617" />
      </mesh>
      
      {/* Grid Lines */}
      <gridHelper args={[30, 60, '#1e293b', '#0f172a']} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.9]} />

      {/* Coastline Approximation (Stylized lines) */}
      <line>
        <bufferGeometry attach="geometry">
          <float32BufferAttribute attach="attributes-position" args={[new Float32Array([
            -2.5, 3.5, 0,
            -2, 2, 0,
            -2.2, 0, 0,
            -1.8, -2.5, 0,
            -1, -3.5, 0,
            0.5, -3.5, 0,
            2.5, -2, 0,
            2.5, 0, 0,
            1.5, 3.5, 0,
            -2.5, 3.5, 0
          ]), 3]} />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="#0ea5e9" transparent opacity={0.3} linewidth={2} />
      </line>

      {/* Base Stations */}
      {STATIONS.map(s => (
        <group key={s.id} position={[s.pos[0], s.pos[1], 0]}>
          <mesh>
            <circleGeometry args={[s.isCenter ? 0.15 : 0.1, 32]} />
            <meshBasicMaterial color={s.color} />
          </mesh>
          <mesh>
            <ringGeometry args={[s.isCenter ? 0.2 : 0.15, s.isCenter ? 0.25 : 0.2, 32]} />
            <meshBasicMaterial color={s.color} transparent opacity={0.5} />
          </mesh>
          <Html distanceFactor={10} zIndexRange={[100, 0]}>
            <div style={{ 
              color: s.color, 
              fontSize: s.isCenter ? '14px' : '11px', 
              fontWeight: 'bold', 
              textShadow: '0 0 5px #000', 
              whiteSpace: 'nowrap', 
              transform: 'translate3d(15px, -50%, 0)',
              pointerEvents: 'none'
            }}>
              {s.name}
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}
