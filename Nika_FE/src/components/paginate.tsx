'use client'

import { isNil } from 'lodash'
import React, { memo, useState } from 'react'
import ReactPaginate from 'react-paginate'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

import { IPagination } from '@/interfaces'

interface PaginateProps {
  data?: IPagination
}

const Paginate: React.FC<PaginateProps> = ({ data }) => {
  if (isNil(data)) return
  if (data.totalPage <= 1) return
  
  const router = useRouter()
  const pathName = usePathname()
  const searchParams = useSearchParams()
  const [initialed, setInitialed] = useState(false)

  
  const changePage = (page: number) => {
    if (initialed) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('pageIndex', page.toString())
      router.push(pathName + '?' + params.toString())
    }
    setInitialed(true)
  }

  const pageIndex = searchParams.get('pageIndex') ?? 1

  return (
    <div>
      <ReactPaginate
        nextLabel=">"
        breakLabel="..."
        previousLabel="<"
        pageRangeDisplayed={3}
        pageCount={data.totalPage}
        className="custom-paginate"
        renderOnZeroPageCount={null}
        initialPage={Number(pageIndex) -1}
        onPageChange={(page) => changePage(page.selected + 1)}
      />
    </div>
  )
}

export default memo(Paginate)
