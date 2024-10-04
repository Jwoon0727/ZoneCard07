'use client';
import Image from 'next/image';
import { signIn, signOut } from 'next-auth/react'; // 로그인 및 로그아웃 함수 임포트

// 로그인 버튼
export default function LoginBtn() {
  return (
    <button 
      className="login-btn" 
      onClick={() => signIn()} 
      style={{
        backgroundColor: 'none0',  // 배경색
        color: '#333',  // 텍스트 색상
        padding: '10px 10px',  // 패딩
        borderRadius: '8px',  // 모서리 둥글게
        marginRight: '10px', 
        border: 'none',  // 테두리 없음
        cursor: 'pointer',  // 커서 포인터
        display: 'flex',  // 이미지와 텍스트 가로 정렬
        alignItems: 'center',  // 수직 가운데 정렬
        gap: '8px',  // 이미지와 텍스트 사이 간격
      }}
    >
      <img 
        src="/images/login.png"  // 이미지 경로 (public 폴더 안에)
        alt="로그인 아이콘" 
        style={{ width: '25px', height: '25px' }}  // 이미지 크기 조정
      />
     로그인
    </button>
  );
}

// 로그아웃 버튼
// 로그아웃 버튼
export function LogOutBtn() {
  return (
    <button 
      onClick={() => signOut()} 
      style={{
        backgroundColor: 'none', 
        color: '#fff', 
        padding: '10px 10px', 
        borderRadius: '8px', 
        border: 'none', 
        cursor: 'pointer', 
        marginLeft: '10px',
        marginRight: '10px',
        alignItems: 'center', 
        gap: '8px'
      }}
    >
      <Image 
        src="/images/logout.png" // public 폴더 기준 경로
        alt="로그아웃 아이콘" 
        width={25} 
        height={25}
      />
     
    </button>
  );
}