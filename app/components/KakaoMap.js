"use client";

import { useEffect, useRef } from 'react';

const KakaoMap = ({ enableDrawingTools = false, initializeMap = true }) => {  
  const mapRef = useRef(null);  // 지도 객체 참조
  const managerRef = useRef(null);  // Drawing Manager 참조

  useEffect(() => {
    const createMap = () => {
      if (window.kakao && window.kakao.maps) {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(36.8396345, 127.1426990), // 초기 중심 좌표
          level: 3,
        };
        

        // Drawing Manager 설정
        if (enableDrawingTools) {  
          const drawingOptions = {
            map: mapRef.current,
            drawingMode: [
              window.kakao.maps.Drawing.OverlayType.MARKER,
           
              window.kakao.maps.Drawing.OverlayType.POLYGON
            ],
            markerOptions: {
              draggable: true,
              removable: true
            },
         
            polygonOptions: {
              draggable: true,
              removable: true,
              editable: true,
              strokeColor: '#39f',
              fillColor: '#cce6ff',
              fillOpacity: 0.7
            }
          };

          // Drawing Manager 생성
          managerRef.current = new window.kakao.maps.Drawing.DrawingManager(drawingOptions);

     
        }
      }
    };

    // Kakao Maps API 로드 후 지도 생성
    const existingScript = document.querySelector(`script[src="//dapi.kakao.com/v2/maps/sdk.js?appkey=06f41dcc4cfb97542d10711c83d8457d&autoload=false&libraries=drawing,services"]`);
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=06f41dcc4cfb97542d10711c83d8457d&autoload=false&libraries=drawing,services`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.kakao.maps.load(() => {
          createMap();
        });
      };

      return () => {
        document.head.removeChild(script);
      };
    } else {
      window.kakao.maps.load(() => {
        createMap();
      });
    }
  
  }, [initializeMap, enableDrawingTools]);

  const selectOverlay = (type) => {
    if (managerRef.current) {
      managerRef.current.cancel(); // 현재 그리기 중이면 취소
      managerRef.current.select(window.kakao.maps.Drawing.OverlayType[type]); // 선택한 도형 타입으로 그리기 시작
    }
  };

  const undo = () => {
    if (managerRef.current) {
      managerRef.current.undo(); // 그리기 요소를 이전 상태로 되돌리기
    }
  };

  const redo = () => {
    if (managerRef.current) {
      managerRef.current.redo(); // redo 기능
    }
  };

  return (
    <div style={{ width: '100%', height: '50vh', position: 'relative' }}>
      <div id="map" style={{ width: '100%', height: '100%', backgroundColor: 'lightgray' }}></div>
      <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 2 }}>
        <button onClick={() => selectOverlay('MARKER')}>Marker</button>
        <button onClick={() => selectOverlay('POLYGON')}>Polygon</button>
      </div>
    </div>
  );
};

export default KakaoMap;