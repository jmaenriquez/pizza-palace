import React from 'react'
import { LuBell, LuShoppingCart, LuUserRound } from 'react-icons/lu'
import { NavLink, replace } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import Button from '../widgets/Button'

interface Links{
  name: string
  to: string
  key: string
}

function Topnav() {

  // ------------------------------Utilities--------------

  const nav = useNavigate()

  const link: Links[] = [
    { to: '/',  name: 'Home',  key: 'home'},
    { to: '/menu',  name: 'Menu',  key: 'menu'},
    { to: '/about',  name: 'About Us',  key: 'about'}
  ]

  // -----------------------------States-----------------------
  const [isScrolled, setIsScrolled] = React.useState(false);


  // --------------------------------useEffects--------------------------

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (

    <div className={`w-full fixed z-50 transition-colors duration-300
      ${isScrolled ? 'bg-foreground/40 backdrop-blur-sm border border-foreground/50' : '' }
    `}>
        <div className='flex justify-between items-center py-4 px-8'>
          <div className='w-20'>
            <img src="/logo.png" alt="" />
          </div>

          <nav className='hidden md:flex gap-4'>
            {
              link.map(item => 

                <NavLink
                  key={item.key}
                  to={item.to}
                >
                  <span className='font-poppins text-background transition-all duration-100 hover:border-b hover:border-secondary hover:text-secondary'>{item.name}</span>

                </NavLink>
              )
            }
          </nav>

          <div>

            {/* If signed in this will appear */}
            {/* <div className='flex gap-8'>
              <LuBell/>
              <LuShoppingCart/>
              <LuUserRound/>
            </div> */}
            <div className='flex gap-4 shrink-0'>
              <Button.Hollow
                name='Sign Up'
                type='button'
                onClick={() => nav('/signup') }
              />
              <Button.Solid
                name='Log In'
                type='button'
                onClick={() => nav('/login') }
              />
            </div>
          </div>
        </div>


        
    </div>
  )
}

export default Topnav