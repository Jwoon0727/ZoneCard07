// pages/api/auth/forgot-password.js


import { sendPasswordResetEmail } from '@/lib/your-email-service';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;

    // 이메일 검증 및 처리 로직 추가
   // pages/api/auth/forgot-password.js
try {
    await sendPasswordResetEmail(email); // 비밀번호 재설정 링크 전송
    return res.status(200).json({ message: '비밀번호 재설정 링크가 이메일로 전송되었습니다.' });
  } catch (error) {
    console.error('비밀번호 재설정 오류:', error); // 에러 로그 추가
    return res.status(500).json({ message: '비밀번호 재설정 요청 처리 중 오류가 발생했습니다.', error: error.message });
  }
  } else {
    return res.status(405).json({ message: 'Method not allowed.' });
  }
}