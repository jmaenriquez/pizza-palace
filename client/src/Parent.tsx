import React from "react";
import ScrollToTop from "./utils/ScrollToTop";

import { useAuth } from "./context/AuthContext";

import { Outlet, useLocation } from "react-router-dom";

import Sidenav from "./components/Sidenav";
import Header from "./pages/admin/Header";

import Topnav from "./components/Topnav";
import Botnav from "./components/Botnav";
import Footer from "./components/Footer";


interface HeaderData {
  title: string;
  subtitle?: string;
}

function Parent() {
  const { session, loading, role } = useAuth()
  const [header, setHeader] = React.useState<HeaderData>({ title: '', subtitle: '' })

  if (loading) return null

  // Admin layout
  if (session && role === 'Admin') {
    return (
      <div className='h-screen md:flex'>
        <Sidenav />
        <div className='flex-1 w-full flex flex-col overflow-hidden'>
          <Header title={header.title} subtitle={header.subtitle} />
          <div className='md:flex-1 md:overflow-y-auto'>
            <Outlet context={{ setHeader }} />
          </div>
        </div>
      </div>
    )
  }

  // User layout
  return (
    <div className='min-h-screen flex flex-col'>
      <ScrollToTop />
      <Topnav />
      <main className='flex-1 pb-16 md:pb-0'>
        <Outlet />
      </main>
      <div className='hidden md:block'>
        <Footer />
      </div>
      <Botnav />
    </div>
  )
}

export default Parent;
