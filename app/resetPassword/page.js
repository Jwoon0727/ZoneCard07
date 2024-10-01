// app/resetPassword/page.js

'use client'; // use client 추가

import ResetPasswordForm from '../components/ResetPasswordForm';
const ResetPasswordPage = () => {
  return (
    <div>
      <h1>비밀번호 재설정</h1>
      <ResetPasswordForm />
    </div>
    
  );
};

export default ResetPasswordPage;