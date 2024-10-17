"use client";

import { useEffect, useRef, useState } from 'react';

const KakaoMap = ({ enableDrawingTools = false, enableInfoWindow = true, initializeMap = true, zoneNumber }) => {  
  const mapRef = useRef(null);  // 지도 객체 참조
  const managerRef = useRef(null);  // Drawing Manager 참조
  const markerRef = useRef(null);  // 마커 객체 참조
  const infowindowRef = useRef(null);  // 정보창 객체 참조

  const polygonRefs = useRef([]);  // 폴리곤들을 저장하는 배열
  const [clickedCoords, setClickedCoords] = useState([]);  // 클릭한 좌표를 저장할 상태
  const [polygonCreated, setPolygonCreated] = useState(false); // 폴리곤 생성 여부

  useEffect(() => {
    const createMap = async () => {
      if (window.kakao && window.kakao.maps) {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(36.8396345, 127.1426990), // 초기 중심 좌표
          level: 3,
        };
        
        // 지도 객체 초기화
        if (initializeMap && !mapRef.current) {
          mapRef.current = new window.kakao.maps.Map(container, options);
          console.log("Map initialized:", mapRef.current);  // 지도 초기화 로그
        }

        if (zoneNumber) {
          try {
            const response = await fetch(`/api/get-polygon-coordinates?zoneNumber=${zoneNumber}`);
            const data = await response.json();
        
            // 여러 개의 폴리곤 데이터를 가져온 경우 처리
            if (data && data.length > 0) {
              data.forEach(polygonData => {
                const polygonPath = polygonData.coordinates.map(coord => 
                  new window.kakao.maps.LatLng(coord.lat, coord.lng)
                );
        
                // 각각의 폴리곤 그리기
                const polygon = new window.kakao.maps.Polygon({
                  path: polygonPath,
                  strokeWeight: 3,
                  strokeColor: '#39f',
                  strokeOpacity: 0.8,
                  fillColor: '#cce6ff',
                  fillOpacity: 0.7,
                });
        
               // 폴리곤 지도에 표시
               polygon.setMap(mapRef.current)
        
              polygonPath.forEach(coord => {
                  console.log("Lat:", coord.getLat(), "Lng:", coord.getLng());
              });
               // 폴리곤 배열에 저장
               polygonRefs.current.push({ polygon, _id: polygonData._id });
        
               // 폴리곤 클릭 시 해당 폴리곤 삭제 이벤트 추가
               window.kakao.maps.event.addListener(polygon, 'click', () => {
                 if (window.confirm("폴리곤을 삭제하시겠습니까?")) {
                   removePolygon(polygonData._id, polygon);
                 }
               });
              });
              
              setPolygonCreated(true);  // 폴리곤 생성 상태를 true로 설정
            } else {
              console.log(`No polygon data found for zoneNumber: ${zoneNumber}`);
            }
          } catch (error) {
            console.error('Error fetching polygon data:', error);
          }
         
        }
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
              removable: true,
            },
            polygonOptions: {
              draggable: true,
              removable: true,
              editable: true,
              strokeColor: '#39f',
              fillColor: '#cce6ff',
              fillOpacity: 0.7,
            },
          };

          // Drawing Manager 생성
          managerRef.current = new window.kakao.maps.Drawing.DrawingManager(drawingOptions);

          // Toolbox 생성 (Drawing 도구)
          const toolbox = new window.kakao.maps.Drawing.Toolbox({ drawingManager: managerRef.current });
          
          // Toolbox 지도에 추가
          mapRef.current.addControl(toolbox.getElement(), window.kakao.maps.ControlPosition.TOPRIGHT);

          // Drawing 완료 후 발생하는 이벤트 리스너 추가

          window.kakao.maps.event.addListener(managerRef.current, 'drawend', (data) => {
            if (data.overlayType === window.kakao.maps.Drawing.OverlayType.POLYGON) {
              setPolygonCreated(true);  // 폴리곤이 그려졌음을 상태로 저장
            }
          })
        }

        // 마커 및 정보창 객체 생성
        markerRef.current = new window.kakao.maps.Marker(); // 마커 생성
        infowindowRef.current = new window.kakao.maps.InfoWindow({ zIndex: 1 }); // 정보창 생성

        // 지도 클릭 이벤트 추가
        window.kakao.maps.event.addListener(mapRef.current, 'click', function (mouseEvent) {
          if (enableInfoWindow) {
            const latLng = mouseEvent.latLng;
            searchDetailAddrFromCoords(latLng, function (result, status) {
              if (status === window.kakao.maps.services.Status.OK) {
                const detailAddr = !!result[0].road_address
                  ? '<div>도로명주소: ' + result[0].road_address.address_name + '</div>'
                  : '';
                const content = `
                  <div class="bAddr">
                    <span class="title"><a href="/addressInfor?jibun=${result[0].address.address_name}">주소정보</a></span>
                    ${detailAddr}
                    <div>지번 주소: ${result[0].address.address_name}</div>
                    <button class="close-btn" id="close-btn">닫기</button>
                  </div>
                `;
        
                // 마커 위치 설정
                markerRef.current.setPosition(latLng);
                markerRef.current.setMap(mapRef.current);
        
                // 정보창에 내용을 설정하고 지도에 표시
                infowindowRef.current.setContent(content);
                infowindowRef.current.open(mapRef.current, markerRef.current);
        
                // 닫기 버튼 이벤트 추가
                addCloseButtonListener();
              }
            });
          }
        
          // 추가된 부분: 클릭한 위치의 경도와 위도 정보를 가져옴
          const latLng = mouseEvent.latLng;  
          const lat = latLng.getLat();
          const lng = latLng.getLng();
        
          // 좌표를 상태에 추가
          setClickedCoords(prevCoords => [...prevCoords, { lat, lng }]);
      
        });
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
  
  }, [initializeMap, enableDrawingTools, enableInfoWindow, zoneNumber]);

  const searchDetailAddrFromCoords = (coords, callback) => {
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
  };

  
  const addCloseButtonListener = () => {
    const closeButton = document.getElementById('close-btn');
    if (closeButton) {
      closeButton.onclick = () => {
        infowindowRef.current.close();  // 정보창 닫기
        markerRef.current.setMap(null);  // 마커 숨기기
      };
    }
  };

  const selectOverlay = (type) => {
    if (managerRef.current) {
      managerRef.current.cancel(); // 현재 그리기 중이면 취소
      managerRef.current.select(window.kakao.maps.Drawing.OverlayType[type]); // 선택한 도형 타입으로 그리기 시작
    }
  };

  // 좌표 저장 함수
  const saveCoords = async () => {
    try {
      const response = await fetch('/api/save-coordinates', {  // API 경로
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zoneNumber,  // zoneNumber를 함께 전송
          coordinates: clickedCoords,  // 좌표 리스트 전송
        }),
      });
  
      if (response.ok) {
        alert('좌표가 성공적으로 저장되었습니다.');
        setPolygonCreated(false);  // 저장 후 저장하기 버튼 숨기기
      } else {
        alert('좌표 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('저장 중 오류 발생:', error);
      alert('좌표 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ width: '100%', height: '50vh', position: 'relative' }}>
      <div id="map" style={{ width: '100%', height: '100%', backgroundColor: 'lightgray' }}></div>
      <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 2 }}>
        <button onClick={() => selectOverlay('MARKER')}>Marker</button>
        <button onClick={() => selectOverlay('POLYGON')}>Polygon</button>
        {polygonCreated && (
          <button 
            onClick={saveCoords} 
            style={{ position: 'absolute', bottom: '10px', right: '10px', zIndex: 2, padding: '10px', backgroundColor: '#39f', color: '#fff' }}>
            좌표 저장하기
          </button>
        )}
      </div>
    </div>
  );
};

export default KakaoMap;