import React from 'react'

import SignIn from '@/components/modals/signIn'

const Auth = () => {
  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <SignIn isAdminPage={true} />
    </div>
  )
}

export default Auth