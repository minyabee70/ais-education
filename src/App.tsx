import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import { EarthGlobe } from './components/EarthGlobe';
import { Vessels } from './components/Vessels';
import { SatelliteSystem } from './components/SatelliteSystem';
import { Radar, ShieldAlert, Satellite, Radio, Anchor } from 'lucide-react';

const TOPICS = [
  { id: 'flow', icon: Radio, title: '1. 기본 신호 흐름', content: '선박에서 발생한 AIS 신호는 연안 기지국을 거쳐 국가정보자원관리원(NIRS)으로 전달됩니다. (녹색 파티클 흐름을 확인하세요)' },
  { id: 'protocol', icon: Anchor, title: '2. AIS 데이터 프로토콜', content: 'AIS 패킷에는 정적(MMSI, 제원), 동적(위치, 속력), 항해(목적지) 정보가 담겨있습니다. 3D 상의 선박에 마우스를 올려 확인해 보세요.' },
  { id: 'class', icon: Radar, title: '3. Class A vs B', content: '대형 선박(Class A, 하얀색)은 출력이 강해 자주 신호를 송신하고, 소형 선박(Class B, 회색)은 간헐적으로 송신합니다.' },
  { id: 'satellite', icon: Satellite, title: '4. 위성 AIS (S-AIS)', content: '먼 바다의 신호는 저궤도(LEO) 위성이 수집합니다. 궤도와 위성의 커버리지 뷰를 확인하세요.' },
  { id: 'security', icon: ShieldAlert, title: '5. 보안 위협 (스푸핑)', content: '암호화되지 않은 신호를 악용하여 가짜 선박(유령선)을 만들어낼 수 있습니다. 아래 버튼으로 시뮬레이션 해보세요.' },
];

function App() {
  const [topic, setTopic] = useState('flow');
  const [spoofActive, setSpoofActive] = useState(false);

  const activeTopic = TOPICS.find(t => t.id === topic);

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      
      {/* Left Panel */}
      <div style={{ width: '400px', padding: '20px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <header className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Radar size={32} color="#38bdf8" />
          <div>
            <h1 style={{ fontSize: '1.3rem', letterSpacing: '1px' }}>AIS <span style={{ color: '#38bdf8' }}>3D Flow</span></h1>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>국가정보자원관리원 모니터링 체계</p>
          </div>
        </header>

        <nav className="glass-panel" style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {TOPICS.map(t => (
            <button key={t.id} className={`topic-btn ${topic === t.id ? 'active' : ''}`} onClick={() => setTopic(t.id)}>
              <t.icon size={18} /> {t.title}
            </button>
          ))}
        </nav>

        <div className="glass-panel" style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          <h2 style={{ color: '#38bdf8', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {activeTopic?.title}
          </h2>
          <p style={{ color: '#cbd5e1', lineHeight: '1.6', fontSize: '0.95rem' }}>{activeTopic?.content}</p>
          
          {topic === 'security' && (
            <button 
              onClick={() => setSpoofActive(true)}
              style={{
                marginTop: '20px', width: '100%', padding: '12px', background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid #ef4444', color: '#f8fafc', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
              }}
            >
              스푸핑 유령선 출현 시뮬레이션
            </button>
          )}
        </div>
      </div>

      {/* Right 3D Canvas */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <color attach="background" args={['#020617']} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 3, 5]} intensity={1.5} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          <SceneManager topic={topic} spoofActive={spoofActive} />
        </Canvas>

        {/* Global Controls */}
        <div style={{ position: 'absolute', bottom: '20px', right: '20px', display: 'flex', gap: '10px' }}>
          <div className="glass-panel" style={{ padding: '8px 15px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%', boxShadow: '0 0 10px #4ade80' }}></span>
            SYSTEM ONLINE
          </div>
        </div>
      </div>

    </div>
  );
}

// Manages which scene to render and handles camera transitions
import { useFrame } from '@react-three/fiber';
import { FlowScene } from './components/scenes/FlowScene';
import { ProtocolScene } from './components/scenes/ProtocolScene';
import { ClassCompareScene } from './components/scenes/ClassCompareScene';
import { SpoofingScene } from './components/scenes/SpoofingScene';
import { SatelliteScene } from './components/scenes/SatelliteScene';
import * as THREE from 'three';

function SceneManager({ topic, spoofActive }: { topic: string, spoofActive: boolean }) {
  useFrame((state) => {
    // Smooth camera transition between 2D map views and 3D globe view
    const targetPos = topic === 'satellite' ? new THREE.Vector3(0, 1.5, 4) : new THREE.Vector3(0, 0, 8);
    state.camera.position.lerp(targetPos, 0.05);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {topic === 'flow' && <FlowScene />}
      {topic === 'protocol' && <ProtocolScene />}
      {topic === 'class' && <ClassCompareScene />}
      {topic === 'satellite' && <SatelliteScene />}
      {topic === 'security' && <SpoofingScene spoofActive={spoofActive} />}
    </>
  );
}

export default App;
