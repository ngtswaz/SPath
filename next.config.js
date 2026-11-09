/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The marketing hub-and-spoke pages were folded into a single landing
  // page in front of the app. Send any old links to the new home.
  async redirects() {
    return [
      { source: "/mission", destination: "/", permanent: false },
      { source: "/features", destination: "/", permanent: false },
      { source: "/planner", destination: "/", permanent: false },
      { source: "/join", destination: "/", permanent: false },
    ];
  },
};

module.exports = nextConfig;
