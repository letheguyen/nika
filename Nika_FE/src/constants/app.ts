export const ROLES = {
  user: 'user',
  admin: 'admin',
}

export const imageMaxSize = 10485760 as const
export const maxFileUpload = 10 as const

export const typeImageNftAllowed = [
  'image/png',
  'image/gif',
  'image/jpeg',
  'image/jpg',
]

export enum TypeCheckFile {
  'required',
  'allowed-type',
  'allowed-size',
}