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
//   const resetLink = '/resetPassword'; // 비밀번호 재설정 링크
  const mailOptions = {
    from: `"Your Name" <${process.env.ICLOUD_EMAIL}>`, // 보내는 사람
    to: email, // 수신자
    subject: '비밀번호 재설정 링크', // 제목
    text: '비밀번호 재설정을 위해 아래 링크를 클릭하세요.', // 텍스트 내용
    // html: `
    //   <p>비밀번호 재설정을 위해 아래 버튼을 클릭하세요:</p>
    //   <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px;">비밀번호 재설정</a>
    //   <p>위 버튼이 작동하지 않으면 아래 링크를 복사하여 브라우저에 붙여넣으세요:</p>
    //   <p>${resetLink}</p>
    // `, // HTML 내용
  };

  await transporter.sendMail(mailOptions);
};