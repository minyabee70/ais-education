import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export function ClassCompareScene() {
  return (
    <group position={[0, 0, 0]}>
      {/* 2D Grid Background */}
      <mesh position={[0, 0, -1]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial color="#020617" />
      </mesh>
      <gridHelper args={[10, 20, '#1e293b', '#0f172a']} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.9]} />

      {/* Class A Vessel */}
      <ClassVessel 
        position={[-2, 0, 0]} 
        cls="A" 
        color="#38bdf8" 
        pulseSpeed={0.05} 
        size={0.6}
        desc="상선, 여객선 (의무 장착) / 송신주기: 2~10초" 
      />

      {/* Class B Vessel */}
      <ClassVessel 
        position={[2, 0, 0]} 
        cls="B" 
        color="#94a3b8" 
        pulseSpeed={0.015} 
        size={0.3}
        desc="소형 어선, 레저보트 / 송신주기: 30초~3분" 
      />
    </group>
  );
}

function ClassVessel({ position, cls, color, pulseSpeed, size, desc }: any) {
  const ringRef = useRef<THREE.Mesh>(null);
  const [pulse, setPulse] = useState(0);

  useFrame(() => {
    if (ringRef.current) {
      const scale = 1 + (pulse % 1) * 6;
      ringRef.current.scale.set(scale, scale, 1);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = (1 - (pulse % 1)) * 0.8;
      setPulse(p => p + pulseSpeed);
    }
  });

  return (
    <group position={position}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[size * 0.5, size * 1.5, 4]} />
        <meshBasicMaterial color={color} />
      </mesh>
      
      {/* Pulse Ring */}
      <mesh ref={ringRef} position={[0, 0, -0.1]}>
        <ringGeometry args={[size, size + 0.1, 32]} />
        <meshBasicMaterial color={color} transparent opacity={1} side={THREE.DoubleSide} />
      </mesh>

      <Html distanceFactor={10} position={[0, -1.5, 0]}>
        <div style={{ textAlign: 'center', width: '200px', transform: 'translate3d(-50%, 0, 0)' }}>
          <div style={{ color, fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>Class {cls}</div>
          <div style={{ color: '#94a3b8', fontSize: '11px', lineHeight: '1.4' }}>{desc}</div>
        </div>
      </Html>
    </group>
  );
}
