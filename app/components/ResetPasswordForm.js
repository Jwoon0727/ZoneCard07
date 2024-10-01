'use client';
import { useState } from 'react';

const ResetPasswordForm = () => {
  const [id, setId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted ID:", id); // ID 확인
    console.log("New Password:", newPassword); // 비밀번호 확인
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/resetPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, newPassword }),
      });

      const data = await response.json();
      console.log("Response:", data); // 응답 확인

      if (response.ok) {
        setMessage(data.message);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <h2>비밀번호 변경</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="id">ID:</label>
          <input
            type="text"
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="newPassword">새 비밀번호:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">비밀번호 변경</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ResetPasswordForm;