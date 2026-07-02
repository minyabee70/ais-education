import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { KoreaMap2D, STATIONS } from './KoreaMap2D';

export function FlowScene() {
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  
  // Create vessels and their paths
  const flowData = useMemo(() => {
    const vessels = [];
    const particles = [];
    const nirsPos = new THREE.Vector3(0, 0, 0);

    for (let i = 0; i < 10; i++) {
      // Random vessel position
      const vPos = new THREE.Vector3(
        -3 + Math.random() * 6,
        -4 + Math.random() * 8,
        0
      );
      vessels.push(vPos);

      // Find nearest station
      let nearestSt = STATIONS[0];
      let minDist = Infinity;
      STATIONS.forEach(st => {
        if (st.isCenter) return;
        const dist = vPos.distanceTo(new THREE.Vector3(st.pos[0], st.pos[1], 0));
        if (dist < minDist) {
          minDist = dist;
          nearestSt = st;
        }
      });

      const stPos = new THREE.Vector3(nearestSt.pos[0], nearestSt.pos[1], 0);

      // Create 3 particles per vessel
      for (let j = 0; j < 3; j++) {
        particles.push({
          progress: Math.random(), // 0 to 1
          speed: 0.002 + Math.random() * 0.002,
          path1: { start: vPos, end: stPos }, // Vessel -> Station
          path2: { start: stPos, end: nirsPos } // Station -> NIRS
        });
      }
    }
    return { vessels, particles };
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (!particlesRef.current) return;
    
    flowData.particles.forEach((p, i) => {
      p.progress += p.speed;
      if (p.progress > 1) p.progress = 0;

      let pos = new THREE.Vector3();
      // First half: Vessel to Station. Second half: Station to NIRS
      if (p.progress < 0.5) {
        const t = p.progress * 2;
        pos.lerpVectors(p.path1.start, p.path1.end, t);
      } else {
        const t = (p.progress - 0.5) * 2;
        pos.lerpVectors(p.path2.start, p.path2.end, t);
      }

      dummy.position.copy(pos);
      dummy.updateMatrix();
      particlesRef.current!.setMatrixAt(i, dummy.matrix);
    });
    particlesRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <KoreaMap2D />

      {/* Vessels */}
      {flowData.vessels.map((pos, i) => (
        <mesh key={i} position={pos}>
          <coneGeometry args={[0.08, 0.2, 4]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* Flowing Data Particles */}
      <instancedMesh ref={particlesRef} args={[undefined, undefined, flowData.particles.length]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#4ade80" />
      </instancedMesh>
    </group>
  );
}
