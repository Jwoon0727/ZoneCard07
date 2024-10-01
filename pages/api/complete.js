// 예시: completeZone API 핸들러
import { connectDB } from "@/util/database";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { jibun, completionDate } = req.body;
    const client = await connectDB;
    const db = client.db("NextCardZone");

    // CompletionDates 컬렉션에 완료 날짜 저장
    await db.collection('CompletionDates').insertOne({
      구역번호: jibun, // 구역번호를 지번으로 사용
      completionDate,
    });

    res.status(200).json({ message: "Zone completed successfully." });
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}