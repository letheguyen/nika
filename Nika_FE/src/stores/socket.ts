import { create } from 'zustand'

import { ValueOf } from '@/interfaces'
import { SOCKET_KEYS } from '@/constants'

interface ISocketStore extends IEventData {
  emitEvent: (data: IEventData) => void
  setSocketEvent: (data: Events) => void
}

interface IEventData extends Events {
  data?: any
  actionKey?: ValueOf<typeof SOCKET_KEYS>
}
interface Events {
  fetchBlog?: () => void
  fetchCountBlog?: () => void
  fetchNotification?: () => void
}

export const socketStore = create<ISocketStore>()((set) => ({
  data: undefined,

  fetchBlog: undefined,
  fetchCountBlog: undefined,
  fetchNotification: undefined,

  actionKey: undefined,
  emitEvent: (data) => {
    set(() => ({ ...data }))
  },

  setSocketEvent: (data) => {
    set(() => (data))
  }
}))
