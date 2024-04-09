'use client'

import { isNil } from 'lodash'
import React, { memo, useEffect, useState } from 'react'

import { fetch } from '@/services'
import { API_URLS } from '@/constants'
import { socketStore } from '@/stores/socket'

const CountNotification = () => {
  const [count, setCount] = useState(0)
  const { setSocketEvent } = socketStore()

  const getTotalNotification = async () => {
    const response = await fetch.get(API_URLS.countNotification)
    if (isNil(response.data)) return
    setCount(response.data)
  }

  useEffect(() => {
    getTotalNotification()
    setSocketEvent({fetchCountBlog: getTotalNotification})
  }, [])

  if (count) {
    return (
      <span className="relative flex h-[28px] w-[28px] -mt-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
        <span className="relative rounded-full h-[28px] w-[28px] bg-sky-500 text-center block text-xs text-white leading-[28px]">
          {count}
        </span>
      </span>
    )
  }
}

export default memo(CountNotification)
