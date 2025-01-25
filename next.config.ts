/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    // Auth routes - Always network only
    {
      urlPattern: /\/api\/auth\/(login|callback|logout|me)/,
      handler: 'NetworkOnly',
      options: {
        matchOptions: {
          ignoreSearch: true
        }
      }
    },
    // Auth0 domain - Always network only
    {
      urlPattern: /^https:\/\/cigarmancave\.us\.auth0\.com\/.*/,
      handler: 'NetworkOnly',
      options: {
        matchOptions: {
          ignoreSearch: true
        }
      }
    },
    // API routes
    {
      urlPattern: /^https:\/\/api\.cigarmancave\.com\/api\/.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 // 1 hour
        },
        matchOptions: {
          ignoreSearch: true
        }
      }
    },
    // Google user images
    {
      urlPattern: /^https:\/\/lh3\.googleusercontent\.com\/.*/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-images',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60 // 24 hours
        }
      }
    },
    // Gravatar images
    {
      urlPattern: /^https:\/\/s\.gravatar\.com\/.*/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'gravatar-images',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60 // 24 hours
        }
      }
    },
    // AWS S3 images
    {
      urlPattern: /^https:\/\/.*\.amazonaws\.com\/.*/,
      handler: 'CacheFirst',
      options: {
        cacheName: 's3-images',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60 // 24 hours
        }
      }
    },
    // Static resources
    {
      urlPattern: /\.(?:js|css)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60 // 24 hours
        }
      }
    },
    // HTML pages
    {
      urlPattern: /^https:\/\/cigarmancave\.com\/.*$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages-cache',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60 // 24 hours
        }
      }
    }
  ]
});

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
        destination: "https://api.cigarmancave.com/api/auth/:path*",
        hasQuery: true
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

  // Cookie and security configuration
  experimental: {
    cookiePrefix: 'auth0',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  },

  // PWA configuration
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    scope: '/',
    sw: 'service-worker.js',
    skipWaiting: true,
    customWorkerDir: 'worker',
  },

  // Environment configuration
  env: {
    AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
    AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_SCOPE: 'openid profile email',
  },

  // Server configuration
  serverRuntimeConfig: {
    auth0: {
      secret: process.env.AUTH0_SECRET,
      baseURL: process.env.AUTH0_BASE_URL,
      issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
    }
  },

  // Optimization configuration
  optimization: {
    minimize: process.env.NODE_ENV === 'production',
  },

  // Compiler configuration
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  }
};

// Export the configuration with PWA support
module.exports = withPWA(nextConfig);