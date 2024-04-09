'use client'

import React, { memo } from 'react'

import { appStore } from '@/stores/app'

const Confirm = () => {
  const { dataModalConfirm, closeModal } = appStore()

  return (
    <div className="px-6">
      <h2 className="text-lg uppercase text-center font-bold opacity-95 ">
        {dataModalConfirm?.title}
      </h2>

      <div className="opacity-85">
        Hành động này sẽ xóa vĩnh viến bài viết
      </div>

      <div className="flex justify-center items-center gap-5 mt-10">
        <button
          onClick={closeModal}
          className="border rounded-md min-w-24 animation-btn py-2 opacity-90 hover:opacity-100 bg-black text-pink-400 font-bold"
        >
          Hủy bỏ
        </button>
        <button
          onClick={() => dataModalConfirm?.okEvent?.()}
          className="border rounded-md min-w-24 animation-btn py-2 opacity-90 hover:opacity-100 bg-red-600 text-white"
        >
          Đồng ý
        </button>
      </div>
    </div>
  )
}

export default memo(Confirm)
