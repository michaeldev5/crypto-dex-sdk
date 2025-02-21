import { useIsSmScreen } from '@crypto-dex-sdk/hooks'
import { Transition, TransitionChild } from '@headlessui/react'
import classNames from 'classnames'
import type { FC, ReactElement } from 'react'
import { Fragment } from 'react'
import ReactDOM from 'react-dom'

import { Dialog } from '../../dialog'
import { useSlideInContext } from './SlideIn'
import { useEscapeClose } from './useEscapeClose'

export interface FromLeftProps {
  show: boolean
  onClose: () => void
  afterEnter?: () => void
  beforeEnter?: () => void
  beforeLeave?: () => void
  afterLeave?: () => void
  children: ReactElement
  className?: string
}

export const FromLeft: FC<FromLeftProps> = ({
  show,
  beforeLeave,
  beforeEnter,
  afterEnter,
  afterLeave,
  onClose,
  children,
  className,
}) => {
  const isSmallScreen = useIsSmScreen()
  useEscapeClose(onClose)

  const portal = useSlideInContext()
  if (!portal)
    return <></>

  if (isSmallScreen) {
    return (
      <Dialog initialFocus={undefined} onClose={onClose} open={show} unmount={false}>
        <div className="!rounded-t-2xl overflow-hidden">{children}</div>
      </Dialog>
    )
  }

  return ReactDOM.createPortal(
    <Transition appear as={Fragment} show={show} unmount={false}>
      <div className={classNames(className, 'absolute left-0 top-0 bottom-0 w-full z-[50]')}>
        <TransitionChild unmount={false}>
          <div aria-hidden className="transition-opacity ease-in-out duration-500 data-[closed]:opacity-0 absolute inset-0 bg-black/70" onClick={onClose} />
        </TransitionChild>
        <TransitionChild
          afterEnter={afterEnter}
          afterLeave={afterLeave}
          as={Fragment}
          beforeEnter={beforeEnter}
          beforeLeave={beforeLeave}
          unmount={false}
        >
          <div className="transition ease-in-out duration-300 data-[closed]:-translate-x-full h-full">
            {children}
          </div>
        </TransitionChild>
      </div>
    </Transition>,
    portal,
  )
}
