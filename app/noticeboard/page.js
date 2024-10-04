'use client'
import ClientNavbar from '../components/ClientNavbar';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useState, useEffect } from 'react';
import Loading from '../loading';

function JustifiedExample() {
  const [key, setKey] = useState('home'); // 기본 탭 설정
  const [tabs, setTabs] = useState([]); // 탭 데이터를 담을 상태 변수
  const [loading, setLoading] = useState(true); // 로딩 상태

  // 서버에서 noticeBoard 데이터 가져오기
  useEffect(() => {
    const fetchTabs = async () => {
      try {
        const response = await fetch('/api/manageBoard');
        const data = await response.json();
        setTabs(data);
        setLoading(false); // 로딩 종료
      } catch (error) {
        console.error('Failed to fetch tabs:', error);
        setLoading(false); // 로딩 종료
      }
    };

    fetchTabs();
  }, []);

  if (loading) {
    return <Loading/>; // 로딩 중일 때 보여줄 화면
  }

  return (
    <div>
      <ClientNavbar />

      {/* 탭 헤더를 감싸는 div에 가로 스크롤 설정 */}
      <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <Tabs
          id="justify-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3"
          style={{
            display: 'flex',
            flexWrap: 'nowrap', // 탭 버튼을 한 줄로 강제 설정
            whiteSpace: 'nowrap',
            overflowX: 'auto', // 탭 헤더에만 가로 스크롤 적용
            scrollbarWidth: 'thin' // 스크롤바를 얇게 설정
          }}
        >
          {/* 동적으로 생성된 탭 */}
          {tabs.map((tab, index) => (
            <Tab eventKey={tab._id || `tab-${index}`} key={tab._id || `tab-${index}`} title={tab.title}>
              <div style={{ padding: '1rem' }}>
                {/* 탭 내용 */}
                <p>{tab.content}</p>

                {/* 업로드된 파일이 있으면 이미지로 표시 */}
                {tab.filePath && (
                  <div style={{ marginTop: '10px' }}>
                    <img
                      src={tab.filePath} // 이미지 경로
                      alt="Uploaded file"
                      style={{ maxWidth: '100%', height: 'auto' }} // 이미지 스타일
                    />
                  </div>
                )}
              </div>
            </Tab>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

export default JustifiedExample;