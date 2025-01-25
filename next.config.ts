const withSerwist = require("@serwist/next").default({
  swSrc: "src/app/sw.ts", // Updated path
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Headers configuration
  async headers() {
    return [
      // Global headers
      {
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "https://cigarmancave.com" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
          },
          // Security headers
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self' https://cigarmancave.us.auth0.com https://api.cigarmancave.com; img-src 'self' data: https: blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cigarmancave.us.auth0.com; connect-src 'self' https://cigarmancave.us.auth0.com https://api.cigarmancave.com;"
          }
        ]
      },
      // Auth-specific headers
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

  // Rewrites configuration
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "https://api.cigarmancave.com/api/auth/:path*"
      }
    ];
  },

  // Image configuration
  images: {
    domains: ["cigarmancave.us.auth0.com"],
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

  // Build configuration
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },

  // Compiler configuration
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  }
};

// Export the configuration with Serwist
module.exports = withSerwist(nextConfig);