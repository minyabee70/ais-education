import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export function SotdmaScene() {
  const [time, setTime] = useState(0);

  useFrame((state) => {
    setTime(Math.floor(state.clock.elapsedTime * 5) % 60); // 60 slots per minute simulation
  });

  const slots = Array.from({ length: 60 });
  
  // Ships A, B, C slots
  const shipASlots = [5, 25, 45];
  const shipBSlots = [10, 30, 50];
  const shipCSlots = [15, 35, 55];

  return (
    <group>
      {/* 2D Grid Background */}
      <mesh position={[0, 0, -1]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial color="#020617" />
      </mesh>
      
      {/* SOTDMA Time Grid visualization at the bottom */}
      <group position={[-5, -2, 0]}>
        {slots.map((_, i) => {
          const row = Math.floor(i / 20);
          const col = i % 20;
          
          let color = '#1e293b'; // empty slot
          let label = '';
          if (shipASlots.includes(i)) { color = '#38bdf8'; label = 'A'; }
          else if (shipBSlots.includes(i)) { color = '#4ade80'; label = 'B'; }
          else if (shipCSlots.includes(i)) { color = '#facc15'; label = 'C'; }
          
          if (i === time) {
            color = '#ffffff'; // active slot
          }

          return (
            <mesh key={i} position={[col * 0.5, -row * 0.5, 0]}>
              <planeGeometry args={[0.4, 0.4]} />
              <meshBasicMaterial color={color} />
            </mesh>
          );
        })}
      </group>
      
      {/* Ships */}
      <Ship name="Ship A" position={[-3, 2, 0]} color="#38bdf8" isTransmitting={shipASlots.includes(time)} />
      <Ship name="Ship B" position={[0, 2.5, 0]} color="#4ade80" isTransmitting={shipBSlots.includes(time)} />
      <Ship name="Ship C" position={[3, 2, 0]} color="#facc15" isTransmitting={shipCSlots.includes(time)} />
      
      <Html distanceFactor={10} position={[0, -4.5, 0]}>
        <div style={{ textAlign: 'center', width: '400px', transform: 'translate3d(-50%, 0, 0)', color: '#f8fafc' }}>
          <h3 style={{ margin: '0' }}>SOTDMA (시분할 다중 접속)</h3>
          <p style={{ fontSize: '11px', color: '#94a3b8' }}>1분을 2250개의 타임 슬롯으로 나누어 선박들이 서로 겹치지 않게 전송 시간을 예약합니다. 위 격자는 이를 간략화하여 보여줍니다.</p>
        </div>
      </Html>
    </group>
  );
}

function Ship({ name, position, color, isTransmitting }: any) {
  return (
    <group position={position}>
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <coneGeometry args={[0.3, 0.8, 4]} />
        <meshBasicMaterial color={isTransmitting ? '#ffffff' : color} />
      </mesh>
      {isTransmitting && (
        <mesh position={[0, 0, -0.1]}>
          <ringGeometry args={[0.5, 0.6, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
      )}
      <Html distanceFactor={10} position={[0, -1, 0]}>
        <div style={{ fontSize: '12px', fontWeight: 'bold', transform: 'translate3d(-50%, 0, 0)', background: isTransmitting ? color : 'transparent', color: isTransmitting ? '#000' : color, padding: '2px 5px', borderRadius: '4px' }}>
          {name}
        </div>
      </Html>
    </group>
  );
}
