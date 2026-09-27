import React from 'react'
import { Outlet } from 'react-router-dom'

function User() {

  return (
    <div className='min-h-screen relative'>

      <div className='absolute inset-0 bg-[url("/bg-img.png")] bg-cover bg-center bg-no-repeat opacity-7 z-0' />

      <div className='z-10 relative py-4 px-8 lg:py-12 lg:px-24 xl:px-24 flex w-full min-h-screen justify-center items-center'>

        <div className='w-full max-w-280 grid md:grid-cols-2 gap-4 overflow-hidden bg-white shadow-md/20'>

          <div className='w-full hidden md:flex'>
            <img 
              src="/poster.png" 
              alt="Poster Image" 
            />
          </div>

          <div className='flex justify-center items-center p-8 md:py-12'>
            <Outlet/>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default User