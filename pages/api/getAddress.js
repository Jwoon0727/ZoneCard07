import { connectDB } from "@/util/database";

export default async function handler(req, res) {
  const client = await connectDB;
  const db = client.db('NextCardZone');

  if (req.method === 'GET') {
    const { jibun } = req.query; // URL의 jibun 파라미터 가져오기

    try {
      const addresses = await db.collection('RegisterCard').find({ 지번: jibun }).toArray(); // 여러 개의 문서 찾기
      if (addresses.length > 0) {
        res.status(200).json(addresses); // 검색된 데이터 반환
      } else {
        res.status(404).json({ message: '주소 정보를 찾을 수 없습니다.' });
      }
    } catch (error) {
      res.status(500).json({ message: '서버 오류가 발생했습니다.', error });
    }
  } else {
    res.status(405).json({ message: '허용되지 않는 메소드입니다.' });
  }
}