import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export function BasicScene() {
  const ringRef = useRef<THREE.Mesh>(null);
  const [pulse, setPulse] = useState(0);

  useFrame(() => {
    if (ringRef.current) {
      const scale = 1 + (pulse % 1) * 8;
      ringRef.current.scale.set(scale, scale, 1);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = (1 - (pulse % 1)) * 0.5;
      setPulse(p => p + 0.015);
    }
  });

  return (
    <group>
      {/* 2D Grid Background */}
      <mesh position={[0, 0, -1]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial color="#020617" />
      </mesh>
      <gridHelper args={[20, 40, '#1e293b', '#0f172a']} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.9]} />

      <mesh rotation={[0, 0, Math.PI / 4]}>
        <coneGeometry args={[0.3, 0.8, 4]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
      
      {/* Pulse Ring */}
      <mesh ref={ringRef} position={[0, 0, -0.1]}>
        <ringGeometry args={[0.4, 0.45, 64]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={1} side={THREE.DoubleSide} />
      </mesh>

      <Html distanceFactor={10} position={[0, 1, 0]}>
        <div style={{ textAlign: 'center', width: '400px', transform: 'translate3d(-50%, -100%, 0)' }}>
          <h1 style={{ fontSize: '3rem', color: '#38bdf8', margin: '0', textShadow: '0 0 20px #38bdf8', letterSpacing: '4px' }}>
            A. I. S.
          </h1>
          <p style={{ color: '#f8fafc', fontSize: '1.2rem', margin: '10px 0', fontWeight: 'bold' }}>
            Automatic Identification System
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '15px' }}>
            <span className="glass-panel" style={{ padding: '5px 10px', color: '#4ade80', border: '1px solid #4ade80' }}>VHF 기반 무선 통신</span>
            <span className="glass-panel" style={{ padding: '5px 10px', color: '#facc15', border: '1px solid #facc15' }}>IMO 탑재 의무화</span>
          </div>
        </div>
      </Html>
    </group>
  );
}
