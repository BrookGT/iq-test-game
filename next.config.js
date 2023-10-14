const path = require('path');
const fs = require('fs');
const { readApiUrl } = require('./lib/env');

const isDockerBuild = process.env.DOCKER_BUILD === '1' || process.env.CI === 'true';
const apiHost = (() => {
  try {
    return new URL(readApiUrl()).hostname;
  } catch (error) {
    return '127.0.0.1';
  }
})();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: isDockerBuild || process.env.NEXT_PUBLIC_SEO === 'true',
    domains: [apiHost, '127.0.0.1', 'localhost'],
  },
  devIndicators: {
    buildActivity: false,
  },
  transpilePackages: [
    'rc-util',
    '@ant-design',
    'kitchen-flow-editor',
    '@ant-design/pro-editor',
    'zustand',
    'leva',
    'antd',
    'rc-pagination',
    'rc-picker',
  ],
  trailingSlash: true,
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer && !isDockerBuild) {
      require('./scripts/sitemap-generator');
    }
    return config;
  },
  async exportPathMap(defaultPathMap, { dir, outDir }) {
    if (dir && outDir && fs.existsSync(path.join(dir, '.htaccess'))) {
      fs.copyFileSync(path.join(dir, '.htaccess'), path.join(outDir, '.htaccess'));
    }
    return defaultPathMap;
  },
};

if (!isDockerBuild && process.env.NEXT_PUBLIC_SEO === 'false') {
  nextConfig.output = 'export';
  nextConfig.images.unoptimized = true;
}

module.exports = nextConfig;
