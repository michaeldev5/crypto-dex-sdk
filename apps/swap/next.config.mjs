import defaultNextConfig from '@crypto-dex-sdk/nextjs-config'

// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  ...defaultNextConfig,
  basePath: '/swap',
  async redirects() {
    return [
      {
        basePath: false,
        destination: '/swap',
        permanent: true,
        source: '/',
      },
    ]
  },
  transpilePackages: [
    '@crypto-dex-sdk/redux-token-lists',
    '@crypto-dex-sdk/redux-localstorage',
    '@crypto-dex-sdk/wagmi',
    '@crypto-dex-sdk/polkadot',
    '@crypto-dex-sdk/parachains-bifrost',
    '@crypto-dex-sdk/compat',
    '@crypto-dex-sdk/shared',
    '@crypto-dex-sdk/ui',
  ],
}

export default nextConfig
