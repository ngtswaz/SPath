/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The old site had a /planner demo page; planning now lives in the app.
  async redirects() {
    return [{ source: "/planner", destination: "/app/plan", permanent: false }];
  },
};

module.exports = nextConfig;
