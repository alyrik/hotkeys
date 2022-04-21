const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['hotkeys-gifs.s3.eu-central-1.amazonaws.com'],
  },
  sassOptions: {
    prependData: '@import "_index.scss";',
    includePaths: [path.join(__dirname, 'styles')],
  },
};

module.exports = nextConfig;
