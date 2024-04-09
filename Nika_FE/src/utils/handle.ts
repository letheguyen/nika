import { isNil } from 'lodash'
import Cookies from 'js-cookie'

import { https } from '@/services'
import { ILoginData } from '@/interfaces'
import { userStore } from '@/stores/user'
import { API_URLS, typeImageNftAllowed } from '@/constants'

export const login = (userData: ILoginData, callBack?: (data: any) => void) => {
  const { accessToken, user } = userData
  const tokenKey = process.env.NEXT_PUBLIC_COOKIE_TOKEN_KEY || ''
  const userDataKey = process.env.NEXT_PUBLIC_COOKIE_USER_KEY || ''

  Cookies.set(tokenKey, accessToken, { expires: 4 })
  userStore.getState().setUserData(userData)
  Cookies.set(userDataKey, JSON.stringify(user), { expires: 4 })

  callBack?.(user.role)
}

export const logOut = () => {
  const tokenKey = process.env.NEXT_PUBLIC_COOKIE_TOKEN_KEY || ''
  const userDataKey = process.env.NEXT_PUBLIC_COOKIE_USER_KEY || ''
  Cookies.remove(tokenKey)
  Cookies.remove(userDataKey)
  userStore.getState().logout()
}

export const checkFile = (
  files: FileList | any,
  type: 'required' | 'allowed-type' | 'allowed-size',
  maxSize = 10 * 1024 * 1024,
  arrayType = typeImageNftAllowed
) => {
  if (typeof files[0] === 'string') return true
  if (isNil(files)) return false
  
  const arrayFile: File[] = Object.keys(files).map((file) => files[file])

  switch (type) {
    case 'required':
      return files.length > 0

    case 'allowed-size':
      if (files.length <= 0) return true
      return arrayFile.every((file) => file.size <= maxSize)

    case 'allowed-type':
      if (files.length <= 0) return true
      return arrayFile.every((file) => arrayType.includes(file.type))
  }
}

export const uploadMultipleFile = async (files: FileList) => {
  if (files) {
    const urls = await Promise.all(
      Object.keys(files).map(async (file) => {
        return await uploadSingleFile(files[file as any])
      })
    )
    return urls
  }
  return []
}

export const uploadSingleFile = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await https.post(API_URLS.uploadFile, formData, {
    headers: { 'Content-Type': 'unset' },
  })

  return data
}
