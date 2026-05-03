import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/privacy-policy",    destination: "/privacy", permanent: true },
      { source: "/terms-of-service",  destination: "/terms",   permanent: true },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/tiktokgJdBgyAJYIBwY3VXBQPyuGOZGA0XIljo.txt/",
        destination: "/tiktokgJdBgyAJYIBwY3VXBQPyuGOZGA0XIljo.txt",
      },
    ];
  },
};

export default nextConfig;
