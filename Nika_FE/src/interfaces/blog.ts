import { IOwnerData } from "./notification"

export interface IBLogsData {
  _id: string
  images: string[]
  owner:  IOwnerData
  createdAt:  string
  updatedAt: string
  description: string
}
