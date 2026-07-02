import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { KoreaMap2D } from './KoreaMap2D';

export function SpoofingScene({ spoofActive }: { spoofActive: boolean }) {
  const normalVesselRef = useRef<THREE.Mesh>(null);
  const spoofVesselRef = useRef<THREE.Mesh>(null);
  const [pulse, setPulse] = useState(0);
  
  const normalPosRef = useRef({ x: -2, y: -3 });
  
  useFrame(() => {
    // Move normal vessel
    normalPosRef.current.x += 0.005;
    normalPosRef.current.y += 0.005;
    if (normalPosRef.current.x > 3) {
      normalPosRef.current.x = -3;
      normalPosRef.current.y = -4;
    }

    if (normalVesselRef.current) {
      normalVesselRef.current.position.set(normalPosRef.current.x, normalPosRef.current.y, 0);
    }

    setPulse(p => p + 0.02);
  });

  return (
    <group>
      <KoreaMap2D />

      {/* Normal Vessel */}
      <mesh ref={normalVesselRef} rotation={[0, 0, Math.PI / 4]}>
        <coneGeometry args={[0.1, 0.3, 4]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Spoofing Vessel */}
      {spoofActive && (
        <group position={[1, 1.5, 0]}>
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <coneGeometry args={[0.15, 0.4, 4]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>

          {/* Warning Pulse */}
          <mesh position={[0, 0, -0.1]}>
            <ringGeometry args={[0.4 + (pulse%1)*0.5, 0.5 + (pulse%1)*0.5, 32]} />
            <meshBasicMaterial color="#ef4444" transparent opacity={1 - (pulse%1)} side={THREE.DoubleSide} />
          </mesh>

          <Html distanceFactor={10} position={[0.5, 0, 0]}>
            <div className="glass-panel" style={{ 
              background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', 
              padding: '10px', color: '#f8fafc', width: '180px',
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)'
            }}>
              <div style={{ fontWeight: 'bold', color: '#ef4444', marginBottom: '5px' }}>⚠️ 위협 감지: SPOOFING</div>
              <div style={{ fontSize: '11px', color: '#fca5a5' }}>
                비정상적인 위치 점프가 감지되었습니다.<br/>
                MMSI: 999999999<br/>
                실제 위치와 송신 위치 불일치
              </div>
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}
