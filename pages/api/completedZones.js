// // pages/api/completedZones.js
// import { connectDB } from "@/util/database";

// export default async function handler(req, res) {
//   const client = await connectDB;
//   const db = client.db('NextCardZone');

//   if (req.method === 'POST') {
//     const { jibun, completionDate, zoneNumber } = req.body;

//     try {
//       // 지번이 같은 구역의 완료 날짜만 업데이트
//       const result = await db.collection('CompletedZones').updateOne(
//         { jibun }, // 조건: 지번이 같은 경우
//         { 
//           $set: { 
//             completionDate, 
//             zoneNumber 
//           } 
//         }, // 완료 날짜와 구역 번호 업데이트
//         { upsert: true } // upsert 옵션을 통해 문서가 없으면 새로 추가
//       );

//       // 업데이트 성공 여부에 따라 응답 처리
//       if (result.modifiedCount > 0 || result.upsertedCount > 0) {
//         res.status(200).json({ message: '구역 완료 날짜가 업데이트되었습니다.' });
//       } else {
//         res.status(404).json({ message: '해당 지번을 찾을 수 없습니다.' });
//       }
//     } catch (error) {
//       console.error("서버 오류:", error);
//       res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
//     } finally {
//       client.close(); // 데이터베이스 연결 종료
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).json({ message: '허용되지 않는 메소드입니다.' });
//   }
// }