import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AuthPath from "./utils/AuthPath";

// General
import Parent from "./Parent.jsx";
import User from "./pages/User";
import Login from "./components/Login";
import Signup from "./components/Register";

// Admin Side
import ADashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import Inventory from "./pages/admin/Inventory";
import Users from "./pages/admin/Users";
import Settings from "./pages/admin/Settings";

// User Side
import UDashboard from "./pages/client/Dashboard";
import Menu from "./pages/client/Menu";
import Cart from "./pages/client/Cart";
import About from "./pages/client/About.js";
import Profile from "./pages/client/Profile.js";

function App() {
  return (
    <>
      <Toaster position="top-right" />

      <Routes>

        {/* User Sign In */}
        <Route element={<User />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Public and Auth Users */}
        <Route element={<AuthPath deny="Admin" redirectTo="/admin" />}>
          <Route element={<Parent />}>
            <Route index element={<UDashboard />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/about" element={<About />} />

            {/* Authorized User */}
            <Route element={<AuthPath />}>
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
        </Route>


        {/* Admin Login */}
        <Route element={<AuthPath allow="Admin" />}>
          <Route element={<Parent />}>
            <Route index path="/admin" element={<ADashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
