import defaultNextConfig from '@crypto-dex-sdk/nextjs-config'

// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  ...defaultNextConfig,
  basePath: '/market',
  transpilePackages: [
    '@crypto-dex-sdk/redux-token-lists',
    '@crypto-dex-sdk/redux-localstorage',
    '@crypto-dex-sdk/wagmi',
    '@crypto-dex-sdk/shared',
    '@crypto-dex-sdk/ui',
    '@crypto-dex-sdk/graph-client',
  ],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/market',
        permanent: true,
        basePath: false,
      },
    ]
  },
}

export default nextConfig
