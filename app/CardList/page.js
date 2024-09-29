import { connectDB } from "@/util/database";
import Link from "next/link";
import ClientNavbar from "../components/ClientNavbar";

export default async function List() {
  const client = await connectDB;
  const db = client.db("NextCardZone");
  let cards = await db.collection('RegisterCard').find().toArray();

  // 구역번호가 같은 경우 중복 제거
  const uniqueCards = [];
  const seenZoneNumbers = new Set();

  cards.forEach((card) => {
    if (!seenZoneNumbers.has(card.구역번호)) {
      seenZoneNumbers.add(card.구역번호);
      uniqueCards.push(card);
    }
  });

  return (
    <div>
      <ClientNavbar />
      <a href="/newCard">구역카드 추가하기123ses + </a>
      
      <div className="list-bg">
        {uniqueCards.map((a, i) => (
          <div className="list-item" key={i}>
            <Link href={'/CardDetail/' + a.구역번호}>
              <h4>{a.구역번호}</h4>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}