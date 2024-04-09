'use client'

import React, { memo } from 'react'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import ReCAPTCHA from 'react-google-recaptcha'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup.js'

import { https } from '@/services'
import { schemaAuth } from '@/schema'
import { appStore } from '@/stores/app'
import { API_URLS, MODAL_KEYS } from '@/constants'
import { formatMessageError, login } from '@/utils'
import { HttpsResponse, IDataAuth } from '@/interfaces'
import { ERROR_MESSAGE } from '@/constants/errorMessage'

const SignUp = () => {
  const { showModal, closeModal } = appStore()
  const reCaptchaRef = React.useRef<any>(null)

  const {
    register,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<IDataAuth>({
    resolver: yupResolver(schemaAuth),
  })

  const signUpSuccess = () => {
    closeModal()
    toast.success('Đăng ký thành công !')
  }

  const submitEvent = async (dataForm: IDataAuth) => {
    const { data, isSuccess, status } = (await https.post(
      API_URLS.signup,
      dataForm
    )) as HttpsResponse<any>

    reCaptchaRef.current.reset()
    
    if (data && isSuccess) return login(data, signUpSuccess)
    if (ERROR_MESSAGE[status]) {
      const message = formatMessageError(ERROR_MESSAGE[status], 'User')
      setError('email', { message })
    }
  }

  const showModalSignIn = () => {
    showModal({
      modalKey: MODAL_KEYS.signIn,
    })
  }

  const onChangeCapcha = (token: any) => {
    setValue('token', token)
    clearErrors('token')
  }

  return (
    <div className="w-96 max-sm:w-full pb-6">
      <h2 className="text-lg uppercase text-center font-bold opacity-95">
        Đăng ký
      </h2>

      <form
        className="w-full auth-form flex flex-col justify-center items-center gap-2"
        onSubmit={handleSubmit(submitEvent)}
      >
        <div className="relative mt-4 flex flex-col justify-center items-center">
          <label htmlFor="email" className="flex mr-auto">
            Email
            <span className="text-red-600 block ml-1">*</span>
          </label>

          <input
            type="text"
            id="email"
            {...register('email')}
            placeholder="Nhập email của bạn..."
            className="border p-2.5 font-light outline-none rounded-lg min-w-72 max-sm:w-full max-sm:min-w-0"
          />
          <span className="text-red-600 mr-auto">{errors.email?.message}</span>
        </div>

        <div className="relative mt-4 flex flex-col justify-center items-center">
          <label htmlFor="password" className="flex mr-auto">
            Mật khẩu
            <span className="text-red-600 block ml-1">*</span>
          </label>

          <input
            id="password"
            type="password"
            {...register('password')}
            placeholder="Nhập mật khẩu của bạn..."
            className="border p-2.5 font-light outline-none rounded-lg min-w-72 max-sm:w-full max-sm:min-w-0"
          />
          <span className="text-red-600 mr-auto">
            {errors.password?.message}
          </span>
        </div>

        <div className="mt-4 flex flex-col justify-center items-center">
          <ReCAPTCHA
            className="w-full"
            ref={reCaptchaRef}
            onChange={onChangeCapcha}
            sitekey={process.env.NEXT_PUBLIC_CAPCHA_SITE_KEY || ''}
          />
          <span className="text-red-600 mr-auto">{errors.token?.message}</span>
        </div>

        <div className="flex gap-5 justify-center items-center mt-4">
          <button className="rounded-lg border bg-pink-600 text-white px-5 py-1.5 leading-8 animation-btn">
            Đăng ký
          </button>
        </div>

        <span className="text-black/20 mt-4">
          Bạn đã có tài khoản ?{' '}
          <span
            onClick={showModalSignIn}
            className="cursor-pointer text-blue-500 hover:text-blue-700"
          >
            Đăng nhập ngay
          </span>
        </span>
      </form>
    </div>
  )
}

export default memo(SignUp)
