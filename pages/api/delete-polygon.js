import { connectDB } from "@/util/database"; // DB 연결 함수
import { ObjectId } from "mongodb"; // MongoDB에서 ObjectId 임포트

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    try {
      const client = await connectDB;  // MongoDB에 연결
      const db = client.db('NextCardZone');  // 사용할 데이터베이스 선택

      // 클라이언트에서 _id 쿼리 파라미터를 가져옴
      const { _id } = req.query;

      // _id가 제공되지 않았을 경우 에러 처리
      if (!_id) {
        return res.status(400).json({ message: '_id가 제공되지 않았습니다.' });
      }

      // 해당 _id에 맞는 폴리곤 데이터를 삭제
      const result = await db.collection('coordinates').deleteOne({ _id: new ObjectId(_id) });

      // 삭제 성공 여부 확인
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: '해당 폴리곤 데이터를 찾을 수 없습니다.' });
      }

      // 성공적으로 삭제된 경우
      res.status(200).json({ message: '폴리곤이 성공적으로 삭제되었습니다.' });
    } catch (error) {
      console.error('폴리곤 삭제 오류:', error);
      res.status(500).json({ message: '폴리곤 삭제 중 오류가 발생했습니다.' });
    }
  } else {
    // DELETE 요청이 아닌 경우 처리
    res.status(405).json({ message: '지원되지 않는 요청 방법입니다.' });
  }
}