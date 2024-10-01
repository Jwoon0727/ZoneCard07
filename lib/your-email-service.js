// your-email-service.js
import nodemailer from 'nodemailer';

// iCloud SMTP 설정
const transporter = nodemailer.createTransport({
  host: 'smtp.mail.me.com', // iCloud SMTP 서버
  port: 587, // SMTP 포트 (TLS)
  secure: false, // true 사용 시 465 포트를 사용
  auth: {
    user: process.env.ICLOUD_EMAIL, // 환경 변수에서 iCloud 이메일 주소 가져오기
    pass: process.env.ICLOUD_APP_PASSWORD, // 환경 변수에서 비밀번호 가져오기
  },
});

export const sendPasswordResetEmail = async (email) => {
  const mailOptions = {
    from: `"Your Name" <${process.env.ICLOUD_EMAIL}>`, // 보내는 사람
    to: email, // 수신자
    subject: '비밀번호 재설정 링크', // 제목
    text: '여기에 비밀번호 재설정 링크를 추가하세요.', // 텍스트 내용
    // html: '<b>여기에 HTML 형식으로 작성된 내용을 추가하세요.</b>', // HTML 내용 (선택사항)
  };

  await transporter.sendMail(mailOptions);
};