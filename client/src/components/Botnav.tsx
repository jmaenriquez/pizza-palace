// components/BottomNav.tsx
import { NavLink } from 'react-router-dom'
import { LuHouse, LuUtensils, LuInfo, LuUser } from 'react-icons/lu'
import type { IconType } from 'react-icons'

interface Links {
  name: string
  to: string
  key: string
  icon: IconType
}

const links: Links[] = [
  { to: '/', name: 'Home', key: 'home', icon: LuHouse },
  { to: '/menu', name: 'Menu', key: 'menu', icon: LuUtensils },
  { to: '/about', name: 'About', key: 'about', icon: LuInfo },
  { to: '/profile', name: 'Me', key: 'profile', icon: LuUser }
]

function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-foreground/90 backdrop-blur-sm border-t border-foreground/50">
      <div className="flex justify-around items-center py-2">
        {links.map(item => (
          <NavLink
            key={item.key}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-1 font-poppins text-xs transition-colors duration-100 ${
                isActive ? 'text-secondary' : 'text-background/80 hover:text-secondary'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNav