// pages/auth/signin.js

'use client'
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignIn() {
  const [credentials, setCredentials] = useState({ id: "", password: "" });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const res = await signIn("credentials", {
      id: credentials.id,
      password: credentials.password,
      callbackUrl: "/", // 로그인 성공 시 이동할 페이지
      redirect: false,  // 자동 리다이렉트를 방지합니다.
    });

    if (res?.error) {
      alert('로그인에 실패했습니다. 아이디나 비밀번호를 확인해주세요.');
    } else {
      window.location.href = res.url;  // 성공 시 해당 페이지로 이동
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      alert(result.message);
      setShowForgotPassword(false);
      setEmail("");
    } catch (error) {
      alert('비밀번호 찾기 요청에 실패했습니다. 다시 시도해 주세요.');
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
          <a href="#" onClick={() => setShowForgotPassword(true)}>비밀번호 찾기</a>
        </div>

        {showForgotPassword && (
          <div style={styles.forgotPasswordContainer}>
            <h3 style={styles.forgotPasswordTitle}>비밀번호 찾기</h3>
            <input
              style={styles.input}
              type="email"
              placeholder="이메일 입력"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button onClick={handleForgotPassword} style={styles.button}>비밀번호 재설정 링크 보내기</button>
            <button onClick={() => setShowForgotPassword(false)} style={styles.button}>취소</button>
          </div>
        )}
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
    backgroundColor: '#0070f3',
    color: '#fff',
    borderRadius: '4px',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
  },
  forgotPasswordContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '20px',
    padding: '1rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
  },
  forgotPasswordTitle: {
    fontSize: '18px',
    marginBottom: '1rem',
    textAlign: 'center',
  },
};