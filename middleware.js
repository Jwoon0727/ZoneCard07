import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const token = await getToken({ req: request, secret: 'jworg9914#' });

  const { pathname } = request.nextUrl;

  console.log('Token:', token); // JWT 토큰 로그
  if (token) {
    console.log('User Role:', token.user.role); // 사용자의 역할 로그
  }

  if (!token && (pathname === '/userlist' || pathname === '/map' || pathname === '/profile' || pathname === '/noticeboard')) {
    return NextResponse.redirect(new URL('/api/auth/signin?callbackUrl=' + encodeURIComponent(request.url), request.url));
  }

  // 전도인 역할 확인
//   if (token && token.user.role === '0' && pathname === '/userlist') {
//     return NextResponse.redirect(new URL('/map-denied', request.url)); // "/map-denied" 페이지로 리다이렉트
//   }

  return NextResponse.next();
}

export const config = {
  matcher: ['/userlist', '/map', '/profile'],
};