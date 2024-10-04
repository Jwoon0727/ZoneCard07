import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    compiler: {
        removeConsole: process.env.NODE_ENV !== "development",
    },
};

export default withPWA({
    dest: "public",
    disable: false, // PWA 항상 활성화
    register: true,
    skipWaiting: true,
    runtimeCaching: [
        {
            urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif)$/i,
            handler: 'CacheFirst',
            options: {
                cacheName: 'image-cache',
                expiration: {
                    maxEntries: 60,
                    maxAgeSeconds: 30 * 24 * 60 * 60,  // 30일
                },
            },
        },
        {
            urlPattern: /^https:\/\/your-api-url\/.*/i,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'api-cache',
                expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 24 * 60 * 60,  // 1일
                },
            },
        },
        {
            urlPattern: /.*/,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'default-cache',
                expiration: {
                    maxEntries: 100,
                    maxAgeSeconds: 24 * 60 * 60,  // 1일
                },
            },
        },
    ],
});