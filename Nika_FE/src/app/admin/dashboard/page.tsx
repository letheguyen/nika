'use client'

import React, { memo } from 'react'

import { SOCKET_KEYS } from '@/constants'
import { socketStore } from '@/stores/socket'

const Dashboard = () => {
  const { emitEvent } = socketStore()

  const onDisconnectSocket = () => {
    emitEvent({
      actionKey: SOCKET_KEYS.disconnect,
    })
  }

  return <div onClick={onDisconnectSocket}>Dashboard 2</div>
}

export default memo(Dashboard)
