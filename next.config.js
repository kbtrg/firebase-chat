/** @type {import('next').NextConfig} */

const runtimeCaching = require('next-pwa/cache')

const withPWA = require('next-pwa')({
  dest: 'public',
  sw: "sw.js",
  // sw: 'service-worker.js',
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching,
  buildExcludes: [/middleware-manifest.json$/],
})

module.exports = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  experimental: { newNextLinkBehavior: false },
});
