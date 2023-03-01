/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: function (config, options) {
    config.experiments = { asyncWebAssembly: true, topLevelAwait: true };
    return config;
  },
  basePath: '/example-next',
}

module.exports = nextConfig
