import type { ButtonProps } from '@crypto-dex-sdk/ui'
import type { ReactNode } from 'react'

export interface CheckerButton extends ButtonProps<'button'> {
  children: ReactNode
}
