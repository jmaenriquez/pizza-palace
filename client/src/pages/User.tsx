import React from 'react'
import { LuArrowLeft } from 'react-icons/lu'
import { Outlet, useNavigate } from 'react-router-dom'

function User() {

  const nav = useNavigate();

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

          <div className='relative flex flex-col justify-center items-center p-8 md:py-12'>
            <div className='absolute right-2.5 md:right-4 top-2.5 md:top-4'>
              <button
                      type="button"
                      onClick={() => nav("/")}
                      className="mb-6 flex items-center gap-2 text-xs md:text-sm font-medium text-primary hover:cursor-pointer transition-all hover:gap-3"
                    >
                      <LuArrowLeft />
                      <p className=''>Back to Menu</p>
                    </button>
            </div>
            <Outlet/>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default User