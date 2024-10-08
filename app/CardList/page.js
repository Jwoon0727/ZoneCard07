import { connectDB } from "@/util/database";
import Link from "next/link";
import ClientNavbar from "../components/ClientNavbar";

export default async function List() {
  const client = await connectDB;
  const db = client.db("NextCardZone");
  let cards = await db.collection('RegisterCard').find().toArray();

  // 구역번호 중복 제거
  const uniqueCards = [];
  const seenZoneNumbers = new Set();

  cards.forEach((card) => {
    if (!seenZoneNumbers.has(card.구역번호)) {
      seenZoneNumbers.add(card.구역번호);
      uniqueCards.push(card);
    }
  });

  // 구역 완료 날짜를 가져오기 위해 추가적인 데이터베이스 조회
  const completionDates = {}; // 구역 완료 날짜를 저장할 객체
  for (const card of uniqueCards) {
    const completion = await db.collection('CompletedZones').findOne({ zoneNumber: card.구역번호 });
    if (completion) {
      completionDates[card.구역번호] = completion.completionDate;
    }
  }

  return (
    <div>
      <ClientNavbar />
      <div>
        
        <Link href={'/newCard'}><img src="/images/plus.png" style={{ width: '45px', height: '45px', marginLeft : "20px", marginBottom : "30px", marginTop : "20px" , marginRight : "20px"}}/></Link>
        <h7>구역추가</h7>
        </div>

      <div className="list-bg">
        {uniqueCards.map((a, i) => (
          <div className="list-item" key={i}>
            <Link href={'/CardDetail/' + a.구역번호}>
              <h4>{a.구역번호}</h4>
              {/* 구역 완료 날짜 표시 */}
              {completionDates[a.구역번호] ? (
                <p>구역 완료 날짜: {new Date(completionDates[a.구역번호]).toLocaleDateString()}</p>
              ) : (
                <p>완료되지 않음</p> // 완료되지 않은 구역 표시
              )}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}