/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // 👇 Dòng này giúp tắt ESLint khi build
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
