import React, { memo } from 'react'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup.js'

import { https } from '@/services'
import { appStore } from '@/stores/app'
import { schemaCreateBlog } from '@/schema'
import { socketStore } from '@/stores/socket'
import PreviewImages from '@/components/previewImages'
import { HttpsResponse, IFormCreateBlog } from '@/interfaces'
import { uploadMultipleFile, uploadSingleFile } from '@/utils'
import { API_URLS, MODAL_KEYS, SOCKET_KEYS, typeImageNftAllowed } from '@/constants'

const CreateBlog = () => {
  const { closeModal, modalEvent } = appStore()
  const { emitEvent } = socketStore()

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormCreateBlog>({
    resolver: yupResolver(schemaCreateBlog),
  })

  const submitEvent = async (formData: IFormCreateBlog) => {
    const { files, description } = formData
    // const urls = await uploadMultipleFile(files)
    const images = [
      'https://relipashop.s3.ap-southeast-1.amazonaws.com/blogs/ada95022-2c4e-44a0-b640-bcc51cd3d914',
      'https://relipashop.s3.ap-southeast-1.amazonaws.com/blogs/2cff3d6e-beaa-434c-a0f9-1d8aeb1b2769',
    ]

    const { data, isSuccess } = (await https.post(API_URLS.createBlog, {
      description,
      images,
    })) as HttpsResponse<any>

    if (data && isSuccess) {
      closeModal()
      modalEvent?.()
      toast.success('Tạo mới blog thành công !')
    } else {
      toast.error('Có lỗi xảy ra !')
    }
  }

  const files = watch('files')

  return (
    <div className="min-w-[1100px] max-w-[1100px]">
      <h2 className="text-lg uppercase text-center font-bold opacity-95">
        Tạo mới bài viết
      </h2>

      <form
        onSubmit={handleSubmit(submitEvent)}
        className="max-h-[85vh] overflow-y-auto"
      >
        <div className="mt-4 flex flex-col justify-center items-center">
          <label htmlFor="email" className="flex mr-auto">
            Nội Dung bài viết
            <span className="text-red-600 block ml-1">*</span>
          </label>

          <textarea
            rows={5}
            id="email"
            {...register('description')}
            placeholder="Nhập nội dung bài viết của bạn..."
            className="border px-3 py-0.5 leading-6 font-light outline-none rounded-lg w-full max-sm:w-full max-sm:min-w-0"
          />

          <span className="text-red-600 mr-auto">
            {errors.description?.message}
          </span>
        </div>

        <div className="mt-4 flex flex-col justify-center items-center">
          <label htmlFor="file" className="flex mr-auto">
            Hình ảnh
            <span className="text-red-600 block ml-1">*</span>
          </label>

          <input
            id="file"
            type="file"
            multiple
            className="mr-auto"
            {...register('files')}
            accept={typeImageNftAllowed.join(',')}
          />
          <span className="text-red-600 mr-auto">{errors.files?.message}</span>
        </div>

        <PreviewImages files={files} />

        <button
          type="submit"
          className="border rounded-md min-w-24 mt-5 animation-btn py-2 opacity-90 hover:opacity-100 bg-black text-pink-400 font-bold"
        >
          Tạo
        </button>
      </form>
    </div>
  )
}

export default memo(CreateBlog)
