/** @type {import('next').NextConfig} */
// Path: next.config.js
const nextConfig = {
  output: "standalone",
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;
