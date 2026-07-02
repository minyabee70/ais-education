export interface AisField {
  name: string;
  value: string;
}

export interface AisMessage {
  type: number;
  name: string;
  category: string; // 'Class A', 'Infra', 'Binary', 'Safety', 'Class B', 'AtoN', etc.
  color: string;
  shortDesc: string;
  fullDesc: string;
  raw: string;
  fields: AisField[];
  modelHint: 'ship' | 'station' | 'aircraft' | 'buoy'; // 3D model to show
}

export const AIS_MESSAGES: AisMessage[] = [
  {
    type: 1, name: '위치 보고 (Class A 예약)', category: 'Class A', color: '#38bdf8', modelHint: 'ship',
    shortDesc: 'Class A 선박의 기본 위치 보고 (항해 중)',
    fullDesc: 'SOTDMA(시분할 다중 접속) 방식으로 전송되는 Class A 선박의 위치 보고 메시지입니다. 선박 속력, 위치, 침로 등 동적 정보를 포함합니다.',
    raw: '!AIVDM,1,1,,B,15M67N0000G?Ual@C<4OwnH00<0,0*2E',
    fields: [
      { name: 'MMSI', value: '366999712' },
      { name: '항해상태', value: '0 (항해 중)' },
      { name: '속력 (SOG)', value: '0.0 knots' },
      { name: '위치정확도', value: '0 (GNSS)' },
      { name: '경도 (LON)', value: '-122.4038°' },
      { name: '위도 (LAT)', value: '37.8076°' },
      { name: '진침로 (COG)', value: '131.0°' },
      { name: '선수방위 (HDG)', value: '511 (미정)' },
    ]
  },
  {
    type: 2, name: '위치 보고 (Class A 지정)', category: 'Class A', color: '#38bdf8', modelHint: 'ship',
    shortDesc: 'TDMA 방식으로 지정된 슬롯에서 전송되는 Class A 위치 보고',
    fullDesc: 'Type 1과 동일한 정보를 담고 있으나, 기지국에 의해 미리 할당된 타임 슬롯(TDMA)을 사용하여 전송합니다. 슬롯 충돌을 방지합니다.',
    raw: '!AIVDM,1,1,,A,25M67N000:G?UalDC<4OwHL0<0k,0*6F',
    fields: [
      { name: 'MMSI', value: '338234631' },
      { name: '항해상태', value: '0 (항해 중)' },
      { name: '속력 (SOG)', value: '9.2 knots' },
      { name: '경도 (LON)', value: '126.9780°' },
      { name: '위도 (LAT)', value: '37.5665°' },
      { name: '진침로 (COG)', value: '260.0°' },
    ]
  },
  {
    type: 3, name: '위치 보고 (Class A 응답)', category: 'Class A', color: '#38bdf8', modelHint: 'ship',
    shortDesc: '다른 선박의 요청에 응답하는 Class A 위치 보고',
    fullDesc: '선박 또는 기지국의 폴링(Polling) 요청에 응답하여 RATDMA 방식으로 전송하는 위치 보고입니다. Type 1과 동일한 데이터 구조를 사용합니다.',
    raw: '!AIVDM,1,1,,A,35M67N0OjG?Ual@C<4OwnH00<0,0*3D',
    fields: [
      { name: 'MMSI', value: '257338000' },
      { name: '항해상태', value: '5 (정박)' },
      { name: '속력 (SOG)', value: '0.0 knots' },
      { name: '경도 (LON)', value: '10.3943°' },
      { name: '위도 (LAT)', value: '63.4305°' },
      { name: '선수방위 (HDG)', value: '225°' },
    ]
  },
  {
    type: 4, name: '기지국 보고', category: '인프라', color: '#a78bfa', modelHint: 'station',
    shortDesc: '연안 AIS 기지국(Base Station)의 UTC 시간 및 위치 보고',
    fullDesc: '육상 AIS 기지국이 주기적으로 자신의 위치와 UTC 기준 시간을 전송합니다. 수신 선박들은 이를 기반으로 시간 동기화와 DGNSS 보정 기준값으로 활용합니다.',
    raw: '!AIVDM,1,1,,A,403OviQuMGCqWrRO9>E6fE700@GO,0*4D',
    fields: [
      { name: 'MMSI (기지국)', value: '003669702' },
      { name: 'UTC 연도', value: '2024' },
      { name: 'UTC 월/일', value: '11 / 15' },
      { name: 'UTC 시/분/초', value: '08:00:00' },
      { name: '경도 (LON)', value: '-122.4771°' },
      { name: '위도 (LAT)', value: '37.9253°' },
    ]
  },
  {
    type: 5, name: '정적·항해 정보', category: 'Class A', color: '#38bdf8', modelHint: 'ship',
    shortDesc: '선박명, 콜사인, 목적지, 선박 제원 등 정적 정보 보고',
    fullDesc: 'Class A 선박이 6분마다 한 번 전송하는 정적 및 항해 정보입니다. 선박의 이름, IMO 번호, 콜사인, 선종, 선박 크기, 목적지 항구, 예상 도착시간(ETA) 등이 포함됩니다.',
    raw: '!AIVDM,2,1,3,B,55?MbV02>H9qL9W<H4eEA4l0T4@Dn2222220l1@<553mH04k0Ep6ClRh00,0*1F\n!AIVDM,2,2,3,B,00000000000,2*24',
    fields: [
      { name: 'MMSI', value: '366000001' },
      { name: 'IMO 번호', value: '9999999' },
      { name: '콜사인', value: 'KABB1' },
      { name: '선박명', value: 'SEA EXPLORER' },
      { name: '선종 코드', value: '70 (화물선)' },
      { name: '선박 길이', value: '180m' },
      { name: '선박 폭', value: '28m' },
      { name: '흘수', value: '6.0m' },
      { name: '목적지', value: 'BUSAN' },
      { name: '예상 도착(ETA)', value: '11/20 06:00 UTC' },
    ]
  },
  {
    type: 6, name: '이진 주소 메시지', category: '이진 메시지', color: '#f97316', modelHint: 'ship',
    shortDesc: '특정 수신자(MMSI)에게 전달되는 이진(Binary) 데이터 메시지',
    fullDesc: '선박간 또는 기지국-선박 간에 특정 수신처를 지정하여 전달하는 이진 데이터 메시지입니다. 기상 특보, 항행 경보 등 맞춤형 정보를 전달하는 데 사용됩니다.',
    raw: '!AIVDM,1,1,,A,6B>jUU2GDdlMH:FKpJDU5DP08000,2*56',
    fields: [
      { name: '발신 MMSI', value: '351359000' },
      { name: '수신 MMSI', value: '123456789' },
      { name: 'Application ID', value: 'DAC: 1, FI: 31' },
      { name: '메시지 내용', value: '이진 인코딩 기상 데이터' },
    ]
  },
  {
    type: 7, name: '이진 수신 확인', category: '이진 메시지', color: '#f97316', modelHint: 'ship',
    shortDesc: 'Type 6 메시지에 대한 수신 확인(ACK) 응답',
    fullDesc: 'Type 6 이진 주소 메시지를 성공적으로 수신했을 때 발신자에게 돌려보내는 수신 확인 응답 메시지입니다.',
    raw: '!AIVDM,1,1,,A,702R5`hwCjq8,0*6B',
    fields: [
      { name: '발신 MMSI', value: '123456789' },
      { name: '수신 확인 MMSI', value: '351359000' },
      { name: '확인 메시지 번호', value: '0' },
    ]
  },
  {
    type: 8, name: '이진 방송 메시지', category: '이진 메시지', color: '#f97316', modelHint: 'station',
    shortDesc: '불특정 다수에게 방송되는 이진 데이터 메시지',
    fullDesc: '특정 수신처 없이 모든 수신 가능 선박에 방송하는 이진 데이터 메시지입니다. 해양 기상 특보, 항만 상태 정보, DGNSS 보정 데이터 등 공공 정보 전파에 사용됩니다.',
    raw: '!AIVDM,1,1,,A,85Mwpb@0000000',
    fields: [
      { name: '발신 MMSI', value: '003160009' },
      { name: 'Application ID', value: 'DAC: 366, FI: 56' },
      { name: '메시지 내용', value: '기상 경보 (Binary Broadcast)' },
    ]
  },
  {
    type: 9, name: 'SAR 항공기 위치 보고', category: 'SAR', color: '#34d399', modelHint: 'aircraft',
    shortDesc: '수색구조(SAR) 항공기의 위치 보고 메시지',
    fullDesc: '수색구조 작전에 투입된 SAR 항공기(헬기, 고정익기 등)가 자신의 위치를 전송하는 메시지입니다. 항공기 고도 정보가 포함된다는 점에서 선박 위치 보고와 다릅니다.',
    raw: '!AIVDM,1,1,,B,91b55vRAirOn<94M097lh=H5rJEd,0*14',
    fields: [
      { name: 'MMSI', value: '111123456' },
      { name: '속력 (SOG)', value: '55.0 knots' },
      { name: '경도 (LON)', value: '129.0441°' },
      { name: '위도 (LAT)', value: '35.1028°' },
      { name: '진침로 (COG)', value: '270.0°' },
      { name: '고도 (ALT)', value: '300m' },
    ]
  },
  {
    type: 10, name: 'UTC/날짜 조회', category: '인프라', color: '#a78bfa', modelHint: 'station',
    shortDesc: '기지국의 UTC 시간/날짜 정보 조회',
    fullDesc: '선박이 기지국의 UTC 날짜 및 시간을 조회할 때 사용합니다. UTC 동기화는 SOTDMA 타임 슬롯의 정확한 동작에 필수적입니다.',
    raw: '!AIVDM,1,1,,A,:5MlU41GMK6F,0*70',
    fields: [
      { name: '발신 MMSI', value: '366999712' },
      { name: '수신 MMSI (기지국)', value: '003669702' },
    ]
  },
  {
    type: 11, name: 'UTC/날짜 응답', category: '인프라', color: '#a78bfa', modelHint: 'station',
    shortDesc: 'Type 10 조회에 대한 기지국의 UTC 시간 응답',
    fullDesc: 'Type 10 UTC 조회에 응답하여 기지국이 전송하는 현재 UTC 날짜 및 시간 메시지입니다. Type 4와 동일한 패킷 구조를 공유합니다.',
    raw: '!AIVDM,1,1,,B,;3aG`X1h@0i1:VDdT:000000000,0*1A',
    fields: [
      { name: 'MMSI (기지국)', value: '003669702' },
      { name: 'UTC 날짜/시간', value: '2024-11-15 08:00:00' },
      { name: '위치정확도', value: '1 (DGPS)' },
    ]
  },
  {
    type: 12, name: '주소 안전 통신문', category: '안전', color: '#fbbf24', modelHint: 'ship',
    shortDesc: '특정 선박에게 전달하는 안전 관련 텍스트 메시지',
    fullDesc: '안전과 관련된 짧은 문자 메시지를 특정 선박(MMSI 지정)에게 전달합니다. VHF 채널 70 디지털 선택 호출(DSC)의 AIS 버전에 해당합니다.',
    raw: '!AIVDM,1,1,,A,<42Lati0W:Ov=C7P6B?=Pjoihhjhqq0,2*16',
    fields: [
      { name: '발신 MMSI', value: '351359000' },
      { name: '수신 MMSI', value: '366000001' },
      { name: '메시지 내용', value: 'ALERT: ICEBERG 35N 130E DANGEROUS' },
    ]
  },
  {
    type: 13, name: '안전 수신 확인', category: '안전', color: '#fbbf24', modelHint: 'ship',
    shortDesc: 'Type 12 안전 통신문의 수신 확인(ACK) 응답',
    fullDesc: 'Type 12 주소 안전 통신문을 수신했음을 발신자에게 알리는 확인 응답입니다. Type 7(이진 수신 확인)과 동일한 패킷 구조를 사용합니다.',
    raw: '!AIVDM,1,1,,A,=02R5`hwCjq8,0*4B',
    fields: [
      { name: '발신 MMSI', value: '366000001' },
      { name: '수신 확인 MMSI', value: '351359000' },
    ]
  },
  {
    type: 14, name: '안전 방송 통신문', category: '안전', color: '#fbbf24', modelHint: 'station',
    shortDesc: '모든 선박에 방송되는 안전 관련 텍스트 메시지 (Mayday 등)',
    fullDesc: '조난, 해상 위험, 항행 경보 등 긴급 안전 정보를 불특정 모든 선박에게 문자 형태로 방송합니다. MAYDAY 신호나 좌초 경고 등에 활용됩니다.',
    raw: '!AIVDM,1,1,,A,>5?Per18=HB1U:1@E=B0m<L,2*51',
    fields: [
      { name: '발신 MMSI', value: '123456789' },
      { name: '텍스트 메시지', value: 'MAYDAY VESSEL SINKING 35N 130E REQUEST ASSISTANCE' },
    ]
  },
  {
    type: 15, name: '조회 요청', category: '인프라', color: '#a78bfa', modelHint: 'station',
    shortDesc: '특정 선박에게 특정 타입의 메시지 전송을 요청',
    fullDesc: '기지국이나 특정 선박이 대상 선박(MMSI)에게 원하는 타입의 AIS 메시지를 전송하도록 요청합니다. 예를 들어, Type 5 정적 정보를 즉시 보내달라고 요청할 수 있습니다.',
    raw: '!AIVDM,1,1,,A,?5OP=l01I`k;8888880000,2*4A',
    fields: [
      { name: '발신 MMSI', value: '003669702' },
      { name: '대상 MMSI 1', value: '366000001' },
      { name: '요청 메시지 타입', value: 'Type 5 (정적 정보)' },
    ]
  },
  {
    type: 16, name: '할당 명령', category: '인프라', color: '#a78bfa', modelHint: 'station',
    shortDesc: '기지국이 선박에게 특정 타임 슬롯 및 채널을 할당',
    fullDesc: '기지국이 관할 구역의 선박들에게 특정 타임 슬롯과 채널을 지정 할당하는 명령 메시지입니다. 이를 통해 혼잡한 해역의 트래픽을 효율적으로 관리합니다.',
    raw: '!AIVDM,1,1,,A,@01uEO000000000000000,4*37',
    fields: [
      { name: '발신 MMSI (기지국)', value: '003669702' },
      { name: '대상 MMSI', value: '366000001' },
      { name: '예약 슬롯 번호', value: '2250' },
      { name: '송신 주기 증분', value: '0' },
    ]
  },
  {
    type: 17, name: 'DGNSS 방송 이진 메시지', category: '인프라', color: '#a78bfa', modelHint: 'station',
    shortDesc: '기지국의 DGNSS 보정 데이터 방송',
    fullDesc: '기지국이 위성 항법 시스템(GPS/GNSS)의 오차를 보정하기 위한 DGNSS(차등 위성항법) 보정 데이터를 방송합니다. 선박의 위치 정확도를 대폭 향상시킵니다.',
    raw: '!AIVDM,1,1,,A,A02VqLPA4I=:000000,0*2D',
    fields: [
      { name: '발신 MMSI (기지국)', value: '003669702' },
      { name: 'DGNSS 타입', value: 'RTCM SC-104' },
      { name: '보정 기준국 ID', value: '001' },
    ]
  },
  {
    type: 18, name: 'Class B 위치 보고 (기본)', category: 'Class B', color: '#94a3b8', modelHint: 'ship',
    shortDesc: 'Class B 선박(소형 선박)의 기본 위치 보고',
    fullDesc: '어선, 요트, 레저보트 등 Class B 장치를 장착한 소형 선박이 전송하는 위치 보고입니다. Class A보다 출력이 낮고(2W) 송신 주기가 길며(30초~3분), 포함 정보가 더 간소합니다.',
    raw: '!AIVDM,1,1,,B,B52IRs0004f4c;0000000000000,0*18',
    fields: [
      { name: 'MMSI', value: '338234631' },
      { name: '속력 (SOG)', value: '3.5 knots' },
      { name: '경도 (LON)', value: '128.4500°' },
      { name: '위도 (LAT)', value: '34.7500°' },
      { name: '진침로 (COG)', value: '045.0°' },
    ]
  },
  {
    type: 19, name: 'Class B 위치 보고 (확장)', category: 'Class B', color: '#94a3b8', modelHint: 'ship',
    shortDesc: 'Class B 선박의 확장 위치 보고 (선박명, 선종 포함)',
    fullDesc: 'Type 18에 선박명, 선종 코드, 선박 크기 등의 정보를 추가한 확장 버전입니다. 수색구조 활동이나 특정 상황에서 더 상세한 식별 정보를 제공할 필요가 있을 때 사용됩니다.',
    raw: '!AIVDM,1,1,,B,C5N3SRgPEnJGEBT>NhWAwwo862PaLELTBJ:V00000000S0D:R220220000000,0*0B',
    fields: [
      { name: 'MMSI', value: '338234632' },
      { name: '선박명', value: 'FAST FISHER' },
      { name: '선종 코드', value: '30 (어선)' },
      { name: '속력 (SOG)', value: '5.1 knots' },
      { name: '선박 길이', value: '22m' },
    ]
  },
  {
    type: 20, name: '데이터 링크 관리', category: '인프라', color: '#a78bfa', modelHint: 'station',
    shortDesc: '기지국이 향후 사용할 타임 슬롯을 예약·공지',
    fullDesc: '기지국이 다음 프레임에서 사용할 예정인 타임 슬롯 번호를 미리 공지하는 메시지입니다. 다른 선박들은 이 정보를 보고 해당 슬롯을 비워두어 충돌을 방지합니다.',
    raw: '!AIVDM,1,1,,A,D03SaF9m2N>000000,4*70',
    fields: [
      { name: '발신 MMSI (기지국)', value: '003669702' },
      { name: '예약 슬롯 1', value: '1200' },
      { name: '예약 슬롯 2', value: '2250' },
    ]
  },
  {
    type: 21, name: '항로표지 보고 (AtoN)', category: 'AtoN', color: '#fb923c', modelHint: 'buoy',
    shortDesc: '등대, 부표 등 항로표지 장치의 위치 보고',
    fullDesc: '등대, 부표, 항로표지 등 AtoN(Aids to Navigation) 장치의 위치와 상태를 보고합니다. 부표가 본래 위치에서 벗어났을 경우(Off-position) 경고 플래그를 설정하여 항해 위험을 알립니다.',
    raw: '!AIVDM,1,1,,B,ENk`sR9`92ah97PR9h0W1P=WWP00000000000,4*6C',
    fields: [
      { name: 'MMSI (AtoN)', value: '993692028' },
      { name: '표지 명칭', value: 'BUSAN LT BUOY 5' },
      { name: '표지 타입', value: '1 (기준점 부표)' },
      { name: '경도 (LON)', value: '129.0850°' },
      { name: '위도 (LAT)', value: '35.0800°' },
      { name: 'Off-position 경고', value: 'Off (정위치)' },
    ]
  },
  {
    type: 22, name: '채널 관리', category: '인프라', color: '#a78bfa', modelHint: 'station',
    shortDesc: '특정 해역에서 사용할 VHF 채널 지정 명령',
    fullDesc: '기지국이 특정 지역의 선박들에게 AIS 통신에 사용할 VHF 채널(CH 87B 또는 88B)을 지정하거나 변경하는 명령 메시지입니다. 혼잡 해역의 주파수 관리에 사용됩니다.',
    raw: `!AIVDM,1,1,,A,F02'RJTjh08H1GEP0H0,4*29`,
    fields: [
      { name: '발신 MMSI (기지국)', value: '003669702' },
      { name: '채널 A 번호', value: '2087 (87B)' },
      { name: '채널 B 번호', value: '2088 (88B)' },
      { name: '대역 모드', value: 'Narrow Band' },
    ]
  },
  {
    type: 23, name: '그룹 할당 명령', category: '인프라', color: '#a78bfa', modelHint: 'station',
    shortDesc: '특정 구역 내 모든 선박에게 보고 설정 변경 명령',
    fullDesc: '기지국이 특정 지리적 구역 내에 있는 모든 선박에게 보고 주기, 보고 타입 등의 AIS 설정 변경을 일괄 명령합니다. 항만 입구나 혼잡 해협에서 트래픽 관리에 활용됩니다.',
    raw: '!AIVDM,1,1,,A,G02R5`hwCjq80000000000,4*4C',
    fields: [
      { name: '발신 MMSI (기지국)', value: '003669702' },
      { name: '적용 대상 선종', value: '모든 선박' },
      { name: '변경 보고 타입', value: 'Type 18' },
      { name: '변경 보고 주기', value: '10초' },
    ]
  },
  {
    type: 24, name: 'Class B 정적 데이터', category: 'Class B', color: '#94a3b8', modelHint: 'ship',
    shortDesc: 'Class B 선박의 선박명 및 선박 제원 정보 (2 파트)',
    fullDesc: 'Class B 선박이 6분마다 전송하는 정적 데이터입니다. Part A에서 선박명을, Part B에서 선종, 콜사인, MMSI를 전달합니다. Type 5의 Class B 버전에 해당합니다.',
    raw: 'Part A: !AIVDM,1,1,,B,H52IRs0UjG<hHoRe`1ab`4l6223220,0*60\nPart B: !AIVDM,1,1,,B,H52IRs4VPH4<tSF0l4Q@Th`Rh0220,0*3F',
    fields: [
      { name: 'MMSI', value: '338234631' },
      { name: '선박명 (Part A)', value: 'LUCKY STAR' },
      { name: '선종 (Part B)', value: '30 (어선)' },
      { name: '콜사인 (Part B)', value: 'HLKA7' },
      { name: '길이/폭 (Part B)', value: '15m / 5m' },
    ]
  },
  {
    type: 25, name: '단문 이진 방송', category: '이진 메시지', color: '#f97316', modelHint: 'ship',
    shortDesc: '주소 없이 방송되는 아주 짧은 이진 메시지',
    fullDesc: 'Type 8보다 더 짧은 형식의 이진 방송 메시지입니다. 매우 간결한 정보를 빠르게 방송해야 할 때 사용하며, 수신처를 지정하지 않고 모든 선박에게 전달됩니다.',
    raw: '!AIVDM,1,1,,A,I6SWo?8P00a3PKpEKEVj0000000,0*73',
    fields: [
      { name: '발신 MMSI', value: '366999712' },
      { name: 'Application ID', value: 'DAC: 1, FI: 56' },
      { name: '이진 데이터 길이', value: '128 bit' },
    ]
  },
  {
    type: 26, name: '장문 이진 방송 (슬롯 예약)', category: '이진 메시지', color: '#f97316', modelHint: 'ship',
    shortDesc: '슬롯 예약 방식으로 전송되는 더 긴 이진 방송 메시지',
    fullDesc: 'Type 8의 긴 버전으로, 더 많은 데이터를 담을 수 있고 SOTDMA 방식으로 슬롯을 예약하여 안정적으로 전송합니다. 해양 환경 모니터링 데이터 등 대용량 정보 전송에 활용됩니다.',
    raw: '!AIVDM,1,1,,A,J0@00@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@,4*4A',
    fields: [
      { name: '발신 MMSI', value: '003669702' },
      { name: 'Application ID', value: 'DAC: 366, FI: 60' },
      { name: '이진 데이터 길이', value: '최대 1004 bit' },
    ]
  },
  {
    type: 27, name: '장거리 위치 보고', category: 'S-AIS', color: '#facc15', modelHint: 'ship',
    shortDesc: '위성 AIS(S-AIS)용 초소형 위치 보고 패킷',
    fullDesc: '위성 AIS 수신에 최적화된 매우 짧은(96bit) 위치 보고 메시지입니다. 먼 바다의 선박이 전송하며, 위치 정확도는 다소 낮지만(0.1도) 위성을 통해 전 세계에서 수신이 가능합니다.',
    raw: '!AIVDM,1,1,,A,KC5E2b@U19PFdLbMuc5=ROv62<7m,0*16',
    fields: [
      { name: 'MMSI', value: '338234631' },
      { name: '항해상태', value: '0 (항해 중)' },
      { name: '경도 (LON)', value: '130.2° (위성 수신, 저정확도)' },
      { name: '위도 (LAT)', value: '38.5° (위성 수신, 저정확도)' },
      { name: '속력 (SOG)', value: '12 knots' },
      { name: '진침로 (COG)', value: '185°' },
    ]
  },
];
