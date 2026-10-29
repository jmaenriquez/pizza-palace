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
import Item from "./pages/client/Item.js";
import Cart from "./pages/client/Cart";
import About from "./pages/client/About.js";
import Profile from "./pages/Profile.js";
import Checkout from "./pages/client/Checkout.js";
import Receipt from "./pages/client/Receipt.js";

// Not Found
import NotFound from "./pages/NotFound.js";

function App() {
  return (
    <>
      <Toaster position="bottom-right" />

      <Routes>
        {/* User Sign In */}
        <Route element={<AuthPath guest />}>
          <Route element={<User />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
        </Route>

        {/* Public and Auth Users */}
        <Route element={<AuthPath deny={["Admin"]} redirectTo="/admin" />}>
          <Route element={<Parent />}>
            <Route index element={<UDashboard />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/menu/view/:id" element={<Item />} />
            <Route path="/about" element={<About />} />

            {/* Authorized User */}
            <Route element={<AuthPath allow={["User"]} redirectTo="login" />}>
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/receipt/:id" element={<Receipt />} />
            </Route>
          </Route>
        </Route>

        {/* Both Role Participants */}
        <Route
          element={<AuthPath allow={["User", "Admin"]} redirectTo="login" />}
        >
          <Route element={<Parent />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Admin Login */}
        <Route element={<AuthPath allow={["Admin"]} />}>
          <Route element={<Parent />}>
            <Route index path="/admin" element={<ADashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Not Found Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
