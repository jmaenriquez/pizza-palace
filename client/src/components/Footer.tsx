import { NavLink, useLocation } from 'react-router-dom'
import { LuMapPin, LuPhone, LuMail } from 'react-icons/lu'

interface Links {
  name: string
  to: string
  key: string
}

const links: Links[] = [
  { to: '/', name: 'Home', key: 'home' },
  { to: '/menu', name: 'Menu', key: 'menu' },
  { to: '/about', name: 'About Us', key: 'about' },
]

function Footer() {
  const { pathname } = useLocation()

  return (
    <footer className="w-full bg-foreground text-background">
      <div className="max-w-6xl mx-auto px-8 py-12 flex justify-between gap-8">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <div className="w-20">
            <img src="/logo.png" alt="Pizza Palace" />
          </div>
          <p className="text-sm text-background/60 max-w-xs">
            Real pizza. Royal flavor. Fresh from our oven to your table.
          </p>
        </div>
        
        {/* Contact */}
        <div className="flex flex-col gap-3 text-sm text-background/80">
          <h4 className="font-poppins font-semibold text-background mb-1">Contact</h4>
          <p className="flex items-center gap-2"><LuMapPin className="shrink-0" /> Some City, Philippines</p>
          <p className="flex items-center gap-2"><LuPhone className="shrink-0" /> 0900 000 0000</p>
          <p className="flex items-center gap-2"><LuMail className="shrink-0" /> pizzapalace@domain.com</p>
        </div>
      </div>

      <div className="border-t border-background/20">
        <p className="max-w-6xl mx-auto px-8 py-4 text-xs text-background/60">
          © {new Date().getFullYear()} Pizza Palace. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer