/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API_HOST: process.env.API_HOST,
        MAP_API_KEY: process.env.MAP_API_KEY,
    }
}

module.exports = nextConfig
