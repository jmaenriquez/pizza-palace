import React from "react";
import { useAuth } from "../context/AuthContext";

import { LuBell, LuLogOut, LuShoppingCart, LuUserRound } from "react-icons/lu";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

import Button from "../widgets/Button";
import supabase from "../config/supabase";

interface Links {
  name: string;
  to: string;
  key: string;
}

function Topnav() {
  // ------------------------------Utilities--------------

  const nav = useNavigate();
  const { pathname } = useLocation();

  const { session, sessionLoading} = useAuth()

  const link: Links[] = [
    { to: "/", name: "Home", key: "home" },
    { to: "/menu", name: "Menu", key: "menu" },
    { to: "/about", name: "About Us", key: "about" },
  ];

  const heroRoutes = ["/"];
  const hasHero = heroRoutes.includes(pathname);

  // -----------------------------States-----------------------
  const [scrollY, setScrollY] = React.useState(0);
  const isSolid = !hasHero || scrollY > 50;
  const [isUserOpen, setIsUserOpen] = React.useState(false);

  // --------------------------------useEffects--------------------------

  React.useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return (
    <div
      className={`w-full z-50 transition-colors duration-300
      ${hasHero ? "fixed" : "bg-foreground/60 backdrop-blur-sm border border-foreground/70"}
      ${isSolid ? "bg-foreground/40 backdrop-blur-sm border border-foreground/50" : ""}
    `}
    >
      <div className="flex justify-between items-center py-4 px-8">
        <div className="w-16 md:w-20">
          <img src="/logo.png" alt="" />
        </div>

        <nav className="hidden md:flex gap-4">
          {link.map((item) => (
            <NavLink key={item.key} to={item.to}>
              <span
                className={`font-poppins text-background transition-all duration-100 hover:border-b hover:border-secondary hover:text-secondary
                    ${item.to == pathname ? " border-b border-secondary text-secondary" : ""}
                  `}
              >
                {item.name}
              </span>
            </NavLink>
          ))}
        </nav>

        <div>
          {sessionLoading ? <div></div> 
          : session ?(
            <div className="flex gap-8 text-background">

              <button>
                <LuBell className="w-5 h-5 cursor-pointer" strokeWidth={3} />
              </button>

              <button>
                <LuShoppingCart
                  className="w-5 h-5 cursor-pointer"
                  strokeWidth={3}
                />
              </button>

              <button>
                <LuUserRound
                  className="hidden md:block w-5 h-5 cursor-pointer"
                  strokeWidth={3}
                  onClick={() =>
                    !isUserOpen ? setIsUserOpen(true) : setIsUserOpen(false)
                  }
                />
              </button>

              {isUserOpen && (
                <div
                  className="absolute right-8 top-full -mt-4 w-48 rounded-lg p-2
                    bg-foreground/90 backdrop-blur-sm shadow-lg
                    border border-background/10 text-background"
                >
                  

                  <div className="flex flex-col">
                    <span
                      className="px-3 py-2 rounded-md font-poppins text-sm cursor-pointer
                         hover:bg-background/10 hover:text-secondary transition-colors"
                    >
                      Profile
                    </span>
                    <span
                      className="px-3 py-2 rounded-md font-poppins text-sm cursor-pointer
                         hover:bg-background/10 hover:text-secondary transition-colors"
                    >
                      Settings
                    </span>
                  </div>

                  <div className="my-2 border-t border-background/10" />

                  <Button.Solid
                    icon={LuLogOut}
                    name="Log out"
                    type="button"
                    onClick={async () => {
                      await supabase.auth.signOut();
                    }}
                    iconRight= {true}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-4 shrink-0">
              <Button.Hollow
                name="Sign Up"
                type="button"
                onClick={() => nav("/signup")}
              />
              <Button.Solid
                name="Log In"
                type="button"
                onClick={() => nav("/login")}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Topnav;
