/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "*.localhost",
  ],
};

export default nextConfig;
