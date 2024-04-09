'use client'

import { MODAL_KEYS } from '@/constants'
import { appStore } from '@/stores/app'

export default function Home() {
  const { showModal } = appStore()

  const onShowModal = () => {
    showModal({
      modalKey: MODAL_KEYS.signIn
    })
  }

  return (
    <main className="cursor-pointer" onClick={onShowModal}>
      HELOO SHOP
    </main>
  )
}
