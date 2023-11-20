/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['dh-frontend.cdn.prismic.io', 'i.annihil.us'],
    },
    reactStrictMode: true,
    swcMinify: true,
    pageExtensions: ['page.tsx', 'page.ts', 'route.tsx', 'route.ts']
}

module.exports = nextConfig
