import { AppSettings } from '@crypto-dex-sdk/compat'
import { App, AppType } from '@crypto-dex-sdk/ui'
import React from 'react'

export function Header() {
  return (
    <App.Header
      apptype={AppType.Analytics}
      maxWidth="6xl"
      nav={(
        <>
          <App.NavItem href="https://app.zenlink.pro/swap" label="Swap" />
          <App.NavItem href="https://app.zenlink.pro/pool" label="Pools" />
          <div className="relative">
            <span className="absolute -top-[12px] right-0">🔥</span>
            <App.NavItem href="https://app.zenlink.pro/market" label="Eden" />
          </div>
          <div className="relative">
            <span className="absolute -top-[12px] right-0">🔥</span>
            <App.NavItem href="https://app.zenlink.pro/gauge" label="Gauge" />
          </div>
        </>
      )}
      withScrollBackground={true}
    >
      <AppSettings />
    </App.Header>
  )
}
