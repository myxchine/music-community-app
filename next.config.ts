import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-5d98fcdd24fb4227be900a856fef1126.r2.dev",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
