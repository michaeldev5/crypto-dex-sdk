import '@crypto-dex-sdk/ui/index.css'

import { App, ToastContainer } from '@crypto-dex-sdk/ui'
import { config } from '@crypto-dex-sdk/wagmi'
import type { AppProps } from 'next/app'
import type { FC } from 'react'
import { configureStore } from '@reduxjs/toolkit'
import { ThemeProvider } from 'next-themes'
import { PolkadotApiProvider } from '@crypto-dex-sdk/polkadot'
import { parachains } from '@crypto-dex-sdk/polkadot-config'
import { DefaultSeo } from 'next-seo'
import { Header } from 'components'
import { LanguageProvider, storage, storageMiddleware } from '@crypto-dex-sdk/shared'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Analytics } from '@vercel/analytics/react'
import { SUPPORTED_CHAIN_IDS } from 'config'
import { Provider } from 'react-redux'

import { WagmiProvider } from 'wagmi'
import SEO from '../next-seo.config.mjs'
import '@zenlink-interface/ui/index.css'

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
