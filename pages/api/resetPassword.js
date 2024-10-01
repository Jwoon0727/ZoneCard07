// pages/api/resetPassword.js

import { connectDB } from '@/util/database';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  const client = await connectDB; // 괄호 추가
  const db = client.db('NextCardZone');

  if (req.method === 'POST') {
    const { id, newPassword } = req.body;
    console.log("Received ID:", id); // 수신된 ID 확인

    console.log(req.body); // 요청 데이터 확인

    try {
      // 사용자 검색
      const user = await db.collection('user_cred').findOne({ id });

      if (!user) {
        return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
      }

      // 비밀번호 해싱
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db.collection('user_cred').updateOne(
        { id },
        { $set: { password: hashedPassword } }
      );

      res.status(200).json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: '비밀번호 변경에 실패했습니다.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}