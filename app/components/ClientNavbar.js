'use client'; // 클라이언트 컴포넌트로 설정

import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import LoginBtn, { LogOutBtn } from '../LoginBtn';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react'; // signOut 함수 임포트

export default function ClientNavbar() {
  const { data: session, status } = useSession();
  const [checked, setChecked] = useState(false); // 체크 상태 추가

  useEffect(() => {
    const checkUserExists = async () => {
      if (status === 'authenticated' && !checked) {
        const response = await fetch('/api/checkUser');

        if (response.status === 404) {
          // 유저가 DB에 존재하지 않으면 로그아웃 처리
          await signOut(); // next-auth의 signOut 메소드를 사용하여 로그아웃
          window.location.href = '/'; // 홈으로 리디렉션
        } else {
          setChecked(true); // 체크 완료
        }
      }
    };

    checkUserExists();
  }, [session, status, checked]); // checked 상태를 의존성에 추가

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">구역카드</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {status === 'authenticated' ? (
              <span>
                환영합니다, {session.user.name} <LogOutBtn />
              </span>
            ) : (
              <>
                <LoginBtn />
                {/* <Link href="/register">
                  <Button variant="outline-primary" className="ms-2">회원가입</Button>
                </Link> */}
              </>
            )}
            <Nav.Link href="/noticeboard">회중게시판</Nav.Link>
            <Nav.Link href="/map">지도</Nav.Link>
            <Nav.Link href="/userlist">구역</Nav.Link>

            <NavDropdown title="봉사" id="basic-nav-dropdown">
            <NavDropdown.Item href="#action/3.3">전시대신청</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">~~</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">~~</NavDropdown.Item>
            </NavDropdown>

            {status === 'authenticated' && session?.user.role !== '0' && (
              <NavDropdown title="더보기" id="basic-nav-dropdown">
                <NavDropdown.Item href="/userCard">유저관리 <img src="/images/user.png" style={{ width: '25px', height: '25px', marginLeft : "25px" }}/></NavDropdown.Item>
                <NavDropdown.Item href="/noticeboardRegister">게시판 관리 <img src="/images/noticeboard.png" style={{ width: '25px', height: '25px', marginLeft : "20px" }}/></NavDropdown.Item>
                <NavDropdown.Item href="/CardList">구역리스트 <img src="/images/list.png" style={{ width: '25px', height: '25px', marginLeft : "20px" }}/></NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">구역배정</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">구역배정</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">구역배정</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.3">111</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}