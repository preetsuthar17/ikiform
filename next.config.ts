import { withBotId } from "botid/next/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [25, 50, 75, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "av5on64jc4.ufs.sh",
        pathname: "/f/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/feedback",
        destination: "https://www.ikiform.com/f/feedback-form-ag334n",
        permanent: false,
      },
      {
        source: "/feature-request",
        destination: "https://www.ikiform.com/f/feature-request-form-zo0tg5",
        permanent: false,
      },
      {
        source: "/bug-report",
        destination: "https://www.ikiform.com/f/bug-report-form-82iwa5",
        permanent: false,
      },
      {
        source: "/github",
        destination: "https://github.com/preetsuthar17/ikiform",
        permanent: false,
      },
      {
        source: "/discord",
        destination: "https://discord.gg/jM5BgDMaGX",
        permanent: false,
      },
      {
        source: "/email",
        destination: "mailto:hi@ikiform.com",
        permanent: false,
      },
      {
        source: "/twitter",
        destination: "https://x.com/preetsuthar17",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/f/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *;",
          },
        ],
      },
      {
        source: "/forms/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *;",
          },
        ],
      },
      {
        source: "/((?!f/|forms/).*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'none';",
          },
        ],
      },
    ];
  },
};

export default withBotId(nextConfig);
