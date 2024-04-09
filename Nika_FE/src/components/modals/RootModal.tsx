'use client'

import clsx from 'clsx'
import React, { memo, useCallback, useEffect, useRef } from 'react'

import SignIn from './signIn'
import SignUp from './signUp'
import Confirm from './confirm'
import EditBlog from './editBlog'
import { CloseIcon } from '@/icons'
import CreateBlog from './createBlog'
import { appStore } from '@/stores/app'
import { MODAL_KEYS } from '@/constants'
import { userStore } from '@/stores/user'
import { useSocketIo } from '@/hooks/useSocketIo'
import { useClickOutside } from '@/hooks/useClickOutSite'
import { getTokensFromCookies, getUserDataFromCookies } from '@/services'

const RootModal = () => {
  useSocketIo()
  const modalContent = useRef(null)
  const { setUserData } = userStore()
  const { isShowModal, modalKey, closeModal } = appStore()

  useClickOutside(modalContent, closeModal)

  const MODAL_CONTENTS = {
    [MODAL_KEYS.signIn]: <SignIn />,
    [MODAL_KEYS.signUp]: <SignUp />,
    [MODAL_KEYS.createBlog]: <CreateBlog />,
    [MODAL_KEYS.editBlog]: <EditBlog />,
    [MODAL_KEYS.confirm]: <Confirm />
  }

  const onLoaded = useCallback(() => {
    const [accessToken, user] = [
      getTokensFromCookies(),
      getUserDataFromCookies(),
    ]

    setUserData({
      accessToken: accessToken ?? '',
      user: user ? JSON.parse(user) : undefined,
    })
  }, [])

  useEffect(() => {
    onLoaded()
  }, [onLoaded])

  return (
    <div
      className={clsx(
        'h-screen w-screen fixed left-0 top-0 flex items-center justify-center transition-all ease-linear max-sm:items-start',
        isShowModal
          ? 'bg-overlay bg-black/10 opacity-100 backdrop-blur-sm z-[99]'
          : 'bg-transparent opacity-0 pointer-events-none backdrop-blur-none z-0'
      )}
    >
      {isShowModal && modalKey && (
        <div
          ref={modalContent}
          className="transition-all ease-linear p-3 max-sm:w-full"
        >
          <div className="border rounded-lg bg-white shadow-md p-3 pb-4">
            <CloseIcon
              width="42px"
              height="42px"
              onClick={closeModal}
              className="transition-all hover:text-pink-700 ease-linear ml-auto p-2.5 -mt-2 -mr-2 cursor-pointer hover:text-primary hover:rotate-90 hover:scale-110"
            />

            {MODAL_CONTENTS[modalKey]}
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(RootModal)
