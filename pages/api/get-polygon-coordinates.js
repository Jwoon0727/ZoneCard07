import { connectDB } from "@/util/database"; // DB 연결 함수

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const client = await connectDB;  // MongoDB에 연결
      const db = client.db('NextCardZone');  // 사용할 데이터베이스 선택

      // 클라이언트에서 zoneNumber 쿼리 파라미터를 가져옴
      const { zoneNumber } = req.query;

      // zoneNumber가 제공되지 않았을 경우 에러 처리
      if (!zoneNumber) {
        return res.status(400).json({ message: 'zoneNumber가 제공되지 않았습니다.' });
      }

      // 해당 zoneNumber에 맞는 모든 폴리곤 데이터를 찾음 (find 사용)
      const polygons = await db.collection('coordinates')
        .find({ zoneNumber: parseInt(zoneNumber, 10) })  // 여러 개의 데이터를 찾기 위해 find 사용
        .toArray();  // 배열로 변환

      // 해당 zoneNumber에 해당하는 데이터가 없을 경우 처리
      if (polygons.length === 0) {
        return res.status(404).json({ message: '해당 구역의 폴리곤 데이터를 찾을 수 없습니다.' });
      }

      // zoneNumber에 해당하는 폴리곤들을 응답으로 반환
      res.status(200).json(polygons);  // 여러 개의 폴리곤을 배열로 반환
    } catch (error) {
      console.error('폴리곤 데이터 가져오기 오류:', error);
      res.status(500).json({ message: '폴리곤 데이터를 가져오는 데 실패했습니다.' });
    }
  } else {
    // GET 요청이 아닌 경우 처리
    res.status(405).json({ message: '지원되지 않는 요청 방법입니다.' });
  }
}