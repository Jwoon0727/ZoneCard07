'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import ClientNavbar from '../components/ClientNavbar';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ImgUpload from '../imgUpload/page'; // 새로운 ImgUpload 컴포넌트 불러오기

function BoardManage() {
  const { data: session, status } = useSession(); // 로그인 세션 가져오기
  const [tabs, setTabs] = useState([]);
  const [key, setKey] = useState('tab-0');
  const [newTabTitle, setNewTabTitle] = useState('');
  const [newTabContent, setNewTabContent] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [loading, setLoading] = useState(true); // 로딩 상태 관리

  useEffect(() => {
    const fetchTabs = async () => {
      try {
        setLoading(true); // 데이터 로딩 시작
        const response = await fetch('/api/manageBoard');
        const data = await response.json();
        setTabs(data);
      } catch (error) {
        console.error('Failed to fetch tabs', error);
      } finally {
        setLoading(false); // 데이터 로딩 완료
      }
    };

    if (status === 'authenticated') {
      fetchTabs();
    }
  }, [status]);

  const handleAddTab = async () => {
    if (!newTabTitle || !newTabContent) {
      alert('제목과 내용을 입력하세요.');
      return;
    }

    try {
      const response = await fetch('/api/addTab', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTabTitle, content: newTabContent }),
      });

      if (!response.ok) {
        throw new Error('Failed to add tab');
      }

      const result = await response.json();

      setTabs((prevTabs) => [...prevTabs, result.tab]);
      setKey(result.tab.title);

      setAlertMessage('탭이 성공적으로 추가되었습니다.');
      setAlertType('success');

      setNewTabTitle('');
      setNewTabContent('');
      setShowForm(false);
    } catch (error) {
      console.error('Failed to add tab', error);
      setAlertMessage('탭 추가에 실패했습니다.');
      setAlertType('error');
    }

    setTimeout(() => {
      setAlertMessage('');
      setAlertType('');
    }, 3000);
  };

  const handleDeleteTab = async (tabId) => {
    try {
      const response = await fetch(`/api/deleteTab?id=${tabId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete tab');
      }

      setTabs((prevTabs) => prevTabs.filter((tab) => tab._id !== tabId));

      setAlertMessage('탭이 성공적으로 삭제되었습니다.');
      setAlertType('success');
    } catch (error) {
      console.error('Failed to delete tab', error);
      setAlertMessage('탭 삭제에 실패했습니다.');
      setAlertType('error');
    }

    setTimeout(() => {
      setAlertMessage('');
      setAlertType('');
    }, 3000);
  };

  // 로딩 중일 때 로딩 메시지 표시
  if (status === 'loading' || loading) {
    return <div>로딩 중...</div>;
  }

  // 인증되지 않은 경우 처리
  if (status === 'unauthenticated') {
    return <div>로그인하지 않았습니다. 로그인 후 이용해주세요.</div>;
  }

  return (
    <div>
      <ClientNavbar />
      <h2>게시판 관리</h2>

      <button
        onClick={() => setShowForm(true)}
        style={{
          marginBottom: '1rem',
          padding: '10px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        탭 추가 +
      </button>

      {alertMessage && (
        <div
          style={{
            padding: '10px',
            marginBottom: '10px',
            color: alertType === 'success' ? 'green' : 'red',
            border: `2px solid ${alertType === 'success' ? 'green' : 'red'}`,
            borderRadius: '5px',
          }}
        >
          {alertMessage}
        </div>
      )}

      {showForm && (
        <div>
          <input
            type="text"
            placeholder="탭 제목"
            value={newTabTitle}
            onChange={(e) => setNewTabTitle(e.target.value)}
            style={{ marginBottom: '1rem', padding: '10px', width: '100%' }}
          />
          <textarea
            placeholder="탭 내용"
            value={newTabContent}
            onChange={(e) => setNewTabContent(e.target.value)}
            style={{ marginBottom: '1rem', padding: '10px', width: '100%' }}
          />
          <button
            onClick={handleAddTab}
            style={{
              padding: '10px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            저장
          </button>
        </div>
      )}

      {Array.isArray(tabs) && (
        <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
          <Tabs
            id="dynamic-tabs"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
            style={{
              display: 'flex',
              flexWrap: 'nowrap',
              whiteSpace: 'nowrap',
              overflowX: 'auto',
              scrollbarWidth: 'thin',
            }}
          >
            {tabs.map((tab, index) => (
              <Tab eventKey={tab._id || `tab-${index}`} key={tab._id || `tab-${index}`} title={tab.title}>
                <div style={{ padding: '1rem' }}>
                  <div>{tab.content}</div>

                  <button
                    onClick={() => handleDeleteTab(tab._id)}
                    style={{
                      marginTop: '10px',
                      padding: '10px',
                      backgroundColor: '#ff4d4d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    탭 삭제
                  </button>

                  {/* 파일 업로드 컴포넌트 추가 */}
                  <ImgUpload />
                </div>
              </Tab>
            ))}
          </Tabs>
        </div>
      )}
    </div>
  );
}

export default BoardManage;