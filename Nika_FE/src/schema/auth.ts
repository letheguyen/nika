import * as yup from 'yup'
import { REGEX } from '@/constants/regex'

export const schemaAuth = yup.object().shape({
  email: yup
    .string()
    .email('Địa chỉ email không hợp lệ')
    .nullable()
    .required('Vui lòng nhập địa chỉ email')
    .matches(REGEX.email, 'Email phải có đuôi @relipasoft.com'),
  password: yup
    .string()
    .trim()
    .nullable()
    .required('Không được bỏ trống password')
    .min(8, 'Password phải có ít nhất 8 ký tự'),
  token: yup
    .string()
    .trim()
    .required('Vui lòng xác thực bạn không phải là robot'),
})
