export interface IDataAuth {
  email: string
  password: string
  token?: string
}

export interface ILoginData {
  accessToken: string
  user: IUserData
}

export interface IUserData {
  userId: string
  email: string
  role: number
  nonce: number
  avatarUrl?: string
}
