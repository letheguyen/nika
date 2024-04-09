'use client'

import clsx from 'clsx'
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
  NotificationStatus,
} from '@/interfaces'
import Nodata from './nodata'
import Paginate from './paginate'
import { https } from '@/services'
import { API_URLS, USER_PATHS } from '@/constants'

const Notification = () => {
  const searchParams = useSearchParams()
  const [pagination, setPagination] = useState<IPagination>()
  const { setSocketEvent, fetchCountNotification } = socketStore()
  const [dataNotification, setDataNotification] = useState<INotificationData[]>()
  const [watchedData, setWatchedData] = useState<{[notificationId: string]: string}>({})
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
        pageSize: 3,
      },
    })) as HttpsResponse<INotificationResponse>

    if (isSuccess) {
      setPagination(data)
      setDataNotification(data.data)
      setWatchedData(data.notificationsWatched)
    }
  }, [pageIndex])

  const viewAll = useCallback(async () => {
    ;(await https.put(API_URLS.notification)) as HttpsResponse<any>
    getNotifications()
    fetchCountNotification?.()
  }, [fetchCountNotification, getNotifications])

  useEffect(() => {
    getNotifications()
    setSocketEvent({ fetchNotification: getNotifications })
  }, [getNotifications])

  if (isNil(dataNotification) || isEmpty(dataNotification)) return <Nodata />

  return (
    <div className="max-w-7xl w-full py-3 flex flex-col gap-3">
      {dataNotification.map((notification) => (
        <Link
          href={ NOTIFICATION_HREF[notification.type] + '/' + notification.hrefId}
          className={clsx(
            'block pb-1 border-b hover:bg-slate-200 p-3',
            watchedData[notification._id] ? 'opacity-45' : '',
          )}
          key={notification._id}
        >
          <p className="font-bold">{NOTIFICATION_TITLE[notification.type]}</p>
          <p className="w-full resize-none bg-transparent text-sm h-10 outline-none select-none line-clamp-2 overflow-hidden">
            {notification.content}
          </p>
        </Link>
      ))}

      <div className="flex text-center py-2 mt-3">
        <div
          onClick={viewAll}
          className="flex gap-3 justify-center items-center  hover:bg-slate-100 px-4 py-2 opacity-70 hover:opacity-100"
        >
          <label className="hover:cursor-pointer" htmlFor="check">
            Đánh dấu đã đọc tất cả
          </label>
        </div>
      </div>

      <Paginate data={pagination} />
    </div>
  )
}

export default memo(Notification)
