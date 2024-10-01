// // pages/api/sendPasswordResetEmail.js
// import { sendPasswordResetEmail } from 'your-email-service.js'; // 경로에 맞게 수정

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { email } = req.body; // 사용자가 입력한 이메일 주소
//     const resetLink = `https://yourdomain.com/reset-password?email=${encodeURIComponent(email)}`; // 비밀번호 재설정 링크

//     try {
//       await sendPasswordResetEmail(email, resetLink); // 이메일 전송
//       res.status(200).json({ message: '비밀번호 재설정 이메일이 전송되었습니다.' });
//     } catch (error) {
//       res.status(500).json({ error: '이메일 전송에 실패했습니다.' });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }