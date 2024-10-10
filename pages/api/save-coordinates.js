import { connectDB } from "@/util/database"; // DB 연결 함수

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const client = await connectDB; // 데이터베이스 연결
      const db = client.db('NextCardZone'); // 데이터베이스 선택

      // 요청에서 좌표 데이터를 가져옴
      const { coordinates } = req.body;

      if (!coordinates || coordinates.length === 0) {
        return res.status(400).json({ message: '저장할 좌표가 없습니다.' });
      }

      // 좌표 데이터를 데이터베이스에 삽입
      await db.collection('coordinates').insertOne({ coordinates });

      // 성공적으로 저장되었음을 응답
      res.status(200).json({ message: '좌표가 성공적으로 저장되었습니다.' });
    } catch (error) {
      console.error('좌표 저장 오류:', error);
      res.status(500).json({ message: '좌표 저장에 실패했습니다.' });
    }
  } else {
    // POST가 아닌 요청은 허용하지 않음
    res.status(405).json({ message: '지원되지 않는 요청 방법입니다.' });
  }
}