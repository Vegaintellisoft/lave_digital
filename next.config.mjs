/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow LAN connections (such as testing from another laptop or phone)
  allowedDevOrigins: [
    "localhost:3000",
  ],
};

export default nextConfig;
