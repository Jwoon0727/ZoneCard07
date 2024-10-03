// components/Loading.js
'use client';
import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

export default function Loading() {
  const styles = {
    container: {
      textAlign: 'center',
      marginTop: '2rem',
    },
  };

  return (
    <div style={styles.container}>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <p>데이터를 불러오는 중...</p>
    </div>
  );
}