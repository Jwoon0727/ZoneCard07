import ClientNavbar from './components/ClientNavbar'; // 클라이언트 컴포넌트 임포트
import dynamic from 'next/dynamic';

// KakaoMap을 동적으로 불러옵니다 (SSR 비활성화)

export default function Home() {
  return (
    <div>
      <ClientNavbar />
      {/* Kakao 지도 */}
      {/* <KakaoMap /> */}

    <h1>회중게시판</h1>
    </div>
  );
}