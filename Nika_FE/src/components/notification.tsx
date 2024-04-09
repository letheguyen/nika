'use client'

import Link from 'next/link'
import { isEmpty, isNil } from 'lodash'
import { socketStore } from '@/stores/socket'
import { useSearchParams } from 'next/navigation'
import React, { memo, useCallback, useEffect, useState } from 'react'

import {
  IPagination,
  HttpsResponse,
  NotificationType,
  INotificationData,
  INotificationResponse,
} from '@/interfaces'
import Nodata from './nodata'
import Paginate from './paginate'
import { https } from '@/services'
import { API_URLS, USER_PATHS } from '@/constants'

const Notification = () => {
  const searchParams = useSearchParams()
  const { setSocketEvent } = socketStore()
  const [pagination, setPagination] = useState<IPagination>()
  const [dataNotification, setDataNotification] = useState<INotificationData[]>()
  const pageIndex = searchParams.get('pageIndex') ?? 1

  const NOTIFICATION_TITLE = {
    [NotificationType.blog]: 'Hệ thống đã thêm 1 bài viết',
  }

  const NOTIFICATION_HREF = {
    [NotificationType.blog]: USER_PATHS.blogs,
  }

  const getNotifications = useCallback(async () => {
    const { isSuccess, data } = (await https.get(API_URLS.notification, {
      params: {
        pageIndex,
        pageSize: 30,
      },
    })) as HttpsResponse<INotificationResponse>

    if (isSuccess) {
      setDataNotification(data.data)
      setPagination(data)
    }
  }, [pageIndex])

  useEffect(() => {
    getNotifications()
    setSocketEvent({ fetchNotification: getNotifications })
  }, [getNotifications])

  if (isNil(dataNotification) || isEmpty(dataNotification)) {
    return <Nodata />
  }

  return (
    <div className="max-w-7xl w-full py-3 flex flex-col gap-3">
      {dataNotification.map((notification) => (
        <Link
          href={
            NOTIFICATION_HREF[notification.type] + '/' + notification.hrefId
          }
          className="block pb-1 border-b hover:bg-slate-200 p-3"
          key={notification._id}
        >
          <p className="font-bold">{NOTIFICATION_TITLE[notification.type]}</p>
          <p className="w-full resize-none bg-transparent text-sm h-10 outline-none select-none line-clamp-2 overflow-hidden">
            {notification.content}
          </p>
        </Link>
      ))}

      <Paginate data={pagination} />
    </div>
  )
}

export default memo(Notification)
