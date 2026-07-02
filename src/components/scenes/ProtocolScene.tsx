import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { AIS_MESSAGES, AisMessage } from '../../data/AisProtocolData';

export function ProtocolScene() {
  const [selected, setSelected] = useState<AisMessage>(AIS_MESSAGES[0]);
  const pulseRef = useRef<THREE.Mesh>(null);
  const pulse = useRef(0);

  useFrame(() => {
    pulse.current += 0.02;
    if (pulseRef.current) {
      const scale = 1 + (pulse.current % 1) * 6;
      pulseRef.current.scale.set(scale, scale, 1);
      (pulseRef.current.material as THREE.MeshBasicMaterial).opacity = (1 - (pulse.current % 1)) * 0.7;
    }
  });

  const categoryColors: Record<string, string> = {
    'Class A': '#38bdf8', 'Class B': '#94a3b8', '인프라': '#a78bfa',
    '이진 메시지': '#f97316', '안전': '#fbbf24', 'SAR': '#34d399',
    'AtoN': '#fb923c', 'S-AIS': '#facc15',
  };

  return (
    <group>
      {/* 2D Grid Background */}
      <mesh position={[0, 0, -1]}>
        <planeGeometry args={[30, 20]} />
        <meshBasicMaterial color="#020617" />
      </mesh>
      <gridHelper args={[30, 60, '#0f172a', '#0f172a']} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.9]} />

      {/* 3D Vessel / Model in the scene center */}
      <group position={[0, 0.5, 0]}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <coneGeometry args={[0.25, 0.7, 4]} />
          <meshBasicMaterial color={selected.color} />
        </mesh>
        <mesh ref={pulseRef} position={[0, 0, -0.1]}>
          <ringGeometry args={[0.4, 0.45, 64]} />
          <meshBasicMaterial color={selected.color} transparent opacity={1} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Full-screen HTML overlay via Html component */}
      <Html fullscreen zIndexRange={[100, 0]}>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', gap: '0',
          pointerEvents: 'none',
          fontFamily: "'Inter', monospace",
        }}>
          {/* LEFT: Message List */}
          <div style={{
            width: '270px', height: '100%',
            overflowY: 'auto', background: 'rgba(2, 6, 23, 0.85)',
            borderRight: '1px solid #1e293b',
            pointerEvents: 'auto', flexShrink: 0,
          }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #1e293b', background: 'rgba(14,165,233,0.08)' }}>
              <h2 style={{ color: '#38bdf8', margin: 0, fontSize: '14px', letterSpacing: '1px' }}>AIS 메시지 타입 목록</h2>
              <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '11px' }}>Msg 1 ~ 27 (ITU-R M.1371)</p>
            </div>
            {AIS_MESSAGES.map(msg => (
              <button
                key={msg.type}
                onClick={() => setSelected(msg)}
                style={{
                  width: '100%', textAlign: 'left', background: selected.type === msg.type ? 'rgba(56,189,248,0.12)' : 'transparent',
                  border: 'none', borderLeft: `3px solid ${selected.type === msg.type ? msg.color : 'transparent'}`,
                  borderBottom: '1px solid #0f172a',
                  padding: '10px 14px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '2px',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    background: msg.color, color: '#020617', fontWeight: 'bold',
                    borderRadius: '4px', padding: '1px 6px', fontSize: '11px', minWidth: '22px', textAlign: 'center',
                  }}>
                    {msg.type}
                  </span>
                  <span style={{ color: selected.type === msg.type ? '#f8fafc' : '#94a3b8', fontSize: '12px' }}>
                    {msg.name}
                  </span>
                </div>
                <span style={{
                  marginLeft: '30px', fontSize: '10px',
                  color: categoryColors[msg.category] || '#64748b',
                  background: `${categoryColors[msg.category]}18`, borderRadius: '3px', padding: '1px 5px',
                  display: 'inline-block',
                }}>
                  {msg.category}
                </span>
              </button>
            ))}
          </div>

          {/* RIGHT: Detail Panel */}
          <div style={{
            flex: 1, height: '100%', overflowY: 'auto',
            background: 'rgba(2, 6, 23, 0.7)',
            padding: '24px', pointerEvents: 'auto',
            display: 'flex', flexDirection: 'column', gap: '16px',
          }}>
            {/* Header */}
            <div style={{ borderBottom: `1px solid ${selected.color}40`, paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{
                  background: selected.color, color: '#020617', fontWeight: 'bold',
                  borderRadius: '6px', padding: '4px 12px', fontSize: '20px',
                }}>
                  Type {selected.type}
                </span>
                <span style={{
                  color: categoryColors[selected.category] || '#64748b',
                  background: `${categoryColors[selected.category]}20`,
                  border: `1px solid ${categoryColors[selected.category] || '#64748b'}40`,
                  borderRadius: '5px', padding: '3px 10px', fontSize: '12px',
                }}>
                  {selected.category}
                </span>
              </div>
              <h3 style={{ color: '#f8fafc', margin: '0 0 6px', fontSize: '18px' }}>{selected.name}</h3>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '13px', lineHeight: '1.6' }}>{selected.shortDesc}</p>
            </div>

            {/* Full Description */}
            <div style={{ background: 'rgba(30,41,59,0.6)', borderRadius: '8px', padding: '14px', border: '1px solid #1e293b' }}>
              <h4 style={{ color: '#38bdf8', margin: '0 0 8px', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>📖 상세 설명</h4>
              <p style={{ color: '#cbd5e1', margin: 0, fontSize: '13px', lineHeight: '1.7' }}>{selected.fullDesc}</p>
            </div>

            {/* NMEA Raw Data */}
            <div style={{ background: 'rgba(0, 0, 0, 0.5)', borderRadius: '8px', padding: '14px', border: `1px solid ${selected.color}30` }}>
              <h4 style={{ color: '#4ade80', margin: '0 0 10px', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>📡 NMEA 0183 Raw Payload</h4>
              <pre style={{
                color: '#4ade80', fontFamily: 'monospace', fontSize: '11px',
                margin: 0, wordBreak: 'break-all', whiteSpace: 'pre-wrap',
                lineHeight: '1.6', background: 'transparent',
              }}>
                {selected.raw}
              </pre>
            </div>

            {/* Decoded Fields */}
            <div style={{ background: 'rgba(30,41,59,0.6)', borderRadius: '8px', padding: '14px', border: '1px solid #1e293b' }}>
              <h4 style={{ color: '#38bdf8', margin: '0 0 10px', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>🔍 디코딩된 데이터 필드</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {selected.fields.map((f, i) => (
                  <div key={i} style={{
                    background: 'rgba(2,6,23,0.6)', borderRadius: '6px',
                    padding: '8px 10px', border: '1px solid #1e293b',
                  }}>
                    <div style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', marginBottom: '2px' }}>{f.name}</div>
                    <div style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 'bold' }}>{f.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}
