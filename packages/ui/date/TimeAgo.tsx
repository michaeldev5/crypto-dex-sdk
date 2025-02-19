import { useInterval } from '@crypto-dex-sdk/hooks'
import type { FC } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { useState } from 'react'

export const TimeAgo: FC<{ date: Date }> = ({ date }) => {
  const [distance, setDistance] = useState<string>(formatDistanceToNow(date, { addSuffix: true, includeSeconds: true }))

  useInterval(() => {
    setDistance(formatDistanceToNow(date, { addSuffix: true, includeSeconds: true }))
  }, 1000)

  return <>{distance}</>
}
