import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import { BookOpen, Radar, Anchor, Clock, Ship, Radio, Satellite, ShieldAlert, LifeBuoy } from 'lucide-react';

const TOPICS = [
  { id: 'basic', icon: BookOpen, title: '1. AIS란 무엇인가?', content: 'AIS(Automatic Identification System)는 선박의 위치, 속력 등의 운항 정보를 VHF 주파수를 통해 인근 선박 및 육상 기지국과 자동으로 주고받는 장치입니다. IMO(국제해사기구)에 의해 장착이 의무화되었습니다.' },
  { id: 'intro', icon: Radar, title: '2. 충돌 예방 (목적)', content: '가장 큰 목적은 해상 충돌 예방입니다. 레이더파가 닿지 않는 섬 뒤편이나 짙은 안개 속에서도 서로의 위치를 파악하여 안전하게 회피할 수 있습니다.' },
  { id: 'protocol', icon: Anchor, title: '3. 데이터 프로토콜', content: 'AIS 패킷에는 정적(MMSI, 제원), 동적(위치, 속력), 항해(목적지) 정보가 담겨있습니다. 3D 상의 선박에 마우스를 올려 확인해 보세요.' },
  { id: 'sotdma', icon: Clock, title: '4. SOTDMA 원리', content: '수많은 선박이 동시에 신호를 보내도 혼신이 발생하지 않는 이유는 시간을 미세한 슬롯(Slot)으로 나누어 질서 있게 송신(시분할 다중 접속)하기 때문입니다.' },
  { id: 'class', icon: Ship, title: '5. Class A vs B', content: '대형 선박(Class A, 파란색)은 출력이 강해 자주 신호를 송신하고, 소형 선박(Class B, 회색)은 간헐적으로 송신합니다.' },
  { id: 'flow', icon: Radio, title: '6. 육상 관제망 흐름', content: '선박에서 발생한 AIS 신호는 연안 기지국을 거쳐 국가정보자원관리원(NIRS)으로 전달되어 VTS 해상 관제 등에 사용됩니다.' },
  { id: 'satellite', icon: Satellite, title: '7. 위성 AIS (S-AIS)', content: '연안 기지국 전파(VHF)가 닿지 않는 먼 바다의 신호는 저궤도(LEO) 위성이 수집하여 전 세계 선박을 커버합니다.' },
  { id: 'security', icon: ShieldAlert, title: '8. 보안 위협 (스푸핑)', content: '암호화되지 않은 신호를 악용하여 가짜 선박(유령선)을 만들어낼 수 있습니다. 아래 버튼으로 시뮬레이션 해보세요.' },
  { id: 'rescue', icon: LifeBuoy, title: '9. 해양 수색구조(SAR)', content: '조난 사고 발생 시 AIS-SART를 통해 조난 위치(SOS 펄스)를 즉각 전송하여 주변 선박과 헬기가 신속하게 구조할 수 있습니다.' }
];

function App() {
  const [topic, setTopic] = useState('basic');
  const [spoofActive, setSpoofActive] = useState(false);
  const [rescueActive, setRescueActive] = useState(false);
  const [fontScale, setFontScale] = useState(1.0);

  const adjustFont = (delta: number) => {
    setFontScale(prev => Math.min(2.0, Math.max(0.6, +(prev + delta).toFixed(1))));
  };

  // Push the scale to :root so all rem/em units update globally
  React.useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', String(fontScale));
  }, [fontScale]);

  const activeTopic = TOPICS.find(t => t.id === topic);

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      
      {/* Left Panel */}
      <div style={{ width: '420px', padding: '20px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <header className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Radar size={32} color="#38bdf8" />
          <div>
            <h1 style={{ fontSize: '1.3rem', letterSpacing: '1px' }}>AIS <span style={{ color: '#38bdf8' }}>Education</span></h1>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>개념부터 활용까지 (NIRS 모니터링 체계)</p>
          </div>
        </header>

        <nav className="glass-panel" style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '5px', overflowY: 'auto' }}>
          {TOPICS.map(t => (
            <button key={t.id} className={`topic-btn ${topic === t.id ? 'active' : ''}`} onClick={() => setTopic(t.id)} style={{ padding: '10px 15px', fontSize: '0.9rem' }}>
              <t.icon size={16} /> {t.title}
            </button>
          ))}
        </nav>

        <div className="glass-panel" style={{ flex: 1, padding: '20px', overflowY: 'auto', minHeight: '180px' }}>
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
          {topic === 'rescue' && (
            <button 
              onClick={() => setRescueActive(true)}
              style={{
                marginTop: '20px', width: '100%', padding: '12px', background: 'rgba(234, 179, 8, 0.2)',
                border: '1px solid #eab308', color: '#f8fafc', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
              }}
            >
              조난 상황(SOS) 시뮬레이션
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
          
          <SceneManager topic={topic} spoofActive={spoofActive} rescueActive={rescueActive} />
        </Canvas>

        {/* Global Controls */}
        <div style={{ position: 'absolute', bottom: '20px', right: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Font Size Controls */}
          <div className="glass-panel" style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.75rem', letterSpacing: '1px' }}>글자 크기</span>
            <button
              onClick={() => adjustFont(-0.1)}
              title="글자 축소"
              style={{
                background: 'rgba(56,189,248,0.15)', border: '1px solid #38bdf8',
                color: '#38bdf8', borderRadius: '5px', width: '28px', height: '28px',
                cursor: 'pointer', fontSize: '16px', lineHeight: 1, display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
              }}
            >−</button>
            <span style={{ color: '#f8fafc', minWidth: '36px', textAlign: 'center', fontSize: '0.85rem' }}>
              {Math.round(fontScale * 100)}%
            </span>
            <button
              onClick={() => adjustFont(0.1)}
              title="글자 확대"
              style={{
                background: 'rgba(56,189,248,0.15)', border: '1px solid #38bdf8',
                color: '#38bdf8', borderRadius: '5px', width: '28px', height: '28px',
                cursor: 'pointer', fontSize: '16px', lineHeight: 1, display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
              }}
            >+</button>
            <button
              onClick={() => setFontScale(1.0)}
              title="초기화"
              style={{
                background: 'transparent', border: '1px solid #475569',
                color: '#94a3b8', borderRadius: '5px', padding: '0 8px', height: '28px',
                cursor: 'pointer', fontSize: '11px',
              }}
            >초기화</button>
          </div>

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
import { BasicScene } from './components/scenes/BasicScene';
import { IntroScene } from './components/scenes/IntroScene';
import { FlowScene } from './components/scenes/FlowScene';
import { ProtocolScene } from './components/scenes/ProtocolScene';
import { SotdmaScene } from './components/scenes/SotdmaScene';
import { ClassCompareScene } from './components/scenes/ClassCompareScene';
import { SpoofingScene } from './components/scenes/SpoofingScene';
import { SatelliteScene } from './components/scenes/SatelliteScene';
import { RescueScene } from './components/scenes/RescueScene';
import * as THREE from 'three';

function SceneManager({ topic, spoofActive, rescueActive }: { topic: string, spoofActive: boolean, rescueActive: boolean }) {
  useFrame((state) => {
    // Smooth camera transition between 2D map views and 3D globe view
    const targetPos = topic === 'satellite' ? new THREE.Vector3(0, 1.5, 4) : new THREE.Vector3(0, 0, 8);
    state.camera.position.lerp(targetPos, 0.05);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {topic === 'basic' && <BasicScene />}
      {topic === 'intro' && <IntroScene />}
      {topic === 'protocol' && <ProtocolScene />}
      {topic === 'sotdma' && <SotdmaScene />}
      {topic === 'class' && <ClassCompareScene />}
      {topic === 'flow' && <FlowScene />}
      {topic === 'satellite' && <SatelliteScene />}
      {topic === 'security' && <SpoofingScene spoofActive={spoofActive} />}
      {topic === 'rescue' && <RescueScene rescueActive={rescueActive} />}
    </>
  );
}

export default App;
