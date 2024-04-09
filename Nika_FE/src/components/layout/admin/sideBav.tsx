'use client'

import clsx from 'clsx'
import Link from 'next/link'
import Image from 'next/image'
import { isNil } from 'lodash'
import React, { memo } from 'react'
import { usePathname } from 'next/navigation'

import { userStore } from '@/stores/user'
import { ADMIN_PATHS, APP_PATHS } from '@/constants'
import CountNotification from '../../countNotification'

const SideBav = () => {
  const { user } = userStore()
  const pathName = usePathname()
  if (isNil(user)) return
  const { email, avatarUrl } = user
  const newAvatarUrl = avatarUrl ? avatarUrl : '/images/defaultAvatar.png'

  const dataMenu = [
    {
      name: 'Thống kê',
      path: ADMIN_PATHS.dashboard,
    },
    {
      name: 'Sản phẩm',
      path: ADMIN_PATHS.item,
    },
    {
      name: 'Đơn hàng',
      path: ADMIN_PATHS.order,
    },
    {
      name: 'Bài viết',
      path: ADMIN_PATHS.blog,
    },
    {
      name: 'Thông báo',
      path: ADMIN_PATHS.feedback,
      children: <CountNotification />,
    },
  ]

  return (
    <div className="px-5 flex flex-col gap-6 py-10 h-screen shadow-md sticky top-0">
       <Link
        href={APP_PATHS.shop}
        className="hover:scale-105 transition-all hover:rotate-3 flex justify-center items-center cursor-pointer"
      >
        <Image
          className="object-contain w-28 h-auto rounded-xl"
          src="/images/logo.png"
          alt="LOGO"
          width="150"
          height="180"
        />
      </Link>

      <div className="flex gap-2 justify-center items-center cursor-pointer">
        <Image
          className="w-10 h-10"
          src={newAvatarUrl}
          alt="AVT"
          width="40"
          height="40"
        />
        <p className="text-lg">{email}</p>
      </div>

      <ul className="flex flex-col justify-center items-center gap-2">
        {dataMenu.map((data) => (
          <li key={data.path} className='hover:bg-slate-100 w-full flex justify-center'>
            <Link
              href={data.path}
              className={clsx(
                pathName === data.path
                  ? 'text-pink-600 font-bold drop-shadow-md opacity-100'
                  : '',
                'opacity-75 text-lg px-4 py-3 flex'
              )}
            >
              {data.name}
              {data.children}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default memo(SideBav)
