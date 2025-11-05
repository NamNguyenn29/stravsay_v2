import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "localhost",
        port: "7020",
        pathname: "/room_images/**",
      },
    ],
    domains: ["localhost"],
  },

};


export default nextConfig;
