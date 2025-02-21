import type { AppProps } from 'next/app'

import type { FC } from 'react'
import { PolkadotApiProvider } from '@crypto-dex-sdk/polkadot'
import { parachains } from '@crypto-dex-sdk/polkadot-config'
import { LanguageProvider, storage, storageMiddleware } from '@crypto-dex-sdk/shared'
import { App, ToastContainer } from '@crypto-dex-sdk/ui'
import { config } from '@crypto-dex-sdk/wagmi'
import { configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Analytics } from '@vercel/analytics/react'
import { Header } from 'components'
import { SUPPORTED_CHAIN_IDS } from 'config'
import { DefaultSeo } from 'next-seo'
import { ThemeProvider } from 'next-themes'
import { Provider } from 'react-redux'
import { WagmiProvider } from 'wagmi'
import SEO from '../next-seo.config.mjs'
import '@crypto-dex-sdk/ui/index.css'

const store = configureStore({
  reducer: {
    [storage.reducerPath]: storage.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(storageMiddleware),
})

declare global {
  interface Window {
    dataLayer: Record<string, any>[]
  }
}

const queryClient = new QueryClient()

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <PolkadotApiProvider chains={parachains}>
            <Provider store={store}>
              <LanguageProvider>
                <ThemeProvider attribute="class" disableTransitionOnChange enableSystem={false}>
                  <App.Shell>
                    <DefaultSeo {...SEO} />
                    <Header />
                    <Component {...pageProps} chainIds={SUPPORTED_CHAIN_IDS} />
                    <App.Footer />
                    <ToastContainer className="mt-[50px]" />
                  </App.Shell>
                  {/* <div className="z-[-1] bg-gradient-radial fixed inset-0 bg-scroll bg-clip-border transform pointer-events-none" /> */}
                </ThemeProvider>
              </LanguageProvider>
            </Provider>
          </PolkadotApiProvider>
        </QueryClientProvider>
      </WagmiProvider>
      <Analytics />
    </>
  )
}

export default MyApp
