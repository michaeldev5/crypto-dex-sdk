import defaultNextConfig from '@crypto-dex-sdk/nextjs-config'

// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  ...defaultNextConfig,
  basePath: '/referrals',
  transpilePackages: [
    '@crypto-dex-sdk/redux-localstorage',
    '@crypto-dex-sdk/wagmi',
    '@crypto-dex-sdk/polkadot',
    '@crypto-dex-sdk/parachains-bifrost',
    '@crypto-dex-sdk/compat',
    '@crypto-dex-sdk/shared',
    '@crypto-dex-sdk/ui',
  ],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/referrals',
        permanent: true,
        basePath: false,
      },
    ]
  },
}

export default nextConfig
