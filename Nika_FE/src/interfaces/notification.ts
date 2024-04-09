import { IPageData, ValueOf } from './app'

export const NotificationType = {
  blog: 'BLOG',
} as const

export const NotificationStatus = {
  totSeen: 'NotSeen',
  Watched: 'Watched',
} as const

export interface IOwnerData {
  _id: string
  email: string
  userName: string
  avatarUrl: string
}

export interface INotificationData {
  _id: string
  to: string
  content: string
  isGlobal: boolean
  owner: IOwnerData
  type: ValueOf<typeof NotificationType>
  status: ValueOf<typeof NotificationStatus>
  createdAt: string
  updatedAt: string
  hrefId: string
  __v: 0
}

export interface INotificationResponse extends IPageData<INotificationData[]> {
  notificationsWatched: {[notificationId: string]: string}
}
