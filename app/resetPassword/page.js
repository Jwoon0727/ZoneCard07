// app/resetPassword/page.js

'use client'; // use client 추가

import ResetPasswordForm from '../components/ResetPasswordForm';
const ResetPasswordPage = () => {
  return (
    <div>
      <h1>비밀번호 재설정</h1>
      <ResetPasswordForm />
      <a href="https://zone-card07.vercel.app/signin?callbackUrl=https%3A%2F%2Fzone-card07.vercel.app%2F">돌아가기</a>
    </div>
    
  );
};

export default ResetPasswordPage;