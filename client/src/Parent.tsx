import React from 'react'
import { Outlet } from 'react-router-dom'

import Sidenav from './components/Sidenav'
import Header from './pages/admin/Header'

import Topnav from './components/Topnav'


interface HeaderData{
  title: string
  subtitle?: string
}

function Parent() {

  const [header, setHeader] = React.useState<HeaderData>({
    title: '',
    subtitle: ''
  })
  return (

    <div>

      {/* Role is Admin */}
      {/* <div className='h-screen md:flex'>  
        <Sidenav/>

        <div className='flex-1 w-full flex flex-col overflow-hidden'>
          <Header title={header.title} subtitle={header.subtitle} />
          <div className='md:flex-1 md:overflow-y-auto'>
            <Outlet context={{ setHeader }} />
          </div>
        </div>
      </div> */}


      {/* Role is User */}

      <div className='h-screen'>
        <Topnav/>
        <div className='md:flex-1 md:overflow-y-auto'>
          <Outlet/>
        </div>
      </div>

    </div>
  )
}

export default Parent