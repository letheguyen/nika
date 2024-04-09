import { memo } from 'react'

import SideBav from '@/components/layout/admin/sideBav'

const AdminLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className='flex gap-6 pr-3'>
      <SideBav />
      <div className="flex-1">{children}</div>
    </div>
  )
}

export default memo(AdminLayout)
