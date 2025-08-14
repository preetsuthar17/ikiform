import type { NextConfig } from "next";

const nextConfig: NextConfig = {
     async redirects() {
    return [
      {
        source: '/feedback',
        destination: 'https://www.ikiform.com/f/feedback-form-ag334n',
        permanent: false, 
      },
      {
        source: '/feature-request',
        destination: 'https://www.ikiform.com/f/feature-request-form-zo0tg5',
        permanent: false, 
      },
      {
        source: '/bug-report',
        destination: 'http://localhost:3000/f/bug-report-form-82iwa5',
        permanent: false, 
      },
      {
        source: '/github',
        destination: 'https://github.com/preetsuthar17/ikiform',
        permanent: false, 
      },
      {
        source: '/discord',
        destination: 'https://discord.gg/jM5BgDMaGX',
        permanent: false, 
      }
    ]
  },
};

export default nextConfig;
