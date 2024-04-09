import React from 'react'

const UserLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className='max-sm:px-3 px-6'>
      UserLayout
      {children}
    </div>
  )
}

export default UserLayout
