import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export function ProtocolScene() {
  const ringRef = useRef<THREE.Mesh>(null);
  const [pulse, setPulse] = useState(0);

  useFrame(() => {
    if (ringRef.current) {
      const scale = 1 + (pulse % 1) * 5;
      ringRef.current.scale.set(scale, scale, 1);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = 1 - (pulse % 1);
      setPulse(p => p + 0.01);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 2D Grid Background */}
      <mesh position={[0, 0, -1]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial color="#020617" />
      </mesh>
      <gridHelper args={[10, 20, '#1e293b', '#0f172a']} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.9]} />

      {/* The Vessel */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <coneGeometry args={[0.3, 0.8, 4]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* Pulse Ring */}
      <mesh ref={ringRef} position={[0, 0, -0.1]}>
        <ringGeometry args={[0.4, 0.45, 32]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={1} side={THREE.DoubleSide} />
      </mesh>

      {/* Packet HUD */}
      <Html distanceFactor={10} position={[1.5, 1, 0]}>
        <div className="glass-panel" style={{ 
          width: '280px', padding: '15px', border: '1px solid #38bdf8', 
          fontFamily: 'monospace', color: '#f8fafc', 
          boxShadow: '0 0 20px rgba(56, 189, 248, 0.2)'
        }}>
          <h3 style={{ color: '#38bdf8', borderBottom: '1px solid #1e293b', paddingBottom: '10px', marginBottom: '10px' }}>
            [ AIS Message Type 1 ]
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '13px' }}>
            <div><span style={{ color: '#94a3b8' }}>MMSI:</span> 440123456 <span style={{ color: '#4ade80' }}>(Valid)</span></div>
            <div><span style={{ color: '#94a3b8' }}>Status:</span> 0 (Under way using engine)</div>
            <div><span style={{ color: '#94a3b8' }}>Speed:</span> 14.2 knots</div>
            <div><span style={{ color: '#94a3b8' }}>Lat:</span> 35.1012 N</div>
            <div><span style={{ color: '#94a3b8' }}>Lon:</span> 129.0321 E</div>
            <div><span style={{ color: '#94a3b8' }}>Heading:</span> 120°</div>
          </div>
          <div style={{ marginTop: '15px', fontSize: '10px', color: '#64748b', wordBreak: 'break-all' }}>
            RAW: !AIVDM,1,1,,A,16S`2cPP00a3O...
          </div>
        </div>
      </Html>
    </group>
  );
}
