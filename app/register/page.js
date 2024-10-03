'use client'
import { useState } from 'react';

export default function Register() {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, id, password, role }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message); // 가입 성공 시 메시지 표시
        window.location.href = '/api/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2F'; // 로그인 페이지로 리다이렉트
      } else {
        alert(result.message); // 에러 메시지 표시
      }
    } catch (error) {
      alert('회원가입 완료되었습니다.');
      window.location.href = '/api/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2F';
    }
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f0f0',
    },
    form: {
      backgroundColor: '#fff',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      width: '300px',
    },
    title: {
      fontSize: '24px',
      marginBottom: '1rem',
      textAlign: 'center',
    },
    input: {
      width: '100%',
      padding: '0.8rem',
      marginBottom: '1rem',
      borderRadius: '4px',
      border: '1px solid #ddd',
      fontSize: '16px',
    },
    button: {
      width: '100%',
      padding: '0.8rem',
      backgroundColor: '#4CAF50',
      color: '#fff',
      borderRadius: '4px',
      border: 'none',
      fontSize: '16px',
      cursor: 'pointer',
    },
    select: {
      padding: '0.8rem',
      margin: '10px 0',
      width: '100%',
      borderRadius: '4px',
      border: '1px solid #ddd',
      fontSize: '16px',
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>회원가입</h2>
        <input 
          name="name" 
          type="text" 
          placeholder="이름" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
          style={styles.input}
        />
        <input 
          name="id" 
          type="text" 
          placeholder="아이디" 
          value={id} 
          onChange={(e) => setId(e.target.value)} 
          required 
          style={styles.input}
        />
        <input 
          name="password" 
          type="password" 
          placeholder="비밀번호" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={styles.input}
        />

        {/* 역할 선택 드롭다운 */}
        <select 
          name="role" 
          value={role} 
          onChange={(e) => setRole(e.target.value)} 
          required
          style={styles.select}
        >
          <option value="" disabled>역할 선택</option>
          <option value="0">전도인</option>
          <option value="1">인도자</option>
          <option value="3">관리자</option>
          <option value="moderator">모더레이터</option>
        </select>

        <button type="submit" style={styles.button}>가입 요청</button>
      </form>
    </div>
  );
}