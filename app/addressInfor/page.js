"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const AddressInfor = () => {
  const searchParams = useSearchParams();
  const jibun = searchParams.get('jibun');
  const router = useRouter();
  const [addressData, setAddressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusData, setStatusData] = useState({}); // 각 세부정보의 상태를 저장하는 객체

  useEffect(() => {
    const fetchAddress = async () => {
      if (jibun) {
        try {
          const response = await fetch(`/api/getAddress?jibun=${jibun}`);
          if (response.ok) {
            const data = await response.json();
            setAddressData(data); // 가져온 데이터를 상태에 저장
          } else {
            setAddressData([]); // 주소 정보가 없을 때
          }
        } catch (error) {
          console.error('Error fetching address:', error);
        }
        setLoading(false); // 로딩 상태 해제
      }
    };

    fetchAddress();
  }, [jibun]);

  const handleStatusChange = (index, status) => {
    setStatusData((prev) => ({
      ...prev,
      [index]: status, // 해당 index에 대한 상태 저장
    }));
  };

  const completeZone = async () => {
    const completionDate = new Date().toISOString(); // 현재 날짜를 ISO 형식으로 저장

    try {
      const response = await fetch('/api/completeZone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jibun, completionDate }), // 지번과 날짜를 전송
      });

      if (response.ok) {
        alert('구역이 완료되었습니다.');
      } else {
        alert('구역 완료 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error completing zone:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (addressData.length === 0) {
    return <div>주소 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div>
      <h1>주소 정보</h1>
      <p>지번 주소: {jibun}</p>
      <p>구역 번호: {addressData[0].구역번호}</p> {/* 구역번호 출력 */}
      
      {/* 여러 세부 정보를 반복문으로 출력 */}
      <div>
        <h2>세부 정보:</h2>
        <ul>
          {addressData.map((item, index) => (
            <li key={index}>
              {item.세부정보} {/* 세부정보 출력 */}
              {/* 상태 변경을 위한 드롭다운 */}
              <select
                value={statusData[index] || ''}
                onChange={(e) => handleStatusChange(index, e.target.value)}
              >
                <option value="">상태 선택</option>
                <option value="방문">방문</option>
                <option value="만나지 못함">만나지 못함</option>
                <option value="방문금지">방문금지</option>
                <option value="나의 재방">나의 재방</option>
              </select>
              {/* 선택한 상태 표시 */}
              <p>선택한 상태: {statusData[index]}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* 구역 완료 버튼 추가 */}
      <button onClick={completeZone}>구역 완료</button>

      <button onClick={() => router.back()}>이전</button>
    </div>
  );
};

export default AddressInfor;