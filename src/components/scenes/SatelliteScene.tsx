import React from 'react';
import { EarthGlobe } from '../EarthGlobe';
import { Vessels } from '../Vessels';
import { SatelliteSystem } from '../SatelliteSystem';
import { OrbitControls } from '@react-three/drei';

export function SatelliteScene() {
  return (
    <group>
      <EarthGlobe />
      <Vessels topic="satellite" spoofActive={false} />
      <SatelliteSystem active={true} />
      <OrbitControls 
        enablePan={false} 
        minDistance={2.5} 
        maxDistance={8}
        autoRotate={false}
      />
    </group>
  );
}
