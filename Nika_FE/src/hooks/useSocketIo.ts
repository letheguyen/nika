'use client'

import { isNil } from 'lodash'
import io, { Socket } from 'socket.io-client'
import { useCallback, useEffect, useState } from 'react'
import { DefaultEventsMap } from '@socket.io/component-emitter'

import { userStore } from '@/stores/user'
import { IUserData } from '@/interfaces'
import { socketStore } from '@/stores/socket'
import { globalEventName } from '@/constants/socket'
import { SOCKET_KEYS, keyActionSocket } from '@/constants'

export const useSocketIo = () => {
  const {
    actionKey,
    emitEvent,
    fetchBlog,
    fetchCountBlog,
    fetchNotification
  } = socketStore()
  const { user, accessToken } = userStore()
  const [socketClient, setSocketClient] =
    useState<Socket<DefaultEventsMap, DefaultEventsMap>>()

  const handleEmitEvent = useCallback(() => {
    if (isNil(socketClient)) return
    if (actionKey === keyActionSocket.clearEvent) return
    const { userId } = user as IUserData

    switch (actionKey) {
      case keyActionSocket.disconnect:
        socketClient.disconnect()
        break

      case keyActionSocket.createdNewBlog:
        socketClient.emit(globalEventName.blogEvent, { userId })
        break
    }

    emitEvent({ actionKey: SOCKET_KEYS.clearEvent })
  }, [actionKey, socketClient])

  const handleOnEvent = useCallback(() => {
    if (isNil(socketClient)) return

    socketClient.on(globalEventName.blogEvent, () => {
      fetchBlog?.()
      fetchCountBlog?.()
      fetchNotification?.()
    })
    
  }, [socketClient, fetchCountBlog, fetchBlog])

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SOCKET_URL
    if (user && accessToken) {
      setSocketClient(io(url + user.userId))
    }
    return () => {
      if (isNil(socketClient)) return
      socketClient.disconnect()
      setSocketClient(undefined)
    }
  }, [user, accessToken])

  useEffect(() => {
    handleEmitEvent()
  }, [handleEmitEvent])

  useEffect(() => {
    handleOnEvent()
  }, [handleOnEvent])
}
