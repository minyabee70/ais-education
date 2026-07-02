import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cone, Html } from '@react-three/drei';
import * as THREE from 'three';

export function SatelliteSystem({ active }: { active: boolean }) {
  const satRef = useRef<THREE.Group>(null);
  const orbitRadius = 2.8;

  useFrame((state) => {
    if (satRef.current) {
      const t = state.clock.getElapsedTime() * 0.2;
      // Polar orbit
      satRef.current.position.x = orbitRadius * Math.cos(t);
      satRef.current.position.y = orbitRadius * Math.sin(t);
      satRef.current.position.z = 0;
      satRef.current.lookAt(0, 0, 0);
    }
  });

  return (
    <group rotation={[23.5 * (Math.PI / 180), 0, 0]}>
      {/* Orbit Ring */}
      {active && (
        <mesh rotation={[0, 0, 0]}>
          <ringGeometry args={[orbitRadius - 0.01, orbitRadius + 0.01, 64]} />
          <meshBasicMaterial color="#facc15" transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Satellite Object */}
      <group ref={satRef}>
        <mesh>
          <boxGeometry args={[0.08, 0.08, 0.08]} />
          <meshBasicMaterial color="#facc15" />
        </mesh>
        
        {/* Coverage Cone */}
        {active && (
          <Cone args={[0.8, orbitRadius - 2, 32]} position={[0, 0, (orbitRadius - 2)/2]} rotation={[Math.PI/2, 0, 0]}>
            <meshBasicMaterial color="#facc15" transparent opacity={0.15} depthWrite={false} side={THREE.DoubleSide} />
          </Cone>
        )}

        {active && (
          <Html distanceFactor={15}>
            <div style={{ color: '#facc15', fontSize: '12px', fontWeight: 'bold', transform: 'translate3d(10px, -10px, 0)' }}>
              LEO Satellite (S-AIS)
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}
