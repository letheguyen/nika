import { IOwnerData } from "./notification"

export interface IBLogsData {
  _id: string
  images: string[]
  ownerId:  IOwnerData
  createdAt:  string
  updatedAt: string
  description: string
}
