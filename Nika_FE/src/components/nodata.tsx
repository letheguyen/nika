import Image from 'next/image'
import React, { memo } from 'react'

interface NoDataProps {
  isShow?: boolean
}

const Nodata: React.FC<NoDataProps> = ({ isShow = true }) => {
  if (isShow) {
    return (
      <div className="px-3 py-5 w-full min-h-96 flex flex-col justify-center items-center">
        <Image
          width="340"
          height="340"
          alt="NO_DATA"
          src="/images/no-data.png"
        />
        <p className="opacity-40">Không có dữ liệu</p>
      </div>
    )
  }
}

export default memo(Nodata)
