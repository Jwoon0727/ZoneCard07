'use client';
import { useEffect, useState } from 'react';
import ClientNavbar from '../components/ClientNavbar';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

function BoardManage() {
  const [tabs, setTabs] = useState([]); // 초기값을 빈 배열로 설정
  const [key, setKey] = useState('tab-0');
  const [newTabTitle, setNewTabTitle] = useState(''); // 새 탭 제목 상태
  const [newTabContent, setNewTabContent] = useState(''); // 새 탭 내용 상태
  const [showForm, setShowForm] = useState(false); // 폼 표시 여부
  const [alertMessage, setAlertMessage] = useState(''); // 알림 메시지 상태
  const [alertType, setAlertType] = useState(''); // 알림 종류 ('success', 'error')

  // 페이지 로드 시 서버에서 모든 탭 가져오기
  useEffect(() => {
    const fetchTabs = async () => {
      try {
        const response = await fetch('/api/manageBoard');
        const data = await response.json();
        setTabs(data); // 가져온 데이터를 tabs 상태에 저장
      } catch (error) {
        console.error('Failed to fetch tabs', error);
      }
    };

    fetchTabs();
  }, []);

  // 탭 추가 핸들러 (DB에 저장)
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

      // 새 탭을 배열에 추가
      setTabs((prevTabs) => [...prevTabs, result.tab]);
      setKey(result.tab.title); // 새 탭으로 이동

      // 성공 알림 표시
      setAlertMessage('탭이 성공적으로 추가되었습니다.');
      setAlertType('success');

      // 입력 필드 초기화 및 폼 숨기기
      setNewTabTitle('');
      setNewTabContent('');
      setShowForm(false);
    } catch (error) {
      console.error('Failed to add tab', error);

      // 실패 알림 표시
      setAlertMessage('탭 추가에 실패했습니다.');
      setAlertType('error');
    }

    // 3초 후에 알림 메시지 자동 해제
    setTimeout(() => {
      setAlertMessage('');
      setAlertType('');
    }, 3000);
  };

  // 파일 업로드 핸들러
  const handleFileUpload = async (e, tabId) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`/api/uploadFile?id=${tabId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const result = await response.json();

      // 탭 목록을 업데이트해서 파일 경로를 반영
      setTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab._id === tabId ? { ...tab, filePath: result.filePath } : tab
        )
      );

      setAlertMessage('파일이 성공적으로 업로드되었습니다.');
      setAlertType('success');
    } catch (error) {
      console.error('Failed to upload file', error);
      setAlertMessage('파일 업로드에 실패했습니다.');
      setAlertType('error');
    }

    // 3초 후에 알림 메시지 자동 해제
    setTimeout(() => {
      setAlertMessage('');
      setAlertType('');
    }, 3000);
  };

  return (
    <div>
      <ClientNavbar />
      <h2>게시판 관리</h2>

      <button
        onClick={() => setShowForm(true)} // 폼 표시
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

      {/* 성공 또는 실패 알림 메시지 */}
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

      {/* 새 탭 입력 폼 */}
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

      {/* tabs 배열이 있는지 확인 후 렌더링 */}
      {Array.isArray(tabs) && (
        <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
          <Tabs
            id="dynamic-tabs"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
            style={{
              display: 'flex',
              flexWrap: 'nowrap', // 한 줄에 강제 배치
              whiteSpace: 'nowrap',
              overflowX: 'auto', // 가로 스크롤 가능
              scrollbarWidth: 'thin', // 스크롤바 얇게
            }}
          >
            {tabs.map((tab, index) => (
              <Tab eventKey={tab._id || `tab-${index}`} key={tab._id || `tab-${index}`} title={tab.title}>
                <div style={{ padding: '1rem' }}>
                  <div>{tab.content}</div>

                  {/* 탭 삭제 버튼 */}
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

                  {/* 파일 업로드 */}
                  <div style={{ marginTop: '10px' }}>
                    <input type="file" onChange={(e) => handleFileUpload(e, tab._id)} />
                  </div>

                  {/* 업로드된 파일이 있을 경우, 파일을 이미지로 표시 */}
                  {tab.filePath && (
                    <div style={{ marginTop: '10px' }}>
                      <img
                        src={tab.filePath}  // 업로드된 파일 경로 사용
                        alt="Uploaded file"
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                    </div>
                  )}
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