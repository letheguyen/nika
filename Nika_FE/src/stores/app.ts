import { create } from 'zustand'

import { ValueOf } from '@/interfaces'
import { MODAL_KEYS } from '@/constants'

interface IModalData {
  modalData?: any
  modalEvent?: () => void
  isShowModal?: boolean
  modalKey?: ValueOf<typeof MODAL_KEYS>
}

interface IModalConfirmData {
  title: string
  descriptions?: string
  okEvent?: () => void
}

interface IAppStore extends IModalData {
  isLoading: boolean
  closeModal: () => void
  dataModalConfirm?: IModalConfirmData
  showModal: (data: IModalData) => void
  setLoading: (isLoading: boolean) => void
  showModalConfirm: (data: IModalConfirmData) => void
}

export const appStore = create<IAppStore>()((set) => ({
  isLoading: false,
  isShowModal: false,
  modalKey: undefined,
  modalData: undefined,
  modalEvent: undefined,
  dataModalConfirm: undefined,

  showModalConfirm: (data) => {
    set(() => ({
      isShowModal: true,
      modalKey: MODAL_KEYS.confirm,
      dataModalConfirm: data,
    }))
  },

  setLoading: (isLoading) => {
    isLoading
      ? set(() => ({ isLoading: isLoading }))
      : setTimeout(() => {
          set(() => ({ isLoading: isLoading }))
        }, 500)
  },

  showModal: (data) => {
    set(() => ({ ...data, isShowModal: true }))
  },

  closeModal: () => {
    set({
      isShowModal: false,
      modalKey: undefined,
      modalData: undefined,
      modalEvent: undefined,
      dataModalConfirm: undefined,
    })
  },
}))
