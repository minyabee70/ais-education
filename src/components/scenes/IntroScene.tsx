import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export function IntroScene() {
  const ship1Ref = useRef<THREE.Group>(null);
  const ship2Ref = useRef<THREE.Group>(null);
  const ship1Pos = useRef({ x: -4, y: -2 });
  const ship2Pos = useRef({ x: 3, y: 1 });
  
  useFrame(() => {
    // Ship 1 moves right-up
    if (ship1Pos.current.x < 5) {
      ship1Pos.current.x += 0.01;
      ship1Pos.current.y += 0.005;
    } else {
      ship1Pos.current.x = -4;
      ship1Pos.current.y = -2;
    }
    
    // Ship 2 moves left-down
    if (ship2Pos.current.x > -5) {
      ship2Pos.current.x -= 0.01;
      ship2Pos.current.y -= 0.005;
    } else {
      ship2Pos.current.x = 3;
      ship2Pos.current.y = 1;
    }
    
    // Both ships see each other via AIS so they deflect their path at the center
    const dist = new THREE.Vector2(ship1Pos.current.x, ship1Pos.current.y).distanceTo(new THREE.Vector2(ship2Pos.current.x, ship2Pos.current.y));
    if (dist < 2.5) {
      ship1Pos.current.y -= 0.01;
      ship2Pos.current.y += 0.01;
    }

    if (ship1Ref.current) ship1Ref.current.position.set(ship1Pos.current.x, ship1Pos.current.y, 0);
    if (ship2Ref.current) ship2Ref.current.position.set(ship2Pos.current.x, ship2Pos.current.y, 0);
  });

  return (
    <group>
      {/* Dark Foggy Background */}
      <mesh position={[0, 0, -1]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>

      {/* An Island in the middle blocking view */}
      <mesh position={[0, -0.5, -0.5]}>
        <circleGeometry args={[1.5, 32]} />
        <meshBasicMaterial color="#1e293b" />
      </mesh>
      <Html distanceFactor={10} position={[0, -0.5, 0]}>
        <div style={{ color: '#94a3b8', fontSize: '14px', transform: 'translate3d(-50%, -50%, 0)' }}>섬 (시야 차단)</div>
      </Html>

      {/* Fog effect overlay */}
      <mesh position={[0, 0, 0.5]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial color="#cbd5e1" transparent opacity={0.1} />
      </mesh>

      {/* Ship 1 (Blue) */}
      <group ref={ship1Ref}>
        <mesh rotation={[0, 0, -Math.PI / 3]}>
          <coneGeometry args={[0.2, 0.6, 4]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[0, 0, -0.1]}>
          <ringGeometry args={[0.5, 0.55, 32]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.5} />
        </mesh>
        <Html distanceFactor={10} position={[0, -1, 0]}>
          <div style={{ color: '#38bdf8', fontSize: '10px', transform: 'translate3d(-50%, 0, 0)' }}>자선 (AIS O)</div>
        </Html>
      </group>

      {/* Ship 2 (Green) */}
      <group ref={ship2Ref}>
        <mesh rotation={[0, 0, 2 * Math.PI / 3]}>
          <coneGeometry args={[0.2, 0.6, 4]} />
          <meshBasicMaterial color="#4ade80" />
        </mesh>
        <mesh position={[0, 0, -0.1]}>
          <ringGeometry args={[0.5, 0.55, 32]} />
          <meshBasicMaterial color="#4ade80" transparent opacity={0.5} />
        </mesh>
        <Html distanceFactor={10} position={[0, 1, 0]}>
          <div style={{ color: '#4ade80', fontSize: '10px', transform: 'translate3d(-50%, 0, 0)' }}>타선 (AIS O)</div>
        </Html>
      </group>
      
      {/* Avoidance Connection Line */}
      <Html distanceFactor={10} position={[0, -3, 0]}>
        <div style={{ textAlign: 'center', width: '300px', transform: 'translate3d(-50%, 0, 0)', color: '#f8fafc', textShadow: '0 0 10px #000' }}>
          <h3>충돌 회피 시뮬레이션</h3>
          <p style={{ fontSize: '12px' }}>섬과 안개로 시야가 차단되어도 AIS 전파를 통해 서로의 접근을 인지하고 회피합니다.</p>
        </div>
      </Html>

    </group>
  );
}
