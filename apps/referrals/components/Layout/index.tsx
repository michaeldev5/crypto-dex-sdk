import type { BreadcrumbLink, MaxWidth } from '@crypto-dex-sdk/ui'
import { Backdrop, Breadcrumb, classNames, Container } from '@crypto-dex-sdk/ui'
import React from 'react'

interface Props {
  children?: React.ReactNode
  maxWidth?: MaxWidth
  backdrop?: React.ReactNode
  className?: string
  breadcrumbs?: BreadcrumbLink[]
}

export function Layout({ children, maxWidth = '5xl', backdrop, className, breadcrumbs }: Props) {
  return (
    <Container className={classNames(className, 'lg:mx-auto px-4 h-full')} maxWidth={maxWidth}>
      {breadcrumbs && <Breadcrumb home="/" links={breadcrumbs} />}
      <div className="pb-4 mt-10 mb-4 lg:mb-40 lg:mt-20">
        <Backdrop backdrop={backdrop}>{children}</Backdrop>
      </div>
    </Container>
  )
}
