import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';

export function EarthGlobe() {
  const earthRef = useRef<THREE.Group>(null);
  
  // Earth tilt
  const TILT = 23.5 * (Math.PI / 180);

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001; // Earth rotation
    }
  });

  return (
    <group rotation={[TILT, 0, 0]} ref={earthRef}>
      {/* Wireframe Grid */}
      <Sphere args={[2, 32, 32]}>
        <meshStandardMaterial 
          color="#38bdf8" 
          wireframe={true} 
          transparent 
          opacity={0.15} 
        />
      </Sphere>
      {/* Solid Dark Core */}
      <Sphere args={[1.98, 32, 32]}>
        <meshBasicMaterial color="#020617" />
      </Sphere>

      {/* NIRS Center */}
      <BaseStation lat={36.35} lon={127.38} label="NIRS (국가정보자원관리원)" color="#b026ff" isCenter />
      
      {/* Base Stations */}
      <BaseStation lat={35.1} lon={129.0} label="동해 기지국" color="#39ff14" />
      <BaseStation lat={34.7} lon={126.3} label="남해 기지국" color="#39ff14" />
      <BaseStation lat={37.4} lon={126.6} label="서해 기지국" color="#39ff14" />
    </group>
  );
}

function BaseStation({ lat, lon, label, color, isCenter = false }: { lat: number, lon: number, label: string, color: string, isCenter?: boolean }) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const r = 2.0; 
  
  const x = -(r * Math.sin(phi) * Math.cos(theta));
  const z = (r * Math.sin(phi) * Math.sin(theta));
  const y = (r * Math.cos(phi));

  return (
    <group position={[x, y, z]}>
      <mesh>
        <sphereGeometry args={[isCenter ? 0.04 : 0.02, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Pulse Effect */}
      <mesh>
        <ringGeometry args={[0.04, 0.06, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      <Html distanceFactor={10} zIndexRange={[100, 0]}>
        <div style={{ color, fontSize: isCenter ? '14px' : '10px', fontWeight: 'bold', textShadow: '0 0 5px #000', whiteSpace: 'nowrap', transform: 'translate3d(-50%, -150%, 0)' }}>
          {label}
        </div>
      </Html>
    </group>
  );
}
