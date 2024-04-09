'use client'

import Image from 'next/image'
import { toast } from 'react-toastify'
import { isEmpty, isNil } from 'lodash'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'

import { https } from '@/services'
import { formatDate } from '@/utils'
import { appStore } from '@/stores/app'
import Nodata from '@/components/nodata'
import { socketStore } from '@/stores/socket'
import { API_URLS, MODAL_KEYS } from '@/constants'
import { HttpsResponse, IBLogsData, IPageData, IPagination } from '@/interfaces'
import Paginate from '@/components/paginate'
import { useSearchParams } from 'next/navigation'

const Blog = () => {
  const searchParams = useSearchParams()
  const { setSocketEvent } = socketStore()
  const [blogsData, setBlogsData] = useState<IBLogsData[]>()
  const [pagination, setPagination] = useState<IPagination>()
  const { showModal, showModalConfirm, closeModal } = appStore()
  
  const pageIndex = searchParams.get('pageIndex') ?? 1

  const getDataBlog = useCallback(async () => {
    const { isSuccess, data } = (await https.get(API_URLS.getBlogs, {
      params: {
        pageIndex,
        pageSize: 30,
      },
    })) as HttpsResponse<IPageData<IBLogsData[]>>

    if (isSuccess) {
      setPagination(data)
      setBlogsData(data.data)
    }
  }, [pageIndex])

  const showModalCreate = () => {
    showModal({
      modalKey: MODAL_KEYS.createBlog,
      modalEvent: getDataBlog,
    })
  }

  const deleteBlog = async (id: string) => {
    const { isSuccess } = (await https.delete(
      API_URLS.blog + id
    )) as HttpsResponse<any>
    isSuccess ? toast.success('Xoá thành công') : toast.error('Có lỗi sảy ra')
    closeModal()
    getDataBlog()
  }

  const onEditBlog = (blogId: string) => {
    showModal({
      modalKey: MODAL_KEYS.editBlog,
      modalEvent: getDataBlog,
      modalData: {
        blogId,
      },
    })
  }

  const showModalConfirmDelete = (blogId: string) => {
    showModalConfirm({
      title: 'Xóa bài viết này',
      okEvent: () => deleteBlog(blogId),
    })
  }

  const tableBody = useMemo(() => {
    if (isNil(blogsData)) return
    if (isEmpty(blogsData)) return
    return blogsData.map((blog) => {
      return (
        <tr
          key={blog._id}
          className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
        >
          <th
            scope="row"
            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            {blog.owner.email ?? blog.owner.userName}
          </th>
          <td className="px-6 py-4 min-w-80">
            <textarea
              rows={4}
              onChange={() => {}}
              value={blog.description}
              className="w-full resize-none bg-transparent h-[70px] outline-none select-none line-clamp-3 overflow-hidden"
            ></textarea>
          </td>
          <td className="px-6 py-4">
            <div className="w-20 h-20 relative">
              <Image
                alt="IMG"
                width="200"
                height="200"
                src={blog.images[0]}
                className="object-cover absolute top-0 left-0 w-full h-full"
              />
            </div>
          </td>
          <td className="px-6 py-4">{formatDate(blog.createdAt)}</td>
          <td className="px-6 py-4">
            <div className="flex flex-col justify-center items-center gap-3">
              <button
                onClick={() => onEditBlog(blog._id)}
                className="border rounded-md min-w-24 animation-btn py-2 opacity-90 hover:opacity-100 bg-black text-pink-400 font-bold"
              >
                Cập nhật
              </button>
              <button
                onClick={() => showModalConfirmDelete(blog._id)}
                className="border rounded-md min-w-24 animation-btn py-2 opacity-90 hover:opacity-100 bg-red-600 text-white"
              >
                Xoá
              </button>
            </div>
          </td>
        </tr>
      )
    })
  }, [blogsData])

  useEffect(() => {
    getDataBlog()
    setSocketEvent({ fetchBlog: getDataBlog })
  }, [getDataBlog])

  return (
    <div className="my-6">
      <div className="flex gap-4 items-center justify-between mb-3">
        <p className="text-xl font-bold min-w-32">Danh sách bài viết</p>
        <button
          onClick={showModalCreate}
          className="border rounded-md min-w-24 animation-btn bg-[#008acff7] py-2 text-white font-bold"
        >
          Tạo mới
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg border">
        <table className="w-full text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 text-sm">
                Người tạo
              </th>
              <th scope="col" className="px-6 py-3 text-sm">
                Nội dung
              </th>
              <th scope="col" className="px-6 py-3 text-sm">
                Hình ảnh
              </th>
              <th scope="col" className="px-6 py-3 text-sm">
                Thời gian
              </th>
              <th scope="col" className="px-6 py-3 text-sm">
                Thêm
              </th>
            </tr>
          </thead>
          <tbody>{tableBody}</tbody>
        </table>

        <Nodata isShow={isNil(tableBody)} />
      </div>

      <Paginate data={pagination} />
    </div>
  )
}

export default memo(Blog)
