import * as yup from 'yup'

import { checkFile } from '@/utils'
import { imageMaxSize, maxFileUpload, typeImageNftAllowed } from '@/constants'

export const schemaCreateBlog = yup.object().shape({
  description: yup.string().trim().required('Nội dung không được để trống'),
  files: yup
    .mixed()
    .test('fileType', 'Không hỗ trợ loại tệp này', (value) => {
      return checkFile(value, 'allowed-type', undefined, typeImageNftAllowed)
    })
    .test('fileSize', 'Tệp không được vượt quá 10MB', (value) => {
      return checkFile(value, 'allowed-size', imageMaxSize)
    }
    )
    .test('MaxLength', 'Chỉ được upload tối đa 10 tệp', (value) => {
      const files = value as FileList
      return files.length < maxFileUpload || typeof value === 'string'
    }),
})
