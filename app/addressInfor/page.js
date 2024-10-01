"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const AddressInfor = () => {
  const searchParams = useSearchParams();
  const jibun = searchParams.get('jibun');
  const router = useRouter();
  const [addressData, setAddressData] = useState([]);
  const [loading, setLoading] = useState(true);

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
            <li key={index}>{item.세부정보}</li> // 각 세부정보 출력
          ))}
        </ul>
      </div>

      <button onClick={() => router.back()}>이전</button>
    </div>
  );
};

export default AddressInfor;