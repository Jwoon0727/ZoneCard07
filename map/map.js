// "use client";

// import { useEffect, useRef } from 'react';

// const KakaoMap = () => {
//   const mapRef = useRef(null);
//   const geocoderRef = useRef(null);
//   const markerRef = useRef(null);
//   const infowindowRef = useRef(null);

//   useEffect(() => {
//     const createMap = () => {
//       if (window.kakao && window.kakao.maps) {
//         const container = document.getElementById('map');
//         const options = {
//           center: new window.kakao.maps.LatLng(36.8396345, 127.1426990), // 초기 중심 좌표
//           level: 3,
//         };

//         // 지도가 생성되지 않았다면 새로 생성
//         if (!mapRef.current) {
//           mapRef.current = new window.kakao.maps.Map(container, options);
          
//           if (window.kakao.maps.services) {
//             geocoderRef.current = new window.kakao.maps.services.Geocoder();
//             markerRef.current = new window.kakao.maps.Marker();
//             infowindowRef.current = new window.kakao.maps.InfoWindow({ zIndex: 1 });

//             window.kakao.maps.event.addListener(mapRef.current, 'click', function(mouseEvent) {
//               searchDetailAddrFromCoords(mouseEvent.latLng, function(result, status) {
//                 if (status === window.kakao.maps.services.Status.OK) {
//                   const detailAddr = !!result[0].road_address ? 
//                     '<div>도로명주소: ' + result[0].road_address.address_name + '</div>' : '';
//                   const content = `
//                     <div class="bAddr">
//                       <span class="title">법정동 주소정보</span>
//                       ${detailAddr}
//                       <div>지번 주소: ${result[0].address.address_name}</div>
//                       <button class="close-btn" id="close-btn">닫기</button>
//                     </div>
//                   `;

//                   markerRef.current.setPosition(mouseEvent.latLng);
//                   markerRef.current.setMap(mapRef.current);
//                   infowindowRef.current.setContent(content);
//                   infowindowRef.current.open(mapRef.current, markerRef.current);

//                   // 닫기 버튼에 클릭 이벤트 추가
//                   document.getElementById('close-btn').onclick = closeInfoWindow;
//                 } else {
//                   console.error('주소 정보를 찾을 수 없습니다.', status);
//                 }
//               });
//             });

//             window.kakao.maps.event.addListener(mapRef.current, 'idle', function() {
//               searchAddrFromCoords(mapRef.current.getCenter(), displayCenterInfo);
//             });
//           } else {
//             console.error('kakao.maps.services 객체를 불러오는 데 실패했습니다.');
//           }
//         }
//       } else {
//         console.error('kakao.maps 객체를 불러오는 데 실패했습니다.');
//       }
//     };

//     const script = document.createElement('script');
//     script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=06f41dcc4cfb97542d10711c83d8457d&autoload=false&libraries=services`;
//     script.async = true;
//     document.head.appendChild(script);

//     script.onload = () => {
//       window.kakao.maps.load(() => {
//         createMap();
//       });
//     };

//     return () => {
//       document.head.removeChild(script);
//     };
//   }, []);

//   const searchAddrFromCoords = (coords, callback) => {
//     if (geocoderRef.current) {
//       geocoderRef.current.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
//     }
//   };

//   const searchDetailAddrFromCoords = (coords, callback) => {
//     if (geocoderRef.current) {
//       geocoderRef.current.coord2Address(coords.getLng(), coords.getLat(), callback);
//     }
//   };

//   const displayCenterInfo = (result, status) => {
//     if (status === window.kakao.maps.services.Status.OK) {
//       const infoDiv = document.getElementById('centerAddr');

//       for (let i = 0; i < result.length; i++) {
//         if (result[i].region_type === 'H') {
//           infoDiv.innerHTML = result[i].address_name;
//           break;
//         }
//       }
//     } else {
//       console.error('중심 좌표에 대한 주소 정보를 찾을 수 없습니다.', status);
//     }
//   };

//   const closeInfoWindow = () => {
//     infowindowRef.current.close();
//     markerRef.current.setMap(null); // 마커도 제거
//   };

//   return (
//     <div style={{ width: '100%', height: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
//       <div id="map" style={{ width: '100%', height: '100%', backgroundColor: 'lightgray' }}></div>
//       <div className="hAddr" style={{ position: 'absolute', left: '10px', top: '10px', borderRadius: '2px', background: 'rgba(255,255,255,0.8)', zIndex: 1, padding: '5px' }}>
//         <span className="title">지도중심기준 행정동 주소정보</span>
//         <span id="centerAddr"></span>
//       </div>
//     </div>
//   );
// };

// export default KakaoMap;