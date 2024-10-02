"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const AddressInfor = () => {
  const searchParams = useSearchParams();
  const jibun = searchParams.get('jibun');
  const router = useRouter();
  const [addressData, setAddressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusData, setStatusData] = useState({});
  const [completionDates, setCompletionDates] = useState({}); // 구역 완료 날짜 상태 추가

  useEffect(() => {
    const fetchAddress = async () => {
      if (jibun) {
        try {
          const response = await fetch(`/api/getAddress?jibun=${jibun}`);
          if (response.ok) {
            const data = await response.json();
            setAddressData(data);
          } else {
            setAddressData([]);
          }
        } catch (error) {
          console.error('Error fetching address:', error);
        }
        setLoading(false);
      }
    };

    fetchAddress();
  }, [jibun]);

  const handleStatusChange = (index, status) => {
    setStatusData((prev) => ({
      ...prev,
      [index]: status,
    }));
  };

  const completeZone = async () => {
    const completionDate = new Date().toISOString(); 
  
    if (addressData.length > 0) {
      const zoneNumber = addressData[0].구역번호; // 구역번호 가져오기
  
      try {
        const response = await fetch('/api/complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ jibun, completionDate, zoneNumber }), // 지번과 구역번호를 body에 포함
        });
  
        if (response.ok) {
          // 구역 번호를 가져와서 완료 날짜를 상태에 저장
          setCompletionDates((prev) => ({
            ...prev,
            [zoneNumber]: completionDate, // 구역 번호를 키로 사용하여 날짜 저장
          }));
          alert('구역 완료!');
          router.push('/map');
        } else {
          alert('구역 완료 저장에 실패했습니다.');
        }
      } catch (error) {
        console.error('Error completing zone:', error);
      }
    } else {
      alert('구역 정보가 없습니다.');
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
      <p>구역 번호: {addressData[0].구역번호}</p>

      <div>
        <h2>세부 정보:</h2>
        <ul>
          {addressData.map((item, index) => (
            <li key={index}>
              {item.세부정보}
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
              <p>선택한 상태: {statusData[index]}</p>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={completeZone}>구역 완료</button>
      <button onClick={() => router.back()}>이전</button>
    </div>
  );
};

export default AddressInfor;