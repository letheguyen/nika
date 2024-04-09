import { Role } from "module/user/contants/constants";

export interface IUserStore {
  userId: string,
  role: Role
}

export interface ISocketBody {
  userId: string
}