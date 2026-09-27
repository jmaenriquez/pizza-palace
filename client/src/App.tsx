import { Routes, Route } from "react-router-dom"
import Parent from "./Parent.jsx"

// General
import User from './pages/User'
import Login from './components/Login'
import Signup from './components/Register'

// Admin Side
import ADashboard from './pages/admin/Dashboard'
import Orders from "./pages/admin/Orders"
import Inventory from "./pages/admin/Inventory"
import Users from "./pages/admin/Users"
import Settings from "./pages/admin/Settings"

// User Side
import UDashboard from './pages/client/Dashboard'
import Menu from "./pages/client/Menu"
import Cart from "./pages/client/Cart"
import About from "./pages/client/About.js"

function App() {
  return (
    <Routes>

      <Route element={<User/>}>
          <Route index path='/login' element={<Login/>} />
          <Route path='/signup' element={<Signup/>} />
      </Route>

      {/* <Route element={<Parent/>}>
        <Route index path='/' element={<ADashboard/>} />
        <Route path='/orders' element={<Orders/>} />
        <Route path='/menu' element={<Menu/>} />
        <Route path='/users' element={<Users/>} />
        <Route path='/settings' element={<Settings/>} />
      </Route> */}

      <Route element={<Parent/>}>
        <Route index path='/' element={<UDashboard/>} />
        <Route path='/menu' element={<Menu/>} />
         <Route path='/cart' element={<Cart/>} />
        <Route path='/about' element={<About/>} />
        {/*<Route path='/settings' element={<Settings/>} /> */}
      </Route>
    </Routes>
  )
}

export default App
