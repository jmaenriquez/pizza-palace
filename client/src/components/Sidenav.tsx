import { useState } from 'react';
import { NavLink } from 'react-router-dom'
import type { IconType } from 'react-icons'
import { LuLayoutDashboard, LuMenu, LuNotepadText, LuSettings, LuUsers, LuUtensils } from 'react-icons/lu'

interface Links{
  to: string,
  name: string
  icon: IconType
  key: string
}

function Sidenav() {

  const [isMobileMenu, setIsMobileMenu] = useState(false);

  const link: Links[] = [
    { to: '/', name: 'Dashboard', icon: LuLayoutDashboard, key:'dashboard'},
    { to: '/orders', name: 'Orders', icon: LuNotepadText, key:'orders'},
    { to: '/menu', name: 'Menu', icon: LuUtensils, key:'menu'},
    // { to: '/users', name: 'Users', icon: LuUsers, key:'employees'},
    // { to: '/settings', name: 'Settings ', icon: LuSettings, key:'settings'},
  ]

  return (
    <div>
    
    
      {/* Mobile View */}
      <div className='relative md:hidden w-full'>
        
        <div className='flex justify-between px-6 py-4 bg-foreground items-center'>
          <div className=''>
            <img 
              src="/logo.png" 
              alt="" 
              className='w-16'/>
          </div>

          <button
            type='button'
            onClick={() => !isMobileMenu ? setIsMobileMenu(true) : setIsMobileMenu(false)}
            className='cursor-pointer'
          >
            <LuMenu
              size={25}
              className='text-background'
            />
          </button>
        </div>

        {
          isMobileMenu &&
          <nav className='absolute left-0 w-full grid gap-2 bg-foreground/90 animate-slide-down z-10'>
            {
              link.map((item) => (

                <NavLink
                  to={item.to}
                  key={item.key}
                  className={({ isActive }) => 
                  `px-6 py-4 rounded-md text-xl text-background font-poppins font-semibold
                  ${isActive ? 'bg-primary' : ""}
                  `}
                >
                  <span className='flex gap-4 items-center'>
                    <item.icon/>
                    <h1>{item.name}</h1>
                  </span>
                </NavLink>

            ))}
          </nav>
        }

      </div>

      {/* Web view*/}
      <div className='hidden pt-12 md:flex flex-col gap-12 w-60 lg:w-80 h-full bg-foreground'>
        <div className='flex gap-4 px-8 justify-center'>
          <div className='w-35 lg:w-45 flex'>
            <img src="/logo.png" alt="" />
          </div>
        </div>

        <nav className='grid'>
          {
            link.map((item) => (

              <NavLink
                to={item.to}
                key={item.key}
                className={({ isActive }) => 
                `px-6 py-4 rounded-md text-lg lg:text-xl text-background font-poppins font-semibold
                ${isActive ? 'bg-primary' : ""}
                `}
              >
                <span className='flex gap-4 items-center'>
                  <item.icon/>
                  <h1>{item.name}</h1>
                </span>
              </NavLink>

          ))}
        </nav>
      </div>
    </div>
  )
}

export default Sidenav