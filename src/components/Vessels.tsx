import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export function Vessels({ topic, spoofActive }: { topic: string, spoofActive: boolean }) {
  const vessels = useMemo(() => {
    const arr = [];
    // Generate Class A and B vessels around Korea
    for(let i=0; i<15; i++) {
      arr.push({
        id: i,
        cls: i < 5 ? 'A' : 'B',
        lat: 30 + Math.random() * 10,
        lon: 124 + Math.random() * 8,
        speed: Math.random() * 0.01 + 0.005,
        heading: Math.random() * Math.PI * 2,
        mmsi: 440000000 + Math.floor(Math.random() * 100000)
      });
    }
    return arr;
  }, []);

  return (
    <group rotation={[23.5 * (Math.PI / 180), 0, 0]}>
      {vessels.map(v => (
        <Vessel key={v.id} data={v} />
      ))}
      {spoofActive && (
        <Vessel key="spoof" data={{ id: 99, cls: 'SPOOF', lat: 34, lon: 128, speed: 0.05, heading: 0, mmsi: 999999999 }} />
      )}
    </group>
  );
}

function Vessel({ data }: { data: any }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  const posRef = useRef({ lat: data.lat, lon: data.lon });
  const r = 2.01;

  useFrame(() => {
    // Move vessel without triggering React re-renders
    posRef.current.lat += Math.cos(data.heading) * data.speed * 0.1;
    posRef.current.lon += Math.sin(data.heading) * data.speed * 0.1;

    if (meshRef.current) {
      const phi = (90 - posRef.current.lat) * (Math.PI / 180);
      const theta = (posRef.current.lon + 180) * (Math.PI / 180);
      meshRef.current.position.x = -(r * Math.sin(phi) * Math.cos(theta));
      meshRef.current.position.z = (r * Math.sin(phi) * Math.sin(theta));
      meshRef.current.position.y = (r * Math.cos(phi));
      
      // Orient normal to surface
      meshRef.current.lookAt(0, 0, 0);
    }
  });

  const isClassA = data.cls === 'A';
  const isSpoof = data.cls === 'SPOOF';
  const color = isSpoof ? '#ef4444' : (isClassA ? '#ffffff' : '#64748b');

  return (
    <group>
      <mesh 
        ref={meshRef}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <coneGeometry args={[0.02, 0.06, 4]} />
        <meshBasicMaterial color={color} />
        {hovered && (
          <Html distanceFactor={10} zIndexRange={[100, 0]}>
            <div className="ship-popup">
              <h3>{isSpoof ? 'UNKNOWN_TARGET' : `VESSEL-${data.id}`} <span style={{fontSize:'10px', padding:'2px 4px', background: isSpoof ? '#ef4444' : '#38bdf8', borderRadius:'4px', marginLeft:'5px'}}>{data.cls}</span></h3>
              <div className="data-row"><span className="label">MMSI</span><span className="font-mono">{data.mmsi}</span></div>
              <div className="data-row"><span className="label">SPEED</span><span className="font-mono">{(data.speed * 1000).toFixed(1)} kts</span></div>
              <div className="data-row"><span className="label">STATUS</span><span style={{color: isSpoof ? '#ef4444' : '#4ade80'}}>{isSpoof ? 'ANOMALY' : 'Under Way'}</span></div>
            </div>
          </Html>
        )}
      </mesh>
    </group>
  );
}
