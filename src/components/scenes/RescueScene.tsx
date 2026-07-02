import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { KoreaMap2D } from './KoreaMap2D';

export function RescueScene({ rescueActive }: { rescueActive: boolean }) {
  const rescue1Ref = useRef<THREE.Group>(null);
  const rescue2Ref = useRef<THREE.Group>(null);
  
  const [pulse, setPulse] = useState(0);
  
  const rescue1Pos = useRef({ x: -3, y: 3 }); // Helicopter
  const rescue2Pos = useRef({ x: 3, y: -2 }); // Rescue Boat
  
  const targetPos = { x: 0, y: 0 }; // Distressed ship

  useFrame(() => {
    setPulse(p => p + 0.03);

    if (rescueActive) {
      // Move rescue units towards target
      const r1 = new THREE.Vector2(rescue1Pos.current.x, rescue1Pos.current.y);
      const target = new THREE.Vector2(targetPos.x, targetPos.y);
      if (r1.distanceTo(target) > 0.5) {
        const dir1 = target.clone().sub(r1).normalize().multiplyScalar(0.04);
        rescue1Pos.current.x += dir1.x;
        rescue1Pos.current.y += dir1.y;
      }

      const r2 = new THREE.Vector2(rescue2Pos.current.x, rescue2Pos.current.y);
      if (r2.distanceTo(target) > 0.5) {
        const dir2 = target.clone().sub(r2).normalize().multiplyScalar(0.02);
        rescue2Pos.current.x += dir2.x;
        rescue2Pos.current.y += dir2.y;
      }
    } else {
      // Idle movement
      rescue1Pos.current.x = -3 + Math.sin(pulse * 0.5) * 0.5;
      rescue1Pos.current.y = 3 + Math.cos(pulse * 0.5) * 0.5;
      
      rescue2Pos.current.x = 3 + Math.cos(pulse * 0.5) * 0.5;
      rescue2Pos.current.y = -2 + Math.sin(pulse * 0.5) * 0.5;
    }

    if (rescue1Ref.current) {
      rescue1Ref.current.position.set(rescue1Pos.current.x, rescue1Pos.current.y, 0);
      rescue1Ref.current.lookAt(targetPos.x, targetPos.y, 0);
    }
    if (rescue2Ref.current) {
      rescue2Ref.current.position.set(rescue2Pos.current.x, rescue2Pos.current.y, 0);
      rescue2Ref.current.lookAt(targetPos.x, targetPos.y, 0);
    }
  });

  return (
    <group>
      <KoreaMap2D />

      {/* Distressed Ship */}
      {rescueActive && (
        <group position={[targetPos.x, targetPos.y, 0]}>
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <coneGeometry args={[0.2, 0.5, 4]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
          <mesh position={[0, 0, -0.1]}>
            <ringGeometry args={[0.5 + (pulse%1)*1, 0.6 + (pulse%1)*1, 32]} />
            <meshBasicMaterial color="#ef4444" transparent opacity={1 - (pulse%1)} side={THREE.DoubleSide} />
          </mesh>
          <Html distanceFactor={10} position={[0, 1, 0]}>
            <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '14px', background: 'rgba(239, 68, 68, 0.2)', padding: '2px 5px', border: '1px solid #ef4444', transform: 'translate3d(-50%, 0, 0)' }}>
              조난선 (AIS-SART 발동)
            </div>
          </Html>
        </group>
      )}

      {/* Rescue Helicopter */}
      <group ref={rescue1Ref}>
        <mesh>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshBasicMaterial color="#eab308" />
        </mesh>
        <Html distanceFactor={10} position={[0, -0.5, 0]}>
          <div style={{ color: '#eab308', fontSize: '10px', transform: 'translate3d(-50%, 0, 0)' }}>해경 헬기</div>
        </Html>
      </group>

      {/* Rescue Boat */}
      <group ref={rescue2Ref}>
        <mesh rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.2, 0.6, 4]} />
          <meshBasicMaterial color="#eab308" />
        </mesh>
        <Html distanceFactor={10} position={[0, -0.5, 0]}>
          <div style={{ color: '#eab308', fontSize: '10px', transform: 'translate3d(-50%, 0, 0)' }}>구조함</div>
        </Html>
      </group>
    </group>
  );
}
