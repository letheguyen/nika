import { create } from 'zustand'
import { ILoginData, IUserData } from '@/interfaces'

interface IUserStore {
  user?: IUserData
  logout: () => void
  accessToken?: string
  setUserData: (data: ILoginData) => void
}

export const userStore = create<IUserStore>()((set) => ({
  user: undefined,
  accessToken: undefined,

  setUserData(data) {
    set({ ...data })
  },

  logout() {
    set({ accessToken: undefined, user: undefined })
  },
}))
