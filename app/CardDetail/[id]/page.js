'use client'

import { useEffect, useState } from "react";
import ClientNavbar from "@/app/components/ClientNavbar";
import Card from 'react-bootstrap/Card';
import Loading from "@/app/loading";
import KakaoMap from "@/app/components/KakaoMap";

export default function Detail(props) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editCardId, setEditCardId] = useState(null);
  const [editCardDetails, setEditCardDetails] = useState({ 지번: "", 세부정보: "" });

  const zoneNumber = parseInt(props.params.id, 10);

  useEffect(() => {
    async function fetchZoneData() {
      try {
        const response = await fetch(`/api/zone/${zoneNumber}`);
        if (!response.ok) {
          throw new Error("데이터를 불러오는 중 오류가 발생했습니다.");
        }
        const data = await response.json();
        setCards(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchZoneData();
  }, [zoneNumber]);

  const handleEditClick = (card) => {
    setEditCardId(card._id);
    setEditCardDetails({ 지번: card.지번, 세부정보: card.세부정보 });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateCard = async () => {
    if (editCardDetails.지번 === "" && editCardDetails.세부정보 === "") {
      alert("수정할 내용을 입력해 주세요.");
      return;
    }

    try {
      const response = await fetch(`/api/zone/${editCardId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editCardDetails),
      });

      if (!response.ok) {
        window.location.reload();
        return;
      }

      const updatedCards = cards.map(card => (card._id === editCardId ? { ...card, ...editCardDetails } : card));
      setCards(updatedCards);
      setEditCardId(null);
      setEditCardDetails({ 지번: "", 세부정보: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  const groupedCards = cards.reduce((acc, card) => {
    if (card.지번) {
      acc[card.지번] = acc[card.지번] || [];
      acc[card.지번].push(card);
    }
    return acc;
  }, {});

  return (
    <div>
      <ClientNavbar />
      {Object.entries(groupedCards).length > 0 ? (
        <>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '1rem',
            padding: '10px',
            backgroundColor: '#4481bd',
            borderRadius: '8px',
            width: '100%',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            position: 'static'
          }}>
            <h2 style={{
              color: 'white',
              fontWeight: 'bold',
              margin: 0,
              fontSize: '24px',
             
            }}>
              구역번호: {zoneNumber}
            </h2>
          </div>
            <KakaoMap  enableDrawingTools = {true} enableInfoWindow = {false} zoneNumber={zoneNumber} initializeMap = {true}/>
          <h4></h4>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '1rem', 
            justifyContent: 'center',  // 카드들을 수평으로 가운데 정렬
            alignItems: 'center'  // 카드들을 수직으로 가운데 정렬 (필요할 경우)
          }}>
            {Object.entries(groupedCards).map(([jibun, cardGroup]) => (
              <Card
                bg="light"
                key={jibun}
                text="dark"
                className="mb-2"
                style={{ 
                  width: '300px',  // 카드 너비를 300px로 설정
                  height: '300px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  marginLeft: '10px'
                }}
              >
                <Card.Header>지번: {jibun}</Card.Header>
                <Card.Body>
                  {cardGroup.map((card) => (
                    <div key={card._id}>
                      <Card.Title>{card.세부정보 || '정보 없음'}</Card.Title>
                     
                      {editCardId === card._id ? (
                        <>
                          <input 
                            type="text" 
                            name="세부정보" 
                            value={editCardDetails.세부정보} 
                            onChange={handleInputChange} 
                            placeholder="세부정보" 
                            className="form-control mb-2"
                          />
                          <button onClick={handleUpdateCard} className="btn btn-success">수정 완료</button>
                        </>
                      ) : (
                        <button 
                          onClick={() => handleEditClick(card)} 
                          style={{
                            backgroundColor: 'none', 
                            color: '#333', 
                            border: '2px solid #ff8800', 
                            padding: '3px 5px', 
                            borderRadius: '8px',
                            cursor: 'pointer'
                          }}
                        >
                          ✏️
                        </button>
                      )}
                    </div>
                  ))}
                </Card.Body>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <p>해당 구역번호에 대한 데이터가 없습니다.</p>
      )}
    </div>
  );
}