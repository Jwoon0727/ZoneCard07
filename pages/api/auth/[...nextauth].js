import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { connectDB } from "@/util/database";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        id: { label: "id", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        try {
          let db = (await connectDB).db('NextCardZone');
          let user = await db.collection('user_cred').findOne({ id: credentials.id });
          if (!user) {
            throw new Error('해당 아이디가 없습니다.');
          }
          const pwcheck = await bcrypt.compare(credentials.password, user.password);
          if (!pwcheck) {
            throw new Error('비밀번호가 틀렸습니다.');
          }
          console.log('로그인 성공:', user.name);
          
          // 역할도 함께 반환합니다.
          return { id: user.id, name: user.name, email: user.email, role: user.role };
        } catch (error) {
          console.error('로그인 실패:', error.message);
          return null;
        }
      }
    })
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 세션 유지 시간 (1일)
  },
  
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = {
          name: user.name,
          email: user.email,
          role: user.role // 역할 추가
        };
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user = token.user;  
      return session;
    },
  },

  pages: {
    signIn: '/signin', // 커스텀 로그인 페이지 경로
  },

  secret: 'jworg9914#', // secret은 환경 변수로 설정하는 것이 좋습니다.
  adapter: MongoDBAdapter(connectDB)
};

export default NextAuth(authOptions);