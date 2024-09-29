import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const client = await connectDB;
  const db = client.db("NextCardZone");

  const { id } = req.query;

  // 구역번호를 숫자로 변환
  const zoneNumber = parseInt(id, 10);

  if (req.method === 'GET') {
    try {
      const cards = await db.collection('RegisterCard').find({ 구역번호: zoneNumber }).toArray();
      return res.status(200).json(cards);
    } catch (error) {
      return res.status(500).json({ message: '서버 오류s', error });
    }
  }

  if (req.method === 'PUT') {
    const { 지번, 세부정보 } = req.body;

    try {
      // 데이터 수정
      const result = await db.collection('RegisterCard').updateOne(
        { _id: new ObjectId(id) }, // id로 필터링
        { $set: { 지번, 세부정보 } }
      );

      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: '수정할 데이터가 없습니다.' });
      }

      return res.status(200).json({ message: '수정 완료' });
    } catch (error) {
      return res.status(500).json({ message: '서버 오류', error });
    }
  }

  return res.setHeader('Allow', ['GET', 'PUT']).status(405).end(`Method ${req.method} Not Allowed`);
}