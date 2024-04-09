'use client'

import React, { memo } from 'react'

import Notification from '@/components/notification'

const Feedback = () => {
  return <div>
    <p className="text-xl font-bold min-w-32 mt-10">Danh sách thông báo</p>
    <Notification />
  </div>
  
}

export default memo(Feedback)
