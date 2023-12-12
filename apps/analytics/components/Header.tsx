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
          <App.NavItem href="https://app.zenlink.pro/referrals" label="Referrals" />
        </>
      )}
      withScrollBackground={true}
    >
      <AppSettings />
    </App.Header>
  )
}
