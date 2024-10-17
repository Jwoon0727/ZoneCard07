// import { connectDB } from "@/util/database"; // MongoDB 연결 함수

// export default async function handler(req, res) {
//   if (req.method === 'GET') {
//     try {
//       const client = await connectDB;  // MongoDB에 연결
//       const db = client.db('NextCardZone');  // 사용할 데이터베이스 선택

//       // 모든 폴리곤 데이터를 가져옴
//       const polygons = await db.collection('coordinates').find({}).toArray();

//       // 데이터가 없을 경우 404 처리
//       if (!polygons || polygons.length === 0) {
//         return res.status(404).json({ message: '폴리곤 데이터를 찾을 수 없습니다.' });
//       }

//       // 모든 폴리곤 데이터를 응답으로 반환
//       res.status(200).json({ polygons });
//     } catch (error) {
//       console.error('폴리곤 데이터 가져오기 오류:', error);
//       res.status(500).json({ message: '폴리곤 데이터를 가져오는 데 실패했습니다.' });
//     }
//   } else {
//     // GET 이외의 요청 처리
//     res.status(405).json({ message: '지원되지 않는 요청 방법입니다.' });
//   }
// }