'use client'

import clsx from 'clsx'
import React, { memo } from 'react'

import { LoadingIcon } from '@/icons'
import { appStore } from '@/stores/app'

const OverlayLoading = () => {
  const { isLoading } = appStore()

  return (
    <div
      className={clsx(
        'h-screen w-screen fixed left-0 top-0 flex items-center justify-center transition-all ease-linear',
        isLoading
          ? 'bg-overlay backdrop-blur-sm z-[999]'
          : 'bg-transparent opacity-0 pointer-events-none backdrop-blur-none'
      )}
    >
      {isLoading && (
        <LoadingIcon
          width="40px"
          height="40px"
          className={clsx('animate-spin text-fuchsia-800')}
        />
      )}
    </div>
  )
}

export default memo(OverlayLoading)
