export type ValueOf<T> = T[keyof T]

export interface HttpsResponse<T> {
  data: T
  status: number
  isSuccess: boolean
}

export interface IPageData<T> extends IPagination {
  data: T
}

export interface IPagination {
  page: 1
  totalItem: 2
  totalPage: 1
}

