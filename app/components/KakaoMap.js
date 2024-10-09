
"use client";

import { useEffect, useRef, useState } from 'react';

const KakaoMap = ({ enableDrawingTools = false, enableInfoWindow = true }) => {  
  const mapRef = useRef(null);  // 지도 객체 참조
  const geocoderRef = useRef(null);  // 지오코더 객체 참조
  const markerRef = useRef(null);  // 마커 객체 참조
  const infowindowRef = useRef(null);  // 정보창 객체 참조
  const managerRef = useRef(null);  // Drawing Manager 참조
  const toolboxRef = useRef(null);  // Toolbox 참조
  const [clickedCoords, setClickedCoords] = useState([]); // 클릭한 좌표를 저장할 state

  useEffect(() => {
    const createMap = () => {
      if (window.kakao && window.kakao.maps) {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(36.8396345, 127.1426990), // 초기 중심 좌표
          level: 3,
        };

        if (!mapRef.current) {
          mapRef.current = new window.kakao.maps.Map(container, options);
          geocoderRef.current = new window.kakao.maps.services.Geocoder();
          markerRef.current = new window.kakao.maps.Marker();
          infowindowRef.current = new window.kakao.maps.InfoWindow({ zIndex: 1 });

          // Drawing Manager 설정
          if (enableDrawingTools) {  
            const drawingOptions = {
              map: mapRef.current,
              drawingMode: [
                window.kakao.maps.Drawing.OverlayType.POLYGON,
              ],
              polygonOptions: {
                draggable: true,
                removable: true,
                strokeColor: '#39f',
                fillColor: '#cce6ff',
                fillOpacity: 0.5,
              },
            };

            // DrawingManager 생성
            managerRef.current = new window.kakao.maps.Drawing.DrawingManager(drawingOptions);

            // Toolbox 생성
            toolboxRef.current = new window.kakao.maps.Drawing.Toolbox({ drawingManager: managerRef.current });
            mapRef.current.addControl(toolboxRef.current.getElement(), window.kakao.maps.ControlPosition.TOP);
          }

          // 세션 스토리지에서 마커 좌표와 infoWindow 정보를 가져옴
          const savedMarker = JSON.parse(sessionStorage.getItem('markerCoords'));
          const savedInfoContent = sessionStorage.getItem('infoContent');

          if (savedMarker) {
            const position = new window.kakao.maps.LatLng(savedMarker.lat, savedMarker.lng);
            markerRef.current.setPosition(position);
            markerRef.current.setMap(mapRef.current);

            if (savedInfoContent) {
              infowindowRef.current.setContent(savedInfoContent);
              infowindowRef.current.open(mapRef.current, markerRef.current);
              addCloseButtonListener();  // 정보창에 닫기 버튼 리스너 추가
            }
          }

          // 지도 클릭 이벤트 추가
          window.kakao.maps.event.addListener(mapRef.current, 'click', function (mouseEvent) {
            if (enableInfoWindow) {  
              searchDetailAddrFromCoords(mouseEvent.latLng, function (result, status) {
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

                  markerRef.current.setPosition(mouseEvent.latLng);
                  markerRef.current.setMap(mapRef.current);
                  infowindowRef.current.setContent(content);
                  infowindowRef.current.open(mapRef.current, markerRef.current);

                  // 마커 좌표와 infoWindow 내용을 세션 스토리지에 저장
                  sessionStorage.setItem('markerCoords', JSON.stringify({
                    lat: mouseEvent.latLng.getLat(),
                    lng: mouseEvent.latLng.getLng(),
                  }));
                  sessionStorage.setItem('infoContent', content);

                  addCloseButtonListener();  // 닫기 버튼에 이벤트 리스너 추가
                }
              });
            }

            // 클릭한 좌표를 state에 저장
            const latLng = mouseEvent.latLng;  // 클릭한 위치의 경도와 위도 정보를 가져옴
            const lat = latLng.getLat();
            const lng = latLng.getLng();

            // 좌표를 상태에 추가
            setClickedCoords(prevCoords => [...prevCoords, { lat, lng }]);
          });
        }
      }
    };

    // 카카오 지도 API 스크립트 동적으로 추가
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
  }, []);

  const searchAddrFromCoords = (coords, callback) => {
    geocoderRef.current.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
  };

  const searchDetailAddrFromCoords = (coords, callback) => {
    geocoderRef.current.coord2Address(coords.getLng(), coords.getLat(), callback);
  };

  const closeInfoWindow = () => {
    infowindowRef.current.close();
    markerRef.current.setMap(null);  // 마커 제거
    sessionStorage.removeItem('infoContent');  // 세션 스토리지에서 infoWindow 내용 제거
  };

  const addCloseButtonListener = () => {
    const closeButton = document.getElementById('close-btn');
    if (closeButton) {
      closeButton.onclick = closeInfoWindow;  // 버튼 클릭 시 closeInfoWindow 호출
    }
  };

  return (
    <div style={{ width: '100%', height: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
      <div id="map" style={{ width: '100%', height: '100%', backgroundColor: 'lightgray' }}></div>
      <div className="hAddr" style={{ position: 'absolute', left: '10px', top: '10px', borderRadius: '2px', background: 'rgba(255,255,255,0.8)', zIndex: 1, padding: '5px' }}>
        <span className="title">지도중심기준 행정동 주소정보</span>
        <span id="centerAddr"></span>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>클릭한 좌표 목록:</h3>
        <ul>
          {clickedCoords.map((coord, index) => (
            <li key={index}>
              경도: {coord.lng}, 위도: {coord.lat}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default KakaoMap;
