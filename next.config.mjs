import withPWA from 'next-pwa';
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV !== 'development', // 개발 환경에서만 console 유지
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias['@'] = path.resolve(__dirname);
    }

    // 서비스 워커에 대한 소스 맵 비활성화 (필요시)
    if (process.env.NODE_ENV === 'production') {
      config.devtool = false; // 프로덕션에서 소스 맵 비활성화
    }

    return config;
  },
};

export default withPWA({
  // PWA 설정
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // 개발 환경에서는 PWA 비활성화
  register: true, // 서비스 워커 등록
  skipWaiting: true, // 서비스 워커 즉시 적용
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif)$/i, // 이미지 파일 캐싱
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30일
        },
      },
    },
    {
      urlPattern: /^https:\/\/your-api-url\/.*/i, // API 요청 캐싱
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 1일
        },
      },
    },
    {
      urlPattern: /.*/, // 기본 캐싱 정책
      handler: 'NetworkFirst',
      options: {
        cacheName: 'default-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60, // 1일
        },
      },
    },
  ],
  buildExcludes: [/middleware-manifest.json$/], // 소스 맵 파일 생성을 제외할 수 있습니다.
})(nextConfig);