'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import ClientNavbar from '../components/ClientNavbar';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

function BoardManage() {
  const { data: session, status } = useSession();
  const [tabs, setTabs] = useState([]);
  const [key, setKey] = useState('tab-0');
  const [newTabTitle, setNewTabTitle] = useState('');
  const [newTabContent, setNewTabContent] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // 탭 데이터 가져오기
  useEffect(() => {
    const fetchTabs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/manageBoard');
        const data = await response.json();
        setTabs(data);
      } catch (error) {
        console.error('Failed to fetch tabs', error);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchTabs();
    }
  }, [status]);

  // 탭 추가 처리
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

  // 탭 삭제 처리
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

  // 파일 업로드 핸들러
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (tabId) => {
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      setUploading(true);
      const res = await fetch('/api/awsUpload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: reader.result,
        }),
      });

      const data = await res.json();
      if (data.url) {
        alert('File uploaded successfully: ' + data.url);

        // 업로드된 이미지 URL을 해당 탭에 저장
        const updateRes = await fetch(`/api/updateTabImage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: tabId, imageUrl: data.url }),
        });

        if (!updateRes.ok) {
          alert('Failed to update tab with image');
        } else {
          const updatedTab = await updateRes.json();
          setTabs((prevTabs) =>
            prevTabs.map((tab) =>
              tab._id === tabId ? { ...tab, imageUrl: updatedTab.imageUrl } : tab
            )
          );
        }
      } else {
        alert('File upload failed');
      }
      setUploading(false);
    };
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

                  {/* 이미지가 있는 경우 이미지 표시 */}
                  {tab.imageUrl && (
                    <div style={{ marginTop: '1rem' }}>
                      <img
                        src={tab.imageUrl}
                        alt="Uploaded image"
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                    </div>
                  )}

                  {/* 파일 업로드 섹션 */}
                  <div style={{ marginTop: '10px' }}>
                    <h3>이미지 업로드</h3>
                    <input type="file" onChange={handleFileChange} />
                    <button
                      onClick={() => handleUpload(tab._id)} // 해당 탭에 이미지 업로드
                      disabled={uploading}
                      style={{
                        padding: '10px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                      }}
                    >
                      {uploading ? 'Uploading...' : 'Upload Image'}
                    </button>
                  </div>

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