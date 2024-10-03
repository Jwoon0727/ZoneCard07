'use client'
import React from 'react';

export default function Loading() {
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh', // 화면의 전체 높이를 차지하도록 설정
    },
    spinner: {
      border: '16px solid #f3f3f3', // 스피너의 바깥쪽 링
      borderRadius: '50%',
      borderTop: '16px solid #3498db', // 회전하는 부분의 색상
      width: '120px',
      height: '120px',
      animation: 'spin 2s linear infinite', // 회전 애니메이션
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}