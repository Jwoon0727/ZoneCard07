// pages/auth/signin.js

'use client'
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignIn() {
  const [credentials, setCredentials] = useState({ id: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const res = await signIn("credentials", {
      id: credentials.id,
      password: credentials.password,
      callbackUrl: "/", // 로그인 성공 시 이동할 페이지
      redirect: false,  // 자동 리다이렉트를 방지합니다.
    });

    // res.ok가 false일 경우 로그인 실패로 간주하고 alert 창을 띄웁니다.
    if (res?.error) {
      alert('로그인에 실패했습니다. 아이디나 비밀번호를 확인해주세요.');
    } else {
      window.location.href = res.url;  // 성공 시 해당 페이지로 이동
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>로그인</h2>
        <input
          style={styles.input}
          type="text"
          placeholder="아이디"
          value={credentials.id}
          onChange={(e) => setCredentials({ ...credentials, id: e.target.value })}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="비밀번호"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        />
        <button type="submit" style={styles.button}>로그인</button> 
       
        <div style={{ marginTop: '10px' }}>
          <a href="/register" style={{ marginRight: '20px' }}>회원가입</a> 
          <a href="/">비밀번호 찾기</a>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0', // 배경색
  },
  form: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    width: '300px', // 폼 크기
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
    backgroundColor: '#0070f3', // 버튼 색상
    color: '#fff',
    borderRadius: '4px',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
  },
};