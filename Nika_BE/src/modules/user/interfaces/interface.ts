import { Role, USER_STATUS } from "module/user/contants/constants"

export interface IUser {
  role: Role
  nonce: number
  email: string
  token?: string
  password?: string
  userName?: string
  avatarUrl?: string
  status: USER_STATUS
  isUpdatedPassword: boolean
}

export interface IUserData extends IUser {
  _id: string,
  createdAt: Date
}
