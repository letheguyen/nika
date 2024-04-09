import Cookies from 'js-cookie'
import axios, { AxiosError, AxiosResponse } from 'axios'

import { logOut } from '@/utils'
import { APP_PATHS } from '@/constants'
import { appStore } from '@/stores/app'
import { STATUS_CODE } from '@/constants/errorMessage'
import { isNil } from 'lodash'

export const getTokensFromCookies = () => {
  const key = process.env.NEXT_PUBLIC_COOKIE_TOKEN_KEY
  return Cookies.get(key ?? '')
}

export const getUserDataFromCookies = () => {
  const key = process.env.NEXT_PUBLIC_COOKIE_USER_KEY
  return Cookies.get(key ?? '')
}

export const https = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

https.interceptors.request.use((config) => {
  const token = getTokensFromCookies()
  config.headers.Authorization = token ?? ''
  appStore.getState().setLoading(true)
  return config
})

https.interceptors.response.use(
  (response) => onSuccess(response),
  (error) => onError(error)
)

const onSuccess = (response: AxiosResponse<any, any>) => {
  appStore.getState().setLoading(false)
  return {
    isSuccess: true,
    data: response.data,
    status: response.status,
  } as any
}

const onError = (error: AxiosError) => {
  appStore.getState().setLoading(false)

  const defaultError = {
    status: 505,
    data: undefined,
    isSuccess: false,
  }

  if (isNil(error)) return defaultError
  if (isNil(error.response)) return defaultError

  switch (error.response.status) {
    case STATUS_CODE.UNAUTHORIZED:
      logOut()
      window.location.replace(APP_PATHS.shop)
      break

    case STATUS_CODE.FORBIDDEN:
      window.location.replace(APP_PATHS.shop)
      break

    default:
      return defaultError
  }
}

// Do not handle loading when calling
export const fetch = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

fetch.interceptors.request.use((config) => {
  config.headers.Authorization = getTokensFromCookies() ?? ''
  return config
})

fetch.interceptors.response.use(
  (response) => {
    return {
      isSuccess: true,
      data: response.data,
      status: response.status,
    } as any
  },
  (error) => ({
    data: undefined,
    isSuccess: false,
  })
)
