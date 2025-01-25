const withSerwist = require("@serwist/next").default({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    // Define CSP based on environment
    const cspContent = process.env.NODE_ENV === 'development' 
      ? "default-src 'self' https://cigarmancave.us.auth0.com http://localhost:3000 http://localhost:3001; img-src 'self' data: https: blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cigarmancave.us.auth0.com; connect-src 'self' https://cigarmancave.us.auth0.com http://localhost:3000 http://localhost:3001;"
      : "default-src 'self' https://cigarmancave.us.auth0.com https://api.cigarmancave.com; img-src 'self' data: https: blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cigarmancave.us.auth0.com; connect-src 'self' https://cigarmancave.us.auth0.com https://api.cigarmancave.com;";

    // Define CORS origin based on environment
    const corsOrigin = process.env.NODE_ENV === 'development'
      ? "http://localhost:3000"
      : "https://cigarmancave.com";

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: corsOrigin },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Content-Security-Policy",
            value: cspContent
          }
        ]
      },
      {
        source: "/api/auth/:path*",
        headers: [
          { key: "Content-Type", value: "text/html; charset=utf-8" },
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "https://cigarmancave.us.auth0.com" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
          {
            key: "Access-Control-Allow-Headers",
            value: "Authorization,Content-Type,Accept,Origin,User-Agent,DNT,Cache-Control,X-Mx-ReqToken,Keep-Alive,X-Requested-With,If-Modified-Since"
          },
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, proxy-revalidate" },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
          { key: "Surrogate-Control", value: "no-store" },
          { 
            key: "Strict-Transport-Security", 
            value: "max-age=31536000; includeSubDomains" 
          }
        ]
      }
    ];
  },

  async rewrites() {
    return process.env.NODE_ENV === 'development' 
      ? [
          {
            source: "/api/auth/:path*",
            destination: "http://localhost:3001/api/auth/:path*" // Local API server
          }
        ]
      : [
          {
            source: "/api/auth/:path*",
            destination: "https://api.cigarmancave.com/api/auth/:path*"
          }
        ];
  },

  images: {
    domains: ["cigarmancave.us.auth0.com", "localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "s.gravatar.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
        port: "",
        pathname: "/**"
      }
    ]
  },

  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  }
};

module.exports = withSerwist(nextConfig);